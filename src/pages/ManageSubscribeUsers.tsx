import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import ExportButtons from '../components/ExportButtons';
import PageLoader from '../extra/PageLoader';
import Swal from 'sweetalert2';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

// Define the type for the record
interface SubscriberRecord {
    _id: string;
    email: string;
    isSubscribed: boolean;
    subscribedAt: string;
}

const ManageSubscribeUsers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Manage Subscribes'));
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<SubscriberRecord[]>([]);

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
        let apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
        try {
            const response = await axios(`${apiBaseUrl}/subscribers/getAllSubscribers`);
            setRecordsData(response.data.data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error fetching review data"
            });
        } finally {
            setIsLoading(false);
        }
    };

    async function deleteSubscriber(id: any) {
        const results = await Swal.fire({
            title: "Do you want to delete this subscriber",
            showDenyButton: true,
            denyButtonText: "Cancel",
            confirmButtonText: "Confirm",
        });

        if (results.isConfirmed) {
            setIsLoading(true);
            let apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;

            try {
                await axios.delete(`${apiBaseUrl}/subscribers/${id}`);
                Swal.fire({
                    icon: "success",
                    title: "Deleted Successfully",
                    text: "The subscriber has been removed from the list.",
                });
                setRecordsData((prevRecords: any) => prevRecords.filter((record: any) => record._id !== id));
            } catch (error: any) {
                Swal.fire({
                    icon: "error",
                    title: "Unable to Delete Subscriber"
                });
            } finally {
                setIsLoading(false);
            }
        } else if (results.isDenied) {
            await Swal.fire({ title: "No changes made.", text: "", icon: "info" });
        }
    }

    useEffect(() => {
        fetchReviewData();
    }, []);

    return (
        <div>
            <PageLoader loading={isLoading} />

            <div className="panel mt-6">
                <ExportButtons />

                <h5 className="font-semibold text-lg dark:text-white-light mb-5">Manage Subscribe Users</h5>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'email',
                                title: 'Email',
                                render: (record: SubscriberRecord) => <div>{record.email}</div>,
                            },
                            {
                                accessor: 'isSubscribed',
                                title: 'IsSubscribed',
                                render: (record: SubscriberRecord) => <div>{record.isSubscribed ? "Yes" : "No"}</div>,
                            },
                            {
                                accessor: 'subscribedAt',
                                title: 'Subscribed At',
                                render: (record: SubscriberRecord) => {
                                    const dateObj = new Date(record.subscribedAt);
                                    const isValidDate = !isNaN(dateObj.getTime());
                                    const formattedDate = isValidDate ? dateObj.toLocaleDateString() : 'Invalid Date';
                                    return <div>{formattedDate}</div>;
                                },
                            },
                            {
                                accessor: '_id',
                                title: 'Actions',
                                render: (record: SubscriberRecord) => (
                                    <div className="flex space-x-2">
                                        <button
                                            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                            onClick={() => deleteSubscriber(record._id)}
                                        >
                                            Delete
                                        </button>
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
    );
};

export default ManageSubscribeUsers;
