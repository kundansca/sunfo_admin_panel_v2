import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import ExportButtons from '../components/ExportButtons';
import PageLoader from '../extra/PageLoader';
import Swal from 'sweetalert2';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import {useSelector} from 'react-redux'

const ManageReviews = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { role } = useSelector((state: any) => {
        return state.auth.userData;
    });
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Manage Reviews'));
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    // const [recordsData, setRecordsData] = useState<any>([]);

    const rowData: any[] = [];
    let apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    let apiImage=import.meta.env.VITE_REACT_APP_IMAGE_API_URL;


      const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    const renderStars = (rating: any) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - Math.ceil(rating);

        return (
            <div className="flex">
                {[...Array(fullStars)].map((_, index) => (
                    <FaStar key={`full-${index}`} className="text-yellow-500" />
                ))}
                {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
                {[...Array(emptyStars)].map((_, index) => (
                    <FaRegStar key={`empty-${index}`} className="text-yellow-500" />
                ))}
            </div>
        );
    };

    const fetchReviewData = async () => {
        setIsLoading(true);
      
        try {
            const response = await axios(`${apiUrl}/reviews/getAllReviews`);
            console.log('Manage Reviews response data');
            console.log(response.data);

            // setRecordsData(response.data.reviews);


            const reviews = response.data.reviews;
            setInitialRecords(reviews); // Update initial records
            setRecordsData(reviews.slice(0, pageSize)); // Show paginated data








        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching review data',
            });
        } finally {
            setIsLoading(false);
        }
    };

    async function deleteReview(id: any) {
        const results = await Swal.fire({
            title: 'Do you want to delete this review',
            showDenyButton: true,
            denyButtonText: 'Cancel',
            confirmButtonText: 'Confirm',
        });

        if (results.isConfirmed) {
            setIsLoading(true);

            try {
                const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
                let response = await axios.delete(`${apiUrl}/reviews/${id}`);

                Swal.fire({
                    icon: 'success',
                    title: 'Deleted Successfully',
                    text: 'The review has been removed from the list.',
                });
                setRecordsData((prevRecords: any) =>
                    prevRecords.filter((record: any) => record._id !== id)
                );
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.message,
                });
            } finally {
                setIsLoading(false);
            }
        } else if (results.isDenied) {
            await Swal.fire({ title: 'No changes made.', text: '', icon: 'info' });
        }
    }

    useEffect(() => {
        fetchReviewData();
    }, []);

    // const handleSortChange = (columnAccessor: string) => {
    //     const newSortStatus = {
    //         columnAccessor,
    //         direction: sortStatus.direction === 'asc' ? 'desc' : 'asc',
    //     };
    //     setSortStatus(newSortStatus);
    // };

    const columns:any[] = [
        {
            accessor: 'user.profilePhoto',
            title: 'Image',
            render: ({user }: any) => (
                <img
                    src={user?.profilePhoto || 'https://via.placeholder.com/150'}
                    alt="profile Image"
                    className="w-12 h-12 rounded-md max-w-none"
                />
            ),
        },
        {
            accessor: 'product.title',
            title: 'Title',
            render: ({ product }: any) => <div>{product?.title || 'N/A'}</div>,
        },
        {
            accessor: 'product.productCode',
            title: 'Product Code',
            render: ({ product }: any) => <div>{product?.productCode || 'N/A'}</div>,
        },
        {
            accessor: 'user.username',
            title: 'Reviewed by',
            render: ({ user }: any) => <div>{user?.username || 'Anonymous'}</div>,
        },
        {
            accessor: 'createdAt',
            title: 'Created At',
            render: ({ createdAt }: any) => {
                const dateObj = new Date(createdAt);
                const isValidDate = !isNaN(dateObj.getTime());
                const formattedDate = isValidDate ? dateObj.toLocaleDateString() : 'Invalid Date';
                return <div>{formattedDate}</div>;
            },
        },
        {
            accessor: 'comment',
            title: 'Comment',
            render: ({ comment }: any) => <div
            className="max-w-[200px] max-h-[80px] overflow-auto whitespace-pre-wrap break-words"
        >
            {comment || 'No Comment'}
        </div>,
        },
        {
            accessor: 'rating',
            title: 'Rating',
            render: ({ rating }: any) => (
                <div>{rating ? renderStars(rating) : 'No Rating'}</div>
            ),
        },
        ...(role === 'super-admin'
            ? [
                  {
                      accessor: 'product._id',
                      title: 'Actions',
                      render: ({ _id }: any) => (
                          <div className="flex space-x-2">
                              <button
                                  className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                  onClick={() => deleteReview(_id)}
                              >
                                  Delete
                              </button>
                          </div>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <div>
            <PageLoader loading={isLoading} />

            <div className="panel mt-6">
                <ExportButtons />

                <h5 className="font-semibold text-lg dark:text-white-light mb-5">
                    Manage Reviews
                </h5>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={columns}
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
    );
};



export default ManageReviews;
