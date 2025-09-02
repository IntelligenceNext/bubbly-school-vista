
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type StorageBucket = 'school_logos' | 'student_photos' | 'attachments' | 'book-covers';

/**
 * Upload a file to a Supabase storage bucket
 */
export const uploadFile = async (
  bucket: StorageBucket,
  file: File,
  path?: string
): Promise<string | null> => {
  try {
    // Create a unique file path if not provided
    const filePath = path || `${Math.random().toString(36).substring(2, 15)}_${file.name}`;
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
      console.error('Error uploading file:', error);
      return null;
    }
    
    return data.path;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    toast({
      title: "Upload failed",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Get the public URL for a file
 */
export const getFileUrl = (
  bucket: StorageBucket,
  path: string
): string => {
  const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Delete a file from a storage bucket
 */
export const deleteFile = async (
  bucket: StorageBucket,
  path: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFile:', error);
    toast({
      title: "Delete failed",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * List all files in a bucket or folder
 */
export const listFiles = async (
  bucket: StorageBucket,
  folder?: string
): Promise<{ name: string, path: string, url: string }[] | null> => {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .list(folder || '');
    
    if (error) {
      toast({
        title: "Failed to list files",
        description: error.message,
        variant: "destructive"
      });
      console.error('Error listing files:', error);
      return null;
    }
    
    if (!data) return [];
    
    return data
      .filter(item => !item.id.endsWith('/')) // Filter out folders
      .map(item => ({
        name: item.name,
        path: folder ? `${folder}/${item.name}` : item.name,
        url: getFileUrl(bucket, folder ? `${folder}/${item.name}` : item.name)
      }));
  } catch (error) {
    console.error('Error in listFiles:', error);
    toast({
      title: "Failed to list files",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};
