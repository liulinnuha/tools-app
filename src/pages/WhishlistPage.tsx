
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolsGrid from '@/components/ui/ToolsGrid';
import { Button } from '@/components/ui/button';
import { Heart, TrashIcon, Info } from 'lucide-react';
import { tools } from '@/data/tools';
import { useToast } from '@/components/ui/use-toast';
import type { ToolType } from '@/data/tools';

const WishlistPage: React.FC = () => {
  const [wishlistTools, setWishlistTools] = useState<ToolType[]>([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load wishlist from localStorage
    const storedWishlist = localStorage.getItem('toolsWishlist');
    if (storedWishlist) {
      try {
        const wishlistIds = JSON.parse(storedWishlist) as string[];
        const filteredTools = tools.filter(tool => wishlistIds.includes(tool.id));
        setWishlistTools(filteredTools);
        setIsEmpty(filteredTools.length === 0);
      } catch (error) {
        console.error('Error parsing wishlist data:', error);
        setIsEmpty(true);
      }
    }
  }, []);

  const clearWishlist = () => {
    localStorage.setItem('toolsWishlist', JSON.stringify([]));
    setWishlistTools([]);
    setIsEmpty(true);
    toast({
      title: "Wishlist cleared",
      description: "All tools have been removed from your wishlist.",
      variant: "default",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-24 pb-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                My Wishlist
              </h1>
              <p className="text-muted-foreground mt-2">
                Tools you've saved for later use
              </p>
            </div>

            {!isEmpty && (
              <Button variant="outline" onClick={clearWishlist} className="flex items-center gap-2">
                <TrashIcon className="h-4 w-4" />
                Clear Wishlist
              </Button>
            )}
          </div>

          {isEmpty ? (
            <div className="glass-panel rounded-lg p-8 text-center animate-fade-in">
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <Heart className="h-16 w-16 text-muted-foreground opacity-30" />
                <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
                <p className="text-muted-foreground max-w-md">
                  You haven't added any tools to your wishlist yet. Browse our tools and click the heart icon to add them.
                </p>
                <Button className="mt-4" onClick={() => navigate('/all-tools')}>
                  Browse Tools
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <ToolsGrid tools={wishlistTools} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
