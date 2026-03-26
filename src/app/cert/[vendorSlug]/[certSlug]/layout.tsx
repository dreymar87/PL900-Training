import { notFound } from "next/navigation";
import { getCertification } from "@/lib/content";
import CertTabs from "@/components/cert/CertTabs";

interface Props {
  params: Promise<{ vendorSlug: string; certSlug: string }>;
  children: React.ReactNode;
}

export default async function CertLayout({ params, children }: Props) {
  const { vendorSlug, certSlug } = await params;
  const cert = await getCertification(vendorSlug, certSlug);
  if (!cert) notFound();

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{cert.name}</h1>
        <p className="text-text-secondary">{cert.description}</p>
      </div>

      <CertTabs vendorSlug={vendorSlug} certSlug={certSlug} />

      {children}
    </div>
  );
}
