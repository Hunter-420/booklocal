import React from 'react';
import { Clock, Check, ArrowRight } from 'lucide-react';
import { BookLocalStore } from '../lib/store';

interface ServicesViewProps {
  onNavigate: (tab: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate }) => {
  const services = BookLocalStore.getServices().filter((s) => s.active);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D3F]">
          Organic Hair Craft
        </span>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-[#1F2A24] text-balance">
          Studio Services & Pricing
        </h1>
        <p className="text-[#6B7A72] text-base text-pretty">
          All our treatments include consultation, botanical scalp massage, organic shampoo wash, and finished styling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="rounded-3xl bg-white border border-[#E8DDCB] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-heading font-bold text-xl text-[#1F2A24]">
                  {srv.name}
                </h2>
                <span className="font-heading font-extrabold text-2xl text-[#1F4D3F] tabular-nums shrink-0">
                  ${(srv.priceCents / 100).toFixed(2)}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E3F1E8] text-[#1F4D3F] text-xs font-semibold tabular-nums">
                <Clock className="size-3" />
                <span>{srv.durationMinutes} minutes session</span>
              </div>

              <p className="text-xs sm:text-sm text-[#6B7A72] leading-relaxed text-pretty">
                {srv.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E8DDCB]/60">
              <button
                onClick={() => onNavigate('booking')}
                className="w-full py-3 rounded-xl bg-[#1F4D3F] hover:bg-[#2C6652] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Select & Pick Slot</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-[#F0E6D8] border border-[#E8DDCB] p-8 text-center space-y-3">
        <h3 className="font-heading font-bold text-xl text-[#1F2A24]">
          Need an extensive colour correction or wedding booking?
        </h3>
        <p className="text-xs text-[#6B7A72] max-w-md mx-auto text-pretty">
          Please contact our team directly so we can allocate dedicated double-session salon chairs.
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-2.5 rounded-xl bg-white border border-[#E8DDCB] text-xs font-bold text-[#1F2A24] hover:bg-[#F5F0E8] transition-colors"
        >
          Contact Reception
        </button>
      </div>
    </div>
  );
};
