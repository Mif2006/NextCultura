"use client"

import { useEffect, useRef, useState } from 'react';

export default function About() {
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
    <section id="about" className="py-16 md:py-32 bg-[#e8e5e0]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start">
          <div>
            <h2
              className={`text-2xl md:text-5xl font-light text-gray-900 mb-8 md:mb-12 leading-tight transform transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.2s' }}
            >
              Что такое<br />Отель Культура?
            </h2>
            <div className="space-y-6 md:space-y-8 text-gray-700 leading-relaxed text-base md:text-lg">
              <p
                className={`transform transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.4s' }}
              >
                Бутик-отель в самом сердце Гродно на знаковой улице Советская. Здесь история встречается с современностью.
              </p>
              <p
                className={`transform transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.6s' }}
              >
                Мы создали пространство, где каждая деталь отражает культурное наследие города и стремление к эстетике.
              </p>
              <p
                className={`transform transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.8s' }}
              >
                Откройте для себя Гродно заново — прогулки по старинным улицам начинаются прямо у порога отеля.
              </p>
            </div>
            <div
              className={`mt-8 md:mt-12 transform transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '1s' }}
            >
              <a
                href="#rooms"
                className="inline-block w-full sm:w-auto text-center px-6 md:px-8 py-3 md:py-4 bg-neutral-700 text-white hover:bg-neutral-600 transition-all duration-300 hover:scale-105 text-sm md:text-base"
              >
                Забронировать
              </a>
            </div>
          </div>

          <div
            className={`space-y-8 transform transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.3s' }}
          >
            <div className="w-full h-[300px] md:h-[600px] overflow-hidden transform hover:shadow-2xl transition-all duration-500 relative">
              <img
                src="https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Hotel Spa"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-black/15 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
