import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Download, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { BookLocalStore } from '../lib/store';
import { Booking } from '../lib/types';
import { canCancelBooking, generateICalendarString } from '../lib/slots';

interface MyBookingsViewProps {
  onNavigate: (tab: string) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentUser = BookLocalStore.getCurrentUser();
  const allBookings = BookLocalStore.getBookings();

  // Filter for current user's bookings
  const userBookings = useMemo(() => {
    return allBookings.filter((b) => b.userId === currentUser.id);
  }, [allBookings, currentUser.id]);

  const nowMs = Date.now();

  const upcomingBookings = useMemo(() => {
    return userBookings
      .filter((b) => new Date(b.startsAt).getTime() >= nowMs)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [userBookings, nowMs]);

  const pastBookings = useMemo(() => {
    return userBookings
      .filter((b) => new Date(b.startsAt).getTime() < nowMs)
      .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
  }, [userBookings, nowMs]);

  const displayedList = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    const res = BookLocalStore.cancelBooking(cancelModalBooking.id);
    if (res.success) {
      setActionMessage({ type: 'success', text: 'Appointment has been cancelled successfully.' });
      setCancelModalBooking(null);
    } else {
      setActionMessage({ type: 'error', text: res.error || 'Failed to cancel appointment.' });
    }
  };

  const handleDownloadCalendar = (bkg: Booking) => {
    const icsData = generateICalendarString(bkg);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `willow-stone-${bkg.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D3F]">
            Client Portal
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#1F2A24] mt-1">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7A72] mt-0.5">
            Bookings for {currentUser.fullName} ({currentUser.email})
          </p>
        </div>

        <button
          onClick={() => onNavigate('booking')}
          className="px-5 py-2.5 rounded-xl bg-[#1F4D3F] hover:bg-[#2C6652] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm self-start sm:self-center"
        >
          Book New Treatment
        </button>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            actionMessage.type === 'success'
              ? 'bg-[#E3F1E8] text-[#1F4D3F] border-[#2D6B4E]/30'
              : 'bg-[#FEE2E2] text-[#7F1D1D] border-[#FCA5A5]'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-xs underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-[#F0E6D8] border border-[#E8DDCB] max-w-xs" role="tablist">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-white text-[#1F2A24] shadow-sm'
              : 'text-[#6B7A72] hover:text-[#1F2A24]'
          }`}
          role="tab"
          aria-selected={activeTab === 'upcoming'}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'past'
              ? 'bg-white text-[#1F2A24] shadow-sm'
              : 'text-[#6B7A72] hover:text-[#1F2A24]'
          }`}
          role="tab"
          aria-selected={activeTab === 'past'}
        >
          Past ({pastBookings.length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {displayedList.map((bkg) => {
          const cancelCheck = canCancelBooking(bkg.startsAt);
          const isCancelled = bkg.status === 'cancelled';

          return (
            <div
              key={bkg.id}
              className={`rounded-3xl p-6 sm:p-8 border transition-colors flex flex-col md:flex-row justify-between gap-6 ${
                isCancelled
                  ? 'bg-white/60 border-gray-200 opacity-70'
                  : 'bg-white border-[#E8DDCB] shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-heading font-bold text-xl text-[#1F2A24]">
                    {bkg.serviceName}
                  </h3>
                  {isCancelled ? (
                    <span className="px-3 py-1 rounded-full bg-[#FEE2E2] text-[#7F1D1D] text-xs font-bold">
                      Cancelled
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-[#DDF3E4] text-[#14532D] text-xs font-bold">
                      Confirmed
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-[#6B7A72] tabular-nums">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-[#1F4D3F]" />
                    <span className="font-semibold text-[#1F2A24]">
                      {new Date(bkg.startsAt).toLocaleDateString('en-NZ', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-[#1F2A24]">
                      {new Date(bkg.startsAt).toLocaleTimeString('en-NZ', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </span>
                    <span>({bkg.durationMinutes} min)</span>
                  </div>
                  <p>Client: {bkg.customerName} · {bkg.customerPhone}</p>
                  {bkg.notes && <p className="italic">Note: "{bkg.notes}"</p>}
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-[#E8DDCB] pt-4 md:pt-0 md:pl-6">
                <div className="md:text-right">
                  <span className="text-xs text-[#6B7A72] block uppercase font-bold">Price</span>
                  <span className="font-heading font-extrabold text-2xl text-[#1F2A24] tabular-nums">
                    ${(bkg.priceCents / 100).toFixed(2)}
                  </span>
                </div>

                {!isCancelled && activeTab === 'upcoming' && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleDownloadCalendar(bkg)}
                      className="px-3 py-2 rounded-xl border border-[#E8DDCB] hover:bg-[#F5F0E8] text-xs font-bold text-[#1F2A24] transition-colors flex items-center justify-center gap-1.5"
                      title="Download calendar event file (.ics)"
                    >
                      <Download className="size-3.5" />
                      <span>.ICS</span>
                    </button>

                    <button
                      disabled={!cancelCheck.allowed}
                      onClick={() => setCancelModalBooking(bkg)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                        cancelCheck.allowed
                          ? 'bg-transparent text-[#7F1D1D] hover:bg-[#FEE2E2] border border-[#FCA5A5]'
                          : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      Cancel booking
                    </button>
                  </div>
                )}

                {!isCancelled && activeTab === 'upcoming' && !cancelCheck.allowed && (
                  <p className="text-[11px] text-[#8A6742] max-w-xs md:text-right">
                    Bookings cannot be cancelled within 24 hours of appointment start time.
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {displayedList.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[#E8DDCB] space-y-4">
            <div className="size-14 rounded-2xl bg-[#E3F1E8] text-[#1F4D3F] flex items-center justify-center mx-auto">
              <Calendar className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl text-[#1F2A24]">
                No {activeTab} bookings yet
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7A72] max-w-sm mx-auto text-pretty">
                Pick a service and an open time slot that suits your schedule.
              </p>
            </div>
            <button
              onClick={() => onNavigate('booking')}
              className="px-6 py-3 rounded-xl bg-[#1F4D3F] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2C6652] transition-colors"
            >
              Book your first appointment
            </button>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog (AlertDialog as per UI Skills) */}
      {cancelModalBooking && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm cancellation"
        >
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 space-y-5 border border-[#E8DDCB] shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-[#FEE2E2] text-[#7F1D1D] flex items-center justify-center shrink-0">
                <AlertCircle className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-xl text-[#1F2A24]">
                  Cancel Appointment?
                </h3>
                <p className="text-xs text-[#6B7A72] text-pretty">
                  Are you sure you want to cancel your{' '}
                  <span className="font-bold text-[#1F2A24]">{cancelModalBooking.serviceName}</span> on{' '}
                  <span className="font-bold text-[#1F2A24] tabular-nums">
                    {new Date(cancelModalBooking.startsAt).toLocaleDateString('en-NZ', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  ? This will release the slot back to the public booking calendar.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DDCB]">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="px-5 py-2.5 rounded-xl border border-[#E8DDCB] text-xs font-bold text-[#1F2A24] hover:bg-[#F5F0E8] transition-colors"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-5 py-2.5 rounded-xl bg-[#7F1D1D] hover:bg-[#991B1B] text-white text-xs font-bold transition-colors shadow-sm"
              >
                Yes, Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
