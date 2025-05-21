
import { useEffect, useState } from "react";
import { listFiles, deleteFile, StorageBucket, getFileUrl } from "@/utils/storageUtils";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  ExternalLink, 
  FileIcon, 
  Download, A
  rrowUpDown, 
  Grid3X3, 
  List, 
  LayoutGrid 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FileGalleryProps {
  bucket: StorageBucket;
  folder?: string;
  onFileDeleted?: () => void;
  refreshKey?: number; // Used to trigger refresh
  displayMode?: "grid" | "list";
  selectable?: boolean;
  onSelectionChange?: (files: { name: string; path: string; url: string }[]) => void;
}

const FileGallery = ({
  bucket,
  folder,
  onFileDeleted,
  refreshKey = 0,
  displayMode: initialDisplayMode = "grid",
  selectable = false,
  onSelectionChange
}: FileGalleryProps) => {
  const [files, setFiles] = useState<{ name: string; path: string; url: string; createdAt?: string; size?: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState<"grid" | "list">(initialDisplayMode);
  const [sortField, setSortField] = useState<"name" | "createdAt" | "size">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedFiles, setSelectedFiles] = useState<{ name: string; path: string; url: string }[]>([]);
  const [fileToDelete, setFileToDelete] = useState<{ name: string; path: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadFiles = async () => {
    setIsLoading(true);
    const filesList = await listFiles(bucket, folder);
    if (filesList) {
      // Add metadata like creation date and size (as examples)
      const filesWithMetadata = filesList.map(file => ({
        ...file,
        createdAt: new Date().toISOString(), // In a real app, we would get this from Supabase metadata
        size: Math.floor(Math.random() * 10000000) // Simulated file size in bytes
      }));
      setFiles(filesWithMetadata);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadFiles();
  }, [bucket, folder, refreshKey]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedFiles);
    }
  }, [selectedFiles, onSelectionChange]);

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
      // Remove from selection if it was selected
      setSelectedFiles(selectedFiles.filter(file => file.path !== path));
    }
  };

  const confirmDelete = (file: { name: string; path: string }) => {
    setFileToDelete(file);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (fileToDelete) {
      await handleDelete(fileToDelete.path);
      setIsDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const isImage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
  };

  const toggleFileSelection = (file: { name: string; path: string; url: string }, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFiles([...selectedFiles, file]);
    } else {
      setSelectedFiles(selectedFiles.filter(f => f.path !== file.path));
    }
  };

  const isFileSelected = (path: string) => {
    return selectedFiles.some(file => file.path === path);
  };

  const toggleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedFiles(files);
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSort = (field: "name" | "createdAt" | "size") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };

  // Sort files based on sort field and direction
  const sortedFiles = [...files].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortField === "createdAt" && a.createdAt && b.createdAt) {
      return sortDirection === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortField === "size" && a.size !== undefined && b.size !== undefined) {
      return sortDirection === "asc"
        ? a.size - b.size
        : b.size - a.size;
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className={`grid grid-cols-1 ${displayMode === "grid" ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : ""} gap-4`}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="border rounded-md overflow-hidden bg-card">
              <Skeleton className="aspect-square w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No files found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        {/* Display mode toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={displayMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setDisplayMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={displayMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setDisplayMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
                Sort by {sortField}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("name")}>
                Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                Date {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("size")}>
                Size {sortField === "size" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Select all checkbox (when selectable is true) */}
          {selectable && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="select-all"
                checked={selectedFiles.length === files.length && files.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm cursor-pointer">
                {selectedFiles.length > 0 ? `${selectedFiles.length} selected` : "Select all"}
              </label>
            </div>
          )}
        </div>
      </div>

      {displayMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedFiles.map((file) => (
            <div 
              key={file.path} 
              className={`border rounded-md overflow-hidden bg-card ${isFileSelected(file.path) ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="aspect-square flex items-center justify-center p-2 bg-muted relative">
                {selectable && (
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={isFileSelected(file.path)}
                      onCheckedChange={(checked) => toggleFileSelection(file, !!checked)}
                    />
                  </div>
                )}
                {isImage(file.name) ? (
                  <img 
                    src={file.url} 
                    alt={file.name} 
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <FileIcon className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              
              <div className="p-3">
                <p className="text-sm font-medium truncate" title={file.name}>
                  {file.name}
                </p>
                
                {file.createdAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(file.createdAt), 'MMM d, yyyy')}
                  </p>
                )}
                
                {file.size !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                )}
                
                <div className="flex justify-between mt-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => confirmDelete(file)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = file.url;
                        a.download = file.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                    >
                      <Download className="h-4 w-4" />
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
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-md divide-y">
          <div className="grid grid-cols-12 py-2 px-4 font-medium text-sm bg-muted">
            {selectable && <div className="col-span-1"></div>}
            <div className={`${selectable ? 'col-span-5' : 'col-span-6'} flex items-center cursor-pointer`} onClick={() => handleSort("name")}>
              Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort("size")}>
              Size {sortField === "size" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort("createdAt")}>
              Date {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
          
          {sortedFiles.map((file) => (
            <div 
              key={file.path}
              className={`grid grid-cols-12 items-center py-3 px-4 hover:bg-muted/50 ${
                isFileSelected(file.path) ? 'bg-primary/10' : ''
              }`}
            >
              {selectable && (
                <div className="col-span-1">
                  <Checkbox
                    checked={isFileSelected(file.path)}
                    onCheckedChange={(checked) => toggleFileSelection(file, !!checked)}
                  />
                </div>
              )}
              <div className={`${selectable ? 'col-span-5' : 'col-span-6'} flex items-center`}>
                <div className="h-8 w-8 mr-2 flex-shrink-0 flex items-center justify-center">
                  {isImage(file.name) ? (
                    <img 
                      src={file.url} 
                      alt={file.name} 
                      className="h-8 w-8 object-cover rounded"
                    />
                  ) : (
                    <FileIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <p className="truncate" title={file.name}>{file.name}</p>
              </div>
              
              <div className="col-span-2 text-sm text-muted-foreground">
                {formatFileSize(file.size)}
              </div>
              
              <div className="col-span-2 text-sm text-muted-foreground">
                {file.createdAt && format(new Date(file.createdAt), 'MMM d, yyyy')}
              </div>
              
              <div className="col-span-3 flex justify-end space-x-1">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => confirmDelete(file)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = file.url;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  <Download className="h-4 w-4" />
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
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-medium">{fileToDelete?.name}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FileGallery;
