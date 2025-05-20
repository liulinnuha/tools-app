import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { tools } from '@/data/tools';
import { ChevronRight, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ToolRenderer from '@/components/tools/ToolRenderer';
import { useFavorites } from '@/hooks/use-favorites';

const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { isInFavorites, toggleFavorite } = useFavorites();

  const tool = tools.find(t => t.id === toolId);

  // Find related tools from the same category
  const relatedTools = tool
    ? tools
        .filter(t => t.category.id === tool.category.id && t.id !== tool.id)
        .slice(0, 3)
    : [];

  if (!tool) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 container mx-auto px-4">
          <div className="glass-card p-8 text-center">
            <h1 className="text-2xl font-semibold mb-4">Tool Not Found</h1>
            <p className="mb-6 text-muted-foreground">
              The tool you're looking for doesn't exist.
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

  const inFavorites = isInFavorites(tool.id);

  const handleFavoritesToggle = () => {
    toggleFavorite(tool.id, tool.name);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tool.name} - ToolHub`,
        text: `Check out this awesome tool: ${tool.name}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Using an alert here since we're not using toasts in this component
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-24 pb-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-muted-foreground mb-4 animate-fade-in overflow-x-auto pb-2">
            <Link to="/" className="hover:text-primary whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
            <Link to={`/categories/${tool.category.id}`} className="hover:text-primary whitespace-nowrap">
              {tool.category.name}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
            <span className="whitespace-nowrap">{tool.name}</span>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Tool Header - Moved above tool interface */}
          <div className="mb-6 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <div className={cn(
                  "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mr-4",
                  "bg-primary/10 text-primary dark:bg-primary/20"
                )}>
                  <tool.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{tool.name}</h1>
                  <span className={cn(
                    "category-chip mt-1",
                    tool.category.color
                  )}>
                    {tool.category.name}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-2 md:mt-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFavoritesToggle}
                  className={cn(
                    "rounded-full transition-colors",
                    inFavorites && "bg-primary/5 dark:bg-primary/20"
                  )}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      inFavorites ? "fill-red-500 text-red-500" : ""
                    )}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="rounded-full"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mt-4">
              {tool.description}
            </p>
          </div>

          {/* Tool Interface */}
          <div className="glass-panel rounded-lg p-4 sm:p-8 mb-8 animate-scale-in shadow-hard dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] dark:bg-gray-900/60">
            <ToolRenderer toolId={tool.id} />
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="mb-8 animate-slide-up">
              <h2 className="text-xl font-semibold mb-6">Related Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTools.map(relatedTool => (
                  <Link
                    key={relatedTool.id}
                    to={relatedTool.path}
                    className="tool-card dark:bg-gray-800/70 dark:hover:bg-gray-800/90 dark:border-gray-700"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center mr-3">
                          <relatedTool.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium">{relatedTool.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {relatedTool.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ToolPage;
