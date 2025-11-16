"use client"

import { useEffect, useRef, useState } from 'react';
import { Clock, Users, Calendar, Phone } from 'lucide-react';

export default function RestaurantReservation() {
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
    <section id="reservation" className="py-32 bg-[#e8e5e0]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2
              className={`text-3xl md:text-5xl font-light text-gray-900 mb-4 transform transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Бронирование
            </h2>
            <p
              className={`text-gray-600 text-lg mt-6 mb-12 transform transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.2s' }}
            >
              Забронируйте столик и насладитесь незабываемым вечером
            </p>

            <div className="space-y-8">
              <div
                className={`flex items-start gap-6 group hover:translate-x-4 transition-all duration-500 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.4s' }}
              >
                <div className="w-12 h-12 border border-neutral-700 flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-700 group-hover:scale-110 transition-all duration-300">
                  <Clock className="w-5 h-5 text-neutral-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="text-sm font-normal text-gray-900 mb-2">ЧАСЫ РАБОТЫ</h4>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Пн-Чт: 12:00 - 23:00<br />
                    Пт-Сб: 12:00 - 01:00<br />
                    Вс: 12:00 - 22:00
                  </p>
                </div>
              </div>

              <div
                className={`flex items-start gap-6 group hover:translate-x-4 transition-all duration-500 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.6s' }}
              >
                <div className="w-12 h-12 border border-neutral-700 flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-700 group-hover:scale-110 transition-all duration-300">
                  <Phone className="w-5 h-5 text-neutral-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="text-sm font-normal text-gray-900 mb-2">ТЕЛЕФОН</h4>
                  <a href="tel:+375333428888" className="text-gray-600 text-lg leading-relaxed hover:text-neutral-900 transition-colors">
                    +375 33 342-88-88
                  </a>
                </div>
              </div>

              <div
                className={`flex items-start gap-6 group hover:translate-x-4 transition-all duration-500 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.8s' }}
              >
                <div className="w-12 h-12 border border-neutral-700 flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-700 group-hover:scale-110 transition-all duration-300">
                  <Users className="w-5 h-5 text-neutral-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="text-sm font-normal text-gray-900 mb-2">ВМЕСТИМОСТЬ</h4>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    До 60 гостей<br />
                    Возможность проведения мероприятий
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`bg-[#e8e5e0] p-10 transform transition-all duration-1000 hover:shadow-2xl ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.5s' }}
          >
            <h3 className="text-2xl font-light text-gray-900 mb-8">Забронировать столик</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Ваше имя</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-700 focus:outline-none transition-colors duration-300"
                  placeholder="Иван Иванов"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Телефон</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-700 focus:outline-none transition-colors duration-300"
                  placeholder="+375 33 342-88-88"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Дата</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-12 pr-4 py-3 border border-neutral-300 focus:border-neutral-700 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Время</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      className="w-full pl-12 pr-4 py-3 border border-neutral-300 focus:border-neutral-700 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Количество гостей</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select className="w-full pl-12 pr-4 py-3 border border-neutral-300 focus:border-neutral-700 focus:outline-none transition-colors duration-300 appearance-none">
                    <option>1 гость</option>
                    <option>2 гостя</option>
                    <option>3 гостя</option>
                    <option>4 гостя</option>
                    <option>5+ гостей</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Комментарий</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-700 focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Особые пожелания или примечания"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-neutral-700 text-white hover:bg-neutral-600 transition-all duration-300 hover:scale-105"
              >
                Забронировать
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
