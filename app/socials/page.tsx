"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart, Clock, MapPin, Coffee, Cake, MessageCircle, Phone, Star } from 'lucide-react';

const MockupShowcase = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const mockups = [
    {
      src: "/DebbieMockup1.png",
      alt: "Debbie's Cakes & Pastries - Home Screen",
      title: "Sweet Selection",
      description: "Browse our delicious collection of handcrafted cakes and pastries"
    },
    {
      src: "/Debbiemockup2.png", 
      alt: "Debbie's Cakes & Pastries - Menu",
      title: "Artisan Creations",
      description: "From wedding cakes to daily treats, made with love and care"
    },
    {
      src: "/DebbieMockup3.png",
      alt: "Debbie's Cakes & Pastries - Orders",
      title: "Easy Ordering",
      description: "Order your favorite treats and schedule pickups effortlessly"
    }
  ];

  const features = [
    {
      icon: <Cake className="w-8 h-8" />,
      title: "Fresh Daily",
      description: "Baked fresh every morning with premium ingredients"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Made with Love",
      description: "Every creation crafted with passion and attention to detail"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Service",
      description: "Fast ordering and convenient pickup times"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Local Bakery",
      description: "Proudly serving our community with sweet delights"
    }
  ];

  const specialties = [
    {
      title: "Wedding Cakes",
      description: "Custom designed cakes for your special day",
      image: "🎂"
    },
    {
      title: "Birthday Treats",
      description: "Colorful and delicious celebration cakes",
      image: "🧁"
    },
    {
      title: "Fresh Pastries",
      description: "Daily baked croissants, muffins, and more",
      image: "🥐"
    },
    {
      title: "Custom Orders",
      description: "Personalized creations for any occasion",
      image: "🍰"
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockups.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mockups.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mockups.length) % mockups.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-200 rounded-full opacity-25 animate-pulse"></div>
        
        {/* Decorative cake icons */}
        <div className="absolute top-32 right-10 text-pink-200 opacity-20 animate-pulse">
          <Cake className="w-12 h-12" />
        </div>
        <div className="absolute bottom-32 left-20 text-orange-200 opacity-20 animate-pulse">
          <Coffee className="w-10 h-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className={`text-xl md:text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-pink-600 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-6 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Debbies Cakes and Pastries
            </h1>
            <p className={`text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Where every bite is a sweet celebration
            </p>
            <div className={`flex justify-center items-center mt-4 space-x-4 transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600 font-medium">5-Star Rated Bakery</span>
            </div>
          </div>

          {/* Large Mockup Showcase */}
          <div className={`relative max-w-6xl mx-auto mb-20 transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="relative bg-white rounded-3xl shadow-2xl p-4 md:p-8 backdrop-blur-sm bg-opacity-95 border border-pink-100">
              {/* Carousel Container */}
              <div className="relative overflow-hidden rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {mockups.map((mockup, index) => (
                    <div key={index} className="w-full flex-shrink-0 flex flex-col items-center justify-center p-4 md:p-8">
                      {/* Large Mockup Image */}
                      <div className="relative group mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-orange-400 to-amber-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <img
                          src={mockup.src}
                          alt={mockup.alt}
                          className="relative z-10 w-full max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl h-auto drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Content Below */}
                      <div className="text-center max-w-2xl">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                          {mockup.title}
                        </h3>
                        <p className="text-lg md:text-xl text-gray-600 mb-8">
                          {mockup.description}
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                          <Link href="/">
                            <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg text-lg">
                              Order Now
                            </button>
                          </Link>
                          <Link href="/">
                            <button className="px-8 py-4 border-2 border-pink-300 text-pink-700 rounded-full font-semibold hover:border-pink-400 hover:bg-pink-50 transform hover:scale-105 transition-all duration-200 text-lg">
                              View Menu
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-opacity-100 transition-all duration-200 hover:scale-110 border border-pink-200"
              >
                <ChevronLeft className="w-6 h-6 text-pink-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-opacity-100 transition-all duration-200 hover:scale-110 border border-pink-200"
              >
                <ChevronRight className="w-6 h-6 text-pink-600" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-8 space-x-2">
                {mockups.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-gradient-to-r from-pink-500 to-orange-500 w-8' 
                        : 'bg-pink-200 hover:bg-pink-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Our Specialties Section */}
          <div className={`mb-20 transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
              Our Specialties
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Discover our signature creations, each made with the finest ingredients and crafted with love
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {specialties.map((specialty, index) => (
                <div key={index} className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-opacity-90 transition-all duration-300 hover:transform hover:scale-105 shadow-lg border border-pink-100">
                  <div className="text-4xl mb-4">{specialty.image}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{specialty.title}</h3>
                  <p className="text-gray-600">{specialty.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20 transform transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {features.map((feature, index) => (
              <div key={index} className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-opacity-90 transition-all duration-300 hover:transform hover:scale-105 shadow-lg border border-pink-100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* WhatsApp Support Section */}
          <div className={`mb-16 transform transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-3xl p-8 text-white max-w-4xl mx-auto shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <MessageCircle className="w-10 h-10" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Need Help? Chat with Us!
                  </h3>
                  <p className="text-lg mb-6 opacity-90">
                    Have questions about our cakes or need help with your order? Our friendly team is here to help you via WhatsApp!
                  </p>
                  <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                    <a 
                      href="https://wa.me/2347013035518" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      <MessageCircle className="w-6 h-6" />
                      Chat on WhatsApp
                    </a>
                    <a 
                      href="tel:+2347013035518"
                      className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all duration-200"
                    >
                      <Phone className="w-6 h-6" />
                      Call Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className={`text-center transform transition-all duration-1000 delay-1200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-3xl p-8 text-white max-w-2xl mx-auto shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to satisfy your sweet tooth?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Visit our bakery today and treat yourself to something special!
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/">
                  <button className="px-8 py-3 bg-white text-pink-600 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
                    Visit Store
                  </button>
                </Link>
                <Link href="/">
                  <button className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-pink-600 transform hover:scale-105 transition-all duration-200">
                    Order Online
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default MockupShowcase;