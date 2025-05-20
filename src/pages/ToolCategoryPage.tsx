import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolsGrid from '@/components/ui/ToolsGrid';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Gamepad2 } from 'lucide-react';
import { tools } from '@/data/tools';
import type { ToolType } from '@/data/tools';

// Define the categories and their filter functions
const categoryConfigs = {
  'pdf': {
    title: 'PDF Tools',
    description: 'Powerful tools for working with PDF files',
    filter: (tool: ToolType) =>
      tool.category.id === "pdf" ||
      tool.name.toLowerCase().includes('pdf') ||
      tool.description.toLowerCase().includes('pdf'),
    iconColor: 'text-red-500'
  },
  'image': {
    title: 'Image Tools',
    description: 'Tools for creating, editing and optimizing images',
    filter: (tool: ToolType) =>
      (tool.category.id === "files" &&
      (tool.name.toLowerCase().includes('image') ||
       tool.description.toLowerCase().includes('image'))),
    iconColor: 'text-blue-500'
  },
  'text': {
    title: 'Text Tools',
    description: 'Tools for manipulating and analyzing text',
    filter: (tool: ToolType) =>
      tool.category.id === "text" ||
      tool.name.toLowerCase().includes('text') ||
      tool.description.toLowerCase().includes('text'),
    iconColor: 'text-purple-500'
  },
  'calculators': {
    title: 'Calculator Tools',
    description: 'Powerful calculators for various needs',
    filter: (tool: ToolType) =>
      tool.category.id === "calculation" ||
      tool.name.toLowerCase().includes('calculator') ||
      tool.description.toLowerCase().includes('calculator'),
    iconColor: 'text-amber-500'
  },
  'ai': {
    title: 'AI Tools',
    description: 'Artificial intelligence powered tools',
    filter: (tool: ToolType) =>
      tool.name.toLowerCase().includes('ai') ||
      tool.description.toLowerCase().includes('ai') ||
      tool.name.toLowerCase().includes('generator') ||
      tool.description.toLowerCase().includes('generator'),
    iconColor: 'text-emerald-500'
  },
  'utility': {
    title: 'Utility Tools',
    description: 'Useful utilities for everyday tasks',
    filter: (tool: ToolType) =>
      tool.category.id === "transforms" ||
      tool.category.id === "encoding" ||
      tool.category.id === "development",
    iconColor: 'text-cyan-500'
  },
  'security': {
    title: 'Security Tools',
    description: 'Tools to help keep your data secure',
    filter: (tool: ToolType) =>
      tool.name.toLowerCase().includes('password') ||
      tool.description.toLowerCase().includes('security') ||
      tool.description.toLowerCase().includes('hash') ||
      tool.name.toLowerCase().includes('hash'),
    iconColor: 'text-gray-700'
  },
  'games': {
    title: 'Game Tools',
    description: 'Fun tools for games and entertainment',
    filter: (tool: ToolType) =>
      tool.category.id === "games" ||
      tool.name.toLowerCase().includes('game') ||
      tool.description.toLowerCase().includes('game') ||
      tool.name.toLowerCase().includes('dice') ||
      tool.description.toLowerCase().includes('dice'),
    icon: Gamepad2,
    iconColor: 'text-pink-500'
  }
};

const ToolCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const categoryConfig = useMemo(() => {
    if (!categoryId || !categoryConfigs[categoryId as keyof typeof categoryConfigs]) {
      return {
        title: 'Tools',
        description: 'Explore our collection of useful tools',
        filter: () => true,
        iconColor: 'text-primary'
      };
    }

    return categoryConfigs[categoryId as keyof typeof categoryConfigs];
  }, [categoryId]);

  const filteredTools = useMemo(() => {
    return tools.filter(categoryConfig.filter);
  }, [categoryConfig]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-16 md:pt-24 pb-6 md:pb-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>

          <div className="mb-6 md:mb-8">
            <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${categoryConfig.iconColor}`}>
              {categoryConfig.title}
            </h1>
            <p className="text-muted-foreground">
              {categoryConfig.description}
            </p>
          </div>

          {filteredTools.length > 0 ? (
            <ToolsGrid tools={filteredTools} columns={3} />
          ) : (
            <div className="text-center py-8 md:py-12">
              <p className="text-muted-foreground">No tools found in this category.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ToolCategoryPage;
