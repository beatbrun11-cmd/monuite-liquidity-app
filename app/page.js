'use client';
import { useState, useEffect } from 'react';

export default function Home() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bexioConnected, setBexioConnected] = useState(false);

  useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('bexio') === 'connected') {
                setBexioConnected(true);
                window.history.replaceState({}, '', '/');
        }
        fetchData();
  }, []);

  const fetchData = async () => {
        try {
                const res = await fetch('/api/liquidity');
                const json = await res.json();
                setData(json);
        } catch (err) {
                console.error('Error:', err);
        } finally {
                setLoading(false);
        }
  };

  const connectBexio = () => {
        window.location.href = '/api/bexio/auth';
  };

  const exportData = async () => {
        window.location.href = '/api/export';
  };

  if (loading) return <div style={styles.container}><p>Lade Daten...</p></div>;

  return (
        <div style={styles.container}>
      <h1 style={styles.title}>Monuite Liquidity Dashboard</h1>

      <div style={styles.buttonRow}>
        <button onClick={connectBexio} style={styles.button}>
  {bexioConnected ? 'Bexio Verbunden' : 'Mit Bexio verbinden'}
</button>
        <button onClick={fetchData} style={styles.button}>Aktualisieren</button>
        <button onClick={exportData} style={styles.buttonExport}>Export CSV</button>
  </div>

{data && (
          <>
            <h2 style={styles.sectionTitle}>Overview</h2>
           <table style={styles.table}>
            <thead>
                <tr>
                  <th style={styles.th}>Typ</th>
                 <th style={styles.th}>Brutto Total</th>
                 <th style={styles.th}>Ausstehend</th>
                 <th style={styles.th}>Manuell</th>
  </tr>
  </thead>
             <tbody>
                <tr>
                  <td style={styles.td}>DEBIT (Kunden)</td>
                 <td style={styles.tdRight}>{formatCHF(data.overview?.debit?.brutto)}</td>
                <td style={styles.tdRight}>{formatCHF(data.overview?.debit?.ausstehend)}</td>
                <td style={styles.tdRight}>{formatCHF(data.overview?.debit?.manuell)}</td>
  </tr>
              <tr>
                  <td style={styles.td}>KREDIT (Lieferanten)</td>
                <td style={styles.tdRight}>{formatCHF(data.overview?.kredit?.brutto)}</td>
                <td style={styles.tdRight}>{formatCHF(data.overview?.kredit?.ausstehend)}</td>
                <td style={styles.tdRight}>{formatCHF(data.overview?.kredit?.manuell)}</td>
  </tr>
  </tbody>
  </table>

          <h2 style={styles.sectionTitle}>Wochen-Matrix</h2>
          <table style={styles.table}>
            <thead>
                <tr>
                  <th style={styles.th}>KW</th>
                <th style={styles.th}>Inflow</th>
                <th style={styles.th}>Outflow</th>
                <th style={styles.th}>Netto</th>
  </tr>
  </thead>
            <tbody>
{data.weeks?.map((w) => (
                  <tr key={w.week}>
                    <td style={styles.td}>{w.week}</td>
                                   <td style={{...styles.tdRight, color: '#2e7d32'}}>{formatCHF(w.inflow)}</td>
                                   <td style={{...styles.tdRight, color: '#c62828'}}>{formatCHF(w.outflow)}</td>
                                   <td style={{...styles.tdRight, fontWeight: 'bold', color: w.netto >= 0 ? '#2e7d32' : '#c62828'}}>{formatCHF(w.netto)}</td>
                 </tr>
                               ))}
</tbody>
  </table>
  </>
      )}
</div>
  );
}

const formatCHF = (n) => n ? `CHF ${n.toLocaleString('de-CH', {minimumFractionDigits: 2})}` : 'CHF 0.00';

const styles = {
    container: { maxWidth: 900, margin: '0 auto', padding: 20 },
    title: { textAlign: 'center', marginBottom: 20 },
    buttonRow: { display: 'flex', gap: 10, marginBottom: 20, justifyContent: 'center' },
    button: { padding: '10px 20px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: 4, background: '#fff' },
    buttonExport: { padding: '10px 20px', cursor: 'pointer', border: 'none', borderRadius: 4, background: '#1976d2', color: '#fff' },
    sectionTitle: { marginTop: 30, borderBottom: '2px solid #333', paddingBottom: 5 },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: 10, background: '#fff' },
    th: { border: '1px solid #ddd', padding: 10, background: '#f5f5f5', textAlign: 'left' },
    td: { border: '1px solid #ddd', padding: 10 },
    tdRight: { border: '1px solid #ddd', padding: 10, textAlign: 'right' }
};'use client';
import { useState, useEffect } from 'react';

