
import { useEffect, useState } from "react";
import { listFiles, deleteFile, StorageBucket, getFileUrl } from "@/utils/storageUtils";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, FileIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileGalleryProps {
  bucket: StorageBucket;
  folder?: string;
  onFileDeleted?: () => void;
  refreshKey?: number; // Used to trigger refresh
}

const FileGallery = ({
  bucket,
  folder,
  onFileDeleted,
  refreshKey = 0
}: FileGalleryProps) => {
  const [files, setFiles] = useState<{ name: string; path: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFiles = async () => {
    setIsLoading(true);
    const filesList = await listFiles(bucket, folder);
    if (filesList) {
      setFiles(filesList);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadFiles();
  }, [bucket, folder, refreshKey]);

  const handleDelete = async (path: string) => {
    const success = await deleteFile(bucket, path);
    if (success) {
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully"
      });
      loadFiles();
      if (onFileDeleted) {
        onFileDeleted();
      }
    }
  };

  const isImage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading files...</div>;
  }

  if (files.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No files found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <div 
          key={file.path} 
          className="border rounded-md overflow-hidden bg-card"
        >
          <div className="aspect-square flex items-center justify-center p-2 bg-muted">
            {isImage(file.name) ? (
              <img 
                src={file.url} 
                alt={file.name} 
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <FileIcon className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          
          <div className="p-3">
            <p className="text-sm font-medium truncate" title={file.name}>
              {file.name}
            </p>
            
            <div className="flex justify-between mt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(file.path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(file.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGallery;
