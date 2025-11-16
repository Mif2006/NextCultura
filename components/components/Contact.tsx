"use client"

import { MapPin, Phone, Instagram } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Contact() {
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

  return (
    <section id="contact" className="py-16 md:py-32 bg-[#e8e5e0]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="mb-12 md:mb-20">
          <h2
            className={`text-2xl md:text-5xl font-light text-gray-900 mb-4 transform transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            Где мы находимся
          </h2>
          <p
            className={`text-gray-600 text-base md:text-lg mt-6 max-w-2xl transform transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.4s' }}
          >
            В самом сердце исторического Гродно, на улице Советская
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">
          <div>
            <div className="space-y-6 md:space-y-10">
              <div
                className={`flex items-start gap-6 group hover:translate-x-4 transition-all duration-500 cursor-pointer transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.6s' }}
              >
                <div className="w-12 h-12 border border-neutral-700 flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-700 group-hover:scale-110 transition-all duration-300">
                  <MapPin className="w-5 h-5 text-neutral-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-normal text-gray-900 mb-2">АДРЕС</h4>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                    г. Гродно, ул. Советская, 3<br />
                    Беларусь
                  </p>
                </div>
              </div>

              <div
                className={`flex items-start gap-6 group hover:translate-x-4 transition-all duration-500 cursor-pointer transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.8s' }}
              >
                <div className="w-12 h-12 border border-neutral-700 flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-700 group-hover:scale-110 transition-all duration-300">
                  <Phone className="w-5 h-5 text-neutral-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-normal text-gray-900 mb-2">ТЕЛЕФОН</h4>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                    +375 33 342-88-88
                  </p>
                </div>
              </div>

              <a
                href="https://www.instagram.com/boutique_hotel_kultura"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start gap-6 group hover:translate-x-4 transition-all duration-500 cursor-pointer transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '1s' }}
              >
                <div className="w-12 h-12 border border-neutral-700 flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-700 group-hover:scale-110 transition-all duration-300">
                  <Instagram className="w-5 h-5 text-neutral-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-normal text-gray-900 mb-2">INSTAGRAM</h4>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                    @boutique_hotel_kultura
                  </p>
                </div>
              </a>
            </div>
          </div>

          <div
            className={`h-[300px] md:h-[600px] overflow-hidden bg-neutral-100 transform transition-all duration-1000 hover:shadow-2xl ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.7s' }}
          >
            <iframe
              title="Hotel Location"
              src="https://yandex.ru/map-widget/v1/?text=г.%20Гродно%2C%20ул.%20Советская%2C%203%2C%20Отель%20Cultura&z=17&l=map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
