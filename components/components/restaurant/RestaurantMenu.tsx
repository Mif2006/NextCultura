"use client";

import { useEffect, useRef, useState } from "react";

export default function RestaurantMenu() {
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

  const handleDownload = (fileName: string) => {
    const link = document.createElement("a");
    link.href = fileName;
    link.download = fileName.split("/").pop() || "menu.jpg";
    link.click();
  };

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center bg-fixed bg-cover bg-center text-center py-20 md:py-28"
      style={{
        backgroundImage: "url('photo_9_2025-10-31_18-24-38.jpg')", // replace with your background
        minHeight: "60vh",
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full px-4">
        <div className="max-w-5xl mx-auto">
          <h2
            className={`text-3xl md:text-5xl font-light text-white mb-8 transform transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Меню
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleDownload("/Menu3.jpg")}
              className="px-6 py-2 text-sm border border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              Основное меню
            </button>

            <button
              onClick={() => handleDownload("/Menu2.jpg")}
              className="px-6 py-2 text-sm border border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              Детское меню
            </button>

            <button
              onClick={() => handleDownload("/Menu1.jpg")}
              className="px-6 py-2 text-sm border border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              Напитки
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
