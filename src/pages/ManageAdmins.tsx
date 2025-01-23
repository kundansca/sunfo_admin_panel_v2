import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../extra/PageLoader';
import ExportButtons from '../components/ExportButtons';


const ManageAdmins = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
     const {role}=useSelector((state:any)=>{
        return state.auth.userData;
     });
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [initialRecords, setInitialRecords] = useState<any[]>([]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

    useEffect(() => {
        dispatch(setPageTitle('Manage Admins'));
    }, [dispatch]);

    useEffect(() => {
        fetchBannerData();
    }, []);

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

    const fetchBannerData = async () => {
        setIsLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
            const response = await axios(`${apiUrl}/admin/getAllUsers`);

            
            setInitialRecords(response.data.data);
            setRecordsData(response.data.data.slice(0, pageSize)); // Show paginated data
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error fetching Admin Data"
            });
        } finally {

            setIsLoading(false);
          
        }
    };

    const deleteAdmin = async (id: string) => {
        const results = await Swal.fire({
            title: "Do you want to delete this Admin?",
            showDenyButton: true,
            denyButtonText: "Cancel",
            confirmButtonText: "Confirm",
        });

        if (results.isConfirmed) {
            setIsLoading(true);
            const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
         
            try {
                await axios.delete(`${apiBaseUrl}/deleteUserById/${id}`);
                Swal.fire({
                    icon: "success",
                    title: "Deleted Successfully",
                    text: "The Admin has been removed from the list.",
                });
                setRecordsData((prevRecords) => prevRecords.filter((record) => record._id !== id));
            } catch (error: any) {
                Swal.fire({
                    icon: "error",
                    title: error.response?.data?.message || "An error occurred",
                });
            } finally {
                setIsLoading(false);
            }
        } else if (results.isDenied) {
            await Swal.fire({ title: "No changes made.", text: "", icon: "info" });
        }
    };

    const gotToBannerEdit = (id: string) => {
        navigate(`/edit-banner/${id}`);
    };
     
    return (
        <>
            {isLoading ? (
                <PageLoader loading={isLoading} />
            ) : (
                <div>
                    <div className="panel mt-6">
                        <h5 className="font-semibold text-lg dark:text-white-light mb-5">All Banners</h5>
                    
                        <ExportButtons  tableData={recordsData} excelHeading={["Banner Image","Title","Description"]} excelKey={["bannerImg","title","description"]}/>
                        <div className="datatables" id='printable-table'>
                            <DataTable
                                noRecordsText="No records available"
                                highlightOnHover
                                className="whitespace-nowrap table-hover"
                                records={recordsData}
                               
                                columns={[
                                    {
                                        accessor: '',
                                        title: 'profilePhoto',
                                        render: ({ profilePhoto }) => (
                                            <img
                                                src={profilePhoto}
                                                alt="Banner"
                                                className="w-12 h-12 rounded-md max-w-none"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://via.placeholder.com/150';
                                                  }}
                                            />
                                        ),
                                    },
                                    
                                    {
                                        accessor: 'FullName',
                                        title: 'Name',
                                        render: ({ firstName,lastName }) => <div>{firstName} {lastName}</div>,
                                    },
                                   
                                    {
                                        accessor: 'email',
                                        title: 'Email',
                                        render: ({ email }) => <div>{email}</div>,
                                    },


                                    {
                                        accessor: 'role',
                                        title: 'Role',
                                        render: ({ role }) => <div>{role}</div>,
                                    },


                                    {
                                        accessor: 'isAccountVerified',
                                        title: 'IsAccountVerified',
                                        render: ({ isAccountVerified }) => <div>{String(isAccountVerified)}</div>,
                                    },

                                    {
                                        accessor: '_id',
                                        title: 'Action',
                                        render: ({ _id }) => (
                                            <div className="flex space-x-2">
                                                <button
                                                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                                    onClick={() => gotToBannerEdit(_id)}
                                                >
                                                    Edit
                                                </button>
                                                {role==="super-admin" &&
                                                <button
                                                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                                    onClick={() => deleteAdmin(_id)}
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

export default ManageAdmins;
