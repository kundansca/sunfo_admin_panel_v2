//  image upload part
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { setPageTitle } from '../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconX from '../components/Icon/IconX';

// other product details of the page.
import BasicProductDetails from './Forms/BasicProductDetails';

// image upload part
const AddProduct = () => {


      

    const dispatch = useDispatch();
    


   

    useEffect(() => {
        dispatch(setPageTitle('File Upload Preview'));
    });
    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    const [images, setImages] = useState<any>([]);
    const [images2, setImages2] = useState<any>([]);
    const maxNumber = 69;
  
   
    const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages(imageList as never[]);
    };

    const onChange2 = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages2(imageList as never[]);
    };
    
  const imageData=(data:any)=>{
          console.log("product image");
         let arrImage=images2.map((image:any)=>{
        
            return image?.file;
          });
      

         console.log(arrImage);

         
    return {...data,productImage:images[0]?.file,productSubImages:arrImage};
    
    

  }
  
    return (
        <>
            <div>
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="#" className="text-primary hover:underline">
                            Forms
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>File Upload</span>
                    </li>
                </ul>
                <div className="pt-5 space-y-8">
                    {/* Single File */}
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                        <div className="panel" id="single_file">
                            <div className="flex items-center justify-between mb-5">
                                <h5 className="font-semibold text-lg dark:text-white-light">Product Main Image</h5>
                            </div>
                            <div className="mb-5">
                                <div className="custom-file-container" data-upload-id="myFirstImage">
                                    <div className="label-container">
                                        <label>Upload </label>
                                        <button
                                            type="button"
                                            className="custom-file-container__image-clear"
                                            title="Clear Image"
                                            onClick={() => {
                                                setImages([]);
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <label className="custom-file-container__custom-file"></label>
                                    <input type="file" className="custom-file-container__custom-file__custom-file-input" accept="image/*"/>
                                    <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
                                    <ImageUploading value={images} onChange={onChange} maxNumber={maxNumber}>
                                        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                                            <div className="upload__image-wrapper">
                                                <button className="custom-file-container__custom-file__custom-file-control" onClick={onImageUpload}>
                                                    Choose File...
                                                </button>
                                                &nbsp;
                                                {imageList.map((image, index) => (
                                                    <div key={index} className="custom-file-container__image-preview relative">
                                                        <img src={image.dataURL} alt="img" className="m-auto" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ImageUploading>
                                    {images.length === 0 ? <img src="/assets/images/file-preview.svg" className="max-w-md w-full m-auto" alt="" /> : ''}
                                </div>
                            </div>
                        </div>

                        {/*  Multiple File */}
                        <div className="multiple-file-upload panel">
                            <div className="flex items-center justify-between mb-5">
                                <h5 className="font-semibold text-lg dark:text-white-light">Product Sub Images</h5>
                            </div>
                            <div className="mb-5">
                                <div className="custom-file-container" data-upload-id="mySecondImage">
                                    <div className="label-container">
                                        <label>Upload </label>
                                        <button
                                            type="button"
                                            className="custom-file-container__image-clear"
                                            title="Clear Image"
                                            onClick={() => {
                                                setImages2([]);
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <label className="custom-file-container__custom-file"></label>
                                    <input type="file" className="custom-file-container__custom-file__custom-file-input" accept="image/*" />
                                    <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
                                    <ImageUploading multiple value={images2} onChange={onChange2} maxNumber={maxNumber}>
                                        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                                            <div className="upload__image-wrapper">
                                                <button className="custom-file-container__custom-file__custom-file-control" onClick={onImageUpload}>
                                                    Choose File...
                                                </button>
                                                &nbsp;
                                                <div className="grid gap-4 sm:grid-cols-3 grid-cols-1">
                                                    {imageList.map((image, index) => (
                                                        <div key={index} className="custom-file-container__image-preview relative">
                                                            <button
                                                                type="button"
                                                                className="custom-file-container__image-clear bg-dark-light dark:bg-dark dark:text-white-dark rounded-full block w-fit p-0.5 absolute top-0 left-0"
                                                                title="Clear Image"
                                                                onClick={() => onImageRemove(index)}
                                                            >
                                
                                                                <IconX className="w-3 h-3" />
                                                            </button>
                                                            <img src={image.dataURL} alt="img" className="object-cover shadow rounded w-full !max-h-48" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </ImageUploading>
                                    {images2.length === 0 ? <img src="/assets/images/file-preview.svg" className="max-w-md w-full m-auto" alt="" /> : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BasicProductDetails imageData={imageData}/>



            <form>
    
</form>

        </>
    );
};

export default AddProduct;
