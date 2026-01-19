import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

  if (!code) {
        return NextResponse.redirect('/?error=no_code');
  }

  try {
        const tokenRes = await fetch('https://idp.bexio.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                          grant_type: 'authorization_code',
                          client_id: process.env.BEXIO_CLIENT_ID,
                          client_secret: process.env.BEXIO_CLIENT_SECRET,
                          redirect_uri: process.env.BEXIO_REDIRECT_URI,
                          code
                })
        });

      const tokens = await tokenRes.json();

      if (tokens.access_token) {
              console.log('Bexio connected! Token received.');
              return NextResponse.redirect('/?bexio=connected');
      }

      return NextResponse.redirect('/?error=token_failed');
  } catch (error) {
        console.error('Bexio callback error:', error);
        return NextResponse.redirect('/?error=callback_failed');
  }
}
