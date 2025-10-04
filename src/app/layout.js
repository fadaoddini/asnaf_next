import '@/styles/globals.css';
import Header from '@/components/Header';
import { AuthProvider } from '@/context/AuthContext'; 
import { Suspense } from 'react';

export const metadata = {
  title: "سامانه نمایشگاه ها | اتاق اصناف بم",
  description: "اتاق اصناف بم",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa">
      <body>
        {/* قرار دادن AuthProvider برای دسترسی به Context */}
        <AuthProvider>
          {/* هدر که در تمام صفحات نمایش داده می‌شود */}
          <Header />  

          {/* استفاده از Suspense برای بارگذاری معلق */}
          <Suspense fallback={<div>در حال بارگذاری...</div>}>
            {/* محتوای صفحات مختلف که در children قرار می‌گیرد */}
            <main>{children}</main>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
