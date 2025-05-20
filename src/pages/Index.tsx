import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoryBar from '@/components/layout/CategoryBar';
import ToolsGrid from '@/components/ui/ToolsGrid';
import CategoryCard from '@/components/ui/CategoryCard';
import HeroCarousel from '@/components/ui/HeroCarousel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { tools, categories } from '@/data/tools';
import {
  Search, Star, TrendingUp, Clock, Grid3X3, ChevronRight,
  FileText, Briefcase, LifeBuoy, MessageCircle, Phone, Mail, HelpCircle,
  FileImage, Type, Calculator, BrainCircuit, Wrench, Shield, Gamepad,
  Bot, Lock, Verified, Bot as BotIcon
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Index: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const featuredTools = tools.filter(tool => tool.featured);
  const newTools = tools.filter(tool => tool.new);

  const pdfTools = tools.filter(tool =>
    tool.category.id === "pdf" ||
    (tool.name.toLowerCase().includes("pdf") || tool.description.toLowerCase().includes("pdf"))
  );

  const imageTools = tools.filter(tool =>
    tool.category.id === "files" &&
    (tool.name.toLowerCase().includes("image") || tool.description.toLowerCase().includes("image"))
  );

  const textTools = tools.filter(tool =>
    tool.category.id === "text" ||
    (tool.name.toLowerCase().includes("text") || tool.description.toLowerCase().includes("text"))
  );

  const calculatorTools = tools.filter(tool =>
    tool.category.id === "calculation" ||
    (tool.name.toLowerCase().includes("calculator") || tool.description.toLowerCase().includes("calculator"))
  );

  const aiTools = tools.filter(tool =>
    (tool.name.toLowerCase().includes("ai") || tool.description.toLowerCase().includes("ai")) ||
    (tool.name.toLowerCase().includes("generator") || tool.description.toLowerCase().includes("generator"))
  );

  const utilityTools = tools.filter(tool =>
    tool.category.id === "transforms" ||
    tool.category.id === "encoding" ||
    tool.category.id === "development"
  );

  const securityTools = tools.filter(tool =>
    tool.name.toLowerCase().includes("password") ||
    tool.description.toLowerCase().includes("security") ||
    tool.description.toLowerCase().includes("hash") ||
    tool.name.toLowerCase().includes("hash")
  );

  const gameTools = tools.filter(tool =>
    tool.name.toLowerCase().includes("game") ||
    tool.description.toLowerCase().includes("game") ||
    tool.name.toLowerCase().includes("random") ||
    tool.description.toLowerCase().includes("dice")
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/all-tools?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const [topTools, setTopTools] = useState<typeof tools>([]);

  useEffect(() => {
    const simulateTopTools = () => {
      const shuffled = [...featuredTools].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 8);
    };

    setTopTools(simulateTopTools());

    const interval = setInterval(() => {
      setTopTools(simulateTopTools());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-16 pb-10">
        <section className="relative overflow-hidden">
          <HeroCarousel />

          <div className="absolute bottom-10 sm:bottom-16 md:bottom-20 left-0 right-0 z-20 px-4">
            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
              <Input
                type="text"
                placeholder="Search for tools..."
                className="search-input pl-10 pr-16 sm:pr-20 py-4 sm:py-6 rounded-full shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                type="submit"
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 rounded-full text-xs sm:text-sm"
              >
                <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Search</span>
              </Button>
            </form>
          </div>
        </section>

        <section id="categories" className="py-6 sm:py-8 container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center">
              <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              </span>
              Browse Categories
            </h2>
            <Link
              to="/categories"
              className="text-xs sm:text-sm text-primary hover:underline flex items-center"
            >
              View All
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Link>
          </div>
          <CategoryBar />
        </section>

        <section className="py-6 sm:py-8 container mx-auto px-4 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-950/10 dark:to-green-950/10 rounded-xl my-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading text-lg sm:text-xl lg:text-2xl flex items-center">
              <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded-full p-2 mr-3">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              New Tools
            </h2>
            <Link
              to="/all-tools?filter=new"
              className="text-xs sm:text-sm text-primary hover:underline flex items-center"
            >
              View All
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Link>
          </div>
          <ToolsGrid tools={newTools.length > 0 ? newTools.slice(0, 4) : tools.filter(tool => tool.category.id === "development").slice(0, 4)} />
        </section>

        <section className="py-6 sm:py-8 container mx-auto px-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10 rounded-xl my-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading text-lg sm:text-xl lg:text-2xl flex items-center">
              <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full p-2 mr-3">
                <Star className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              Featured Tools
            </h2>
            <Link
              to="/all-tools?filter=featured"
              className="text-xs sm:text-sm text-primary hover:underline flex items-center"
            >
              View All
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Link>
          </div>
          <ToolsGrid tools={topTools.length > 0 ? topTools : featuredTools.slice(0, 4)} />
        </section>

        <section className="py-8 container mx-auto px-4 my-6 bg-pattern rounded-xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            <span className="gradient-text">Explore Our Tools Collection</span>
          </h2>

          <Tabs defaultValue="all" className="w-full">
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <TabsList className="w-max flex flex-nowrap justify-center mx-auto mb-8 bg-transparent">
                <TabsTrigger value="all" className="m-1 data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap text-base">
                  <Grid3X3 className="w-5 h-5 mr-2" />
                  All Tools
                </TabsTrigger>
                <TabsTrigger value="pdf" className="m-1 data-[state=active]:bg-red-500 data-[state=active]:text-white whitespace-nowrap text-base">
                  <FileText className="w-5 h-5 mr-2" />
                  PDF Tools
                </TabsTrigger>
                <TabsTrigger value="image" className="m-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white whitespace-nowrap text-base">
                  <FileImage className="w-5 h-5 mr-2" />
                  Image Tools
                </TabsTrigger>
                <TabsTrigger value="text" className="m-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white whitespace-nowrap text-base">
                  <Type className="w-5 h-5 mr-2" />
                  Text Tools
                </TabsTrigger>
                <TabsTrigger value="calculators" className="m-1 data-[state=active]:bg-amber-500 data-[state=active]:text-white whitespace-nowrap text-base">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculators
                </TabsTrigger>
                <TabsTrigger value="ai" className="m-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white whitespace-nowrap text-base">
                  <BotIcon className="w-5 h-5 mr-2" />
                  AI Tools
                </TabsTrigger>
                <TabsTrigger value="utility" className="m-1 data-[state=active]:bg-cyan-500 data-[state=active]:text-white whitespace-nowrap text-base">
                  <Wrench className="w-5 h-5 mr-2" />
                  Utility Tools
                </TabsTrigger>
                <TabsTrigger value="security" className="m-1 data-[state=active]:bg-gray-500 data-[state=active]:text-white whitespace-nowrap text-base">
                  <Lock className="w-5 h-5 mr-2" />
                  Security Tools
                </TabsTrigger>
                <TabsTrigger value="games" className="m-1 data-[state=active]:bg-pink-500 data-[state=active]:text-white whitespace-nowrap text-base">
                  <Gamepad className="w-5 h-5 mr-2" />
                  Game Tools
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-6 focus-visible:outline-none">
              <div className="bg-white/60 dark:bg-black/30 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Grid3X3 className="mr-2 h-5 w-5 text-primary" />
                  All Tools
                </h3>
                <ToolsGrid tools={tools.slice(0, 8)} />
                <div className="text-center mt-6">
                  <Button asChild>
                    <Link to="/all-tools">
                      <Grid3X3 className="mr-2 h-4 w-4" />
                      View All Tools
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pdf" className="mt-6 focus-visible:outline-none">
              <div className="bg-white/60 dark:bg-black/30 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-red-500" />
                  PDF Tools
                </h3>
                <ToolsGrid tools={pdfTools} />
                <div className="text-center mt-6">
                  <Button asChild variant="outline" className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200">
                    <Link to="/tool-category/pdf">
                      <FileText className="mr-2 h-4 w-4" />
                      View All PDF Tools
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="image" className="mt-6 focus-visible:outline-none">
              <div className="bg-white/60 dark:bg-black/30 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FileImage className="mr-2 h-5 w-5 text-blue-500" />
                  Image Tools
                </h3>
                <ToolsGrid tools={imageTools} />
                <div className="text-center mt-6">
                  <Button asChild variant="outline" className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200">
                    <Link to="/tool-category/image">
                      <FileImage className="mr-2 h-4 w-4" />
                      View All Image Tools
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-6 focus-visible:outline-none">
              <div className="bg-white/60 dark:bg-black/30 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Type className="mr-2 h-5 w-5 text-purple-500" />
                  Text Tools
                </h3>
                <ToolsGrid tools={textTools} />
                <div className="text-center mt-6">
                  <Button asChild variant="outline" className="bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200">
                    <Link to="/tool-category/text">
                      <Type className="mr-2 h-4 w-4" />
                      View All Text Tools
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calculators" className="mt-6 focus-visible:outline-none">
              <div className="bg-white/60 dark:bg-black/30 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Calculator className="mr-2 h-5 w-5 text-amber-500" />
                  Calculators
                </h3>
                <ToolsGrid tools={calculatorTools} />
                <div className="text-center mt-6">
                  <Button asChild variant="outline" className="bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200">
                    <Link to="/tool-category/calculators">
                      <Calculator className="mr-2 h-4 w-4" />
                      View All Calculators
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="mt-6 focus-visible:outline-none">
              <div className="bg-white/60 dark:bg-black/30 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <BrainCircuit className="mr-2 h-5 w-5 text-emerald-500" />
                  AI Tools
                </h3>
                <ToolsGrid tools={aiTools} />
                <div className="text-center mt-6">
                  <Button asChild variant="outline" className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200">
                    <Link to="/tool-category/ai">
                      <BrainCircuit className="mr-2 h-4 w-4" />
                      View All AI Tools
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="utility" className="mt-6 focus-visible:outline-none">
              <div className="bg-white/60 dark:bg-black/30 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Wrench className="mr-2 h-5 w-5 text-cyan-500" />
                  Utility Tools
                </h3>
                <ToolsGrid tools={utilityTools} />
                <div className="text-center mt-6">
                  <Button asChild variant="outline" className="bg-cyan-50 hover:bg-cyan-100 text-cyan-600 border-cyan-200">
                    <Link to="/tool-category/utility">
                      <Wrench className="mr-2 h-4 w-4" />
                      View All Utility Tools
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-6 focus-visible:outline-none">
              <div className="bg-white/60 dark:bg-black/30 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-gray-700" />
                  Security Tools
                </h3>
                <ToolsGrid tools={securityTools} />
                <div className="text-center mt-6">
                  <Button asChild variant="outline" className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
                    <Link to="/tool-category/security">
                      <Shield className="mr-2 h-4 w-4" />
                      View All Security Tools
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="games" className="mt-6 focus-visible:outline-none">
              <div className="bg-white/60 dark:bg-black/30 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Gamepad className="mr-2 h-5 w-5 text-pink-500" />
                  Game Tools
                </h3>
                <ToolsGrid tools={gameTools} />
                <div className="text-center mt-6">
                  <Button asChild variant="outline" className="bg-pink-50 hover:bg-pink-100 text-pink-600 border-pink-200">
                    <Link to="/tool-category/games">
                      <Gamepad className="mr-2 h-4 w-4" />
                      View All Game Tools
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="py-6 sm:py-8 container mx-auto px-4">
          <div className="glass-card p-8 sm:p-10 rounded-xl text-center shadow-md transform hover:shadow-lg transition-all duration-300">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Explore Our Complete Collection</h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Browse our full library of {tools.length} productivity tools to find exactly what you need.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
              <Link to="/all-tools">
                <Grid3X3 className="w-4 h-4 mr-2" />
                View All Tools
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-8 sm:py-12 container mx-auto px-4 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-6 sm:p-10 shadow-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <LifeBuoy className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Need Help?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our support team is always ready to help you with any questions or issues you might encounter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 dark:bg-gray-800/40 rounded-xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105 shadow-sm hover:shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full mb-4">
                  <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Chat Support</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Chat with our support team in real-time for immediate assistance.
                </p>
                <Button variant="outline" className="mt-auto">
                  Start Chat
                </Button>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/40 rounded-xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105 shadow-sm hover:shadow-md">
                <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full mb-4">
                  <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <Button variant="outline" className="mt-auto">
                  Email Us
                </Button>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/40 rounded-xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105 shadow-sm hover:shadow-md">
                <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-full mb-4">
                  <HelpCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Help Center</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Browse our knowledge base for tutorials and FAQs.
                </p>
                <Button variant="outline" className="mt-auto">
                  Visit Help Center
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">Can't find what you're looking for?</p>
              <Button asChild>
                <Link to="/support">
                  <LifeBuoy className="w-4 h-4 mr-2" />
                  Go to Support Page
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
