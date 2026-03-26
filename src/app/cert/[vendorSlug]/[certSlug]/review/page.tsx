import { notFound } from "next/navigation";
import { getVendors, getCertification } from "@/lib/content";
import SpacedRepetitionDeck from "@/components/cert/SpacedRepetitionDeck";

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
  return { title: `Spaced Repetition — ${cert.name} — CertTrainer` };
}

export default async function ReviewPage({ params }: Props) {
  const { vendorSlug, certSlug } = await params;
  const cert = await getCertification(vendorSlug, certSlug);
  if (!cert) notFound();

  if (cert.flashcards.length === 0) {
    return (
      <p className="text-text-secondary text-center py-12">
        No flashcards available for spaced repetition yet.
      </p>
    );
  }

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-text-secondary mb-6">
        Spaced repetition optimizes your review schedule. Rate each card after revealing the answer to adjust its next review date.
      </p>
      <SpacedRepetitionDeck flashcards={cert.flashcards} certSlug={certSlug} />
    </div>
  );
}
