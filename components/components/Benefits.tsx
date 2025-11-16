import { MapPin, Award, Clock, Wifi } from 'lucide-react';

const benefits = [
  {
    icon: MapPin,
    title: 'Премиальное расположение',
    description: 'В самом сердце города с удобным доступом к культурным достопримечательностям'
  },
  {
    icon: Award,
    title: 'Высокий уровень сервиса',
    description: 'Индивидуальный подход и внимание к каждому гостю'
  },
  {
    icon: Clock,
    title: 'Гибкие условия',
    description: 'Удобные варианты размещения и персонализированные услуги'
  },
  {
    icon: Wifi,
    title: 'Современные удобства',
    description: 'Высокоскоростной Wi-Fi, смарт-технологии и комфорт во всем'
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-light tracking-wider text-gray-900 mb-4">
            ЧТО ВАС ЖДЁТ
          </h2>
          <div className="w-24 h-px bg-gray-900 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animation: `fadeInUp 0.8s ease-out ${index * 0.1}s forwards` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border border-gray-900 group-hover:rotate-12 transition-transform duration-300">
                <benefit.icon className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-lg tracking-wide text-gray-900 mb-3 font-normal">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
