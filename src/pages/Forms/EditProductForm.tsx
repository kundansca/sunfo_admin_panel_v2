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

const EditProductForm = (props: any) => {
    console.log('eidt product form componets called');

    const dispatch = useDispatch();
    const [isloading, setIsloading] = useState(false);
    const [categories, setCategories] = useState<any>([]);

    console.log('edit product form run');
    console.log(props.productData);

    const [productData, setProductData] = useState<any>({
        ...props.productData,
        color: '',
        tags: ['youtube', 'facebook'],
        categories: [
            { name: 'kundan', _id: '102' },
            { name: 'kundan', id: '102' },
            { name: 'kundan', id: '102' },
        ],
    });

    const handleChange = (event: any) => {
        if (event.target.name === 'colorVariants') {
            setProductData({ ...productData, colorVariants: [productData.colorVariants, event.target.value] });
        }
        if (event.target.name === 'isStock' || event.target.name === 'isPremiumLeather') {
            setProductData({ ...productData, [event.target.name]: !productData[event.target.name] });
        } else {
            setProductData({ ...productData, [event.target.name]: event.target.value });
        }
    };

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
                    color: '', // Reset color input
                });
            }
        }
    };

    // Remove selected color from the array
    const removeColorVariant = (colorToRemove: string) => {
        const updatedColors = productData.colorsAvailable.filter((color: string) => color !== colorToRemove);
        setProductData({ ...productData, colorsAvailable: updatedColors });
    };

    const handleTagChange = (e: any) => {
        setProductData({ ...productData, tag: e.target.value });
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' && productData.tag.trim() !== '') {
            // Check if the tag already exists
            if (!productData.tags.includes(productData.tag.trim())) {
                setProductData({
                    ...productData,
                    tags: [...productData.tags, productData.tag.trim()],
                    tag: '', // Reset input field
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

    const removeTag = (tagToRemove: any) => {
        setProductData({
            ...productData,
            tags: productData.tags.filter((tag: any) => tag !== tagToRemove),
        });
    };

    // Add size and quantity
    const addSizeData = () => {
        if (productData.size && productData.quantity) {
            setProductData({
                ...productData,
                sizesAvailable: [...productData.sizesAvailable, { size: productData.size, quantity: productData.quantity }],
                size: '', // Reset size input
                quantity: '', // Reset quantity input
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
        const updatedSizeData = productData.sizesAvailable.filter((_: any, i: any) => i !== index);
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

    async function fetchCategories() {
        setIsloading(true);
        try {
            let response = await axios.get('https://sunfo-backend.onrender.com/api/categories');

            const categories = response.data.map((category: any) => {
                return { value: category._id, label: category.name };
            });

            setCategories(categories);``
        } catch {
            console.log('category faild part run');
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Something is Wrong pelase try agin',
                confirmButtonText: 'OK',
            });
        } finally {
            setIsloading(false);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSelectedCategoires = (selectedCategory: any) => {
        let categoriesId = selectedCategory.map((category: any) => {
            return category.value;
        });
        setProductData({ ...productData, categories: categoriesId });
    };
    const handleSubmit = (event: any) => {
        event.preventDefault();
        let data = props.imageData(productData);
        console.log('form submit');
        console.log(data);

        // const formData = new FormData();
        // for (const [key, value] of Object.entries(data)) {
        //     if (Array.isArray(value)) {
        //       // If the value is an array, append each element separately
        //       value.forEach(item => formData.append(key, item));
        //     } else {
        //       formData.append(key,value);
        //     }
        //   }
    };

    return (
        <div className="pt-5">
            {isloading === true && <PageLoader loading={true} />}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* form controls */}
                <div className="panel lg:row-span-3">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Add Product From</h5>
                    </div>
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="title">Title</label>
                                    <input type="text" placeholder="Enter Title" className="form-input" id="title" name="title" value={productData.title} onChange={handleChange} />
                                </div>

                                <div>
                                    <label htmlFor="brand">Select Categoies</label>
                                    {/*                    
                    <Select placeholder="Select an option" options={categories} isMulti isSearchable={true} onChange={handleSelectedCategoires} defaultValue={[{value:productData.category._id,label:productData.category.name}]}/> */}

                                    <Select placeholder="Select an option" options={categories} isMulti isSearchable={true} onChange={handleSelectedCategoires} />
                                </div>

                                {/* Size and Quantity input section */}
                                <div>
                                    <label htmlFor="size">Size</label>
                                    <input type="number" placeholder="Enter Size" className="form-input" id="size" name="size" value={productData.size} onChange={handleChange} />
                                </div>

                                <div>
                                    <label htmlFor="quantity">Quantity</label>
                                    <input type="number" placeholder="Enter Quantity" className="form-input" id="quantity" name="quantity" value={productData.quantity} onChange={handleChange} />
                                </div>

                                {/* Button to add size and quantity */}
                                <div>
                                    <button type="button" className="btn btn-primary" onClick={addSizeData}>
                                        Add Size
                                    </button>
                                </div>

                                {/* Display added sizes and quantities */}
                                {productData.sizesAvailable.length > 0 && (
                                    <div className="mt-4">
                                        <h6>Added Sizes:</h6>
                                        <div className="flex flex-wrap gap-2">
                                            {productData.sizesAvailable.map((data: { size: string; quantity: string }, index: number) => (
                                                <div key={index} className="flex items-center gap-2 bg-gray-200 p-2 rounded-lg">
                                                    <span>
                                                        {data.size} - {data.quantity}
                                                    </span>
                                                    <button type="button" onClick={() => removeSizeData(index)} className="text-red-500 hover:text-red-700">
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tags Input */}
                                <div>
                                    <label htmlFor="tags" className="text-sm">
                                        Tags (Press Enter to Add)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Add tags"
                                        className="form-input"
                                        id="tags"
                                        name="tag"
                                        value={productData.tag}
                                        onChange={handleTagChange}
                                        onKeyDown={handleKeyDown}
                                        aria-describedby="tagsHelp"
                                    />
                                    <small id="tagsHelp" className="text-gray-500">
                                        Enter tags like color, material, etc. and press Enter.
                                    </small>
                                </div>

                                {/* Tags Display */}
                                {productData.tags.length > 0 && (
                                    <div className="tags-display mt-4">
                                        <h6>Added Tags:</h6>
                                        <div className="flex flex-wrap gap-2">
                                            {productData.tags.map((tag: any, index: any) => (
                                                <div key={index} className="tag-item flex items-center bg-gray-200 p-2 rounded-full">
                                                    <span className="mr-2">{tag}</span>
                                                    <button type="button" onClick={() => removeTag(tag)} className="text-red-500 hover:text-red-700">
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="brand">Brand</label>
                                    <input type="text" placeholder="Enter Brand" className="form-input" id="brand" name="brand" value={productData.brand} onChange={handleChange} />
                                </div>

                                <div>
                                    <label htmlFor="product-code">Product Code</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Product Code"
                                        className="form-input"
                                        name="productCode"
                                        id="product-code"
                                        value={productData.productCode}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="slugTitle">Slug Title</label>
                                    <input type="text" placeholder="Enter Slug Title" className="form-input" id="slug-title" name="slugTitle" value={productData.slugTitle} onChange={handleChange} />
                                </div>

                                <div>
                                    <label htmlFor="selling-price">Selling Price</label>
                                    <input
                                        type="number"
                                        placeholder="Enter Selling Price"
                                        className="form-input"
                                        id="selling-price"
                                        name="sellingPrice"
                                        value={productData.sellingPrice}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="discount-price">Discount Price</label>
                                    <input
                                        type="number"
                                        placeholder="Enter Discount Price"
                                        className="form-input"
                                        id="discount-price"
                                        name="discount"
                                        value={productData.discount}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Color Variants */}
                                <div>
                                    <label htmlFor="color">Select Color Variants</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            id="color"
                                            name="color"
                                            value={productData.color}
                                            onChange={handleChange}
                                            className="form-input w-10 h-10 opacity-1 cursor-pointer"
                                            style={{ backgroundColor: productData.color || '#ffffff' }}
                                        />
                                        <button type="button" className="btn btn-primary" onClick={addColorVariant}>
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
                                                        {/* Cross icon for removing the color */}
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

                                <div>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox" checked={productData.isStock} onChange={handleChange} name="isStock" />
                                        <span className="text-white-dark">Is the stock available?</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox" checked={productData.disableProduct} onChange={handleChange} name="disableProduct" />
                                        <span className="text-white-dark">Is DisableProduct</span>
                                    </label>
                                </div>

                                <div>
                                    <label htmlFor="description">Enter Description</label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        className="form-textarea"
                                        placeholder="Enter Description"
                                        value={productData.description}
                                        onChange={handleChange}
                                        name="description"
                                    ></textarea>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary !mt-6">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProductForm;
