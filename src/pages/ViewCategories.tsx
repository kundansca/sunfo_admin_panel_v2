import React from 'react'
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import ReactApexChart from 'react-apexcharts';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import IconBell from '../components/Icon/IconBell';
import IconStar from '../components/Icon/IconStar';
import axios from 'axios';
import ExportButtons from '../components/ExportButtons';
import PageLoader from '../extra/PageLoader';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';
const ViewCategories = () => {
    const [isLoading,setIsloading]=useState<any>(false);
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const {role}=useSelector((state:any)=>{
        return state.auth.userData;
    });
    let apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
let apiImage=import.meta.env.VITE_REACT_APP_IMAGE_API_URL;

    useEffect(() => {
        dispatch(setPageTitle('View Categories'));
    });

    const rowData:any[] = [
       
    ];

   
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    // useEffect(() => {
    //     const from = (page - 1) * pageSize;
    //     const to = from + pageSize;
    //     setRecordsData([...initialRecords.slice(from, to)]);
    // }, [page, pageSize, initialRecords]);


    useEffect(() => {
        const from = (page - 1) * pageSize; // Starting index of current page
        const to = from + pageSize; // Ending index of current page
        setRecordsData(initialRecords.slice(from, to)); // Set paginated data
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);


    
   

   
  


  

    async  function fetchCategories(){
    console.log(recordsData);
        setIsloading(true);
      


        try{

          
           let response= await axios(`${apiUrl}/categories`);
             console.log(response.status);
            console.log("response");
            console.log(response.data);
              
        //    setRecordsData(response.data); 
      
        const categories = response.data;
        setInitialRecords(categories); // Update initial records
        setRecordsData(categories.slice(0, pageSize)); // Show paginated data

        
          

      }catch(error){
       
        Swal.fire({
            icon: "error",
            title: "Error fetching categories"
           
          
          });
      

      }finally{
      
        setIsloading(false);
      }





    
}


async function deleteCategory(id:any){
   
    const results = await Swal.fire({
        title: "Do you want to delete this Category",
        showDenyButton: true,
        denyButtonText: "Cancel",
        confirmButtonText: "Confirm",
      });

      if (results.isConfirmed) {
        setIsloading(true);
        let apiBaseUrl= import.meta.env.VITE_REACT_APP_API_URL;

        try{
             await axios.delete(`${apiBaseUrl}/categories/${id}`);
           
            Swal.fire({
              icon: "success",
              title: "Deleted Successfully",
              text: "The Category has been removed from the list.",
          });
          setRecordsData((prevRecords:any) => prevRecords.filter((record:any) => record._id !== id));
          
  
        }catch(error:any){
          Swal.fire({
              icon: "error",
              title:error.response.data.message
             
            
            });
        }finally{
          setIsloading(false);
        }
        
    }else if(results.isDenied) {
            await Swal.fire({ title: "No changes made.", text: "", icon: "info" });
          }
    



}
function gotToEditCategory(id:String){
    navigate(`/edit-category/${id}`);
    
}


useEffect(() => {
    fetchCategories();
}, []);

    return (
        <>
        <PageLoader loading={isLoading}/>
       {isLoading===false&&<><div>

            
             

            {/* <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3">Documentation: </span>
                <a href="https://www.npmjs.com/package/mantine-datatable" target="_blank" className="block hover:underline">
                    https://www.npmjs.com/package/mantine-datatable
                </a>
            </div> */}
            <div className="panel mt-6">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">View Categories</h5>
                <ExportButtons/>
                <div className="datatables">
            <DataTable
                noRecordsText="No records available"
                highlightOnHover
                className="whitespace-nowrap table-hover"
                records={recordsData}
                columns={[
                    {
                        accessor: 'image',
                        title: 'Image',
                        render: ({image}) => (
                        
                            <img
                                src={`${apiImage}${image}`}
                                alt="product"
                                className="w-12 h-12 rounded-md max-w-none"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/150';
                                  }}
                            />
                        ),
                    },
                    {
                        accessor: 'name',
                        title: 'Name',
                        render: ({ name }) => <div>{name}</div>, // Render name
                    },
                    {
                        accessor: 'isVisibleOnNavbar',
                        title: 'Show On Navbar',
                        render: ({isVisibleOnNavbar}) => <div>{String(isVisibleOnNavbar)}</div>, // Render name
                    },
                 

                    
                   
                    
                    
                   
                   
                    


                    {
                        accessor: '_id',
                        title: 'Action',
                        render: ({_id}) => (
                            <div className="flex space-x-2">
                                <button
                                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                    onClick={() => gotToEditCategory(_id)}
                                >
                                    Edit
                                </button>
                            {role==="super-admin" &&
                                <button
                            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                           onClick={()=>{
                           deleteCategory(_id)
                           }}
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
        </>
    }
        </>
    );
};

export default ViewCategories;

