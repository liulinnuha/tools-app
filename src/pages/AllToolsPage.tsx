import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { tools, categories } from '@/data/tools';
import { ChevronRight, Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ToolsGrid from '@/components/ui/ToolsGrid';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const AllToolsPage: React.FC = () => {
    const [isFirstRender, setIsFirstRender] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    React.useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const searchQuery = queryParams.get('search');

      if (isFirstRender && searchQuery) {
        setSearchTerm(searchQuery);
        setIsFirstRender(false);
      }
    }, [isFirstRender]);

    React.useEffect(() => {
      if (!isFirstRender) {
        const url = new URL(window.location.href);
        if (searchTerm) {
          url.searchParams.set('search', searchTerm);
        } else {
          url.searchParams.delete('search');
        }
        window.history.pushState({}, '', url);
      }
    }, [searchTerm, isFirstRender]);
  const filteredTools = tools.filter(tool => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || tool.category.id === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-16 md:pt-24 pb-6 md:pb-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-muted-foreground mb-4 md:mb-6 overflow-x-auto">
            <Link to="/" className="hover:text-primary whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1 md:mx-2 flex-shrink-0" />
            <span className="whitespace-nowrap">All Tools</span>
          </div>

          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">All Tools</h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse our collection of {tools.length} tools to help with everyday tasks and make your life easier.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-6 md:mb-8 bg-secondary/50 rounded-lg p-3 md:p-4 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search tools..."
                  className="pl-10 pr-4 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>

              <div className="flex gap-2 md:w-auto">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {searchTerm && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Results for:</span>
                <Badge variant="secondary" className="text-xs font-normal">
                  {searchTerm}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => setSearchTerm('')}
                  >
                    ×
                  </button>
                </Badge>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-muted-foreground text-sm">
              Showing {filteredTools.length} of {tools.length} tools
            </p>
          </div>

          {/* Tools Display */}
          {filteredTools.length > 0 ? (
            viewMode === 'grid' ? (
              <ToolsGrid tools={filteredTools} />
            ) : (
              <div className="space-y-3 md:space-y-4">
                {filteredTools.map(tool => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="bg-background border rounded-lg p-3 md:p-4 flex items-center hover:shadow-medium transition-all duration-200 group"
                  >
                    <div className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0",
                      tool.category.color
                    )}>
                      <tool.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center mb-1 flex-wrap gap-1">
                        <h3 className="text-base md:text-lg font-medium group-hover:text-primary transition-colors truncate">
                          {tool.name}
                        </h3>
                        <div className="flex gap-1 flex-wrap">
                          {tool.featured && (
                            <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-none">
                              Featured
                            </Badge>
                          )}
                          {tool.new && (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-none">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-1">{tool.description}</p>
                    </div>

                    <Badge className="ml-2 md:ml-4 capitalize text-xs md:text-sm hidden sm:inline-flex">
                      {tool.category.name}
                    </Badge>

                    <ChevronRight className="ml-2 md:ml-4 w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )
          ) : (
            <div className="text-center p-8 md:p-12 glass-card rounded-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AllToolsPage;
