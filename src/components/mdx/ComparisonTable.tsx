interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
}

export default function ComparisonTable({ headers = [], rows = [] }: ComparisonTableProps) {
  if (!headers.length || !rows.length) return null;
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border border-border-primary rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-surface-tertiary">
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left px-4 py-3 font-semibold text-text-primary border-b border-border-primary"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-surface-primary" : "bg-surface-secondary"}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-2.5 text-text-secondary border-b border-border-primary"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
