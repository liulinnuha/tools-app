import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Star, Zap, Box, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface SlideProps {
  title: string;
  subtitle: string;
  bgColor: string;
  icon: React.ElementType;
  buttonText: string;
  buttonLink: string;
  bgPattern?: string;
}

const slides: SlideProps[] = [
  {
    title: "All the tools you need",
    subtitle: "A collection of 50+ essential web tools designed with simplicity and elegance.",
    bgColor: "from-blue-600/80 via-indigo-600/60 to-violet-500/70",
    icon: Box,
    buttonText: "Explore Tools",
    buttonLink: "#categories",
    bgPattern: "radial"
  },
  {
    title: "Save your favorites",
    subtitle: "Create your wishlist with the tools you use most often for quick access.",
    bgColor: "from-rose-600/80 via-pink-600/60 to-amber-500/70",
    icon: Heart,
    buttonText: "View Wishlist",
    buttonLink: "/wishlist",
    bgPattern: "grid"
  },
  {
    title: "Powerful & Fast",
    subtitle: "Lightning-fast tools that work directly in your browser with no installations required.",
    bgColor: "from-teal-600/80 via-emerald-600/60 to-green-500/70",
    icon: Zap,
    buttonText: "See Popular Tools",
    buttonLink: "/popular",
    bgPattern: "dots"
  },
  {
    title: "Find the perfect tool",
    subtitle: "Search through our extensive collection to find exactly what you need.",
    bgColor: "from-purple-600/80 via-fuchsia-600/60 to-blue-500/70",
    icon: Search,
    buttonText: "Browse Categories",
    buttonLink: "/categories",
    bgPattern: "waves"
  }
];

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="relative overflow-hidden h-[350px] xs:h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px]">
      {slides.map((slide, index) => {
        const Icon = slide.icon;

        // Background pattern based on slide type
        let patternStyle = {};
        if (slide.bgPattern === 'grid') {
          patternStyle = {
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M0 0h20v20H0z\'/%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '20px 20px'
          };
        } else if (slide.bgPattern === 'dots') {
          patternStyle = {
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '20px 20px'
          };
        } else if (slide.bgPattern === 'waves') {
          patternStyle = {
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M21.184 20c.357-.13.72-.264.888-.14 1.5-1.963 2.783-5.433-.414-7.156.61-.774 3.071-1.73 2.754-2.87-2.14 1.3-4.47 1.235-4.816.756-.017-1.362 1.197-3.188 1.084-3.513-.936.73-1.98 1.297-2.055 1.42-.603-1.73-.36-4.908-.15-6.37.03-.2-3.542 1.535-3.58 1.57l-.266.254c-.42.405-.252 1.768-.18 2.48 0 0-.676-1.95-.79-2.006C11.205 2.84 7.72 5.09 7.72 5.09c-.507.495-.676.862-.295 1.37.33-.24.632-.43.904-.566.898-.467 1.18.056 1.153.467-.92 1.257-1.255 2.178-1.294 2.428-.868-.565-1.43 1.827-1.244 2.563.116.46 2.02-.42 2.124-.58.28.683.44 1.665.516 2.58-.455.214-.85.218-.958.21 0 0 .715.9.936 1.297.165.293 1.2.842 2.184-.4.5.72 1.97 1.452 2.597 1.08.624.033 1.889-1.246 1.5-3.98.83-.324 1.12-.466 1.74-.34.962.19 1.67-.882 1.453-2.932-.16-1.576-1.81-1.9-1.925-2.262-.05-.156.21-.884.225-.853.947.343 1.85 1.593 1.59 4.088-.456.56-.684.6-.865-.085-.304-1.156-.328-3.457-.328-3.457.705 0 .94.167 1.134.335 0 0-.14-2.98 1.41-3.71 1.155-.544 1.978.538 1.978.538.906.3 1.686-.297 2.304-1.28.62-.985.382-2.52.382-2.52s.97.473 1.613.47c.645-.004 1.973-1.04 1.532-3.02-.44-1.982-1.58-1.922-1.58-1.922.4-.03 1.273.874 1.273.874l.41-.584c.47-.67 1.334-1.614 1.485-1.806.645.145 1.997.337 2.307-.15C25.57 3.418 25.487.743 25.012.21c-.472-.53-1.93.404-1.93.404s.19-.516.343-.68c.153-.165 1.14-1.233.997-1.51C24.292.95 22.178 0 19.218 0c-2.96 0-5.074.95-5.074.95l-.865 1.05c-.063-.065-.938-.71-.938-.71C9.644.137 6.36.14 4.48 1.052c-1.88.91-2.04 1.703-2.04 1.703s-.293-.598-.88-.832C.872 1.69.263 1.81.162 1.956.62 2.102-.184 3.1.106 3.76c.29.66 2.096.782 2.096.782s.11.31.176.452c-2.386.584-3.988 1.953-3.988 1.953s-.598-.144-1.267-.03c-.668.116-1.66.977-1.198 2.352.462 1.375 1.566 1.26 1.566 1.26s-.223.456-.148.85c.075.396 1.336 1.895 3.89.053 2.555-1.84 4.02-1.17 4.02-1.17l.025.37c.033.462.518.583.518.583s-.198.583-.223.922c-.025.34.385 2.162.938 2.023.552-.14.513-.25.69-1.47.177-1.22.257-.723.257-.723s.38.438.533.595c.153.156 1.09.785 1.68.785.588 0 .798-.726.798-.726l1.366-1.53c.02-.022.664.016.664.016s0 .34.05.504c.05.164.855.285 1.234-.324.38-.61.62-1.293.62-1.293l1.05.05c.13.006.806-1.39.62-2.417-.186-1.028-2.06-1.486-2.06-1.486s-.05-.227-.025-.356c.026-.13.83-3.32.83-3.32s.238.016.318.016c.08 0 .697-.225.697-.225s.125.16.175.16c.05 0 .54-.304.54-.304s.232-.1.306-.1c.075 0 .59.037.59.037s.294.1.397.1c.102 0 1.02-.913 1.02-.913s.398.08.436.08c.04 0 1.21-1.034 1.21-1.034z\' fill=\'%23ffffff\' fill-opacity=\'0.15\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundSize: '100px 20px'
          };
        } else { // radial default
          patternStyle = {
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          };
        }

        return (
          <div
            key={index}
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-1000 p-4",
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-b",
                slide.bgColor,
                "opacity-80 transition-all duration-700"
              )}
            />
            <div
              className="absolute inset-0 opacity-20"
              style={patternStyle}
            />

            <div className="relative z-20 text-center max-w-4xl mx-auto animate-fade-in px-4">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center",
                  "bg-white/10 backdrop-blur-sm text-white shadow-xl",
                  "border border-white/20"
                )}>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                </div>
              </div>

              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-2 sm:mb-4 text-white drop-shadow-md">
                {slide.title}
              </h1>
              <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-4 xs:mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow">
                {slide.subtitle}
              </p>

              <Button
                asChild
                size="lg"
                className="rounded-full px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg transition-transform hover:scale-105 bg-white/90 hover:bg-white text-gray-900 font-medium shadow-lg border border-white/20"
              >
                <Link to={slide.buttonLink}>
                  {slide.buttonText}
                </Link>
              </Button>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 shadow-lg border border-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 shadow-lg border border-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 xs:w-2.5 xs:h-2.5 rounded-full transition-all duration-300",
              currentSlide === index
                ? "bg-white w-4 xs:w-6 sm:w-8"
                : "bg-white/50 hover:bg-white/70"
            )}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
