import ImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addNewFeatureImage, deleteFeatureImage, fetchAllFeatureImage } from "@/store/common/feature-slice";
import { AppDispatch, RootState } from "@/store/store";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminFeature = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
    const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const {featureImageList} = useSelector((state: RootState) => state.commonFeature);
    const handleUploadImage= () => {
        dispatch(addNewFeatureImage({image: uploadedImageUrl})).then((data) => {
            if(data.payload.success){
                dispatch(fetchAllFeatureImage());
                setUploadedImageUrl("");
                setImageFile(null);
            }
        })
    }
    useEffect(() => {
        dispatch(fetchAllFeatureImage());
    }, [dispatch]);
    console.log(featureImageList)
    return(
        <div>
            <ImageUpload 
                imageFile={imageFile}
                setImageFile={setImageFile}
                setImageLoadingState={setImageLoadingState}
                setUploadedImageUrl={setUploadedImageUrl}
                imageLoadingState={imageLoadingState}
                isCustomStyling={true}
            />
            <Button onClick={handleUploadImage} className="mt-5 w-full">
                Upload
            </Button>
            <div className="flex flex-col gap-4 mt-5">
                {
                    featureImageList && featureImageList.length > 0
                        ? featureImageList.map((featureImage) => (
                            <div className="relative">
                                <img src={featureImage.image} alt="" className="w-full h-[300px] object-cover rounded-t-lg"/>
                                <Button
                                    className="mt-2"
                                    onClick={() => dispatch(deleteFeatureImage(featureImage.id)).then(data => dispatch(fetchAllFeatureImage()))}
                                >
                                    Delete
                                </Button>
                            </div>
                        )) : null
                }
            </div>
        </div>
    )
}

export default AdminFeature;