import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'MyShop – Premium Electronics Store',
  description: 'ร้านค้าออนไลน์คัดสรรสินค้าอิเล็กทรอนิกส์คุณภาพสูง จัดส่งไว ราคาคุ้มค่า',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="page-container">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}