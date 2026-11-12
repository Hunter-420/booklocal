import React, { useState } from 'react';
import { Plus, Trash2, Clock, Calendar, Check, Save } from 'lucide-react';
import { BookLocalStore } from '../lib/store';
import { Service, OpeningHour, BlockedDate } from '../lib/types';

export const OwnerSettingsView: React.FC = () => {
  const [services, setServices] = useState<Service[]>(BookLocalStore.getServices());
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>(BookLocalStore.getOpeningHours());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(BookLocalStore.getBlockedDates());

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // New service inputs
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('60');
  const [newServicePrice, setNewServicePrice] = useState('95');

  // New blocked date
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');

  const triggerSavedNotice = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleToggleClosed = (weekday: number) => {
    const updated = openingHours.map((oh) =>
      oh.weekday === weekday ? { ...oh, isClosed: !oh.isClosed } : oh
    );
    setOpeningHours(updated);
    BookLocalStore.saveOpeningHours(updated);
    triggerSavedNotice('Opening hours updated');
  };

  const handleTimeChange = (weekday: number, field: 'openTime' | 'closeTime', val: string) => {
    const updated = openingHours.map((oh) =>
      oh.weekday === weekday ? { ...oh, [field]: val } : oh
    );
    setOpeningHours(updated);
    BookLocalStore.saveOpeningHours(updated);
    triggerSavedNotice('Opening hours updated');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newSrv: Service = {
      id: `srv-${Date.now()}`,
      name: newServiceName,
      description: newServiceDesc,
      durationMinutes: parseInt(newServiceDuration, 10) || 60,
      priceCents: Math.round(parseFloat(newServicePrice) * 100) || 8500,
      active: true,
      sortOrder: services.length + 1,
    };

    const updated = [...services, newSrv];
    setServices(updated);
    BookLocalStore.saveServices(updated);
    setNewServiceName('');
    setNewServiceDesc('');
    triggerSavedNotice('New service added');
  };

  const handleDeleteService = (id: string) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    BookLocalStore.saveServices(updated);
    triggerSavedNotice('Service removed');
  };

  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDate) return;
    const newBlk: BlockedDate = {
      id: `blk-${Date.now()}`,
      date: newBlockDate,
      reason: newBlockReason || 'Holiday',
    };
    const updated = [...blockedDates, newBlk];
    setBlockedDates(updated);
    BookLocalStore.saveBlockedDates(updated);
    setNewBlockDate('');
    setNewBlockReason('');
    triggerSavedNotice('Blocked date added');
  };

  const handleRemoveBlockedDate = (id: string) => {
    const updated = blockedDates.filter((b) => b.id !== id);
    setBlockedDates(updated);
    BookLocalStore.saveBlockedDates(updated);
    triggerSavedNotice('Blocked date removed');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E8DDCB] pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D3F]">
          Studio Configuration
        </span>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#1F2A24] mt-1">
          Owner Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7A72] mt-0.5">
          Manage treatment catalog, weekly opening hours, and holiday date blocks.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-[#E3F1E8] text-[#1F4D3F] text-xs font-bold border border-[#2D6B4E]/30 flex items-center gap-2">
          <Check className="size-4" />
          <span>{savedNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Weekly Opening Hours */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDCB] shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-[#E8DDCB] pb-4">
            <Clock className="size-5 text-[#1F4D3F]" />
            <h2 className="font-heading font-bold text-xl text-[#1F2A24]">
              Weekly Opening Hours
            </h2>
          </div>

          <div className="space-y-3">
            {openingHours.map((oh) => (
              <div
                key={oh.weekday}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#FBF6EF] border border-[#E8DDCB] text-xs"
              >
                <div className="w-24 font-bold text-[#1F2A24]">
                  {oh.weekdayName}
                </div>

                <div className="flex items-center gap-2 tabular-nums">
                  {!oh.isClosed ? (
                    <>
                      <input
                        type="time"
                        value={oh.openTime}
                        onChange={(e) => handleTimeChange(oh.weekday, 'openTime', e.target.value)}
                        className="px-2 py-1 rounded-lg border border-[#E8DDCB] bg-white text-xs"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={oh.closeTime}
                        onChange={(e) => handleTimeChange(oh.weekday, 'closeTime', e.target.value)}
                        className="px-2 py-1 rounded-lg border border-[#E8DDCB] bg-white text-xs"
                      />
                    </>
                  ) : (
                    <span className="text-[#8A6742] font-semibold py-1">Closed for appointments</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleClosed(oh.weekday)}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                    oh.isClosed
                      ? 'bg-[#E3F1E8] text-[#1F4D3F] hover:bg-[#DDF3E4]'
                      : 'bg-[#FEE2E2] text-[#7F1D1D] hover:bg-[#FECACA]'
                  }`}
                >
                  {oh.isClosed ? 'Set Open' : 'Set Closed'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Blocked Holiday Dates */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDCB] shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-[#E8DDCB] pb-4">
            <Calendar className="size-5 text-[#E07A5F]" />
            <h2 className="font-heading font-bold text-xl text-[#1F2A24]">
              Blocked Dates & Holidays
            </h2>
          </div>

          <form onSubmit={handleAddBlockedDate} className="space-y-3 p-4 rounded-2xl bg-[#FBF6EF] border border-[#E8DDCB]">
            <span className="text-xs font-bold text-[#1F2A24] block uppercase tracking-wider">
              Add New Blocked Date
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <input
                type="date"
                required
                value={newBlockDate}
                onChange={(e) => setNewBlockDate(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E8DDCB] bg-white text-[#1F2A24]"
              />
              <input
                type="text"
                placeholder="Reason (e.g. Easter Monday)"
                value={newBlockReason}
                onChange={(e) => setNewBlockReason(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E8DDCB] bg-white text-[#1F2A24]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-[#1F4D3F] text-white text-xs font-bold hover:bg-[#2C6652] transition-colors"
            >
              Add Blocked Date
            </button>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {blockedDates.map((blk) => (
              <div
                key={blk.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#FBF6EF] border border-[#E8DDCB] text-xs"
              >
                <div>
                  <span className="font-bold text-[#1F2A24] tabular-nums">{blk.date}</span>
                  <span className="text-[#6B7A72] ml-2">({blk.reason})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBlockedDate(blk.id)}
                  className="p-1 rounded text-[#7F1D1D] hover:bg-[#FEE2E2] transition-colors"
                  aria-label={`Remove block for ${blk.date}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services List and Creator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDCB] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8DDCB] pb-4">
          <h2 className="font-heading font-bold text-xl text-[#1F2A24]">
            Service Catalog & Treatments ({services.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-4 rounded-2xl bg-[#FBF6EF] border border-[#E8DDCB] flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-base text-[#1F2A24]">
                    {srv.name}
                  </h3>
                  <span className="text-xs font-semibold text-[#6B7A72] tabular-nums">
                    {srv.durationMinutes} min
                  </span>
                </div>
                <p className="text-xs text-[#6B7A72] line-clamp-2">{srv.description}</p>
                <div className="font-bold text-sm text-[#1F4D3F] tabular-nums pt-1">
                  ${(srv.priceCents / 100).toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => handleDeleteService(srv.id)}
                className="p-1.5 rounded-lg text-[#7F1D1D] hover:bg-[#FEE2E2] transition-colors shrink-0"
                aria-label={`Delete ${srv.name}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Service Form */}
        <form onSubmit={handleAddService} className="pt-6 border-t border-[#E8DDCB] space-y-4">
          <h3 className="font-heading font-bold text-base text-[#1F2A24]">
            Add New Styling Service
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#1F2A24] mb-1">Service Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Scalp Detox & Scalp Facial"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1F2A24] mb-1">Duration (min)</label>
              <input
                type="number"
                min="15"
                step="15"
                value={newServiceDuration}
                onChange={(e) => setNewServiceDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1F2A24] mb-1">Price ($ NZD)</label>
              <input
                type="number"
                min="0"
                step="5"
                value={newServicePrice}
                onChange={(e) => setNewServicePrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF]"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold text-[#1F2A24] mb-1 text-xs">Description</label>
            <input
              type="text"
              placeholder="Short description of what the client receives..."
              value={newServiceDesc}
              onChange={(e) => setNewServiceDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-xs"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#1F4D3F] hover:bg-[#2C6652] text-white text-xs font-bold transition-colors"
          >
            Create Service
          </button>
        </form>
      </div>
    </div>
  );
};
