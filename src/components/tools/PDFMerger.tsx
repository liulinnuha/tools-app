import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileUp, X, FileText, RefreshCw, FileDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const PDFMerger: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      const pdfFiles = fileList.filter(file => file.type === 'application/pdf');

      if (pdfFiles.length !== fileList.length) {
        toast({
          title: "Invalid file format",
          description: "Only PDF files are accepted",
          variant: "destructive",
        });
      }

      setFiles(prevFiles => [...prevFiles, ...pdfFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf');

      if (pdfFiles.length !== droppedFiles.length) {
        toast({
          title: "Invalid file format",
          description: "Only PDF files are accepted",
          variant: "destructive",
        });
      }

      setFiles(prevFiles => [...prevFiles, ...pdfFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setFiles([]);
    setMergedPdfUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast({
        title: "Not enough files",
        description: "You need at least 2 PDF files to merge",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileArrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileArrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergedPdfUrl(url);

      toast({
        title: "Success!",
        description: "PDF files have been merged successfully",
      });
    } catch (error) {
      console.error('Error merging PDFs:', error);
      toast({
        title: "Error",
        description: "Failed to merge PDF files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">PDF Merger</h2>
      <p className="text-muted-foreground">
        Combine multiple PDF files into a single document. Upload your files, arrange them in the desired order, and merge.
      </p>

      <Card className="p-6">
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center mb-6 hover:bg-muted/50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Drop PDF files here or click to browse</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Supports multiple PDF files
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium">Selected Files ({files.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto p-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                    <div className="truncate max-w-md">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-end">
          <Button variant="outline" onClick={handleReset} disabled={files.length === 0 && !mergedPdfUrl}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={mergePDFs}
            disabled={files.length < 2 || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Merging...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Merge PDFs
              </>
            )}
          </Button>
        </div>
      </Card>

      {mergedPdfUrl && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Merged PDF</h3>
          <div className="mb-4">
            <iframe
              src={mergedPdfUrl}
              className="w-full h-[500px] border rounded-md"
              title="Merged PDF Preview"
            ></iframe>
          </div>
          <div className="flex justify-end gap-3">
            <Button asChild>
              <a href={mergedPdfUrl} download="merged_document.pdf">
                <FileDown className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PDFMerger;
