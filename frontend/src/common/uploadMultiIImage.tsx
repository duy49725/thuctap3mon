import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ImagePlus, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (images: { imageUrl: string;}[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  maxImages = 5 
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = selectedFiles.length + newFiles.length;

    if (totalFiles > maxImages) {
      toast({
        title: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      });
      return;
    }

    const validFiles = newFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only JPEG, PNG, GIF, and WebP images are allowed",
          variant: "destructive"
        });
        return false;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Each image must be less than 5MB",
          variant: "destructive"
        });
        return false;
      }

      return true;
    });

    const newSelectedFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newSelectedFiles);

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const uploadImagesToBackend = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No images selected",
        variant: "destructive"
      });
      return [];
    }

    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post('http://localhost:3000/api/image/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      setSelectedFiles([]);
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return response.data.data; 
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newSelectedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    const newPreviews = previews.filter((_, index) => index !== indexToRemove);

    setSelectedFiles(newSelectedFiles);
    setPreviews(newPreviews);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    const uploadedImages = await uploadImagesToBackend();
    if (uploadedImages.length > 0) {
      onImageUpload(uploadedImages);
      toast({
        title: "Images Uploaded",
        description: `${uploadedImages.length} image(s) uploaded successfully`
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input 
          type="file" 
          ref={fileInputRef}
          multiple 
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          id="imageUpload"
        />
        <label htmlFor="imageUpload">
          <Button 
            type="button" 
            variant="outline" 
            className="flex items-center"
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Select Images
          </Button>
        </label>
        {selectedFiles.length > 0 && (
          <Button 
            type="button" 
            onClick={handleUpload} 
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Images'
            )}
          </Button>
        )}
      </div>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img 
                src={preview} 
                alt={`Preview ${index + 1}`} 
                className="h-24 w-24 object-cover rounded-md" 
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;