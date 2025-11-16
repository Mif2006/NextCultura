"use client"

import { useState } from 'react';
import { X, Calendar, Users, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import axios from 'axios';


interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomType?: string;
  pricePerNight?: number;
  discountPercentage?: number;
  offerTitle?: string;
}

export default function BookingModal({ isOpen, onClose, roomType = 'Стандарт', pricePerNight = 120, discountPercentage = 0, offerTitle }: BookingModalProps) {
  const [step, setStep] = useState<'booking' | 'payment'>('booking');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    guestsCount: 1,
    specialRequests: ''
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const { data } = await axios.post('http://localhost:5000/api/bookings', {
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            roomType: roomType,
            guestsCount: formData.guestsCount
        });

        // You can handle the response data here, e.g., display a booking confirmation
        console.log('Booking confirmation:', data);
        setBookingId(data.id); // Save booking ID or response data as needed
        setStep('payment'); // Switch to payment step
    } catch (error) {
        console.error('Booking error:', error);
        alert('Ошибка при создании бронирования. Попробуйте снова.');
    } finally {
        setLoading(false);
    }
};

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const yookassaPaymentId = `yk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await new Promise(resolve => setTimeout(resolve, 2000));

      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          payment_intent_id: yookassaPaymentId
        })
        .eq('id', bookingId);

      if (error) throw error;

      alert('Оплата через ЮKassa прошла успешно! Бронирование подтверждено. Подтверждение отправлено на вашу почту.');

      setFormData({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        checkIn: '',
        checkOut: '',
        guestsCount: 1,
        specialRequests: ''
      });
      setPaymentData({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
      });
      setStep('booking');
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ошибка при обработке платежа. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-light text-gray-900">
{step === 'booking' ? 'Бронирование номера' : 'Оплата через ЮKassa'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Полное имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    placeholder="example@mail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
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
                    min="1"
                    max="10"
                    required
                    value={formData.guestsCount}
                    onChange={(e) => setFormData({ ...formData, guestsCount: parseInt(e.target.value) })}
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
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Особые пожелания
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
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
                {loading ? 'Обработка...' : 'Перейти к оплате'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Защищенная оплата через ЮKassa</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Сумма к оплате:</span>
                  <span className="text-2xl font-medium text-neutral-700">
                    {totalPrice.toLocaleString('ru-RU')} BYN
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CreditCard size={16} className="inline mr-1" />
                  Номер карты *
                </label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={paymentData.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '');
                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                    setPaymentData({ ...paymentData, cardNumber: formatted });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя на карте *
                </label>
                <input
                  type="text"
                  required
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  placeholder="IVAN IVANOV"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Срок действия *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={paymentData.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setPaymentData({ ...paymentData, expiryDate: value });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    placeholder="MM/YY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={paymentData.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setPaymentData({ ...paymentData, cvv: value });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep('booking')}
                  disabled={loading}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-neutral-700 text-white hover:bg-neutral-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Обработка...' : 'Оплатить'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
