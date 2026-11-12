import React, { useState, useMemo } from 'react';
import { Calendar, DollarSign, Users, Clock, AlertCircle, Ban, Check, Search, Filter } from 'lucide-react';
import { BookLocalStore } from '../lib/store';
import { Booking } from '../lib/types';

interface OwnerDashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const OwnerDashboardView: React.FC<OwnerDashboardViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');

  const bookings = BookLocalStore.getBookings();
  const blockedDates = BookLocalStore.getBlockedDates();

  // Metrics
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayBookings = useMemo(() => {
    return bookings.filter((b) => b.startsAt.startsWith(todayStr) && b.status === 'confirmed');
  }, [bookings, todayStr]);

  const totalRevenueCents = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.priceCents, 0);
  }, [bookings]);

  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchSearch =
        searchQuery === '' ||
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [bookings, statusFilter, searchQuery]);

  const handleCancelBooking = (id: string) => {
    BookLocalStore.cancelBooking(id);
  };

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate) return;
    const current = BookLocalStore.getBlockedDates();
    if (current.some((b) => b.date === blockDate)) return;

    BookLocalStore.saveBlockedDates([
      ...current,
      {
        id: `blk-${Date.now()}`,
        date: blockDate,
        reason: blockReason || 'Owner Blocked',
      },
    ]);
    setShowBlockModal(false);
    setBlockDate('');
    setBlockReason('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D3F]">
            Studio Management
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#1F2A24] mt-1">
            Owner Dashboard
          </h1>
          <p className="text-xs text-[#6B7A72] mt-0.5">
            Willow & Stone · 142 Ponsonby Road Studio Schedule
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBlockModal(true)}
            className="px-4 py-2.5 rounded-xl border border-[#E8DDCB] bg-white hover:bg-[#F5F0E8] text-[#1F2A24] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            <Ban className="size-3.5 text-[#E07A5F]" />
            <span>Block Date</span>
          </button>
          <button
            onClick={() => onNavigate('owner-settings')}
            className="px-4 py-2.5 rounded-xl bg-[#1F4D3F] hover:bg-[#2C6652] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Configure Hours
          </button>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl bg-white p-6 border border-[#E8DDCB] shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#6B7A72] uppercase tracking-wider block">
            Today's Schedule
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-3xl text-[#1F2A24] tabular-nums">
              {todayBookings.length}
            </span>
            <span className="text-xs font-semibold text-[#1F4D3F] bg-[#E3F1E8] px-2 py-0.5 rounded-full">
              Active Today
            </span>
          </div>
          <p className="text-[11px] text-[#6B7A72]">Clients visiting the studio today</p>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-[#E8DDCB] shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#6B7A72] uppercase tracking-wider block">
            Total Revenue Booked
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-3xl text-[#1F2A24] tabular-nums">
              ${(totalRevenueCents / 100).toFixed(0)}
            </span>
            <span className="text-xs font-semibold text-[#1F4D3F] bg-[#E3F1E8] px-2 py-0.5 rounded-full">
              Gross Value
            </span>
          </div>
          <p className="text-[11px] text-[#6B7A72]">Confirmed appointments sum</p>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-[#E8DDCB] shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#6B7A72] uppercase tracking-wider block">
            Confirmed Bookings
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-3xl text-[#1F2A24] tabular-nums">
              {confirmedCount}
            </span>
            <span className="text-xs font-semibold text-[#2D6B4E] bg-[#DDF3E4] px-2 py-0.5 rounded-full">
              System Total
            </span>
          </div>
          <p className="text-[11px] text-[#6B7A72]">Across all styling services</p>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-[#E8DDCB] shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#6B7A72] uppercase tracking-wider block">
            Blocked Dates
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-3xl text-[#1F2A24] tabular-nums">
              {blockedDates.length}
            </span>
            <span className="text-xs font-semibold text-[#8A6742] bg-[#F0E6D8] px-2 py-0.5 rounded-full">
              Holidays
            </span>
          </div>
          <p className="text-[11px] text-[#6B7A72]">No public slot availability</p>
        </div>
      </div>

      {/* Schedule Table and Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDCB] shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#E8DDCB] pb-5">
          <h2 className="font-heading font-bold text-xl text-[#1F2A24]">
            All Appointments
          </h2>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex gap-1 p-1 rounded-xl bg-[#F0E6D8] border border-[#E8DDCB] text-xs font-bold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === 'all' ? 'bg-white text-[#1F2A24] shadow-sm' : 'text-[#6B7A72]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === 'confirmed' ? 'bg-white text-[#1F2A24] shadow-sm' : 'text-[#6B7A72]'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setStatusFilter('cancelled')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === 'cancelled' ? 'bg-white text-[#1F2A24] shadow-sm' : 'text-[#6B7A72]'
                }`}
              >
                Cancelled
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 md:w-60">
              <Search className="size-3.5 text-[#6B7A72] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search client or service..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-xs text-[#1F2A24] focus:outline-none focus:ring-1 focus:ring-[#1F4D3F]"
              />
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-body">
            <thead>
              <tr className="border-b border-[#E8DDCB] text-xs uppercase tracking-wider text-[#6B7A72]">
                <th className="pb-3 font-bold">Client</th>
                <th className="pb-3 font-bold">Service</th>
                <th className="pb-3 font-bold">Appointment Date</th>
                <th className="pb-3 font-bold">Duration</th>
                <th className="pb-3 font-bold">Price</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDCB]/60 tabular-nums">
              {filteredBookings.map((bkg) => {
                const isCancelled = bkg.status === 'cancelled';
                return (
                  <tr key={bkg.id} className="hover:bg-[#FBF6EF]/50 transition-colors">
                    <td className="py-4 font-semibold text-[#1F2A24]">
                      <div>{bkg.customerName}</div>
                      <div className="text-xs text-[#6B7A72] font-normal">{bkg.customerPhone || bkg.customerEmail}</div>
                    </td>
                    <td className="py-4 text-[#1F2A24] font-medium">{bkg.serviceName}</td>
                    <td className="py-4 text-[#1F2A24]">
                      <div>
                        {new Date(bkg.startsAt).toLocaleDateString('en-NZ', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                      <div className="text-xs text-[#6B7A72]">
                        {new Date(bkg.startsAt).toLocaleTimeString('en-NZ', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                    </td>
                    <td className="py-4 text-[#6B7A72]">{bkg.durationMinutes} min</td>
                    <td className="py-4 font-bold text-[#1F2A24]">
                      ${(bkg.priceCents / 100).toFixed(2)}
                    </td>
                    <td className="py-4">
                      {isCancelled ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#7F1D1D] text-xs font-bold">
                          Cancelled
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#DDF3E4] text-[#14532D] text-xs font-bold">
                          Confirmed
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {!isCancelled && (
                        <button
                          onClick={() => handleCancelBooking(bkg.id)}
                          className="px-3 py-1 rounded-lg text-xs font-bold text-[#7F1D1D] hover:bg-[#FEE2E2] border border-[#FCA5A5] transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="py-12 text-center text-xs text-[#6B7A72]">
              No bookings matched your search filter.
            </div>
          )}
        </div>
      </div>

      {/* Block Date Modal Dialog */}
      {showBlockModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Block out date"
        >
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 space-y-5 border border-[#E8DDCB] shadow-2xl">
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl text-[#1F2A24]">
                Block Studio Date
              </h3>
              <p className="text-xs text-[#6B7A72]">
                Prevent clients from booking any time slots on a specific calendar date.
              </p>
            </div>

            <form onSubmit={handleCreateBlock} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="blk_date" className="block text-xs font-bold text-[#1F2A24] uppercase tracking-wider">
                  Select Date
                </label>
                <input
                  id="blk_date"
                  type="date"
                  required
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-sm text-[#1F2A24]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="blk_reason" className="block text-xs font-bold text-[#1F2A24] uppercase tracking-wider">
                  Reason / Holiday Name
                </label>
                <input
                  id="blk_reason"
                  type="text"
                  placeholder="e.g. Staff Training or Public Holiday"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-sm text-[#1F2A24]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E8DDCB]">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8DDCB] text-xs font-bold text-[#1F2A24]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1F4D3F] hover:bg-[#2C6652] text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Confirm Block Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
