import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import { getVendors, getCertification, getModule, getModuleMdxSource } from "@/lib/content";
import { modulePath, certPath } from "@/lib/constants";
import { mdxComponents } from "@/components/mdx/mdx-components";
import StudyGuideSection from "@/components/cert/StudyGuideSection";
import PracticeQuiz from "@/components/cert/PracticeQuiz";
import NoteEditor from "@/components/cert/NoteEditor";
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

  // Try to load MDX content
  const mdxSource = await getModuleMdxSource(vendorSlug, certSlug, moduleSlug);
  let mdxContent: React.ReactNode | null = null;
  if (mdxSource) {
    const { content } = await compileMDX({
      source: mdxSource,
      components: mdxComponents,
    });
    mdxContent = content;
  }

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

      {/* Study content: MDX or fallback to JSON sections */}
      {mdxContent ? (
        <article className="mb-8">{mdxContent}</article>
      ) : (
        <div className="space-y-4 mb-8">
          {mod.sections.map((section, i) => (
            <StudyGuideSection key={i} section={section} />
          ))}
        </div>
      )}

      {/* Per-module quiz */}
      {mod.quizQuestions && mod.quizQuestions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Module Quiz</h2>
          <p className="text-sm text-text-secondary mb-4">
            Test your understanding of {mod.title}.
          </p>
          <PracticeQuiz questions={mod.quizQuestions} />
        </div>
      )}

      {/* Module notes */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Module Notes</h2>
        <NoteEditor certSlug={certSlug} moduleSlug={mod.slug} />
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
