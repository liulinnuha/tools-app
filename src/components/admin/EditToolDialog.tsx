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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ToolType } from '@/data/tools';
import { categories } from '@/data/tools';
import { Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditToolDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingTool: ToolType | null;
  setEditingTool: React.Dispatch<React.SetStateAction<ToolType | null>>;
  updateTool: (tool: ToolType) => void;
}

const EditToolDialog: React.FC<EditToolDialogProps> = ({
  isOpen,
  setIsOpen,
  editingTool,
  setEditingTool,
  updateTool
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Tool</DialogTitle>
          <DialogDescription>
            Make changes to the tool. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {editingTool && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editingTool.name}
                onChange={(e) => setEditingTool({...editingTool, name: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={editingTool.description}
                onChange={(e) => setEditingTool({...editingTool, description: e.target.value})}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={editingTool.category.id}
                onValueChange={(value) => {
                  const selectedCategory = categories.find(cat => cat.id === value);
                  if (selectedCategory) {
                    setEditingTool({...editingTool, category: selectedCategory});
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Featured
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox
                  id="featured"
                  checked={!!editingTool.featured}
                  onCheckedChange={(checked) => {
                    setEditingTool({...editingTool, featured: checked as boolean});
                  }}
                />
                <Label htmlFor="featured" className="text-sm font-normal">
                  Show in featured section
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                New
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox
                  id="new"
                  checked={!!editingTool.new}
                  onCheckedChange={(checked) => {
                    setEditingTool({...editingTool, new: checked as boolean});
                  }}
                />
                <Label htmlFor="new" className="text-sm font-normal">
                  Mark as new tool
                </Label>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => editingTool && updateTool(editingTool)}>
            <Star className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditToolDialog;
