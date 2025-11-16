import { Utensils, Sparkles, Users, Car, Coffee, Dumbbell } from 'lucide-react';

const services = [
  {
    icon: Utensils,
    title: 'Ресторан',
    description: 'Изысканная кухня и завтраки в формате шведского стола'
  },
  {
    icon: Sparkles,
    title: 'SPA-зона',
    description: 'Спа-процедуры, массаж, сауна и хаммам для полного расслабления'
  },
  {
    icon: Users,
    title: 'Конференц-залы',
    description: 'Оборудованные залы для деловых мероприятий и встреч'
  },
  {
    icon: Car,
    title: 'Трансфер',
    description: 'Трансфер от/до аэропорта и вокзала по запросу'
  },
  {
    icon: Coffee,
    title: 'Лобби-бар',
    description: 'Уютная атмосфера для встреч и неформального общения'
  },
  {
    icon: Dumbbell,
    title: 'Фитнес-центр',
    description: 'Современное оборудование и тренажеры для активного отдыха'
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-wider text-gray-900 mb-4">
            УСЛУГИ И УДОБСТВА
          </h2>
          <div className="w-24 h-px bg-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Мы создали всё для вашего идеального отдыха и продуктивной работы
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animation: `fadeInUp 0.8s ease-out ${index * 0.1}s forwards` }}
            >
              <div className="w-20 h-20 mb-6 border border-gray-300 flex items-center justify-center group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-10 h-10 text-gray-900 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg tracking-wide text-gray-900 mb-3 font-normal group-hover:text-gray-600 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm max-w-xs">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative h-96 overflow-hidden group">
            <img
              src="https://images.pexels.com/photos/2291599/pexels-photo-2291599.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Hotel Services"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
              <div className="p-8">
                <h3 className="text-2xl font-light tracking-wider text-white mb-2">
                  Безупречный сервис
                </h3>
                <p className="text-gray-200 text-sm">
                  Команда профессионалов 24/7
                </p>
              </div>
            </div>
          </div>
          <div className="relative h-96 overflow-hidden group">
            <img
              src="https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Hotel Comfort"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
              <div className="p-8">
                <h3 className="text-2xl font-light tracking-wider text-white mb-2">
                  Комфорт и уют
                </h3>
                <p className="text-gray-200 text-sm">
                  Продуманный дизайн каждого пространства
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
