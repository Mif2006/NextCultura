import { Eye } from 'lucide-react';

export default function Gallery() {
  const images = [
    {
      url: '/photo_12_2025-10-31_18-24-38.jpg',
      title: 'Интерьер номера',
      span: 'col-span-2 row-span-2'
    },
    {
      url: '/photo_13_2025-10-31_18-24-38.jpg',
      title: 'Ресторан',
      span: 'col-span-1 row-span-1'
    },
    {
      url: '/photo_14_2025-10-31_18-24-38.jpg',
      title: 'Лобби',
      span: 'col-span-1 row-span-1'
    },
    {
      url: '/photo_15_2025-10-31_18-24-38.jpg',
      title: 'Спа-зона',
      span: 'col-span-1 row-span-1'
    },
    {
      url: '/photo_16_2025-10-31_18-24-38.jpg',
      title: 'Панорамный вид',
      span: 'col-span-1 row-span-1'
    },
    {
      url: '/photo_17_2025-10-31_18-24-38.jpg',
      title: 'Фасад отеля',
      span: 'col-span-2 row-span-1'
    },
    {
      url: '/photo_18_2025-10-31_18-24-38.jpg',
      title: 'Спа-процедуры',
      span: 'col-span-1 row-span-1'
    },
    {
      url: '/photo_19_2025-10-31_18-24-38.jpg',
      title: 'Фитнес-центр',
      span: 'col-span-1 row-span-1'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#e8e5e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16 animate-fade-in-up">
          <h2 className="text-2xl md:text-5xl font-light tracking-wider text-gray-900 mb-4">
            ГАЛЕРЕЯ
          </h2>
          <div className="w-24 h-px bg-gray-900 mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Познакомьтесь с атмосферой нашего отеля через визуальное путешествие
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 auto-rows-[150px] md:auto-rows-[200px]">
          {images.map((image, index) => (
            <div
              key={index}
              className={`${image.span} relative overflow-hidden group cursor-pointer animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animation: `fadeIn 0.8s ease-out ${index * 0.1}s forwards` }}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-6">
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <div className="w-10 h-10 border border-white/50 flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors duration-300">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white text-lg font-light tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {image.title}
                  </h3>
                  <div className="w-12 h-0.5 bg-white mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <button className="px-6 md:px-8 py-3 md:py-4 border-2 border-gray-900 text-gray-900 text-xs md:text-sm tracking-widest hover:bg-gray-900 hover:text-white hover:scale-105 transition-all duration-300">
            СМОТРЕТЬ ВСЕ ФОТО
          </button>
        </div>
      </div>
    </section>
  );
}
