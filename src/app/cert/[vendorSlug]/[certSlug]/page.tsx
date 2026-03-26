import { notFound } from "next/navigation";
import { getVendors, getCertification } from "@/lib/content";
import ModuleList from "@/components/cert/ModuleList";
import DomainCard from "@/components/ui/DomainCard";

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
  return { title: `${cert.name} — CertTrainer` };
}

export default async function CertificationPage({ params }: Props) {
  const { vendorSlug, certSlug } = await params;
  const cert = await getCertification(vendorSlug, certSlug);
  if (!cert) notFound();

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{cert.name}</h1>
        <p className="text-text-secondary">{cert.description}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-primary border border-border-primary rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent">{cert.modules.length}</div>
          <div className="text-xs text-text-secondary mt-1">Modules</div>
        </div>
        <div className="bg-surface-primary border border-border-primary rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent">{cert.flashcards.length}</div>
          <div className="text-xs text-text-secondary mt-1">Flashcards</div>
        </div>
        <div className="bg-surface-primary border border-border-primary rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent">{cert.quizQuestions.length}</div>
          <div className="text-xs text-text-secondary mt-1">Quiz Questions</div>
        </div>
      </div>

      {/* Modules */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Study Modules</h2>
        <ModuleList
          modules={cert.modules}
          vendorSlug={vendorSlug}
          certSlug={certSlug}
        />
      </section>

      {/* Exam Domains */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Exam Domains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cert.examDomains.map((domain) => (
            <DomainCard key={domain.name} domain={domain} />
          ))}
        </div>
      </section>
    </div>
  );
}
