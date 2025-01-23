import React, { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../extra/PageLoader';
import ExportButtons from '../components/ExportButtons';

const ViewOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { role } = useSelector((state: any) => state.auth.userData);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });
    let apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
let apiImage=import.meta.env.VITE_REACT_APP_IMAGE_API_URL;

    useEffect(() => {
        dispatch(setPageTitle('View Orders'));
    }, [dispatch]);

    useEffect(() => {
        fetchOrderData();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);
    
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData((prev) => prev.slice(from, to)); // Correct paginated data
    }, [page, pageSize]);  // Removed recordsData from the dependency array

    const fetchOrderData = async () => {
        setIsLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
            const response = await axios.get(`${apiUrl}/orders/getAllOrders`);
            console.log("order data");
            console.log(response.data);
            const orders = response.data.orders.map((order: any) => ({
                _id: order._id,
                orderId: order._id,
                date: new Date(order.createdAt).toLocaleDateString(),
                username: `${order.firstName} ${order.lastName}`,
                mobile: order.mobile,
                title: order.products[0]?.title || 'N/A',
                productImage: order.products[0]?.productImage || '',
                orderStatus: order.paymentDetails?.paymentStatus || 'Pending',
                totalAmount: order.total,
            }));
            setRecordsData(orders);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching orders',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const deleteOrder = async (id: string) => {
        const result = await Swal.fire({
            title: 'Do you want to delete this Order?',
            showDenyButton: true,
            denyButtonText: 'Cancel',
            confirmButtonText: 'Confirm',
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
            try {
                await axios.delete(`${apiBaseUrl}/orders/deleteOrder/${id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Order Deleted',
                });
                setRecordsData((prev) => prev.filter((record) => record._id !== id));
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: error.response?.data?.message || 'An error occurred',
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const goToOrderEdit = (id: string) => {
        navigate(`/invoice/${id}`);
    };

    return (
        <>
            {isLoading ? (
                <PageLoader loading={isLoading} />
            ) : (
                <div>
                    <div className="panel mt-6">
                        <h5 className="font-semibold text-lg dark:text-white-light mb-5">View Orders</h5>
                        <ExportButtons />
                        <div className="datatables">
                            <DataTable
                                noRecordsText="No orders available"
                                highlightOnHover
                                className="whitespace-nowrap table-hover"
                                records={recordsData}
                                columns={[
                                    {
                                        accessor: 'productImage',
                                        title: 'Product Image',
                                        render: ({ productImage }) => (
                                            <img
                                                src={`${apiImage}${productImage}` || 'https://via.placeholder.com/150'}
                                                alt="Product"
                                                className="w-12 h-12 rounded-md max-w-none"
                                            />
                                        ),
                                    },
                                    {
                                        accessor: 'title',
                                        title: 'Product Name',
                                    },
                                    {
                                        accessor: 'username',
                                        title: 'Customer Name',
                                    },
                                    {
                                        accessor: 'mobile',
                                        title: 'Mobile',
                                    },
                                    {
                                        accessor: 'date',
                                        title: 'Order Date',
                                    },
                                    {
                                        accessor: 'orderId',
                                        title: 'Order Id',
                                    },
                                   
                                    
                                   
                                    
                                    {
                                        accessor: 'orderStatus',
                                        title: 'Order Status',
                                        render: ({orderStatus}) => {
                                            let statusColor;
                                            switch (orderStatus) {
                                                case 'Paid':
                                                    statusColor = 'bg-green-500 text-white';
                                                    break;
                                                case 'Pending':
                                                    statusColor = 'bg-yellow-500 text-black';
                                                    break;
                                                case 'Cancelled':
                                                    statusColor = 'bg-red-500 text-white';
                                                    break;
                                                default:
                                                    statusColor = 'bg-gray-500 text-white';
                                                    break;
                                            }
                                    
                                            return (
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${statusColor}`}
                                                >
                                                    {orderStatus}
                                                </span>
                                            );
                                        },
                                    },
                                    {
                                        accessor: 'totalAmount',
                                        title: 'Total Amount',
                                        render: ({ totalAmount }) => (
                                            <span className='text-center'>
                                                ₹{totalAmount}
                                            </span>
                                        ),
                                    },
                                    {
                                        accessor: '_id',
                                        title: 'Actions',
                                        render: ({ _id }) => (
                                            <div className="flex space-x-2">
                                                <button
                                                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                                    onClick={() => goToOrderEdit(_id)}
                                                >
                                                    View Details
                                                </button>
                                                {role === 'super-admin' && (
                                                    <button
                                                        className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                                        onClick={() => deleteOrder(_id)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        ),
                                    },
                                ]}
                                totalRecords={recordsData.length}
                                recordsPerPage={pageSize}
                                page={page}
                                onPageChange={setPage}
                                recordsPerPageOptions={[10, 20, 50]}
                                onRecordsPerPageChange={setPageSize}
                                paginationText={({ from, to, totalRecords }) =>
                                    `Showing ${from} to ${to} of ${totalRecords} entries`
                                }
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewOrders;
