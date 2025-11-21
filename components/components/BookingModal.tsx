'use client';

import React, { useState } from 'react';
import { X, Calendar, Users, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/**
 * BookingModal (revised)
 *
 * - Server creates the local booking via POST /api/booking/prebook
 * - Payment integration is intentionally DISABLED in this build.
 * - For testing, a "Simulate confirmation" button will mark the booking as confirmed in Supabase.
 *
 * NOTE: Remove the simulate button in production or guard it behind an environment flag.
 */

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roomType?: string;
  pricePerNight?: number;
  discountPercentage?: number;
  offerTitle?: string;
};

type FormData = {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  specialRequests: string;
};

type PaymentData = {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
};

async function postJSON<T = any>(url: string, body: unknown, timeoutMs = 30000): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    clearTimeout(id);

    const text = await res.text();
    if (!res.ok) {
      try {
        const parsed = JSON.parse(text);
        throw new Error(parsed?.message || parsed?.error || text || `Request failed: ${res.status}`);
      } catch {
        throw new Error(text || `Request failed: ${res.status}`);
      }
    }

    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  }
}

export default function BookingModal({
  isOpen,
  onClose,
  roomType = 'Стандарт',
  pricePerNight = 120,
  discountPercentage = 0,
  offerTitle,
}: BookingModalProps) {
  const [step, setStep] = useState<'booking' | 'postbook'>('booking');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [prebookData, setPrebookData] = useState<any | null>(null);

  const [formData, setFormData] = useState<FormData>({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    guestsCount: 1,
    specialRequests: '',
  });

  // payment fields kept for visual parity but intentionally unused
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  if (!isOpen) return null;

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const basePrice = calculateNights() * pricePerNight;
  const discountAmount = discountPercentage > 0 ? Math.round(basePrice * (discountPercentage / 100)) : 0;
  const totalPrice = basePrice - discountAmount;

  // ---- Booking step -> call server prebook which also creates local booking ----
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!formData.guestName || !formData.guestEmail || !formData.checkIn || !formData.checkOut) {
      alert('Пожалуйста заполните все обязательные поля.');
      setLoading(false);
      return;
    }

    try {
      const prebookPayload = {
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guestsCount: formData.guestsCount,
        roomType,
        pricePerNight,
        totalPrice,
        // include guest info so server can persist it
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        specialRequests: formData.specialRequests,
      };

      // Server route must create the local booking and return { ok, localBookingId, prebook, bookHash, price }
      const resp = await postJSON<{
        ok: boolean;
        localBookingId: string;
        prebook?: any;
        bookHash?: string;
        price?: number;
      }>('/api/booking/prebook', prebookPayload, 60000);

      if (!resp?.ok) throw new Error('Prebook failed');

      // Save returned id & prebook into component state
      setBookingId(resp.localBookingId);
      setPrebookData(resp.prebook ?? null);

      // Move to postbook screen (payment disabled)
      setStep('postbook');
    } catch (err: any) {
      console.error('Booking / Prebook error:', err);
      alert(err?.message ?? 'Ошибка при создании бронирования. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  // ---- Payment disabled: show instructions and allow dev-only simulation ----
  const handleSimulateConfirmation = async () => {
    if (!bookingId) return alert('Missing booking id');

    if (!confirm('This will simulate payment/confirmation and mark the booking as confirmed in Supabase. DEV only. Continue?')) return;

    setLoading(true);
    try {
      // Mark booking as confirmed locally for testing. This uses the client-side Supabase key,
      // which is fine for dev but should be performed server-side in production.
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          booking_status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      if (error) throw error;

      alert('Booking marked as confirmed (simulated).');
      onClose();
      // reset state lightly
      setStep('booking');
      setBookingId('');
      setPrebookData(null);
      setFormData({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        checkIn: '',
        checkOut: '',
        guestsCount: 1,
        specialRequests: '',
      });
    } catch (err: any) {
      console.error('Simulate confirmation error:', err);
      alert(err?.message ?? 'Failed to simulate confirmation.');
    } finally {
      setLoading(false);
    }
  };

  // quick helpers for updating state
  const updateForm = (patch: Partial<FormData>) => setFormData((s) => ({ ...s, ...patch }));
  const updatePayment = (patch: Partial<PaymentData>) => setPaymentData((s) => ({ ...s, ...patch }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-light text-gray-900">{step === 'booking' ? 'Бронирование номера' : 'Бронирование создано'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {step === 'booking' ? (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">{roomType}</h3>
                <p className="text-gray-600">{pricePerNight.toLocaleString('ru-RU')} BYN за ночь</p>
                {offerTitle && discountPercentage > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                      {offerTitle} - Скидка {discountPercentage}%
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Полное имя *</label>
                  <input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={(e) => updateForm({ guestName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.guestEmail}
                    onChange={(e) => updateForm({ guestEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    placeholder="example@mail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Телефон *</label>
                  <input
                    type="tel"
                    required
                    value={formData.guestPhone}
                    onChange={(e) => updateForm({ guestPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    placeholder="+375 29 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users size={16} className="inline mr-1" />
                    Количество гостей *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={formData.guestsCount}
                    onChange={(e) => updateForm({ guestsCount: parseInt(e.target.value || '1') })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Заезд *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.checkIn}
                    onChange={(e) => updateForm({ checkIn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Выезд *
                  </label>
                  <input
                    type="date"
                    required
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    value={formData.checkOut}
                    onChange={(e) => updateForm({ checkOut: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Особые пожелания</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => updateForm({ specialRequests: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  placeholder="Дополнительные подушки, ранний заезд и т.д."
                />
              </div>

              {calculateNights() > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-700">Количество ночей:</span>
                    <span className="font-medium">{calculateNights()}</span>
                  </div>
                  {discountPercentage > 0 && (
                    <>
                      <div className="flex justify-between items-center text-lg mt-2">
                        <span className="text-gray-700">Сумма без скидки:</span>
                        <span className="line-through text-gray-500">{basePrice.toLocaleString('ru-RU')} BYN</span>
                      </div>
                      <div className="flex justify-between items-center text-lg mt-1">
                        <span className="text-green-700 font-medium">Скидка ({discountPercentage}%):</span>
                        <span className="text-green-700 font-medium">-{discountAmount.toLocaleString('ru-RU')} BYN</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center text-xl font-medium mt-2 pt-2 border-t border-gray-300">
                    <span className="text-gray-900">Итого к оплате:</span>
                    <span className="text-neutral-700">{totalPrice.toLocaleString('ru-RU')} BYN</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || calculateNights() === 0}
                className="w-full py-3 bg-neutral-700 text-white hover:bg-neutral-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Обработка...' : 'Забронировать (создать бронирование)'}
              </button>
            </form>
          ) : (
            // POST-BOOK (payment disabled)
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Бронирование создано — оплата отключена</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Локальный ID бронирования:</span>
                    <span className="font-medium">{bookingId}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-700">Сумма (итого):</span>
                    <span className="font-medium">{(prebookData?.price ?? totalPrice).toLocaleString?.('ru-RU') ?? prebookData?.price ?? totalPrice} BYN</span>
                  </div>

                  {prebookData?.cancellation_policy && (
                    <div className="mt-2">
                      <div className="font-medium">Условия отмены:</div>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(prebookData.cancellation_policy, null, 2)}</pre>
                    </div>
                  )}

                  {prebookData && !prebookData.cancellation_policy && (
                    <div className="text-sm text-gray-600">Пре-бронирование успешно. Подождите подтверждения после оплаты (оплата отключена в этом тесте).</div>
                  )}
                </div>
              </div>

              {/* Payment section intentionally disabled */}
              <div className="bg-white p-4 rounded border border-dashed border-gray-200">
                <div className="mb-3 text-sm text-gray-700">
                  Оплата отключена для тестирования. Ниже вы можете симулировать подтверждение бронирования (DEV ONLY).
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CreditCard size={16} className="inline mr-1" />
                      Номер карты
                    </label>
                    <input
                      type="text"
                      disabled
                      value={paymentData.cardNumber}
                      onChange={(e) => updatePayment({ cardNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded"
                      placeholder="(оплата отключена)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Имя на карте</label>
                    <input
                      type="text"
                      disabled
                      value={paymentData.cardName}
                      onChange={(e) => updatePayment({ cardName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded"
                      placeholder="(оплата отключена)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Срок действия</label>
                    <input
                      type="text"
                      disabled
                      value={paymentData.expiryDate}
                      onChange={(e) => updatePayment({ expiryDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      disabled
                      value={paymentData.cvv}
                      onChange={(e) => updatePayment({ cvv: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded"
                      placeholder="CVV"
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      // Back to edit booking
                      setStep('booking');
                    }}
                    className="py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Редактировать бронирование
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateConfirmation}
                    className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500"
                    disabled={loading}
                  >
                    {loading ? 'Обработка...' : 'Simulate confirmation (DEV)'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
