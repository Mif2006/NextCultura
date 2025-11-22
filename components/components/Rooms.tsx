"use client"

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import BookingModal from './BookingModal';

const rooms = [
  {
    title: 'Делюкс с балконом',
    description: 'Уютный современный номер с выходом на небольшой балкон. Идеален для пары или одного гостя.',
    price: 'от 120 BYN',
    images: [
      '/Rooms/IMG_20251120_150935_690.jpg',
      '/Rooms/IMG_20251120_150919_870.jpg',
      '/Rooms/IMG_20251120_150916_901.jpg',
      '/Rooms/IMG_20251120_150859_353.jpg',
      '/Rooms/IMG_20251120_150855_053.jpg',
      '/Rooms/IMG_20251120_150938_549.jpg',
    ],
    features: ['44 м²', 'Двуспальная кровать', 'Рабочая зона', 'Wi‑Fi', 'Небольшой балкон']
  },
  {
    title: 'Представительский люкс с балконом и ванной чашей',
    description: 'Просторный номер с зоной отдыха, панорамным балконом и круглой купелью. Отличный выбор для романтического отдыха.',
    price: 'от 180 BYN',
    images: [
      '/Rooms/IMG_20251120_145519_667.jpg',
      '/Rooms/IMG_20251120_145501_634.jpg',
      '/Rooms/IMG_20251120_145526_536.jpg',
      '/Rooms/IMG_20251120_145556_884.jpg',
      '/Rooms/IMG_20251120_145604_693.jpg',
      '/Rooms/IMG_20251120_145712_373.jpg',
    ],
    features: ['38 м²', 'Зона отдыха', 'Балкон', 'Мини‑бар', 'Ванная чаша']
  },
  {
    title: 'Делюкс с ванной чашей',
    description: 'Комфортный номер средней площади с отдельной зоной отдыха и круглой купелью.',
    price: 'от 280 BYN',
    images: [
      '/Rooms/IMG_20251120_145334_889.jpg',
      '/Rooms/IMG_20251120_145338_036.jpg',
      '/Rooms/IMG_20251120_145410_674.jpg'
    ],
    features: ['40 м²', 'Отдельная небольшая гостиная', 'Wi‑Fi', 'Ванная чаша']
  }
];

export default function Rooms() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<{ type: string; price: number } | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [currentImageIndexes, setCurrentImageIndexes] = useState<number[]>(() => rooms.map(() => 0));
  const imageRefs = useRef<Array<HTMLImageElement | null>>(rooms.map(() => null));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const animateImageChange = (cardIndex: number, targetIndex: number) => {
    const img = imageRefs.current[cardIndex];
    if (!img) {
      setCurrentImageIndexes(prev => {
        const copy = [...prev];
        copy[cardIndex] = targetIndex;
        return copy;
      });
      return;
    }

    gsap.killTweensOf(img);
    gsap.to(img, {
      opacity: 0,
      scale: 0.98,
      duration: 0.18,
      ease: 'power1.in',
      onComplete: () => {
        setCurrentImageIndexes(prev => {
          const copy = [...prev];
          copy[cardIndex] = targetIndex;
          return copy;
        });

        requestAnimationFrame(() => {
          gsap.fromTo(
            img,
            { opacity: 0, scale: 1.02 },
            { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
          );
        });
      }
    });
  };

  const goPrev = (cardIndex: number) => {
    const len = rooms[cardIndex].images.length;
    animateImageChange(cardIndex, (currentImageIndexes[cardIndex] - 1 + len) % len);
  };

  const goNext = (cardIndex: number) => {
    const len = rooms[cardIndex].images.length;
    animateImageChange(cardIndex, (currentImageIndexes[cardIndex] + 1) % len);
  };

  const jumpTo = (cardIndex: number, imgIndex: number) => {
    if (imgIndex !== currentImageIndexes[cardIndex]) animateImageChange(cardIndex, imgIndex);
  };

  return (
    <section id="rooms" className="py-16 md:py-32 bg-[#e8e5e0]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="mb-12 md:mb-20">
          <h2
            className={`text-2xl md:text-5xl font-light text-gray-900 mb-4 transform transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            Номера и цены
          </h2>
          <p
            className={`text-gray-600 text-base md:text-lg mt-6 max-w-2xl transform transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.4s' }}
          >
            Комфорт и удобство в самом центре Гродно
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {rooms.map((room, index) => (
            <div
              key={index}
              className={`group transform transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${0.6 + index * 0.2}s` }}
            >
              <div className="relative h-[300px] md:h-[500px] overflow-hidden mb-6 md:mb-8 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <img
                  ref={el => { imageRefs.current[index] = el; }}
                  src={room.images[currentImageIndexes[index]]}
                  alt={`${room.title} ${currentImageIndexes[index] + 1}`}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 cursor-pointer"
                  onClick={() => setFullscreenImage(room.images[currentImageIndexes[index]])}
                />

                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-all duration-500"></div>

                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={() => goPrev(index)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/60 backdrop-blur-sm rounded-full p-2 md:p-3 shadow hover:scale-105"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => goNext(index)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/60 backdrop-blur-sm rounded-full p-2 md:p-3 shadow hover:scale-105"
                    >
                      ›
                    </button>

                    <div className="absolute left-1/2 -translate-x-1/2 bottom-3 z-10 flex gap-2">
                      {room.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => jumpTo(index, i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentImageIndexes[index] === i ? 'bg-white scale-125' : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-3 group-hover:translate-x-2 transition-transform duration-300">{room.title}</h3>
              <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">{room.description}</p>

              <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                {room.features.map((feature, i) => (
                  <span key={i} className="text-xs md:text-sm text-gray-500">
                    {feature}{i < room.features.length - 1 ? ' •' : ''}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <span className="text-xl md:text-2xl font-light text-gray-900">{room.price}</span>
                <button
                  onClick={() => {
                    setSelectedRoom({ type: room.title, price: parseInt(room.price.match(/\d+/)?.[0] || '120') });
                    setIsModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-neutral-700 text-white hover:bg-neutral-600 transition-all duration-300 hover:scale-105 text-sm md:text-base"
                >
                  Забронировать
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRoom && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRoom(null);
          }}
          roomType={selectedRoom.type}
          pricePerNight={selectedRoom.price}
        />
      )}

      {fullscreenImage && (
        <div className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-4 animate-fadeIn">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 text-white text-3xl md:text-4xl font-light hover:scale-110 transition-transform"
          >
            ×
          </button>
          <img
            src={fullscreenImage}
            className="max-w-[95%] max-h-[95%] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
