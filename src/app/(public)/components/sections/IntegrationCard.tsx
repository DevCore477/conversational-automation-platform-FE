// components/IntegrationCard.tsx
import { type Integration } from "@/common/constants/integrations";

interface IntegrationCardProps {
  integration: Integration;
}

export default function IntegrationCard({ integration }: IntegrationCardProps) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-4 md:p-6 shadow-md transition-all hover:shadow-lg group">
      {/* Icon Container */}
      <div className="flex size-16 lg:size-20 shrink-0 items-center justify-center rounded-xl transition-colors">
        {integration.img ? (
          <img
            src={integration.img.src}
            className="size-16 lg:size-20 object-contain"
            alt={integration.name}
          />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-cyan-blue to-neon-pink flex items-center justify-center text-white font-bold text-xl">
            {integration.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-dm-sans text-base lg:text-xl 4xl:text-2xl font-medium text-dark-gray transition-colors">
          {integration.name}
        </h3>
        <p className="lg:mt font-dm-sans text-xs lg:text-sm leading-tight text-slate-gray">
          {integration.desc}
        </p>
      </div>
    </div>
  );
}