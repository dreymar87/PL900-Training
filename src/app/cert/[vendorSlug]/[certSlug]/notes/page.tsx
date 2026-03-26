import { notFound } from "next/navigation";
import { getVendors, getCertification } from "@/lib/content";
import NoteEditor from "@/components/cert/NoteEditor";

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
  return { title: `Notes — ${cert.name} — CertTrainer` };
}

export default async function NotesPage({ params }: Props) {
  const { vendorSlug, certSlug } = await params;
  const cert = await getCertification(vendorSlug, certSlug);
  if (!cert) notFound();

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-text-secondary mb-6">
        Capture your thoughts and key takeaways. Notes are saved locally in your browser.
      </p>
      <NoteEditor certSlug={certSlug} />
    </div>
  );
}
