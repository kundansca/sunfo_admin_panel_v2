import { Link } from 'react-router-dom';
import CodeHighlight from '../../components/Highlight';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconCode from '../../components/Icon/IconCode';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';
import PageLoader from '../../extra/PageLoader';



const BasicProductDetails = (props:any) => {
   
   
    const dispatch = useDispatch();
    const [isloading,setIsloading]=useState(false);
   const [categories,setCategories]=useState<any>([]);
   const [isCategoriesLoader,setIsCategoriesLoader]=useState<any>(false);
 

   
    const [productData,setProductData]=useState<any>({title:"",brand:"",tags:[],description:"",productCode:"",isInStock:false,sellingPrice:null,discount:null,
        disableProduct:false,color:"",colorsAvailable:[],sizesAvailable:[],categories:[]});
        const supportedImageFormats = ['image/jpeg', 'image/jpg', 'image/png'];
       
    const handleChange=(event:any)=>{
        if(event.target.name==="colorVariants"){
        setProductData({...productData,colorsAvailable:[productData.colorsAvailable,event.target.value]});
        }
        if(event.target.name==="isInStock" || event.target.name==="disableProduct"){
         
            setProductData({...productData,[event.target.name]:!productData[event.target.name]});
        }else{
        setProductData({...productData,[event.target.name]:event.target.value});
        }
    }
     

    const addColorVariant = () => {
        if (productData.color) {
            // Check if color already exists
            if (productData.colorsAvailable.includes(productData.color)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Duplicate Color',
                    text: 'This color is already added!',
                    confirmButtonText: 'OK',
                });
            } else {
                // Add color if it's not duplicate
                setProductData({
                    ...productData,
                    colorsAvailable: [...productData.colorsAvailable, productData.color],
                    color: "" // Reset color input
                });
            }
        }
    };



    // Remove selected color from the array
    const removeColorVariant = (colorToRemove: string) => {
        const updatedColors = productData.colorsAvailable.filter(
            (color: string) => color !== colorToRemove
        );
        setProductData({ ...productData, colorsAvailable: updatedColors });
    };



    const handleTagChange = (e:any) => {
        setProductData({ ...productData, tag: e.target.value });
      };
    
      const handleKeyDown = (e:any) => {
        if (e.key === 'Enter' && productData.tag.trim() !== '') {
          // Check if the tag already exists
          if (!productData.tags.includes(productData.tag.trim())) {
            setProductData({
              ...productData,
              tags: [...productData.tags, productData.tag.trim()],
              tag: '' // Reset input field
            });
          } else {
            // Swal.fire({
            //     icon: 'warning',
            //     title: 'Duplicate Tag',
            //     text: 'Tag already added!',
              
            //     confirmButtonText: 'OK',
            // });
           
            alert('Tag already added!');
          }
        }
      };
    
      const removeTag = (tagToRemove:any) => {
        setProductData({
          ...productData,
          tags: productData.tags.filter((tag:any) => tag !== tagToRemove)
        });
      };






       // Add size and quantity
    const addSizeData = () => {
        if (productData.size && productData.quantity) {
            setProductData({
                ...productData,
                sizesAvailable: [
                    ...productData.sizesAvailable                    ,
                    { size: productData.size, quantity: Number(productData.quantity) }
                ],
                size: "", // Reset size input
                quantity: "" // Reset quantity input
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please enter both size and quantity.',
                confirmButtonText: 'OK',
            });
        }
    };

    // Remove size and quantity
    const removeSizeData = (index: number) => {
        const updatedSizeData = productData.sizesAvailable.filter((_:any, i:any) => i !== index);
        setProductData({ ...productData, sizesAvailable: updatedSizeData });
    };


    useEffect(() => {
        dispatch(setPageTitle('Basic Forms'));
    });
    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };




      async function fetchCategories(){
        setIsCategoriesLoader(true);
       try{
        let apiBaseUrl= import.meta.env.VITE_REACT_APP_API_URL;
           let response= await  axios.get(`${apiBaseUrl}/categories`);
           console.log("Raw categories response:", response.data);
          
           
        
       
           const   categories=response.data.map((category:any)=>{
         
             console.log("Processing category:", category);
             return {value:category._id,label:category.name}
    
         });
         console.log("Processed categories:", categories);
         setCategories(categories);

         

       }catch{
        Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Something is Wrong pelase try agin',
            confirmButtonText: 'OK',
        });
        

       }finally{
          

        setIsCategoriesLoader(false);
       }



      }
    useEffect(()=>{
           
      fetchCategories();
    },[]);
    
    const handleSelectedCategoires = (selectedCategory: any) => {
     
        
        // If single category is selected
        if (selectedCategory && !Array.isArray(selectedCategory)) {
           
            setProductData({...productData, category: selectedCategory.value});
            return;
        }
        
        // If multiple categories are selected (though currently we only need one)
        let categoriesId = selectedCategory.map((category: any) => {
            console.log("Category mapping:", category);
            return category.value;
        });
      
        
        // For now, just take the first category if multiple are selected
        setProductData({...productData, category: categoriesId[0]});
    };

   const sendProductData = async (formData: FormData) => {
     
        const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
        
        try {
           
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await axios.post(`${apiBaseUrl}/createProduct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log("API Response:", response.data);
            
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Product created successfully!',
                });
            }
        } catch (error: any) {
            console.error("Error creating product:", error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to create product',
            });
        }
    };

    const handleSubmit = async(event: any) => {
        event.preventDefault();

   






        

        const processedData = await props.imageData(productData);
          console.log("new product data");
          console.log(processedData);
        if (processedData.productImage==undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Prdouct Images',
                text: 'Please upload product images',
            });
            return;
        }else if(processedData.productSubImages.length===0){

            Swal.fire({
                icon:"error",
                title:"Missing Product SubImages",
                text:"Please upload Sub Images"
            });
            return ;
        }else if (!supportedImageFormats.includes(processedData?.productImage?.type)) {
                Swal.fire({
                  icon: "error",
                  title: "Invalid Product image format. Only JPEG, PNG are allowed.",
                });
                return;
              }else if (processedData?.productImage?.size > 10 * 1024 * 1024) {
                      Swal.fire({
                        icon: "error",
                        title: "Product Image size should be less than 10MB.",
                      });
                      return;
                    }else if(processedData.productSubImages.length>0){
                    for(let file of  processedData?.productSubImages){
                        if(!supportedImageFormats.includes(file?.type)){
                            Swal.fire({
                                icon: "error",
                                title: "Invalid Product Sub image format. Only JPEG, PNG are allowed.",
                              });

                              return; 

                        }else if (file?.size > 10 * 1024 * 1024) {
                            Swal.fire({
                              icon: "error",
                              title: "Product Sub Image size should be less than 10MB.",
                            });
                            return;
                          }

                    }

              }
              
              
            //   else if (image.file.size > 10 * 1024 * 1024) {
            //     Swal.fire({
            //       icon: "error",
            //       title: "Image size should be less than 10MB.",
            //     });
            //     return;
            //   }
        
        


        // Validate category

        

       if(productData.title.length===0){
        Swal.fire({
            icon: 'error',
            title: 'Title field is required',
         
        });
        return;

    


       }else if (!processedData.category) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Category',
            text: 'Please select a category',
        });
        return;
    }else if(productData.sizesAvailable.length===0){

        Swal.fire({
            icon: 'error',
            title: 'Product size is required',
         
        });
        return;


       }else if(productData.tags.length===0){

        Swal.fire({
            icon: 'error',
            title: 'Tag is required',
         
        });
        return;


       }else if(productData.brand===""){

        Swal.fire({
            icon: 'error',
            title: 'Brand field is required',
         
        });
        return;

       }else if(productData.productCode===""){
        Swal.fire({
            icon:"error",
            title:"Product code is required"
        });
        return ;

       }
       
       else if(productData.sellingPrice===""){


        Swal.fire({
            icon: 'error',
            title: 'Selling Price field is required',
         
        });
        return;


       }else if(productData.colorsAvailable.length===0){
          Swal.fire({
            icon:"error",
            title:"color is required"
          })
          return ;
       
    }else if(productData.description!==0){

    Swal.fire({
        icon:"error",
        title:"Description field is required"
        
    });
     return;

    }



        




        const formData = new FormData();

        // Add category (ensure it's a string)
        formData.append('category', processedData.category.toString());
        
        // Add basic fields
        formData.append('title', processedData.title);
        formData.append('productCode', processedData.productCode);
        formData.append('description', processedData.description);
        formData.append('price', processedData.price);
        formData.append('sellingPrice', processedData.sellingPrice);
        formData.append('tag', processedData.tag);
        
        // Add arrays as JSON strings
        formData.append('sizesAvailable', JSON.stringify(processedData.sizesAvailable));
        formData.append('colorsAvailable', JSON.stringify(processedData.colorsAvailable));

        // Add boolean fields
        formData.append('isInStock', processedData.isInStock.toString());
        formData.append('disableProduct', processedData.disableProduct.toString());

        // Add images
        formData.append('productImage', processedData.productImage);
        processedData.productSubImages.forEach((image: File, index: number) => {
            formData.append('productSubImages', image);
        });

        console.log("FormData prepared, sending to API...");
        sendProductData(formData);
    };

    return (
  






 <div className="pt-5">
    <PageLoader loading={isloading} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
        <div className="panel lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <h5 className="font-semibold text-lg dark:text-white-light">Add Product Form</h5>
            </div>
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            placeholder="Enter Title"
                            className="form-input w-full py-2 px-4 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            id="title"
                            name="title"
                            value={productData.title}
                          
                            onChange={handleChange}
                        />
                    </div>

                    {/* Categories Select */}
                    <div>
                        <label htmlFor="categories" className="block text-sm font-medium text-gray-700">Select Categories</label>
                        <Select
                            placeholder="Select an option"
                            options={categories}
                            isMulti={false}
                            isSearchable={true}
                            onChange={handleSelectedCategoires}
                            isLoading={isCategoriesLoader}
                            className="w-full"
                            value={categories.find((cat: any) => cat.value === productData.category)}
                            onBlur={() => console.log("Current category value:", productData.category)}
                        />
                    </div>

                    {/* Size Input */}
                    <div>
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size</label>
                        <input
                            type="text"
                            placeholder="Enter Size"
                            className="form-input w-full py-2 px-4 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            id="size"
                            name="size"
                            value={productData.size}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Quantity Input */}
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                            type="number"
                            placeholder="Enter Quantity"
                            className="form-input w-full py-2 px-4 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            id="quantity"
                            name="quantity"
                            value={productData.quantity}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Add Size Button */}
                <div className="mt-4">
                    <button
                        type="button"
                        className="btn btn-primary w-full sm:w-auto py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={addSizeData}
                    >
                        Add Size
                    </button>
                </div>

                {/* Display added sizes and quantities */}
                {productData.sizesAvailable.length > 0 && (
                    <div className="mt-4">
                        <h6 className="text-sm font-medium text-gray-700">Added Sizes:</h6>
                        <div className="flex flex-wrap gap-2">
                            {productData.sizesAvailable.map((data: { size: string, quantity: string }, index: number) => (
                                <div key={index} className="flex items-center gap-2 bg-gray-200 p-2 rounded-lg">
                                    <span>{data.size} - {data.quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeSizeData(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags Input */}
                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (Press Enter to Add)</label>
                    <input
                        type="text"
                        placeholder="Add tags"
                        className="form-input w-full py-2 px-4 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        id="tags"
                        name="tag"
                        value={productData.tag}
                        onChange={handleTagChange}
                        onKeyDown={handleKeyDown}
                    />
                    <small className="text-gray-500">Enter tags like color, material, etc. and press Enter.</small>
                </div>

                {/* Tags Display */}
                {productData.tags.length > 0 && (
                    <div className="mt-4">
                        <h6 className="text-sm font-medium text-gray-700">Added Tags:</h6>
                        <div className="flex flex-wrap gap-2">
                            {productData.tags.map((tag: any, index: any) => (
                                <div key={index} className="tag-item flex items-center bg-gray-200 p-2 rounded-full">
                                    <span className="mr-2">{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Brand Input */}
                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                    <input
                        type="text"
                        placeholder="Enter Brand"
                        className="form-input w-full py-2 px-4 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        id="brand"
                        name="brand"
                        value={productData.brand}
                        onChange={handleChange}
                     
                    />
                </div>

                {/* Product Code */}
                <div>
                    <label htmlFor="product-code" className="block text-sm font-medium text-gray-700">Product Code</label>
                    <input
                        type="text"
                        placeholder="Enter Product Code"
                        className="form-input w-full py-2 px-4 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        name="productCode"
                        id="product-code"
                        value={productData.productCode}
                        onChange={handleChange}

                    />
                </div>

                {/* Selling Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Selling Price</label>
                    <input
                        type="number"
                        placeholder="Enter Selling Price"
                        className="form-input w-full py-2 px-4 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        id="price"
                        name="sellingPrice"
                        value={productData.sellingPrice}
                        onChange={handleChange}

                    />
                </div>

                {/* Discount Price */}
                <div>
                    <label htmlFor="discount-price" className="block text-sm font-medium text-gray-700">Discount Price</label>
                    <input
                        type="number"
                        placeholder="Enter Discount Price"
                        className="form-input w-full py-2 px-4 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        id="discount-price"
                        name="discount"
                        value={productData.discount}
                        onChange={handleChange}
                   
                    />
                </div>

                {/* Color Variants */}
                <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">Select Color Variants</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            id="color"
                            name="color"
                            value={productData.color}
                            onChange={handleChange}
                            className="form-input w-10 h-10 opacity-1 cursor-pointer"
                            style={{ backgroundColor: productData.color || "#ffffff" }}
                        />
                        <button
                            type="button"
                            className="btn btn-primary py-2 px-4 rounded-md"
                            onClick={addColorVariant}
                        >
                            Add Color
                        </button>
                    </div>

                    {/* Display selected colors */}
                    {productData.colorsAvailable.length > 0 && (
                        <div className="mt-3">
                            <h6 className="text-sm font-medium mb-2">Selected Colors:</h6>
                            <div className="flex gap-2 flex-wrap">
                                {productData.colorsAvailable.map((color: string, index: number) => (
                                    <div
                                        key={index}
                                        className="relative w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                                        style={{ backgroundColor: color }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => removeColorVariant(color)}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Stock Availability */}
                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={productData.isInStock}
                            onChange={handleChange}
                            name='isInStock'
                        />
                        <span className="text-sm ml-2">Is the stock available?</span>
                    </label>
                </div>

                {/* Disable Product */}
                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={productData.disableProduct}
                            onChange={handleChange}
                            name='disableProduct'
                        />
                        <span className="text-sm ml-2">Is this product disabled?</span>
                    </label>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Enter Description</label>
                    <textarea
                        id="description"
                        rows={3}
                        className="form-textarea w-full py-2 px-4 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Description"
                        onChange={handleChange}
                        name="description"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <button
                        type="button"
                        className="btn btn-primary w-full sm:w-auto py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </div>
</div> 































































    );
}

export default BasicProductDetails;