import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SearchDialog from "@/components/layout/SearchDialog";
import { getVendors } from "@/lib/content";
import { buildSearchIndex } from "@/lib/search";

export const metadata: Metadata = {
  title: "CertTrainer — Certification Training Platform",
  description:
    "Navigate training materials for certifications from Microsoft, AWS, Google, CompTIA, and more.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const vendors = await getVendors();
  const searchIndex = await buildSearchIndex();

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="h-full antialiased">
        <Sidebar vendors={vendors} />
        <SearchDialog index={searchIndex} />

        {/* Main content area */}
        <div className="lg:pl-72">
          {/* Spacer for mobile header */}
          <div className="h-[53px] lg:hidden" />

          <main className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
