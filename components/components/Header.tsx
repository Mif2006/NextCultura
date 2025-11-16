'use client';

import { Menu, X, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() ?? '/';
  const router = useRouter();

  const isRestaurant = pathname === '/restaurant';

  /**
   * Scroll to an element id on the appropriate page.
   *
   * - if already on target page, scroll immediately
   * - otherwise push route with hash (e.g. "/#rooms" or "/restaurant#menu") and
   *   attempt to scroll after navigation completes (small timeout fallback)
   */
  const scrollToSection = useCallback(
    (id: string) => {
      const targetPath = isRestaurant ? '/restaurant' : '/';
      const currentPath = pathname.split('#')[0];

      const doScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setIsMenuOpen(false);
          return true;
        }
        return false;
      };

      if (currentPath === targetPath) {
        // same page — just scroll
        // small timeout to ensure element exists (useful if content renders after)
        setTimeout(() => {
          if (!doScroll()) {
            // if not found, try again slightly later
            setTimeout(doScroll, 150);
          }
        }, 10);
      } else {
        // navigate to the target page with a hash
        // example: '/#rooms' or '/restaurant#menu'
        const href = `${targetPath}#${id}`;
        router.push(href);

        // After navigation, try to scroll. We can't reliably await navigation here,
        // so use a couple of retries with timeouts to cover different load timings.
        const attempts = [100, 350, 800]; // ms
        for (const t of attempts) {
          setTimeout(() => {
            doScroll();
          }, t);
        }
        // close mobile menu regardless
        setIsMenuOpen(false);
      }
    },
    [isRestaurant, pathname, router]
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 transform transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-lg md:text-2xl font-light text-gray-900 hover:text-neutral-600 transition-colors duration-300">
                ОТЕЛЬ КУЛЬТУРА
              </h1>
            </Link>
            <Link
              href={isRestaurant ? '/' : '/restaurant'}
              className="text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 border-l border-neutral-300 pl-4 md:pl-8 hidden md:block"
            >
              {isRestaurant ? 'Отель' : 'Ресторан'}
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8 h-full">
            {!isRestaurant && (
              <>
                <button
                  onClick={() => scrollToSection('rooms')}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 h-full flex items-center"
                >
                  Номера
                </button>
                <button
                  onClick={() => scrollToSection('offers')}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 h-full flex items-center"
                >
                  Акции
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 h-full flex items-center"
                >
                  О нас
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 h-full flex items-center"
                >
                  Контакты
                </button>
              </>
            )}
            {isRestaurant && (
              <>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 h-full flex items-center"
                >
                  О ресторане
                </button>
                <button
                  onClick={() => scrollToSection('menu')}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 h-full flex items-center"
                >
                  Меню
                </button>
                <button
                  onClick={() => scrollToSection('reservation')}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 h-full flex items-center"
                >
                  Бронирование
                </button>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:+375333428888"
              className="flex items-center text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105"
            >
              <Phone className="w-4 h-4 mr-2" />
              +375 33 342-88-88
            </a>
            {!isRestaurant && (
              <button
                onClick={() => scrollToSection('rooms')}
                className="px-6 py-2 bg-neutral-700 text-white hover:bg-neutral-600 transition-all duration-300 hover:scale-105"
              >
                Забронировать
              </button>
            )}
            {isRestaurant && (
              <button
                onClick={() => scrollToSection('reservation')}
                className="px-6 py-2 bg-neutral-700 text-white hover:bg-neutral-600 transition-all duration-300 hover:scale-105"
              >
                Забронировать столик
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:scale-110 transition-transform duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 animate-fade-in">
          <div className="px-6 py-6 space-y-4">
            <Link
              href={isRestaurant ? '/' : '/restaurant'}
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left py-2 text-sm text-gray-700 hover:translate-x-2 transition-transform duration-300 font-medium"
            >
              {isRestaurant ? '← Отель' : 'Ресторан →'}
            </Link>
            <div className="border-t border-neutral-200 pt-4">
              {!isRestaurant && (
                <>
                  <button onClick={() => scrollToSection('rooms')} className="block w-full text-left py-2 text-sm text-gray-700 hover:translate-x-2 transition-transform duration-300">
                    Номера
                  </button>
                  <button onClick={() => scrollToSection('offers')} className="block w-full text-left py-2 text-sm text-gray-700 hover:translate-x-2 transition-transform duration-300">
                    Акции
                  </button>
                  <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-sm text-gray-700 hover:translate-x-2 transition-transform duration-300">
                    О нас
                  </button>
                  <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-sm text-gray-700 hover:translate-x-2 transition-transform duration-300">
                    Контакты
                  </button>
                </>
              )}
              {isRestaurant && (
                <>
                  <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-sm text-gray-700 hover:translate-x-2 transition-transform duration-300">
                    О ресторане
                  </button>
                  <button onClick={() => scrollToSection('menu')} className="block w-full text-left py-2 text-sm text-gray-700 hover:translate-x-2 transition-transform duration-300">
                    Меню
                  </button>
                  <button onClick={() => scrollToSection('reservation')} className="block w-full text-left py-2 text-sm text-gray-700 hover:translate-x-2 transition-transform duration-300">
                    Бронирование
                  </button>
                </>
              )}
            </div>
            <a href="tel:+375333428888" className="flex items-center py-2 text-sm text-gray-700">
              <Phone className="w-4 h-4 mr-2" />
              +375 33 342-88-88
            </a>
            {!isRestaurant && (
              <button
                onClick={() => { setIsMenuOpen(false); scrollToSection('rooms'); }}
                className="block w-full px-6 py-3 bg-neutral-700 text-white text-center hover:bg-neutral-600 transition-all duration-300"
              >
                Забронировать
              </button>
            )}
            {isRestaurant && (
              <button
                onClick={() => scrollToSection('reservation')}
                className="block w-full px-6 py-3 bg-neutral-700 text-white text-center hover:bg-neutral-600 transition-all duration-300"
              >
                Забронировать столик
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
