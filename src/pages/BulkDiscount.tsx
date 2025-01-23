import Select from 'react-select';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../extra/BulkDiscount.css";

const BulkDiscount = () => {
    const [bulkDiscountFormData, setBulkDiscountFormData] = useState({ discountPrice: "", categories: [] });
    const [categories, setCategories] = useState<any>([]);
    const [isCategoriesLoader, setIsCategoriesLoader] = useState<any>(false);

    const handleChange = (event: any) => {
        setBulkDiscountFormData({ ...bulkDiscountFormData, [event.target.name]: event.target.value });
    };

    async function sendDiscountData(data: any) {
        try {
            let apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
            let response = await axios.post(`${apiBaseUrl}/categoryDiscount`, { discount: data.discountPrice, categories: data.categories });
            setBulkDiscountFormData({ discountPrice: "", categories: [] });

            Swal.fire({
                icon: 'success',
                title: response.data.message,
                confirmButtonText: 'OK',
            });
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: error.response.message || "Failed to Add Discount",
                confirmButtonText: 'OK',
            });
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (Number(bulkDiscountFormData.discountPrice) > 99) {
            Swal.fire({
                icon: 'warning',
                title: 'Discount Price cannot exceed 99%',
                confirmButtonText: 'OK',
            });
            return;
        } else if (bulkDiscountFormData.categories.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Please select at least one category.',
                confirmButtonText: 'OK',
            });
            return;
        }

        sendDiscountData(bulkDiscountFormData);
    };

    async function fetchCategories() {
        setIsCategoriesLoader(true);
        try {
            let apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
            let response = await axios.get(`${apiBaseUrl}/categories`);

            const categories = response.data.map((category: any) => {
                return { value: category._id, label: category.name }
            });
            setCategories(categories);
        } catch {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Something is Wrong, please try again',
                confirmButtonText: 'OK',
            });
        } finally {
            setIsCategoriesLoader(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSelectedCategories = (selectedCategory: any) => {
        let categoriesId = selectedCategory.map((category: any) => {
            return category.value;
        });
        setBulkDiscountFormData({ ...bulkDiscountFormData, categories: categoriesId });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto sm:max-w-2xl md:max-w-3xl">
            <ul className="flex space-x-2 rtl:space-x-reverse mb-4">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Forms
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Bulk Discount</span>
                </li>
            </ul>
            <h2 className="text-2xl font-semibold text-center mb-6">Bulk Discount Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Discount Price */}
                <div className="flex flex-col relative">
                    <label htmlFor="discountPrice" className="text-lg font-medium mb-2">Discount Percentage </label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                    <input
  type="number"
  id="discountPrice"
  name="discountPrice"
  value={bulkDiscountFormData.discountPrice}
  onChange={handleChange}
  className="p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
  placeholder="Enter discount price"
  required
  max={99}
/>
                        <span className="absolute right-3 text-lg text-gray-600">%</span>
                    </div>
                </div>

                {/* Category */}
                <div className="flex flex-col">
                    <label htmlFor="category" className="text-lg font-medium mb-2">Select Category</label>
                    <Select placeholder="Select an option" options={categories} isMulti isSearchable={true} onChange={handleSelectedCategories} isLoading={isCategoriesLoader} />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-dark transition duration-300"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BulkDiscount;
