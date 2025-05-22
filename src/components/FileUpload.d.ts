
interface FileUploadProps {
  /**
   * The storage bucket to upload files to
   */
  bucket: 'school_logos' | 'student_photos' | 'attachments' | 'book-covers';
  
  /**
   * Optional folder path within the bucket
   */
  folder?: string;
  
  /**
   * Callback function triggered after successful upload
   */
  onUploadComplete?: (filePath: string) => void;
  
  /**
   * Maximum size of each file in MB (legacy prop)
   */
  maxSize?: number;

  /**
   * Maximum size of each file in MB
   */
  maxSizeInMB?: number;
  
  /**
   * Accepted file types
   */
  acceptedFileTypes?: string[];
  
  /**
   * Maximum number of files allowed to upload
   */
  maxFiles?: number;
  
  /**
   * Text to display on the upload button
   */
  buttonText?: string;
}

export default FileUploadProps;
