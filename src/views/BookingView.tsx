import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, Check, AlertCircle, Sparkles, Download, ArrowRight } from 'lucide-react';
import { BookLocalStore } from '../lib/store';
import { Service, Booking } from '../lib/types';
import { generateAvailableSlots, generateICalendarString, TimeSlot } from '../lib/slots';

interface BookingViewProps {
  onNavigate: (tab: string) => void;
}

export const BookingView: React.FC<BookingViewProps> = ({ onNavigate }) => {
  const services = useMemo(() => BookLocalStore.getServices().filter((s) => s.active), []);
  const openingHours = useMemo(() => BookLocalStore.getOpeningHours(), []);
  const blockedDates = useMemo(() => BookLocalStore.getBlockedDates(), []);
  const allBookings = useMemo(() => BookLocalStore.getBookings(), []);
  const currentUser = useMemo(() => BookLocalStore.getCurrentUser(), []);

  // Form states
  const [selectedService, setSelectedService] = useState<Service>(services[0]);

  // Set default date to tomorrow
  const getDefaultDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getDefaultDateStr());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [customerName, setCustomerName] = useState(currentUser.fullName);
  const [customerEmail, setCustomerEmail] = useState(currentUser.email);
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone);
  const [notes, setNotes] = useState('');

  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Compute available slots
  const { slots, isDayBlocked, blockedReason, isDayClosed } = useMemo(() => {
    if (!selectedService || !selectedDate) {
      return { slots: [], isDayBlocked: false, isDayClosed: false };
    }
    return generateAvailableSlots(
      selectedDate,
      selectedService,
      openingHours,
      blockedDates,
      allBookings
    );
  }, [selectedDate, selectedService, openingHours, blockedDates, allBookings]);

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setBookingError(null);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setBookingError('Please select an available time slot.');
      return;
    }

    if (!customerName.trim() || !customerEmail.trim()) {
      setBookingError('Please provide your name and email address.');
      return;
    }

    const res = BookLocalStore.createBooking({
      serviceId: selectedService.id,
      startsAt: selectedSlot.startsAt,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    });

    if (!res.success) {
      setBookingError(res.error || 'Failed to complete booking.');
      return;
    }

    setConfirmedBooking(res.booking!);
  };

  const handleDownloadCalendar = () => {
    if (!confirmedBooking) return;
    const icsData = generateICalendarString(confirmedBooking);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `willow-stone-${confirmedBooking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D3F]">
          Online Reservations
        </span>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-[#1F2A24] text-balance">
          Book an appointment with our stylists
        </h1>
        <p className="text-sm sm:text-base text-[#6B7A72] text-pretty">
          Choose a service, select your preferred day, and lock in an exclusive 1-on-1 session at our Ponsonby studio.
        </p>
      </div>

      {/* Confirmation Success Modal */}
      {confirmedBooking && (
        <div className="rounded-3xl bg-[#E3F1E8] border border-[#2D6B4E]/30 p-8 sm:p-10 shadow-lg space-y-6 animate-in fade-in duration-200">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-[#1F4D3F] flex items-center justify-center text-white shrink-0">
              <Check className="size-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#1F4D3F] uppercase tracking-wider">
                Booking Confirmed
              </span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1F2A24]">
                We look forward to seeing you, {confirmedBooking.customerName}
              </h2>
              <p className="text-sm text-[#1F2A24]/80">
                A confirmation email notification has been dispatched to {confirmedBooking.customerEmail}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2D6B4E]/20 text-sm">
            <div>
              <span className="text-xs text-[#6B7A72] uppercase font-bold block">Treatment</span>
              <span className="font-bold text-[#1F2A24]">{confirmedBooking.serviceName}</span>
            </div>
            <div>
              <span className="text-xs text-[#6B7A72] uppercase font-bold block">Date & Time</span>
              <span className="font-bold text-[#1F2A24] tabular-nums">
                {new Date(confirmedBooking.startsAt).toLocaleDateString('en-NZ', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}{' '}
                at{' '}
                {new Date(confirmedBooking.startsAt).toLocaleTimeString('en-NZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#6B7A72] uppercase font-bold block">Duration</span>
              <span className="font-bold text-[#1F2A24] tabular-nums">
                {confirmedBooking.durationMinutes} minutes
              </span>
            </div>
            <div>
              <span className="text-xs text-[#6B7A72] uppercase font-bold block">Total Price</span>
              <span className="font-bold text-[#1F4D3F] text-lg tabular-nums">
                ${(confirmedBooking.priceCents / 100).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleDownloadCalendar}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1F4D3F] hover:bg-[#2C6652] text-white font-bold text-sm transition-colors shadow-sm"
            >
              <Download className="size-4" />
              <span>Add to Calendar (.ics)</span>
            </button>
            <button
              onClick={() => onNavigate('my-bookings')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F5F0E8] text-[#1F2A24] font-semibold text-sm transition-colors border border-[#E8DDCB]"
            >
              <span>View My Bookings</span>
              <ArrowRight className="size-4" />
            </button>
            <button
              onClick={() => {
                setConfirmedBooking(null);
                setSelectedSlot(null);
              }}
              className="text-xs text-[#6B7A72] underline hover:text-[#1F2A24] ml-auto"
            >
              Book another appointment
            </button>
          </div>
        </div>
      )}

      {/* Main 2-Column Booking Flow */}
      {!confirmedBooking && (
        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Service, Date and Slot Selection */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Select Service */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDCB] shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E8DDCB] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="size-7 rounded-full bg-[#1F4D3F] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <h2 className="font-heading font-bold text-xl text-[#1F2A24]">
                    Select Service
                  </h2>
                </div>
                <span className="text-xs text-[#6B7A72] font-semibold">
                  {services.length} options available
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {services.map((srv) => {
                  const isSelected = selectedService.id === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setSelectedService(srv);
                        setSelectedSlot(null);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#E3F1E8]/50 border-[#1F4D3F] ring-1 ring-[#1F4D3F]'
                          : 'bg-[#FBF6EF]/50 border-[#E8DDCB] hover:border-[#C9A27E]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-base text-[#1F2A24]">
                            {srv.name}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B7A72] tabular-nums">
                            <Clock className="size-3" />
                            {srv.durationMinutes} min
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7A72] text-pretty">
                          {srv.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-heading font-bold text-lg text-[#1F2A24] tabular-nums block">
                          ${(srv.priceCents / 100).toFixed(2)}
                        </span>
                        <div className="mt-1 flex justify-end">
                          <span
                            className={`size-5 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-[#1F4D3F] text-white' : 'border border-[#CBD5E1]'
                            }`}
                          >
                            {isSelected && <Check className="size-3" />}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Date & Available 30-min Slots */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDCB] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8DDCB] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="size-7 rounded-full bg-[#1F4D3F] text-white flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <h2 className="font-heading font-bold text-xl text-[#1F2A24]">
                    Choose Date & Available Time Slot
                  </h2>
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label htmlFor="booking_date" className="block text-xs font-bold text-[#1F2A24] uppercase tracking-wider">
                  Appointment Date
                </label>
                <div className="relative max-w-xs">
                  <input
                    id="booking_date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot(null);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-[#1F2A24] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]"
                  />
                </div>
              </div>

              {/* Slot Availability Grid */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#6B7A72]">
                  <span>Available Time Slots ({selectedService.durationMinutes} min appointment):</span>
                  <span>Times in NZST</span>
                </div>

                {isDayBlocked && (
                  <div className="p-4 rounded-xl bg-[#FEE2E2] text-[#7F1D1D] text-xs font-medium border border-[#FCA5A5] flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>Studio is closed on this date ({blockedReason || 'Scheduled Holiday'}). Please choose another day.</span>
                  </div>
                )}

                {isDayClosed && !isDayBlocked && (
                  <div className="p-4 rounded-xl bg-[#F0E6D8] text-[#1F2A24] text-xs font-medium border border-[#E8DDCB]">
                    Studio is closed on Sundays for team rest. Please choose Monday through Saturday.
                  </div>
                )}

                {!isDayBlocked && !isDayClosed && slots.length === 0 && (
                  <div className="p-4 rounded-xl bg-[#F0E6D8] text-[#6B7A72] text-xs font-medium border border-[#E8DDCB]">
                    No suitable slots remaining for a {selectedService.durationMinutes}-minute treatment before closing.
                  </div>
                )}

                {!isDayBlocked && !isDayClosed && slots.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {slots.map((slot) => {
                      const isSelected = selectedSlot?.startsAt === slot.startsAt;
                      return (
                        <button
                          key={slot.startsAt}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => handleSlotSelect(slot)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold tabular-nums transition-all ${
                            isSelected
                              ? 'bg-[#1F4D3F] text-white shadow-md scale-105'
                              : slot.available
                              ? 'bg-[#F0E6D8] text-[#1F2A24] hover:bg-[#E3F1E8] hover:text-[#1F4D3F] border border-[#E8DDCB]'
                              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through opacity-60'
                          }`}
                          title={slot.conflictReason || 'Available'}
                        >
                          {slot.timeStr}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Customer Details & Booking Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDCB] shadow-sm space-y-6">
              <div className="border-b border-[#E8DDCB] pb-4">
                <span className="text-xs font-bold text-[#E07A5F] uppercase tracking-wider block">
                  Step 3
                </span>
                <h2 className="font-heading font-bold text-2xl text-[#1F2A24]">
                  Appointment Summary
                </h2>
              </div>

              {/* Summary Breakdown */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FBF6EF] border border-[#E8DDCB] text-sm tabular-nums">
                <div className="flex justify-between">
                  <span className="text-[#6B7A72]">Selected Service:</span>
                  <span className="font-bold text-[#1F2A24]">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7A72]">Duration:</span>
                  <span className="font-medium text-[#1F2A24]">{selectedService.durationMinutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7A72]">Date:</span>
                  <span className="font-medium text-[#1F2A24]">
                    {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-NZ', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7A72]">Time:</span>
                  <span className="font-bold text-[#1F4D3F]">
                    {selectedSlot ? selectedSlot.timeStr : 'Please select slot'}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#E8DDCB] flex justify-between items-center">
                  <span className="font-bold text-[#1F2A24]">Total Due at Salon:</span>
                  <span className="font-heading font-extrabold text-2xl text-[#1F4D3F]">
                    ${(selectedService.priceCents / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Client Info Inputs */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="cust_name" className="block text-xs font-bold text-[#1F2A24] uppercase tracking-wider">
                    Full Name <span className="text-[#E07A5F]">*</span>
                  </label>
                  <input
                    id="cust_name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Samantha Reed"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-[#1F2A24] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="cust_email" className="block text-xs font-bold text-[#1F2A24] uppercase tracking-wider">
                    Email Address <span className="text-[#E07A5F]">*</span>
                  </label>
                  <input
                    id="cust_email"
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="sam.reed@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-[#1F2A24] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="cust_phone" className="block text-xs font-bold text-[#1F2A24] uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    id="cust_phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="021 555 7890"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-[#1F2A24] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="cust_notes" className="block text-xs font-bold text-[#1F2A24] uppercase tracking-wider">
                    Special Requests / Hair History
                  </label>
                  <textarea
                    id="cust_notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Sensitive scalp, previous bleach, or quiet appointment..."
                    className="w-full px-4 py-2 rounded-xl border border-[#E8DDCB] bg-[#FBF6EF] text-[#1F2A24] text-xs focus:outline-none focus:ring-2 focus:ring-[#1F4D3F] resize-y"
                  />
                </div>
              </div>

              {bookingError && (
                <div className="p-3.5 rounded-xl bg-[#FEE2E2] text-[#7F1D1D] text-xs font-medium border border-[#FCA5A5] flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedSlot}
                className="w-full py-4 rounded-xl bg-[#1F4D3F] hover:bg-[#2C6652] text-[#FBF6EF] font-body font-bold text-base transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Confirm & Reserve Appointment</span>
              </button>

              <p className="text-[11px] text-[#6B7A72] text-center text-pretty">
                24-Hour Policy: Cancellations and rescheduling are free up to 24 hours prior to appointment time. Payment is settled at the studio.
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
