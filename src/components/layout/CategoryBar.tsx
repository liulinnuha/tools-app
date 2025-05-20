import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/tools';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CategoryBar: React.FC<{ className?: string }> = ({ className }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.5;
      const targetScrollLeft = direction === 'left'
        ? current.scrollLeft - scrollAmount
        : current.scrollLeft + scrollAmount;

      current.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      setShowLeftArrow(current.scrollLeft > 0);
      setShowRightArrow(
        current.scrollLeft < current.scrollWidth - current.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();

      // Set up resize observer
      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(scrollContainer);

      return () => {
        scrollContainer.removeEventListener('scroll', checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <div className={cn("relative px-1", className)}>
      {showLeftArrow && (
        <Button
          onClick={() => scroll('left')}
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 shadow-sm rounded-full hover:bg-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 py-2 px-2 scroll-smooth space-x-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.id}`}
            className="flex-shrink-0"
          >
            <div className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200",
              "hover:shadow-sm",
              category.color
            )}>
              <category.icon className="w-4 h-4" />
              <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
            </div>
          </Link>
        ))}
      </div>

      {showRightArrow && (
        <Button
          onClick={() => scroll('right')}
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 shadow-sm rounded-full hover:bg-secondary"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default CategoryBar;
