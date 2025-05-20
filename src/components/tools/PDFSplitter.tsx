import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileUp, Scissors, RefreshCw, X, FileText, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const PDFSplitter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [splitPdfs, setSplitPdfs] = useState<{name: string, url: string}[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [splitMode, setSplitMode] = useState<'range' | 'individual'>('range');
  const [rangeStart, setRangeStart] = useState<string>('1');
  const [rangeEnd, setRangeEnd] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: "Invalid file format",
          description: "Only PDF files are accepted",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      setSplitPdfs([]);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPageCount();
        setPageCount(pages);
        setSelectedPages([]);
        setRangeEnd(`${pages}`);
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast({
          title: "Error",
          description: "Failed to load PDF file. The file might be corrupted.",
          variant: "destructive",
        });
        setFile(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      if (droppedFile.type !== 'application/pdf') {
        toast({
          title: "Invalid file format",
          description: "Only PDF files are accepted",
          variant: "destructive",
        });
        return;
      }

      setFile(droppedFile);
      setSplitPdfs([]);

      try {
        const arrayBuffer = await droppedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPageCount();
        setPageCount(pages);
        setSelectedPages([]);
        setRangeEnd(`${pages}`);
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast({
          title: "Error",
          description: "Failed to load PDF file. The file might be corrupted.",
          variant: "destructive",
        });
        setFile(null);
      }
    }
  };

  const handlePageSelection = (page: number) => {
    setSelectedPages(prev =>
      prev.includes(page)
        ? prev.filter(p => p !== page)
        : [...prev, page]
    );
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setSelectedPages([]);
    setSplitPdfs([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const splitPDF = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const fileName = file.name.replace(/\.pdf$/, '');

      let pagesToExtract: number[][] = [];

      if (splitMode === 'individual') {
        // Individual pages mode - each page as separate document
        pagesToExtract = Array.from({ length: pageCount }, (_, i) => [i]);
      } else if (splitMode === 'range') {
        // Range mode - extract pages in the specified range
        const start = Math.max(1, parseInt(rangeStart) || 1);
        const end = Math.min(pageCount, parseInt(rangeEnd) || pageCount);

        if (start <= end) {
          const rangePages = Array.from(
            { length: end - start + 1 },
            (_, i) => start + i - 1
          );
          pagesToExtract = [rangePages];
        } else {
          toast({
            title: "Invalid range",
            description: "Start page must be less than or equal to end page",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      const newSplitPdfs = [];

      for (let i = 0; i < pagesToExtract.length; i++) {
        const pages = pagesToExtract[i];
        if (pages.length === 0) continue;

        const newPdf = await PDFDocument.create();

        for (const pageIndex of pages) {
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
          newPdf.addPage(copiedPage);
        }

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const outputName = splitMode === 'individual'
          ? `${fileName}_page_${pages[0] + 1}.pdf`
          : `${fileName}_pages_${pages[0] + 1}-${pages[pages.length - 1] + 1}.pdf`;

        newSplitPdfs.push({ name: outputName, url });
      }

      setSplitPdfs(newSplitPdfs);

      toast({
        title: "Success!",
        description: "PDF has been split successfully",
      });
    } catch (error) {
      console.error('Error splitting PDF:', error);
      toast({
        title: "Error",
        description: "Failed to split PDF file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">PDF Splitter</h2>
      <p className="text-muted-foreground">
        Split PDF files into smaller documents by page ranges or extract individual pages.
      </p>

      <Card className="p-6">
        {!file ? (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center mb-6 hover:bg-muted/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Drop a PDF file here or click to browse</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Upload a PDF file to split
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between bg-muted p-3 rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB • {pageCount} pages
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-md p-4 space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="range-mode"
                    checked={splitMode === 'range'}
                    onCheckedChange={() => setSplitMode('range')}
                  />
                  <Label htmlFor="range-mode">Split by page range</Label>
                </div>

                {splitMode === 'range' && (
                  <div className="grid grid-cols-2 gap-4 mt-2 ml-6">
                    <div className="space-y-2">
                      <Label htmlFor="range-start">Start Page</Label>
                      <Input
                        id="range-start"
                        type="number"
                        min="1"
                        max={pageCount}
                        value={rangeStart}
                        onChange={e => setRangeStart(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="range-end">End Page</Label>
                      <Input
                        id="range-end"
                        type="number"
                        min="1"
                        max={pageCount}
                        value={rangeEnd}
                        onChange={e => setRangeEnd(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="individual-mode"
                  checked={splitMode === 'individual'}
                  onCheckedChange={() => setSplitMode('individual')}
                />
                <Label htmlFor="individual-mode">Extract each page as a separate PDF</Label>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            onClick={splitPDF}
            disabled={!file || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Scissors className="mr-2 h-4 w-4" />
                Split PDF
              </>
            )}
          </Button>
        </div>
      </Card>

      {splitPdfs.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Split PDFs</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {splitPdfs.map((pdf, index) => (
              <div key={index} className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                  <p className="text-sm font-medium">{pdf.name}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <a href={pdf.url} download={pdf.name}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PDFSplitter;
