import Link from "next/link";
import { getVendors, getAllCertifications } from "@/lib/content";
import { vendorPath } from "@/lib/constants";
import CertCard from "@/components/cert/CertCard";

export default async function HomePage() {
  const vendors = await getVendors();

  // Load all certs for display
  const vendorCerts = await Promise.all(
    vendors.map(async (v) => ({
      vendor: v,
      certs: await getAllCertifications(v.slug),
    }))
  );

  const totalCerts = vendorCerts.reduce((sum, vc) => sum + vc.certs.length, 0);
  const totalModules = vendorCerts.reduce(
    (sum, vc) => sum + vc.certs.reduce((s, c) => s + c.modules.length, 0),
    0
  );

  return (
    <div className="max-w-5xl">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CertTrainer</h1>
        <p className="text-text-secondary text-lg">
          Your certification training hub. Study guides, flashcards, quizzes, and
          progress tracking — all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-primary border border-border-primary rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent">{vendors.length}</div>
          <div className="text-xs text-text-secondary mt-1">Vendors</div>
        </div>
        <div className="bg-surface-primary border border-border-primary rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent">{totalCerts}</div>
          <div className="text-xs text-text-secondary mt-1">Certifications</div>
        </div>
        <div className="bg-surface-primary border border-border-primary rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent">{totalModules}</div>
          <div className="text-xs text-text-secondary mt-1">Modules</div>
        </div>
      </div>

      {/* Vendor sections */}
      {vendorCerts.map(({ vendor, certs }) => (
        <section key={vendor.slug} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{vendor.name}</h2>
            <Link
              href={vendorPath(vendor.slug)}
              className="text-sm text-accent hover:text-accent-hover font-medium"
            >
              View all &rarr;
            </Link>
          </div>
          <p className="text-sm text-text-secondary mb-4">{vendor.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((cert) => (
              <CertCard key={cert.slug} cert={cert} />
            ))}
          </div>
        </section>
      ))}

      {vendors.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          <p className="text-lg">No certifications added yet.</p>
          <p className="text-sm mt-1">Add vendor JSON files to the content directory to get started.</p>
        </div>
      )}
    </div>
  );
}