export default function Home() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bexioConnected, setBexioConnected] = useState(false);

  useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('bexio') === 'connected') {
                setBexioConnected(true);
                window.history.replaceState({}, '', '/');
        }
        fetchData();
  }, []);

  const fetchData = async () => {
        try {
                const res = await fetch('/api/liquidity');
                const json = await res.json();
                setData(json);
        } catch (err) {
                console.error('Error:', err);
        } finally {
                setLoading(false);
        }
  };

  const connectBexio = () => {
        window.location.href = '/api/bexio/auth';
  };

  const exportData = async () => {
        window.location.href = '/api/export';
  };

  if (loading) return <div style={styles.container}><p>Lade Daten...</p></div>;

  return (
        <div style={styles.container}>
      <h1 style={styles.title}>Monuite Liquidity Dashboard</h1>

      <div style={styles.buttonRow}>
        <button onClick={connectBexio} style={styles.button}>
  {bexioConnected ? 'Bexio Verbunden' : 'Mit Bexio verbinden'}
</button>
        <button onClick={fetchData} style={styles.button}>Aktualisieren</button>
        <button onClick={exportData} style={styles.buttonExport}>Export CSV</button>
  </div>

{data && (
          <>
            <h2 style={styles.sectionTitle}>Overview</h2>
           <table style={styles.table}>
            <thead>
                <tr>
                  <th style={styles.th}>Typ</th>
                 <th style={styles.th}>Brutto Total</th>
                 <th style={styles.th}>Ausstehend</th>
                 <th style={styles.th}>Manuell</th>
  </tr>
  </thead>
             <tbody>
                <tr>
                  <td style={styles.td}>DEBIT (Kunden)</td>
                 <td style={styles.tdRight}>{formatCHF(data.overview?.debit?.brutto)}</td>
                <td style={styles.tdRight}>{formatCHF(data.overview?.debit?.ausstehend)}</td>
                <td style={styles.tdRight}>{formatCHF(data.overview?.debit?.manuell)}</td>
  </tr>
              <tr>
                  <td style={styles.td}>KREDIT (Lieferanten)</td>
                <td style={styles.tdRight}>{formatCHF(data.overview?.kredit?.brutto)}</td>
                <td style={styles.tdRight}>{formatCHF(data.overview?.kredit?.ausstehend)}</td>
                <td style={styles.tdRight}>{formatCHF(data.overview?.kredit?.manuell)}</td>
  </tr>
  </tbody>
  </table>

          <h2 style={styles.sectionTitle}>Wochen-Matrix</h2>
          <table style={styles.table}>
            <thead>
                <tr>
                  <th style={styles.th}>KW</th>
                <th style={styles.th}>Inflow</th>
                <th style={styles.th}>Outflow</th>
                <th style={styles.th}>Netto</th>
  </tr>
  </thead>
            <tbody>
{data.weeks?.map((w) => (
                  <tr key={w.week}>
                    <td style={styles.td}>{w.week}</td>
                                   <td style={{...styles.tdRight, color: '#2e7d32'}}>{formatCHF(w.inflow)}</td>
                                   <td style={{...styles.tdRight, color: '#c62828'}}>{formatCHF(w.outflow)}</td>
                                   <td style={{...styles.tdRight, fontWeight: 'bold', color: w.netto >= 0 ? '#2e7d32' : '#c62828'}}>{formatCHF(w.netto)}</td>
                 </tr>
                               ))}
</tbody>
  </table>
  </>
      )}
</div>
  );
}

const formatCHF = (n) => n ? `CHF ${n.toLocaleString('de-CH', {minimumFractionDigits: 2})}` : 'CHF 0.00';

const styles = {
    container: { maxWidth: 900, margin: '0 auto', padding: 20 },
    title: { textAlign: 'center', marginBottom: 20 },
    buttonRow: { display: 'flex', gap: 10, marginBottom: 20, justifyContent: 'center' },
    button: { padding: '10px 20px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: 4, background: '#fff' },
    buttonExport: { padding: '10px 20px', cursor: 'pointer', border: 'none', borderRadius: 4, background: '#1976d2', color: '#fff' },
    sectionTitle: { marginTop: 30, borderBottom: '2px solid #333', paddingBottom: 5 },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: 10, background: '#fff' },
    th: { border: '1px solid #ddd', padding: 10, background: '#f5f5f5', textAlign: 'left' },
    td: { border: '1px solid #ddd', padding: 10 },
    tdRight: { border: '1px solid #ddd', padding: 10, textAlign: 'right' }
};
