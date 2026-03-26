import { notFound } from "next/navigation";
import { getVendors, getCertification } from "@/lib/content";
import ResourceTracker from "@/components/cert/ResourceTracker";

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
  return { title: `Resources — ${cert.name} — CertTrainer` };
}

export default async function ResourcesPage({ params }: Props) {
  const { vendorSlug, certSlug } = await params;
  const cert = await getCertification(vendorSlug, certSlug);
  if (!cert) notFound();

  if (cert.resources.length === 0) {
    return (
      <p className="text-text-secondary text-center py-12">
        No external resources available for this certification yet.
      </p>
    );
  }

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-text-secondary mb-6">
        Track your progress through external learning resources. Your completion status is saved locally.
      </p>
      <ResourceTracker resources={cert.resources} certSlug={certSlug} />
    </div>
  );
}
