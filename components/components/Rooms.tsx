"use client"

import { useEffect, useRef, useState } from 'react';
import BookingModal from './BookingModal';

const rooms = [
  {
    title: 'Стандартный номер',
    description: 'Уютный номер с современным дизайном и всеми удобствами',
    price: 'от 120 BYN',
    image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1200',
    features: ['25 м²', 'Двуспальная кровать', 'Wi-Fi']
  },
  {
    title: 'Номер Делюкс',
    description: 'Просторный номер с зоной отдыха и панорамным видом',
    price: 'от 180 BYN',
    image: 'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=1200',
    features: ['40 м²', 'Зона отдыха', 'Мини-бар']
  },
  {
    title: 'Люкс',
    description: 'Роскошные апартаменты с отдельной гостиной',
    price: 'от 280 BYN',
    image: 'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg?auto=compress&cs=tinysrgb&w=1200',
    features: ['65 м²', 'Отдельная гостиная', 'Ванна с джакузи']
  }
];

export default function Rooms() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<{ type: string; price: number } | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

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
            Каждый номер создан для вашего комфорта в историческом центре Гродно
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
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-all duration-500"></div>
              </div>
              <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-3 group-hover:translate-x-2 transition-transform duration-300">
                {room.title}
              </h3>
              <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                {room.description}
              </p>
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
    </section>
  );
}
