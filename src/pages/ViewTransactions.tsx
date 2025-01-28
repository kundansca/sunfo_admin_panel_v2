import React, { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../extra/PageLoader';
import ExportButtons from '../components/ExportButtons';
import { useSelector } from 'react-redux';

const ViewTransactions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {role}=useSelector((state:any)=>{
        return state.auth.userData;
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [recordsData, setRecordsData] = useState<any[]>([  
       
    ]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [initialRecords, setInitialRecords] = useState<any[]>([ 
        
    //     {
    //     _id:"1234525",
    //    username:"Demo",
    //    transactionID:"TXN123456789",
    //    paymentDate:"	25 Dec 2024, 10:00 AM",
    //    amount:"₹1800 (Product ₹1500 + Tax ₹300)",
    //    paymentMethod:"UPI (Google Pay)",
    //    accountHolderName:"Kundan",
    //    paymentStatus:"Success",
    //    refundStatus:"Not Applicable"
    // },
    // {   _id:"1235687",
    //     username:"Demo2",
    //     transactionID:"TXN123456874",
    //    paymentDate:"	30 Dec 2023, 11:55 PM",
    //    amount:"₹1800 (Product ₹1300 + Tax ₹200)",
    //    accountHolderName:"chandan",
    //    paymentMethod:"UPI (Phone Pay)",
    //    paymentStatus:"Failed",
    //    refundStatus:"Not Applicable"
    // }
]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

    useEffect(() => {
        dispatch(setPageTitle('Advanced Table'));
    }, [dispatch]);


    const fetchTransactionsData = async () => {
        setIsLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
            const response = await axios(`${apiUrl}/orders/getAllOrders`);
            console.log(response.data);
            const transcations = response.data.orders;
            setInitialRecords(transcations);
            setRecordsData(transcations.slice(0, pageSize)); // Show paginated data
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error Transaction Data"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactionsData();
    }, []);


    const rowData = [
       
    ]

   let amount=[0,0];

    const calculateAmount=(products:any)=>{
        let total=0;
        let gst=0;
        products.forEach((product:any)=>{
          total+=product.subtotal
          gst+=product.tax;

        });
       amount[0]=total,
       amount[1]=gst;

    return amount;
    }


    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(initialRecords.slice(from, to)); // Correct paginated data
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        const data = initialRecords.sort((a, b) => {
            return sortStatus.direction === 'asc' ? a.id - b.id : b.id - a.id;
        });
        setInitialRecords(data);
        setPage(1);
    }, [sortStatus, initialRecords]);

    




       

    const deleteTransaction= async (id: string) => {
        const results = await Swal.fire({
            title: "Are you sure you want to delete this transaction?",
            showDenyButton: true,
            denyButtonText: "Cancel",
            confirmButtonText: "Confirm",
        });

        if (results.isConfirmed) {
            setIsLoading(true);
            const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
            try {
              
                Swal.fire({
                    icon: "success",
                    title: "Transaction Deleted",
                    text: "The transaction has been successfully removed.",
                });
                setRecordsData((prevRecords) => prevRecords.filter((record) => record._id !== id));
            } catch (error: any) {
                Swal.fire({
                    icon: "error",
                    title: error.response?.data?.message || "An error occurred, please try again.",
                });
            } finally {
                setIsLoading(false);
            }
        } else if (results.isDenied) {
            await Swal.fire({ title: "No changes made.", text: "", icon: "info" });
        }
    };

    const gotToInvoicePage = (id: string) => {
        navigate(`/invoice/${id}`);
    };

    return (
        <>
            {isLoading ? (
                <PageLoader loading={isLoading} />
            ) : (
                <div>
                    <div className="panel mt-6">
                        <h5 className="font-semibold text-lg dark:text-white-light mb-5">Advanced</h5>
                        <ExportButtons />
                        <div className="datatables">
                            <DataTable
                                noRecordsText="No records available"
                                highlightOnHover
                                className="whitespace-nowrap table-hover"
                                records={recordsData}
                                columns={[
                                    {
                                        accessor: 'username',
                                        title: 'User Name',
                                        render: ({firstName,lastName }) => <div>{firstName+" "+lastName}</div>,
                                    },
                                    {
                                        accessor: 'email',
                                        title: 'Email',
                                        render: ({email }) => <div>{email}</div>,
                                    },
                                   
                                    {
                                        accessor: 'transactionID',
                                        title: 'Transaction ID',
                                        render: ({paymentDetails}) => <div>{paymentDetails?.razorpay_payment_id}</div>,
                                    },
                                    {
                                        accessor: 'paymentStatus',
                                        title: 'Payment Status:',
                                        render: ({ paymentDetails}) => <div>{paymentDetails?.paymentStatus}</div>,
                                    },
                                    {
                                        accessor: 'amount',
                                        title: 'Total Amount',
                                        render: ({products }) => <div>₹{calculateAmount(products)[0]+calculateAmount(products)[1]} (Product ₹{calculateAmount(products)[0]} + Tax ₹{calculateAmount(products)[1]})</div>,
                                    },
                                    {
                                        accessor: 'paymentMethod',
                                        title: 'Payment Method',
                                        render: ({paymentDetails }) => <div>{paymentDetails?.paymentType}</div>,
                                    },
                                    // {
                                    //     accessor: 'accountHolderName',
                                    //     title: 'Account Holder Name',
                                    //     render: ({accountHolderName }) => <div>{accountHolderName}</div>,
                                    // },
                                    {
                                        accessor: 'paymentDate',
                                        title: 'Payment Date:',
                                        render: ({createdAt }) => <div>{new Date(createdAt).toLocaleDateString()}</div>,
                                    },
                                    // {
                                    //     accessor: 'refundStatus',
                                    //     title: 'Refund Status ',
                                    //     render: ({ refundStatus}) => <div>{refundStatus}</div>,
                                    // },
                                   
                                    
                                    
                                  
                                    
                                    
                                    
                                    
                                    
                                    
                                    {
                                        accessor: 'id',
                                        title: 'Action',
                                        render: ({ razorpay_order_id,_id }) => (
                                            <div className="flex space-x-2">
                                                <button
                                                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                                    onClick={() => gotToInvoicePage(razorpay_order_id)}
                                                >
                                                    View Details
                                                </button>
                                                {role==="super-admin" &&
                                                <button
                                                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                                    onClick={() => deleteTransaction(_id)}
                                                >
                                                    Delete
                                                </button>
                                               }
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

export default ViewTransactions;