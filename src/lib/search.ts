import { getVendors, getAllCertifications } from "./content";
import { certPath, modulePath } from "./constants";

export interface SearchResult {
  type: "module" | "flashcard" | "quiz" | "resource";
  title: string;
  excerpt: string;
  href: string;
  certName: string;
}

export async function buildSearchIndex(): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const vendors = await getVendors();

  for (const vendor of vendors) {
    const certs = await getAllCertifications(vendor.slug);

    for (const cert of certs) {
      // Modules
      for (const mod of cert.modules) {
        results.push({
          type: "module",
          title: mod.title,
          excerpt: mod.sections.map((s) => s.heading).join(" · "),
          href: modulePath(vendor.slug, cert.slug, mod.slug),
          certName: cert.name,
        });
      }

      // Flashcards
      for (const fc of cert.flashcards) {
        results.push({
          type: "flashcard",
          title: fc.question,
          excerpt: fc.answer.substring(0, 100),
          href: certPath(vendor.slug, cert.slug) + "/flashcards",
          certName: cert.name,
        });
      }

      // Quiz questions
      for (const q of cert.quizQuestions) {
        results.push({
          type: "quiz",
          title: q.question,
          excerpt: q.options.join(" / "),
          href: certPath(vendor.slug, cert.slug) + "/quiz",
          certName: cert.name,
        });
      }

      // Resources
      for (const r of cert.resources) {
        results.push({
          type: "resource",
          title: r.title,
          excerpt: r.type,
          href: certPath(vendor.slug, cert.slug) + "/resources",
          certName: cert.name,
        });
      }
    }
  }

  return results;
}
