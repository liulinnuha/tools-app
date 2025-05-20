import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Table as TableIcon, Download, Trash, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CsvViewer: React.FC = () => {
  const { toast } = useToast();
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [hasHeaders, setHasHeaders] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCsv = (csvText: string, hasHeader: boolean): { headers: string[], data: string[][] } => {
    // Simple CSV parser - could be improved for more complex CSVs
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    const data: string[][] = lines.map(line => line.split(',').map(cell => cell.trim()));

    let headers: string[] = [];
    if (hasHeader && data.length > 0) {
      headers = [...data[0]];
      data.shift(); // Remove header row from data
    } else {
      // Create generic headers (Column 1, Column 2, etc.)
      if (data.length > 0) {
        headers = Array.from({ length: data[0].length }, (_, i) => `Column ${i + 1}`);
      }
    }

    return { headers, data };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is a CSV
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      const { headers, data } = parseCsv(csvText, hasHeaders);
      setCsvHeaders(headers);
      setCsvData(data);

      toast({
        title: "CSV Loaded",
        description: `Loaded ${data.length} rows from ${file.name}`
      });
    };

    reader.readAsText(file);
  };

  const downloadCsv = () => {
    if (!csvData.length) return;

    // Combine headers and data
    const outputData = hasHeaders ? [csvHeaders, ...csvData] : csvData;

    // Convert to CSV text
    const csvContent = outputData.map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `processed_${fileName || 'data.csv'}`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    toast({
      title: "Downloaded",
      description: "CSV file has been downloaded"
    });
  };

  const resetData = () => {
    setCsvData([]);
    setCsvHeaders([]);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">CSV Viewer & Editor</h2>
      <p className="text-muted-foreground">
        Upload and view CSV files directly in your browser. Analyze data without sharing it with external services.
      </p>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="csv-file">Upload CSV File</Label>
            {fileName && (
              <Button variant="destructive" size="sm" onClick={resetData}>
                <Trash className="h-4 w-4 mr-2" />
                Clear Data
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {fileName ? 'Change File' : 'Select CSV File'}
            </Button>
            <input
              ref={fileInputRef}
              id="csv-file"
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="has-headers"
                checked={hasHeaders}
                onChange={(e) => setHasHeaders(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="has-headers" className="cursor-pointer text-sm">
                First row contains headers
              </Label>
            </div>
          </div>

          {fileName && (
            <div className="text-sm bg-secondary/30 p-2 rounded">
              <span className="font-medium">File:</span> {fileName}
            </div>
          )}
        </div>
      </Card>

      {csvData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">CSV Data Preview</h3>
            <div className="flex gap-2">
              <Button size="sm" onClick={downloadCsv}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {csvHeaders.map((header, index) => (
                      <TableHead key={index} className="font-medium">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.slice(0, 50).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {csvData.length > 50 && (
              <div className="bg-muted/50 p-2 text-center text-sm text-muted-foreground">
                Showing first 50 rows of {csvData.length} rows
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-secondary/20 p-2 rounded">
              <p className="text-sm text-muted-foreground">Rows</p>
              <p className="font-medium">{csvData.length}</p>
            </div>
            <div className="bg-secondary/20 p-2 rounded">
              <p className="text-sm text-muted-foreground">Columns</p>
              <p className="font-medium">{csvHeaders.length}</p>
            </div>
            <div className="bg-secondary/20 p-2 rounded">
              <p className="text-sm text-muted-foreground">Cells</p>
              <p className="font-medium">{csvData.length * csvHeaders.length}</p>
            </div>
          </div>
        </div>
      )}

      {!csvData.length && (
        <div className="border border-dashed rounded-md p-8 text-center">
          <TableIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">No CSV Data Loaded</h3>
          <p className="text-muted-foreground mb-4">
            Upload a CSV file to view its contents in a table format.
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Browse Files
          </Button>
        </div>
      )}
    </div>
  );
};

export default CsvViewer;
