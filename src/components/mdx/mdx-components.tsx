import type { MDXComponents } from "mdx/types";
import Callout from "./Callout";
import ExamTip from "./ExamTip";
import KeyTerm from "./KeyTerm";
import ComparisonTable from "./ComparisonTable";
import DidYouKnow from "./DidYouKnow";

export const mdxComponents: MDXComponents = {
  // Custom components
  Callout,
  ExamTip,
  KeyTerm,
  ComparisonTable,
  DidYouKnow,

  // HTML element overrides
  h2: (props) => (
    <h2 className="text-xl font-bold text-text-primary mt-8 mb-3" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2" {...props} />
  ),
  h4: (props) => (
    <h4 className="text-base font-semibold text-text-primary mt-4 mb-2" {...props} />
  ),
  p: (props) => (
    <p className="text-sm text-text-secondary leading-relaxed mb-4" {...props} />
  ),
  ul: (props) => (
    <ul className="text-sm text-text-secondary list-disc pl-5 mb-4 space-y-1.5" {...props} />
  ),
  ol: (props) => (
    <ol className="text-sm text-text-secondary list-decimal pl-5 mb-4 space-y-1.5" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-text-primary" {...props} />,
  a: (props) => (
    <a className="text-accent hover:text-accent-hover underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  code: (props) => (
    <code className="bg-surface-tertiary text-accent px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
  ),
  pre: (props) => (
    <pre className="bg-surface-tertiary rounded-xl p-4 overflow-x-auto text-xs mb-4" {...props} />
  ),
  hr: () => <hr className="border-border-primary my-6" />,
  table: (props) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border border-border-primary rounded-xl overflow-hidden" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-surface-tertiary" {...props} />,
  th: (props) => (
    <th className="text-left px-4 py-3 font-semibold text-text-primary border-b border-border-primary" {...props} />
  ),
  td: (props) => (
    <td className="px-4 py-2.5 text-text-secondary border-b border-border-primary" {...props} />
  ),
  tr: (props) => <tr className="even:bg-surface-secondary" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-4 border-accent pl-4 italic text-text-secondary my-4 text-sm" {...props} />
  ),
};
