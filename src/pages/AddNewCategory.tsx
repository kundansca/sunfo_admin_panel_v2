import React from 'react'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { setPageTitle } from '../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconX from '../components/Icon/IconX';
import axios from 'axios';
import Swal from 'sweetalert2';
import PageLoader from '../extra/PageLoader';
export default function AddNewCategory() {
    const dispatch = useDispatch();
    const [isLoading,setIsloading]=useState<Boolean>(false);
    

    const supportedImageFormats = ['image/jpeg', 'image/jpg', 'image/png',];

    // const handleProductImageChange=(event:any)=>{
    //     console.log("file handle change");
    //     setFiles({...files,productImage:event.target.files[0]});

    //  }

     



    const [formData, setFormData] = useState({
        name: '',
        icon: '',
        color: '"#ff0000"',
        isVisibleOnNavbar: true
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = () => {
        setFormData((prevData) => ({
            ...prevData,
            isVisibleOnNavbar: !prevData.isVisibleOnNavbar
        }));
    };

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
            return image.file;
          });
      

         console.log(images[0]);
    return {...data,productImage:images[0].file,productSubImage:arrImage}
    

  }


  const submitCategoryData = async () => {
  
    const data = new FormData();
    data.append('name', formData.name);
    data.append('icon', formData.icon);
    data.append('color', formData.color);
    data.append('isVisibleOnNavbar', String(formData.isVisibleOnNavbar));
    data.append("categoryImage",images[0].file);

    try {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
        setIsloading(true);
         await axios.post(`${apiUrl}/categories`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        setFormData({ name: '',
            icon: '',
            color: '"#ff0000"',
            isVisibleOnNavbar: true});
        setImages([]);
         Swal.fire({
                  icon: "success",
                  title: "Category added successfully",
               
              });
        

    } catch (error:any) {
     
        Swal.fire({
                  icon: "error",
                  title:error.response.data.message || "Something went wrong while adding the category. Please try again" 
                 
                
                });
          
    }finally{
   setIsloading(false);


    }
};
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(images);
    if(images.length===0){
        Swal.fire({
            icon: "error",
            title:"Category image is required."
           
          
          });
          return ;

    }

const image = images[0];
      // Check image format
      if (!supportedImageFormats.includes(image.file.type)) {
        Swal.fire({
          icon: "error",
          title: "Invalid image format. Only JPEG, PNG are allowed.",
        });
        return;
      }else if (image.file.size > 10 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Image size should be less than 10MB.",
        });
        return;
      }




     if(formData.name.length>=20){
        

        Swal.fire({
            icon: "error",
            title:"Category Name cannot be more than 20 characters"
           
          
          });
          return ;

     }else if(formData.icon.length>=25){
        Swal.fire({
            icon: "error",
            title:"Icon cannot be more than 25 characters"
           
          
          });
          return ;

     }



    submitCategoryData();

    console.log('Form submitted:', formData);
};
  return (
   <>
   {isLoading===true ?<PageLoader loading={isLoading}/> :<>
    <div >
               
                <div className="pt-5 space-y-8 lg:mx-auto"style={{maxWidth:"700px"}} >
                    {/* Single File */}
                    <div className="grid lg:grid-cols-1 grid-cols-1 gap-6">
                        <div className="panel" id="single_file">
                            <div className="flex items-center justify-between mb-5">
                                <h5 className="font-semibold text-lg dark:text-white-light">Category Form</h5>
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



                       
                    </div>
                </div>
            </div>

<div className=' mt-3 mb-5 panel rounded lg:mx-auto' style={{maxWidth:"700px"}}>
           
            <div className="pt-5 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Category Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Icon Input */}
                        <div>
                            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                                Icon
                            </label>
                            <input
                                type="text"
                                name="icon"
                                id="icon"
                                value={formData.icon}
                                required
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                       


<div className="flex justify-start items-center">
    <label htmlFor="color" className="block text-sm font-medium text-gray-700">
        Color
    </label>
    <div
        className="ml-3 w-10 h-10 rounded-full border border-gray-300 overflow-hidden"
        style={{ backgroundColor: formData.color }}
    >
        <input
            type="color"
            name="color"
            id="color"
            value={formData.color}
            onChange={handleChange}
            className="opacity-0 w-full h-full cursor-pointer"
        />
    </div>
</div>


                        {/* Navbar Visibility */}
                        <div className="flex items-center">
                            <label htmlFor="isVisibleOnNavbar" className="block text-sm font-medium text-gray-700">
                                Visible on Navbar
                            </label>
                            <input
                                type="checkbox"
                                name="isVisibleOnNavbar"
                                id="isVisibleOnNavbar"
                                checked={formData.isVisibleOnNavbar}
                                onChange={handleCheckboxChange}
                                className="ml-2 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    <div className="flex justify-start">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Save Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
</>
}

</>

  )

}
