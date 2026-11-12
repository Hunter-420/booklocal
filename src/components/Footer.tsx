import React from 'react';
import { MapPin, Phone, Mail, Clock, Scissors } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#14201B] text-[#E3F1E8] border-t border-[#2F4238]">
      {/* Demo Notice */}
      <div className="bg-[#0F1A15] border-b border-[#243730] py-2.5 px-4 text-center">
        <p className="text-xs font-semibold text-[#E07A5F] tracking-wider uppercase">
          Demo project: concept booking app for Willow & Stone Hair Studio (Ponsonby, Auckland)
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#1F4D3F] flex items-center justify-center p-2 text-[#E3F1E8] border border-[#2F4238]">
                <Scissors className="size-5" />
              </div>
              <span className="font-heading font-bold text-2xl text-[#F2EDE4]">
                Willow & Stone
              </span>
            </div>
            <p className="text-sm text-[#A3B3AA] text-pretty leading-relaxed">
              Organic, low-tox hair artistry and modern barbering located in the heart of Ponsonby, Auckland.
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-[#1F4D3F] text-xs font-semibold text-[#E3F1E8]">
              Sustainable Salon Network Member
            </span>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-base text-[#F2EDE4]">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A3B3AA]">
              {[
                { id: 'booking', label: 'Book Appointment Online' },
                { id: 'services', label: 'Service Catalog & Pricing' },
                { id: 'my-bookings', label: 'Client Appointments' },
                { id: 'owner-dashboard', label: 'Owner Portal' },
                { id: 'contact', label: 'Location & Parking' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      onNavigate(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#E3F1E8] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-base text-[#F2EDE4]">
              Studio Hours
            </h4>
            <div className="space-y-2 text-sm text-[#A3B3AA] tabular-nums">
              <div className="flex justify-between py-1 border-b border-[#243730]">
                <span>Monday - Friday</span>
                <span className="font-semibold text-[#F2EDE4]">9:00 am - 5:00 pm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#243730]">
                <span>Saturday</span>
                <span className="font-semibold text-[#F2EDE4]">9:00 am - 3:00 pm</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Sunday</span>
                <span className="font-semibold text-[#E07A5F]">Closed for rest</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-base text-[#F2EDE4]">
              Visit Studio
            </h4>
            <div className="space-y-3 text-sm text-[#A3B3AA]">
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-[#C9A27E] shrink-0 mt-0.5" />
                <span>142 Ponsonby Road, Ponsonby, Auckland 1011</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-[#C9A27E] shrink-0" />
                <span className="tabular-nums">(09) 376 4920</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-[#C9A27E] shrink-0" />
                <span>appointments@willowandstone.co.nz</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[#243730] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7A72]">
          <p className="tabular-nums">
            &copy; 2026 Willow & Stone. All rights reserved.
          </p>
          <p>
            Demo application proving custom service booking workflows and exclusion constraint scheduling.
          </p>
        </div>
      </div>
    </footer>
  );
};
