"use client"

import { useEffect, useRef, useState } from 'react';
import { UtensilsCrossed, Wine, ChefHat } from 'lucide-react';

export default function RestaurantAbout() {
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

  const features = [
    {
      icon: ChefHat,
      title: 'Авторская кухня',
      description: 'Наши повара создают уникальные блюда, сочетающие традиции и современность'
    },
    {
      icon: Wine,
      title: 'Винная карта',
      description: 'Тщательно подобранная коллекция вин со всего мира'
    },
    {
      icon: UtensilsCrossed,
      title: 'Свежие продукты',
      description: 'Только лучшие локальные и сезонные ингредиенты'
    }
  ];

  return (
    <section id="about" className="py-32 bg-[#e8e5e0]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6">
              Гастрономическое путешествие
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Ресторан Культура — это место, где каждое блюдо рассказывает свою историю.
              Мы создаём уникальные гастрономические впечатления, объединяя традиции
              белорусской кухни с современными кулинарными техниками.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Наш шеф-повар и его команда ежедневно работают над тем, чтобы каждый
              визит в наш ресторан становился незабываемым событием.
            </p>
          </div>

          <div
            className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <img
              src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Restaurant Interior"
              className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`text-center transform transition-all duration-1000 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${0.6 + index * 0.2}s` }}
            >
              <div className="w-20 h-20 mx-auto mb-6 border border-neutral-700 flex items-center justify-center hover:bg-neutral-700 group transition-all duration-300">
                <feature.icon className="w-10 h-10 text-neutral-700 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-light text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
