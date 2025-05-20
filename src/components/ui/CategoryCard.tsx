import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { ToolCategoryType } from '@/data/tools';
import { Badge } from '@/components/ui/badge';

interface CategoryCardProps {
  category: ToolCategoryType;
  toolCount?: number;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  toolCount = 0,
  className
}) => {
  return (
    <Link
      to={`/categories/${category.id}`}
      className={cn(
        "glass-card rounded-lg hover:shadow-medium group animate-scale-in",
        "transition-all duration-300 ease-apple transform hover:-translate-y-1",
        className
      )}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            category.color,
            "transition-all duration-300 group-hover:shadow-sm"
          )}>
            <category.icon className="w-6 h-6" />
          </div>

          <Badge className="bg-secondary dark:bg-secondary transition-colors">
            {toolCount} tools
          </Badge>
        </div>

        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {category.description}
        </p>

        <div className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-4">
          <span>Browse Tools</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 transform group-hover:translate-x-1"
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
