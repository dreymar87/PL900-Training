import { notFound } from "next/navigation";
import { getVendor, getVendors, getAllCertifications } from "@/lib/content";
import CertCard from "@/components/cert/CertCard";

interface Props {
  params: Promise<{ vendorSlug: string }>;
}

export async function generateStaticParams() {
  const vendors = await getVendors();
  return vendors.map((v) => ({ vendorSlug: v.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { vendorSlug } = await params;
  const vendor = await getVendor(vendorSlug);
  if (!vendor) return {};
  return { title: `${vendor.name} Certifications — CertTrainer` };
}

export default async function VendorPage({ params }: Props) {
  const { vendorSlug } = await params;
  const vendor = await getVendor(vendorSlug);
  if (!vendor) notFound();

  const certs = await getAllCertifications(vendorSlug);

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{vendor.name}</h1>
        <p className="text-text-secondary">{vendor.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map((cert) => (
          <CertCard key={cert.slug} cert={cert} />
        ))}
      </div>

      {certs.length === 0 && (
        <p className="text-text-secondary text-center py-8">
          No certifications available for this vendor yet.
        </p>
      )}
    </div>
  );
}
