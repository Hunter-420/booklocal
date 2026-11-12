import React, { useState } from 'react';
import { MapPin, Clock, Phone, Mail, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setMsg('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D3F]">
          Studio & Enquiries
        </span>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-[#1F2A24] text-balance">
          Find us in Ponsonby
        </h1>
        <p className="text-[#6B7A72] text-base text-pretty">
          Centrally located on Ponsonby Road with dedicated rear client parking and complimentary organic herbal teas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Contact info cards */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-[#E8DDCB] shadow-sm space-y-6">
            <h2 className="font-heading font-bold text-2xl text-[#1F2A24]">
              Studio Information
            </h2>

            <div className="space-y-4 text-sm text-[#6B7A72]">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-[#E3F1E8] text-[#1F4D3F] flex items-center justify-center shrink-0">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1F2A24]">Address</p>
                  <p>142 Ponsonby Road, Ponsonby, Auckland 1011</p>
                  <p className="text-xs text-[#8A6742] mt-0.5">Free client parking in rear lane</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-[#E3F1E8] text-[#1F4D3F] flex items-center justify-center shrink-0">
                  <Clock className="size-4" />
                </div>
                <div className="tabular-nums space-y-1">
                  <p className="font-bold text-[#1F2A24]">Studio Hours</p>
                  <p className="text-xs">Monday - Friday: 9:00 am - 5:00 pm</p>
                  <p className="text-xs">Saturday: 9:00 am - 3:00 pm</p>
                  <p className="text-xs font-medium text-[#E07A5F]">Sunday: Closed for team rest</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-[#E3F1E8] text-[#1F4D3F] flex items-center justify-center shrink-0">
                  <Phone className="size-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1F2A24]">Phone</p>
                  <p className="tabular-nums">(09) 376 4920</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-[#E3F1E8] text-[#1F4D3F] flex items-center justify-center shrink-0">
                  <Mail className="size-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1F2A24]">Email</p>
                  <p>appointments@willowandstone.co.nz</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-3xl p-8 border border-[#E8DDCB] shadow-sm space-y-6">
          <h2 className="font-heading font-bold text-2xl text-[#1F2A24]">
            Send Reception a Note
          </h2>

          {sent && (
            <div className="p-4 rounded-xl bg-[#E3F1E8] text-[#1F4D3F] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              <span>Message sent. We will reply within 4 salon business hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1F2A24] uppercase">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Samantha Reed"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-sm text-[#1F2A24]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1F2A24] uppercase">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sam@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-sm text-[#1F2A24]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1F2A24] uppercase">Message</label>
              <textarea
                rows={3}
                required
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Special service requirements or hair questions..."
                className="w-full px-4 py-2 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-xs text-[#1F2A24]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1F4D3F] hover:bg-[#2C6652] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              Send Enquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
