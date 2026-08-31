"use client";

interface BulletListProps {
  items: (string | { text: string; subItems?: string[] })[];
  color?: string;
}

export function BulletList({ items, color = "text-cyan-blue" }: BulletListProps) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => {
        if (typeof item === "string") {
          return (
            <li key={i} className="flex items-start gap-2 text-sm lg:text-base font-light text-slate-gray">
              <span className={`${color} shrink-0`}>•</span>
              <span>{item}</span>
            </li>
          );
        }
        return (
          <li key={i} className="flex flex-col gap-1">
            <div className="flex items-start gap-2 text-sm lg:text-base font-light text-slate-gray">
              <span className={`${color} shrink-0`}>•</span>
              <span>{item.text}</span>
            </div>
            {item.subItems && (
              <ul className="flex flex-col gap-1 pl-6">
                {item.subItems.map((sub, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm font-light text-slate-gray">
                    <span className="text-slate-gray shrink-0">-</span>
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

interface ParagraphProps {
  text: string;
  color?: string;
}

export function Paragraph({ text, color = "text-slate-gray" }: ParagraphProps) {
  return (
    <p className={`text-sm lg:text-base font-light ${color} leading-relaxed`}>
      {text}
    </p>
  );
}

interface StatGridProps {
  items: { value: string; label: string }[];
  columns?: number;
}

export function StatGrid({ items, columns = 2 }: StatGridProps) {
  return (
    <div className={`grid grid-cols-${columns} gap-3`}>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col p-3 bg-white border border-gray-100 rounded-xl">
          <span className="text-xl lg:text-2xl font-bold text-cyan-blue">{item.value}</span>
          <span className="text-xs font-light text-slate-gray">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

interface SectionItem {
  title: string;
  text: string;
}

interface SectionListProps {
  items: SectionItem[];
}

export function SectionList({ items }: SectionListProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((section, i) => (
        <div key={i}>
          <h4 className="font-medium text-base text-dark-gray mb-1">{section.title}</h4>
          <p className="text-sm lg:text-base font-light text-slate-gray leading-relaxed">{section.text}</p>
        </div>
      ))}
    </div>
  );
}