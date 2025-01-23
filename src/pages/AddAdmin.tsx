import Select from 'react-select';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AddAdmin = () => {
    const [adminFormData, setAdminFormData] = useState<any>({
        email: "",
        firstName: "",
        lastName: "",
        role: "",
        password: "",
        confirmPassword: "",
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false); // Loader state

    const adminTypes = [
        { value: "admin", label: "admin" },
        { value: "super-admin", label: "super-admin" },
    ];

    const handleChange = (event: any) => {
        setAdminFormData({ ...adminFormData, [event.target.name]: event.target.value });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const createAdmin = async (data: any) => {
        console.log("form data", data);
        try {
            setLoading(true); // Start the loader
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

           let response= await axios.post(`${apiUrl}/auth/registerAdmin`, data);
           console.log("response data");
           console.log(response.data);

            setAdminFormData({
                firstName: "",
                lastName: "",
                email: "",
                role: "",
                password: "",
                confirmPassword: "",
            });

            Swal.fire({
                icon: 'success',
                title: response.data.message,
                confirmButtonText: 'OK',
            });
        } catch (error:any) {
            if(error.response.status==201){
            Swal.fire({
                icon: 'error',
                title: 'Failed to Add Admin',
                text:error.response.message,
                confirmButtonText: 'OK',
            });
        }else {

            Swal.fire({
                icon: 'error',
                title: 'Failed to Add Admin',
                text:"SomeThing went wrong",
                confirmButtonText: 'OK',
            });


        }
        } finally {
            setLoading(false); // Stop the loader
        }
    };

    const handleSelectedCategories = (selectedAdminType: any) => {
        setAdminFormData({ ...adminFormData, role: selectedAdminType.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (adminFormData.role.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Please Select Role',
                confirmButtonText: 'OK',
            });
            return;
        }

        if (adminFormData.password !== adminFormData.confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Password and Confirm Password do not match',
                confirmButtonText: 'OK',
            });
            return;
        }

        const tempData = { ...adminFormData };
        delete tempData.confirmPassword;

        createAdmin(tempData);
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
                    <span>Add Admin</span>
                </li>
            </ul>
            <h2 className="text-2xl font-semibold text-center mb-6">Add Admin Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <div className="flex flex-col">
                    <label htmlFor="firstName" className="text-lg font-medium mb-2">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={adminFormData.firstName}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter First Name"
                        required
                    />
                </div>

                {/* Last Name */}
                <div className="flex flex-col">
                    <label htmlFor="lastName" className="text-lg font-medium mb-2">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={adminFormData.lastName}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter Last Name"
                        required
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label htmlFor="email" className="text-lg font-medium mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={adminFormData.email}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter Email"
                        required
                    />
                </div>

                {/* Admin Type */}
                <div className="flex flex-col">
                    <label htmlFor="category" className="text-lg font-medium mb-2">Select Admin Type</label>
                    <Select
                        placeholder="Select an option"
                        options={adminTypes}
                        isSearchable={false}
                        onChange={handleSelectedCategories}
                        value={adminFormData.role ? { value: adminFormData.role, label: adminFormData.role } : null}
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                    <label htmlFor="password" className="text-lg font-medium mb-2">Password</label>
                    <div className="relative">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            name="password"
                            value={adminFormData.password}
                            onChange={handleChange}
                            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                            placeholder="Enter Password"
                            required
                        />
                        {adminFormData.password.length > 0 && (
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {passwordVisible ? <FaEye size={24} /> : <FaEyeSlash size={24} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="text-lg font-medium mb-2">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={adminFormData.confirmPassword}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                        placeholder="Confirm Password"
                        required
                    />
                </div>

                {/* Submit Button */}
                {/* <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={loading} // Disable button during loading
                        className={`bg-primary text-white font-semibold py-2 px-6 rounded-lg transition duration-300 `}
                    >
                      Add Admin
                    </button>
                </div> */}

<div className="flex justify-center">
    <button
        type="submit"
        disabled={loading} // Disable button during loading
        className={`${
            loading ? "opacity-50 cursor-not-allowed" : ""
        } bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out`}
    >
        {loading ? (
            <span className="flex items-center gap-2">
                <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.577 1.031 4.911 2.709 6.707l1.291-1.416z"
                    ></path>
                </svg>
                Loading...
            </span>
        ) : (
            "Add Admin"
        )}
    </button>
</div>



            </form>
        </div>
    );
};

export default AddAdmin;
