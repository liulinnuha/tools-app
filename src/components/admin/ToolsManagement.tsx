import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ToolType } from '@/data/tools';
import { PlusCircle, Edit, Trash, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ToolsManagementProps {
  toolsList: ToolType[];
  setToolsList: React.Dispatch<React.SetStateAction<ToolType[]>>;
  openEditDialog: (tool: ToolType) => void;
}

const ToolsManagement: React.FC<ToolsManagementProps> = ({
  toolsList,
  setToolsList,
  openEditDialog
}) => {
  const [filterText, setFilterText] = useState('');
  const { toast } = useToast();

  // Filter tools based on search text
  const filteredTools = toolsList.filter(tool =>
    tool.name.toLowerCase().includes(filterText.toLowerCase()) ||
    tool.description.toLowerCase().includes(filterText.toLowerCase()) ||
    tool.category.name.toLowerCase().includes(filterText.toLowerCase())
  );

  // Remove tool
  const removeTool = (toolId: string) => {
    if (window.confirm(`Are you sure you want to remove this tool?`)) {
      setToolsList(prev => prev.filter(tool => tool.id !== toolId));

      toast({
        title: "Tool removed",
        description: "The tool has been removed successfully.",
        variant: "default",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Input
          placeholder="Search tools..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="max-w-md"
        />
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Tool
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>New</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell className="font-medium">{tool.name}</TableCell>
                  <TableCell>{tool.category.name}</TableCell>
                  <TableCell>
                    {tool.featured ?
                      <CheckCircle2 className="h-5 w-5 text-green-500" /> :
                      <XCircle className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                    }
                  </TableCell>
                  <TableCell>
                    {tool.new ?
                      <CheckCircle2 className="h-5 w-5 text-blue-500" /> :
                      <XCircle className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(tool)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeTool(tool.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ToolsManagement;
