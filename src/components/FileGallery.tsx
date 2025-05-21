
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Download, FileImage, FileText, FileArchive } from 'lucide-react';
import { getFileUrl, deleteFile } from '@/utils/storageUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface FileGalleryProps {
  bucketName: string; // Changed from bucketName to match other references
  filePath: string;
  onFileDelete?: () => void;
  showDelete?: boolean;
  showDownload?: boolean;
  className?: string;
  maxHeight?: string;
}

const FileGallery: React.FC<FileGalleryProps> = ({
  bucketName,
  filePath,
  onFileDelete,
  showDelete = true,
  showDownload = true,
  className = '',
  maxHeight = '400px'
}) => {
  const [files, setFiles] = useState<{ name: string; url: string; type: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        // Update this to match the expected type for getFileUrl
        const fileList = await getFileUrl(bucketName as any, filePath);
        if (fileList && Array.isArray(fileList)) {
          const filesData = fileList.map(file => {
            const type = file.name.split('.').pop() || '';
            return {
              name: file.name,
              url: `/api/storage/file?bucketName=${bucketName}&filePath=${filePath}/${file.name}`,
              type: type,
            };
          });
          setFiles(filesData);
        } else {
          setFiles([]);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        toast({
          title: "Error",
          description: "Failed to retrieve files.",
          variant: "destructive",
        });
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [bucketName, filePath, toast]);

  const handleDeleteFile = async (fileName: string) => {
    try {
      // Update this to match the expected type for deleteFile
      await deleteFile(bucketName as any, `${filePath}/${fileName}`);
      setFiles(files.filter(file => file.name !== fileName));
      if (onFileDelete) {
        onFileDelete();
      }
      toast({
        title: "Success",
        description: "File deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Error",
        description: "Failed to delete file.",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(type.toLowerCase())) {
      return <FileImage className="h-4 w-4 mr-2" />;
    } else if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(type.toLowerCase())) {
      return <FileText className="h-4 w-4 mr-2" />;
    } else if (['zip', 'rar', 'tar', 'gz', '7z'].includes(type.toLowerCase())) {
      return <FileArchive className="h-4 w-4 mr-2" />;
    } else {
      return <FileText className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className={className}>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : files.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <Card key={file.name} className="shadow-md">
              <CardContent style={{ maxHeight: maxHeight, overflowY: 'auto' }} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(file.type)}
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">
                      {file.name}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    {showDownload && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {showDelete && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteFile(file.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">No files found.</div>
      )}
    </div>
  );
};

export default FileGallery;
