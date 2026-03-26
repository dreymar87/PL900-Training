import { notFound } from "next/navigation";
import { getVendors, getCertification } from "@/lib/content";
import ProgressDashboard from "@/components/cert/ProgressDashboard";
import DataExportImport from "@/components/cert/DataExportImport";

interface Props {
  params: Promise<{ vendorSlug: string; certSlug: string }>;
}

export async function generateStaticParams() {
  const vendors = await getVendors();
  const params: { vendorSlug: string; certSlug: string }[] = [];
  for (const v of vendors) {
    for (const c of v.certifications) {
      params.push({ vendorSlug: v.slug, certSlug: c });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { vendorSlug, certSlug } = await params;
  const cert = await getCertification(vendorSlug, certSlug);
  if (!cert) return {};
  return { title: `Progress — ${cert.name} — CertTrainer` };
}

export default async function ProgressPage({ params }: Props) {
  const { vendorSlug, certSlug } = await params;
  const cert = await getCertification(vendorSlug, certSlug);
  if (!cert) notFound();

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-text-secondary mb-6">
        Track your overall exam readiness across all study activities.
      </p>
      <ProgressDashboard cert={cert} />
      <div className="mt-6">
        <DataExportImport cert={cert} />
      </div>
    </div>
  );
}
