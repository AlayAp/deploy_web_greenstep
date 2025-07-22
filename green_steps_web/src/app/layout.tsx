import './globals.css';
import ClientProviders from './ClientProviders';

export const metadata = {
  title: "Your App Title",
  description: "Your app description",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <div className="responsive-container">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
