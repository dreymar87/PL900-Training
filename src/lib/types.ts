// --- Vendor ---
export interface Vendor {
  slug: string;
  name: string;
  description: string;
  icon: string;
  certifications: string[];
}

// --- Certification ---
export interface Certification {
  slug: string;
  vendorSlug: string;
  name: string;
  description: string;
  examDomains: ExamDomain[];
  modules: Module[];
  flashcards: Flashcard[];
  quizQuestions: QuizQuestion[];
  checklistGroups: ChecklistGroup[];
  resources: Resource[];
}

// --- Exam Domain ---
export interface ExamDomain {
  name: string;
  weight: string;
  description: string;
  topics: string[];
}

// --- Module ---
export interface Module {
  slug: string;
  title: string;
  label: string;
  order: number;
  sections: ModuleSection[];
}

export interface ModuleSection {
  heading: string;
  content: string;
}

// --- Flashcard ---
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
}

// --- Quiz ---
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

// --- Checklist ---
export interface ChecklistGroup {
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
}

// --- Resource (future) ---
export interface Resource {
  id: string;
  title: string;
  url: string;
  type: "video" | "article" | "documentation" | "course";
  completed?: boolean;
}
