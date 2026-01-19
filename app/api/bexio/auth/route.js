import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.BEXIO_CLIENT_ID;
    const redirectUri = process.env.BEXIO_REDIRECT_URI;

  const authUrl = `https://idp.bexio.com/authorize?` +
        `client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=openid profile email kb_invoice_edit kb_bill_edit`;

  return NextResponse.redirect(authUrl);
}
