"use client"


import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [
    '/Cakes1.jpg',
    '/Cakes2.jpg',
    '/Cakes3.jpg',
    '/Cakes4.jpg',
    '/Cakes5.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleMenuClick = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen max-h-[900px] w-full overflow-hidden rounded-2xl mt-10">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      <div className="relative z-10 flex items-center justify-center h-full text-center text-white py-32 px-6">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-7xl mb-6 font-dancing-script font-serif text-[#F7F4E9]">
            Debbies Cakes and pastries
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-serif">
            Indulge your taste buds 😋😍
          </p>
          <p
            className="text-2xl md:text-5xl mb-6 font-dancing-script font-serif text-[#EFE8DA]"
          >
            Welcome to our Menu
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
