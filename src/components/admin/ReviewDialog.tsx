import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
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

interface ReviewDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  reviewingTool: ToolSuggestion | null;
  reviewToolSuggestion: (approved: boolean) => void;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  isOpen,
  setIsOpen,
  reviewingTool,
  reviewToolSuggestion
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review Tool Suggestion</DialogTitle>
          <DialogDescription>
            Review the suggested tool and approve or reject it
          </DialogDescription>
        </DialogHeader>

        {reviewingTool && (
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Tool Name:</span> {reviewingTool.name}
              </div>
              <div>
                <span className="font-semibold">Category:</span> {categories.find(cat => cat.id === reviewingTool.category)?.name || reviewingTool.category}
              </div>
              <div>
                <span className="font-semibold">Description:</span>
                <p className="mt-1 p-2 bg-muted rounded-md">{reviewingTool.description}</p>
              </div>
              {reviewingTool.link && (
                <div>
                  <span className="font-semibold">Link:</span> {reviewingTool.link}
                </div>
              )}
              <div>
                <span className="font-semibold">Suggested by:</span> {reviewingTool.email}
              </div>
              <div>
                <span className="font-semibold">Date:</span> {new Date(reviewingTool.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => reviewToolSuggestion(false)}>
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button variant="default" onClick={() => reviewToolSuggestion(true)}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
