import { notFound } from "next/navigation";
import { getVendors, getCertification } from "@/lib/content";
import FlashcardDeck from "@/components/cert/FlashcardDeck";

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
  return { title: `Flashcards — ${cert.name} — CertTrainer` };
}

export default async function FlashcardsPage({ params }: Props) {
  const { vendorSlug, certSlug } = await params;
  const cert = await getCertification(vendorSlug, certSlug);
  if (!cert) notFound();

  if (cert.flashcards.length === 0) {
    return (
      <p className="text-text-secondary text-center py-12">
        No flashcards available for this certification yet.
      </p>
    );
  }

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-text-secondary mb-6">
        Click cards to reveal answers. Track your progress as you review.
      </p>
      <FlashcardDeck flashcards={cert.flashcards} />
    </div>
  );
}
