import { Quote, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Анна Петрова',
    role: 'Бизнес-консультант',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    text: 'Превосходный отель с безупречным сервисом. Номера просторные и современные, персонал внимательный и дружелюбный. Обязательно вернусь снова!',
    rating: 5
  },
  {
    name: 'Михаил Соколов',
    role: 'Архитектор',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    text: 'Идеальное место для отдыха и работы. Продуманный дизайн, отличное расположение и вкусные завтраки. Рекомендую всем своим коллегам.',
    rating: 5
  },
  {
    name: 'Елена Морозова',
    role: 'Предприниматель',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    text: 'Восхитительный отель! Спа-зона просто волшебная, а вид из номера захватывает дух. Это был лучший отдых за последние годы.',
    rating: 5
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-light tracking-wider text-white mb-4">
            ОТЗЫВЫ ГОСТЕЙ
          </h2>
          <div className="w-24 h-px bg-white mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Узнайте, что говорят о нас наши гости
          </p>
        </div>

        <div className="relative">
          <div className="absolute -top-8 -left-8 opacity-20">
            <Quote className="w-24 h-24 text-white" />
          </div>

          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                index === activeIndex
                  ? 'opacity-100 translate-x-0 relative'
                  : 'opacity-0 absolute inset-0 translate-x-full'
              }`}
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 md:p-12 rounded-none">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>

                <p className="text-white text-lg md:text-xl leading-relaxed mb-8 font-light">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-normal tracking-wide">{testimonial.name}</h4>
                    <p className="text-gray-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-12 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl md:text-5xl font-light text-white mb-2">500+</div>
            <div className="text-gray-400 text-sm tracking-wide">Довольных гостей</div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl md:text-5xl font-light text-white mb-2">4.9</div>
            <div className="text-gray-400 text-sm tracking-wide">Средний рейтинг</div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-4xl md:text-5xl font-light text-white mb-2">98%</div>
            <div className="text-gray-400 text-sm tracking-wide">Рекомендуют друзьям</div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-4xl md:text-5xl font-light text-white mb-2">24/7</div>
            <div className="text-gray-400 text-sm tracking-wide">Поддержка гостей</div>
          </div>
        </div>
      </div>
    </section>
  );
}
