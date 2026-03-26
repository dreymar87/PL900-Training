import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { getVendors } from "@/lib/content";

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

  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <Sidebar vendors={vendors} />

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
