
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { uploadFile, StorageBucket } from "@/utils/storageUtils";

interface FileUploadProps {
  bucket: StorageBucket;
  folder?: string;
  onUploadComplete?: (filePath: string) => void;
  maxSize?: number; // in MB
  acceptedFileTypes?: string[];
  maxFiles?: number;
  buttonText?: string;
}

const FileUpload = ({
  bucket,
  folder,
  onUploadComplete,
  maxSize = 5, // Default 5MB
  acceptedFileTypes,
  maxFiles = 1,
  buttonText = "Upload File"
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Maximum file size is ${maxSize}MB`,
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create path with folder if provided
      const path = folder ? `${folder}/${selectedFile.name}` : selectedFile.name;
      
      const filePath = await uploadFile(bucket, selectedFile, path);
      
      if (filePath) {
        toast({
          title: "Upload successful",
          description: "Your file has been uploaded",
        });
        
        // Reset selected file
        setSelectedFile(null);
        
        // Call onUploadComplete callback if provided
        if (onUploadComplete) {
          onUploadComplete(filePath);
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearSelectedFile = () => {
    setSelectedFile(null);
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="relative"
            disabled={isUploading}
          >
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              onChange={handleFileChange}
              accept={acceptedFileTypes ? acceptedFileTypes.map(type => `.${type}`).join(',') : undefined}
              disabled={isUploading}
            />
            {buttonText}
          </Button>
          
          {selectedFile && (
            <div className="flex items-center gap-2 text-sm">
              <span className="truncate max-w-[200px]">{selectedFile.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={clearSelectedFile}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {selectedFile && (
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="w-fit"
          >
            {isUploading ? "Uploading..." : "Upload"}
            {!isUploading && <Upload className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
