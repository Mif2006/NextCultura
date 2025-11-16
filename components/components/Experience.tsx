import { Sparkles } from 'lucide-react';

export default function Experience() {
  const experiences = [
    {
      image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: 'Завтрак на террасе',
      description: 'Начните свой день с панорамным видом на город'
    },
    {
      image: 'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: 'SPA-ритуалы',
      description: 'Расслабьтесь в нашем премиальном спа-центре'
    },
    {
      image: 'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: 'Вечерний коктейль',
      description: 'Насладитесь атмосферой в нашем лобби-баре'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-stone-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gray-900 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-gray-900 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-gray-900 animate-pulse" />
            <span className="text-sm tracking-widest text-gray-600">УНИКАЛЬНЫЙ ОПЫТ</span>
            <Sparkles className="w-6 h-6 text-gray-900 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-light tracking-wider text-gray-900 mb-4">
            НЕЗАБЫВАЕМЫЕ МОМЕНТЫ
          </h2>
          <div className="w-24 h-px bg-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Каждый момент в отеле Культура создан для того, чтобы подарить вам особенные впечатления
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group relative overflow-hidden cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.2}s`, opacity: 0, animation: `scaleIn 0.8s ease-out ${index * 0.2}s forwards` }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <h3 className="text-white text-2xl font-light tracking-wide mb-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  {exp.title}
                </h3>
                <p className="text-gray-200 text-sm transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                  {exp.description}
                </p>
              </div>
              <div className="absolute top-4 right-4 w-12 h-12 border border-white/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-90">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 row-span-2 relative overflow-hidden group cursor-pointer animate-fade-in">
            <img
              src="https://images.pexels.com/photos/2507007/pexels-photo-2507007.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Hotel Pool"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-light tracking-wide mb-1">Бассейн на крыше</h3>
                <p className="text-gray-200 text-sm">С панорамным видом на город</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden group cursor-pointer animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <img
              src="https://images.pexels.com/photos/6775268/pexels-photo-6775268.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Hotel Gym"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
          </div>

          <div className="relative overflow-hidden group cursor-pointer animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <img
              src="https://images.pexels.com/photos/3952048/pexels-photo-3952048.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Hotel Bar"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
          </div>

          <div className="relative overflow-hidden group cursor-pointer animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <img
              src="https://images.pexels.com/photos/5490235/pexels-photo-5490235.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Hotel Reception"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
          </div>

          <div className="relative overflow-hidden group cursor-pointer animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <img
              src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Hotel Lounge"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
