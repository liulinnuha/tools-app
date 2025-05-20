import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolsGrid from '@/components/ui/ToolsGrid';
import { tools, categories } from '@/data/tools';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const category = useMemo(() => {
    return categories.find(c => c.id === categoryId);
  }, [categoryId]);

  const categoryTools = useMemo(() => {
    return tools.filter(tool => tool.category.id === categoryId);
  }, [categoryId]);

  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16 md:pt-24 container mx-auto px-4">
          <div className="glass-card p-6 md:p-8 text-center">
            <h1 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Category Not Found</h1>
            <p className="mb-4 md:mb-6 text-muted-foreground">
              The category you're looking for doesn't exist.
            </p>
            <Link to="/" className="text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-16 md:pt-24 pb-6 md:pb-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-muted-foreground mb-4 md:mb-6 animate-fade-in overflow-x-auto pb-2">
            <Link to="/" className="hover:text-primary whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1 md:mx-2 flex-shrink-0" />
            <Link to="/categories" className="hover:text-primary whitespace-nowrap">
              Categories
            </Link>
            <ChevronRight className="h-4 w-4 mx-1 md:mx-2 flex-shrink-0" />
            <span className="whitespace-nowrap truncate">{category.name}</span>
          </div>

          {/* Category Header */}
          <div className="mb-8 md:mb-12 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className={cn(
                "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center",
                category.color
              )}>
                <category.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{category.name} Tools</h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mt-1 md:mt-2">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="h-1 w-full bg-gradient-to-r from-primary/50 to-transparent rounded-full"></div>
          </div>

          {/* Tools Grid */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
              <span className={cn(
                "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2",
                "bg-primary/10 text-primary"
              )}>
                <category.icon className="w-3 h-3 md:w-4 md:h-4" />
              </span>
              All {category.name} Tools ({categoryTools.length})
            </h2>

            {categoryTools.length > 0 ? (
              <ToolsGrid tools={categoryTools} className="animate-fade-in" />
            ) : (
              <div className="glass-card p-6 md:p-8 text-center">
                <p className="text-muted-foreground">
                  No tools available in this category yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
