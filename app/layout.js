export const metadata = {
    title: 'Monuite Liquidity Dashboard',
    description: 'Weekly liquidity overview with Bexio and WooCommerce integration',
};

export default function RootLayout({ children }) {
    return (
          <html lang="de">
            <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f5f5f5' }}>
{children}
</body>
  </html>
  );
}
