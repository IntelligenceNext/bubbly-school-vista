
interface FileUploadProps {
  /**
   * The storage bucket to upload files to
   */
  bucket: 'school_logos' | 'student_photos' | 'attachments' | 'book-covers';
  
  /**
   * Callback function triggered after successful upload
   * Returns an array of file URLs or paths
   */
  onUploadComplete: (urls: string[]) => void;
  
  /**
   * Accepted file types
   */
  acceptedFileTypes?: string[];
  
  /**
   * Maximum number of files allowed to upload
   */
  maxFiles?: number;
  
  /**
   * Maximum size of each file in MB
   */
  maxSizeInMB?: number;
}

export default FileUploadProps;
