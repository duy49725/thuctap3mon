import axios from "axios";
import React, {useEffect, useRef} from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface ImageUploadProps{
    imageFile: File | null;
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
    setUploadedImageUrl: React.Dispatch<React.SetStateAction<string>>;
    imageLoadingState: boolean;
    setImageLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
    isCustomStyling?: boolean;
}

const ImageUpload = ({imageFile, setImageFile, setUploadedImageUrl, imageLoadingState, setImageLoadingState, isCustomStyling = true}: ImageUploadProps) =>{
    const inputRef = useRef<HTMLInputElement | null>(null);
    const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if(selectedFile) setImageFile(selectedFile);
    }
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if(droppedFile) setImageFile(droppedFile);
    }

    function handleRemoveImage(){
        setImageFile(null);
        if(inputRef.current){
            inputRef.current.value = "";
        }
    }

    const uploadImageToCloudinary = async () => {
        setImageLoadingState(true);
        const data = new FormData();
        data.append("image", imageFile as Blob);
        try {
            const response = await axios.post<{success: boolean, result: {url: string}}>(
                'http://localhost:3000/api/admin/product/upload-image',
                data
            );
            if(response.data.success){
                setUploadedImageUrl(response.data.result.url);
            }
        } catch (error) {
            console.log(error);
        }finally{
            setImageLoadingState(false);
        }
    }

    useEffect(() => {
        if(imageFile != null) uploadImageToCloudinary();
    }, [imageFile])    

    return(
        <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
            <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
            <div onDragOver={handleDragOver} onDrop={handleDrop} className="border-2 border-dashed rounded-lg p-4">
                <Input id="image-upload" type="file" className="hidden" ref={inputRef} onChange={handleImageFileChange}/>
                {
                    !imageFile ? (
                        <Label htmlFor="image-upload" className="flex flex-col items-center justify-center h-32 cursor-pointer">
                            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2"/>
                            <span>Drag & drop or click to upload image</span>
                        </Label>
                    ) : imageLoadingState ? (
                        <Skeleton className="h-10 bg-gray-100" />
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileIcon className="w-8 text-primary mr-2 h-8" />
                            </div>
                            <p className="text-sm font-medium">{imageFile.name}</p>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleRemoveImage}>
                                <XIcon className="w-4 h-4" />
                                <span className="sr-only">Remove File</span>
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ImageUpload;