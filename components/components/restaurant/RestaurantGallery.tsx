"use client"

import { useEffect, useRef, useState } from 'react';

export default function RestaurantGallery() {
  const [isVisible, setIsVisible] = useState(false);
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

  const images = [
    {
      url: '/photo_1_2025-10-31_18-24-38.jpg',
      alt: 'Английский завтрак с глазуньей'
    },
    {
      url: '/photo_8_2025-10-31_18-24-38.jpg',
      alt: 'Брускетты с сёмгой'
    },
    {
      url: '/photo_16_2025-10-31_18-24-38.jpg',
      alt: 'Салат с мандарином'
    },
    {
      url: '/photo_23_2025-10-31_18-24-38.jpg',
      alt: 'Говядина с клюквенным соусом'
    },
    {
      url: '/photo_31_2025-10-31_18-24-38.jpg',
      alt: 'Больше чем шу'
    },
    {
      url: '/photo_19_2025-10-31_18-24-38.jpg',
      alt: 'Рамен с цыпленком'
    }
  ];

  return (
    <section className="py-32 bg-[#e8e5e0]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <h2
            className={`text-3xl md:text-5xl font-light text-gray-900 mb-4 transform transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Галерея
          </h2>
          <p
            className={`text-gray-600 text-lg mt-6 max-w-2xl mx-auto transform transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            Взгляните на наши кулинарные шедевры
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden h-80 transform transition-all duration-1000 hover:scale-105 hover:shadow-2xl ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${0.4 + index * 0.1}s` }}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
