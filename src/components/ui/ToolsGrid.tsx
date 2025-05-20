import React from 'react';
import ToolCard from './ToolCard';
import type { ToolType } from '@/data/tools';
import { cn } from '@/lib/utils';

interface ToolsGridProps {
  tools: ToolType[];
  className?: string;
  columns?: 2 | 3 | 4;
}

const ToolsGrid: React.FC<ToolsGridProps> = ({ tools, className, columns = 4 }) => {
  const gridClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  }[columns];

  return (
    <div className={cn("tool-grid", gridClass, "gap-4 sm:gap-5 md:gap-6", className)}>
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};

export default ToolsGrid;
