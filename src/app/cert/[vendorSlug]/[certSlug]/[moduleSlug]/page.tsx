import { notFound } from "next/navigation";
import Link from "next/link";
import { getVendors, getCertification, getModule } from "@/lib/content";
import { modulePath, certPath } from "@/lib/constants";
import StudyGuideSection from "@/components/cert/StudyGuideSection";
import Badge from "@/components/ui/Badge";

interface Props {
  params: Promise<{ vendorSlug: string; certSlug: string; moduleSlug: string }>;
}

export async function generateStaticParams() {
  const vendors = await getVendors();
  const params: { vendorSlug: string; certSlug: string; moduleSlug: string }[] = [];
  for (const v of vendors) {
    for (const certSlug of v.certifications) {
      const cert = await getCertification(v.slug, certSlug);
      if (cert) {
        for (const mod of cert.modules) {
          params.push({
            vendorSlug: v.slug,
            certSlug,
            moduleSlug: mod.slug,
          });
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { vendorSlug, certSlug, moduleSlug } = await params;
  const result = await getModule(vendorSlug, certSlug, moduleSlug);
  if (!result) return {};
  return { title: `${result.module.title} — CertTrainer` };
}

export default async function ModulePage({ params }: Props) {
  const { vendorSlug, certSlug, moduleSlug } = await params;
  const result = await getModule(vendorSlug, certSlug, moduleSlug);
  if (!result) notFound();

  const { module: mod, certification: cert } = result;
  const sorted = [...cert.modules].sort((a, b) => a.order - b.order);
  const currentIndex = sorted.findIndex((m) => m.slug === mod.slug);
  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{mod.title}</h1>
          <Badge>{mod.label}</Badge>
        </div>
        <p className="text-sm text-text-secondary">
          Module {mod.order} of {cert.modules.length} in {cert.name}
        </p>
      </div>

      {/* Study guide sections */}
      <div className="space-y-4 mb-8">
        {mod.sections.map((section, i) => (
          <StudyGuideSection key={i} section={section} />
        ))}
      </div>

      {/* Prev/Next navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border-primary">
        {prev ? (
          <Link
            href={modulePath(vendorSlug, certSlug, prev.slug)}
            className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {prev.title}
          </Link>
        ) : (
          <Link
            href={certPath(vendorSlug, certSlug)}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            &larr; Back to overview
          </Link>
        )}
        {next ? (
          <Link
            href={modulePath(vendorSlug, certSlug, next.slug)}
            className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover font-medium"
          >
            {next.title}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <Link
            href={certPath(vendorSlug, certSlug)}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            Back to overview &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
