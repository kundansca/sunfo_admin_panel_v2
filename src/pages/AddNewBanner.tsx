import React from 'react';
import { useEffect, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { setPageTitle } from '../store/themeConfigSlice';
import { useDispatch } from 'react-redux';

import axios from 'axios';
import Swal from 'sweetalert2';
import PageLoader from '../extra/PageLoader';

export default function AddNewBanner() {
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState<Boolean>(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    dispatch(setPageTitle('File Upload Preview'));
  }, [dispatch]);

  const [images, setImages] = useState<any>([]);
  const maxNumber = 69;

  const supportedImageFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/avif', 'image/webp'];

  const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    setImages(imageList as never[]);
  };

  const submitBannerData = async () => {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);

    data.append("bannerImg", images[0].file);

    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      setIsloading(true);
      await axios.post(`${apiUrl}/addBanner`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setFormData({
        title: '',
        description: '',
      });
      setImages([]);

      Swal.fire({
        icon: "success",
        title: "Banner added successfully",
      });

    } catch (error: any) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong! Please try again"
      });

    } finally {
      setIsloading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Banner image is required.",
        });
        return;
      }
  
      const image = images[0];
      // Check image format
      if (!supportedImageFormats.includes(image.file.type)) {
        Swal.fire({
          icon: "error",
          title: "Invalid image format. Only JPEG, PNG, AVIF, and WebP are allowed.",
        });
        return;
      }
  
      // Check image size (should be less than 10MB)
      if (image.file.size > 10 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Image size should be less than 10MB.",
        });
        return;
      }



    // Check for character limits
    if (formData.title.length > 50) {
      Swal.fire({
        icon: "error",
        title: "Title cannot be more than 50 characters.",
      });
      return;
    }

    if (formData.description.length > 100) {
      Swal.fire({
        icon: "error",
        title: "Description cannot be more than 100 characters.",
      });
      return;
    }

    

    submitBannerData();
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <div>
        <PageLoader loading={isLoading} />

        <div className="pt-5 space-y-8 lg:mx-auto" style={{ maxWidth: "900px" }}>
          <div className="grid lg:grid-cols-1 grid-cols-1 gap-6">
            <div className="panel" id="single_file">
              <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">Add New Banner Form</h5>
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
                  <input type="file" className="custom-file-container__custom-file__custom-file-input" accept="image/*" />
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

      <div className='mt-3 mb-5 panel rounded lg:mx-auto' style={{ maxWidth: "900px" }}>

        <div className="pt-5 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid lg:grid-cols-1 gap-6">
              {/* Name Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Description Input */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  required
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  style={{ height: "100px" }}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-start">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Banner
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
