import { notFound } from "next/navigation";
import { getVendors, getCertification, getAllQuizQuestions } from "@/lib/content";
import PracticeQuiz from "@/components/cert/PracticeQuiz";

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
  return { title: `Practice Quiz — ${cert.name} — CertTrainer` };
}

export default async function QuizPage({ params }: Props) {
  const { vendorSlug, certSlug } = await params;
  const cert = await getCertification(vendorSlug, certSlug);
  if (!cert) notFound();

  const allQuestions = await getAllQuizQuestions(vendorSlug, certSlug);

  if (allQuestions.length === 0) {
    return (
      <p className="text-text-secondary text-center py-12">
        No quiz questions available for this certification yet.
      </p>
    );
  }

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-text-secondary mb-6">
        Full practice exam with {allQuestions.length} questions from all modules. Select an answer for each question.
      </p>
      <PracticeQuiz questions={allQuestions} />
    </div>
  );
}
