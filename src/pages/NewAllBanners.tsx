import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../extra/PageLoader';
import ExportButtons from '../components/ExportButtons';


const NewAllBanners = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { role } = useSelector((state: any) => {
        return state.auth.userData;
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [initialRecords, setInitialRecords] = useState<any[]>([]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

    let apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
let apiImage=import.meta.env.VITE_REACT_APP_IMAGE_API_URL;

    useEffect(() => {
        dispatch(setPageTitle('Manage Banners'));
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
            const response = await axios(`${apiUrl}/getAllBanners`);
            const banners = response.data.banners;
            setInitialRecords(banners);
            setRecordsData(banners.slice(0, pageSize)); // Show paginated data
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error fetching Banner Data"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBanner = async (id: string) => {
        const results = await Swal.fire({
            title: "Do you want to delete this Banner?",
            showDenyButton: true,
            denyButtonText: "Cancel",
            confirmButtonText: "Confirm",
        });

        if (results.isConfirmed) {
            setIsLoading(true);
            const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
            try {
                await axios.delete(`${apiBaseUrl}/deleteBanner/${id}`);
                Swal.fire({
                    icon: "success",
                    title: "Deleted Successfully",
                    text: "The Banner has been removed from the list.",
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

    function handlePrint() {
        window.print();
    }

    return (
        <>
            {isLoading ? (
                <PageLoader loading={isLoading} />
            ) : (
                <div className="overflow-x-auto">
  <div className="panel mt-6">
    <h5 className="font-semibold text-lg dark:text-white-light mb-5">All Banners</h5>

    <ExportButtons tableData={recordsData} excelHeading={["Banner Image", "Title", "Description"]} excelKey={["bannerImg", "title", "description"]} />

    <div className="datatables" id="printable-table">
      <DataTable
        noRecordsText="No records available"
        highlightOnHover
        className="whitespace-nowrap table-hover"
        records={recordsData}
        columns={[
          {
            accessor: 'bannerImg',
            title: 'Banner Image',
            render: ({ bannerImg }) => (
              <img
                src={`${apiImage}/uploads/${bannerImg}`}
                alt="Banner"
                className="w-15 h-14 rounded-md max-w-none"
                // onError={(e) => {
                //   const target = e.target as HTMLImageElement;
                //   target.src = 'https://via.placeholder.com/150';
                // }}
              />
            ),
          },
          {
            accessor: 'title',
            title: 'Title',
            render: ({ title }) => <div>{title}</div>,
          },
          {
            accessor: 'description',
            title: 'Description',
            render: ({ description }) => (
              <div className="max-h-24 sm:max-h-32 md:max-h-40 overflow-y-auto whitespace-normal scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-300">
                {String(description)}
              </div>
            ),
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
                {role === "super-admin" && (
                  <button
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => deleteBanner(_id)}
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

export default NewAllBanners;
