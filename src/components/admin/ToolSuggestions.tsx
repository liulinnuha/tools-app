import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { categories } from '@/data/tools';

type ToolSuggestion = {
  id: string;
  name: string;
  description: string;
  category: string;
  link: string | null;
  email: string;
  reviewed: boolean;
  approved: boolean;
  created_at: string;
};

interface ToolSuggestionsProps {
  suggestions: ToolSuggestion[];
  openReviewDialog: (suggestion: ToolSuggestion) => void;
  refreshSuggestions: () => void;
  isLoading: boolean;
}

const ToolSuggestions: React.FC<ToolSuggestionsProps> = ({
  suggestions,
  openReviewDialog,
  refreshSuggestions,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-primary" />
          Tool Suggestions
        </h3>
        <Button variant="outline" onClick={refreshSuggestions} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suggestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No tool suggestions found
                  </TableCell>
                </TableRow>
              ) : (
                suggestions.map((suggestion) => (
                  <TableRow key={suggestion.id}>
                    <TableCell className="font-medium">{suggestion.name}</TableCell>
                    <TableCell>
                      {categories.find(cat => cat.id === suggestion.category)?.name || suggestion.category}
                    </TableCell>
                    <TableCell>{suggestion.email}</TableCell>
                    <TableCell>{new Date(suggestion.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {!suggestion.reviewed ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          Pending Review
                        </span>
                      ) : suggestion.approved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                          Rejected
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReviewDialog(suggestion)}
                          disabled={suggestion.reviewed}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ToolSuggestions;
