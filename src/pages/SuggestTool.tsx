import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ChevronRight, SendIcon, LightbulbIcon } from 'lucide-react';
import { categories } from '@/data/tools';
import { supabase } from "@/integrations/supabase/client";

const SuggestTool: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    link: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send data to Supabase
      const { error } = await supabase
        .from('tool_suggestions')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Suggestion Received!",
        description: "Thank you for suggesting a tool. We'll review it soon.",
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        link: '',
        email: ''
      });
    } catch (error) {
      console.error('Error submitting tool suggestion:', error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-24 pb-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-muted-foreground mb-6 animate-fade-in">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Suggest Tool</span>
          </div>

          {/* Page Header */}
          <div className="mb-12 animate-slide-up">
            <h1 className="text-4xl font-bold mb-4 flex items-center">
              <span className="bg-primary/10 text-primary rounded-full p-2 mr-3">
                <LightbulbIcon className="h-6 w-6" />
              </span>
              Suggest a Tool
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Know an awesome tool that should be included in our collection? Let us know!
              Fill out the form below with details about the tool you'd like to suggest.
            </p>
          </div>

          {/* Suggestion Form */}
          <div className="max-w-2xl mx-auto glass-card p-8 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">Tool Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter the tool name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="text-base py-6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what this tool does"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="min-h-[120px] text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-lg">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  required
                >
                  <SelectTrigger id="category" className="text-base py-6">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link" className="text-lg">Tool Website (Optional)</Label>
                <Input
                  id="link"
                  name="link"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.link}
                  onChange={handleChange}
                  className="text-base py-6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg">Your Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="text-base py-6"
                />
                <p className="text-sm text-muted-foreground">
                  We'll notify you when your suggested tool is added.
                </p>
              </div>

              <Button type="submit" className="w-full py-6 text-lg" disabled={isSubmitting}>
                <SendIcon className="mr-2 h-5 w-5" />
                {isSubmitting ? "Submitting..." : "Submit Suggestion"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuggestTool;
