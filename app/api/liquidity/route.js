import { NextResponse } from 'next/server';

function getWeekYear(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    const weekNum = 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return `${weekNum}_${d.getFullYear()}`;
}

function calculateManuell(brutto, ausstehend) {
    return ausstehend === 0 ? brutto : ausstehend;
}

export async function GET() {
    try {
          const accessToken = process.env.BEXIO_ACCESS_TOKEN;

      if (!accessToken) {
              return NextResponse.json({
                        overview: {
                                    debit: { brutto: 0, ausstehend: 0, manuell: 0 },
                                    kredit: { brutto: 0, ausstehend: 0, manuell: 0 }
                        },
                        weeks: [],
                        message: 'Bexio nicht verbunden'
              });
      }

      const headers = { 
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
      };

      const [invoicesRes, billsRes] = await Promise.all([
              fetch('https://api.bexio.com/2.0/kb_invoice', { headers }),
              fetch('https://api.bexio.com/2.0/kb_bill', { headers })
            ]);

      const invoices = invoicesRes.ok ? await invoicesRes.json() : [];
          const bills = billsRes.ok ? await billsRes.json() : [];

      let debitBrutto = 0, debitAusstehend = 0;
          let kreditBrutto = 0, kreditAusstehend = 0;
          const weeklyData = {};

      invoices.forEach(inv => {
              const brutto = parseFloat(inv.total_gross) || 0;
              const ausstehend = parseFloat(inv.total_remaining_payments) || 0;
              debitBrutto += brutto;
              debitAusstehend += ausstehend;

                             const week = getWeekYear(inv.is_valid_from || inv.created_at);
              if (!weeklyData[week]) weeklyData[week] = { inflow: 0, outflow: 0 };
              weeklyData[week].inflow += calculateManuell(brutto, ausstehend);
      });

      bills.forEach(bill => {
              const brutto = parseFloat(bill.total_gross) || 0;
              const ausstehend = parseFloat(bill.total_remaining_payments) || 0;
              kreditBrutto += brutto;
              kreditAusstehend += ausstehend;

                          const week = getWeekYear(bill.is_valid_from || bill.created_at);
              if (!weeklyData[week]) weeklyData[week] = { inflow: 0, outflow: 0 };
              weeklyData[week].outflow += calculateManuell(brutto, ausstehend);
      });

      const weeks = Object.entries(weeklyData)
            .map(([week, data]) => ({
                      week,
                      inflow: data.inflow,
                      outflow: data.outflow,
                      netto: data.inflow - data.outflow
            }))
            .sort((a, b) => {
                      const [wA, yA] = a.week.split('_').map(Number);
                      const [wB, yB] = b.week.split('_').map(Number);
                      return yA !== yB ? yA - yB : wA - wB;
            });

      return NextResponse.json({
              overview: {
                        debit: {
                                    brutto: debitBrutto,
                                    ausstehend: debitAusstehend,
                                    manuell: calculateManuell(debitBrutto, debitAusstehend)
                        },
                        kredit: {
                                    brutto: kreditBrutto,
                                    ausstehend: kreditAusstehend,
                                    manuell: calculateManuell(kreditBrutto, kreditAusstehend)
                        }
              },
              weeks
      });
    } catch (error) {
          console.error('Liquidity API error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
