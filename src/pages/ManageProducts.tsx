
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import React,{ useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import ReactApexChart from 'react-apexcharts';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import IconBell from '../components/Icon/IconBell';
import IconStar from '../components/Icon/IconStar';
import ExportButtons from '../components/ExportButtons';
import axios from "axios";
import PageLoader from '../extra/PageLoader';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';

const ManageProducts = () => {
    const [isLoading,setIsLoading]=useState<any>(false);

   
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const {role}=useSelector((state:any)=>{
       return  state.auth.userData;
    });

    let response=null;
  
    
    useEffect(() => {

        
        dispatch(setPageTitle('Manage Products'));
});


let apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
let apiImage=import.meta.env.VITE_REACT_APP_IMAGE_API_URL;
const deletePrdouct=async (id:any)=>{
  console.log("id="+id);


  const results = await Swal.fire({
    title: "Do you want to delete this product",
    showDenyButton: true,
    denyButtonText: "Cancel",
    confirmButtonText: "Confirm",
  });

  if (results.isConfirmed) {
    setIsLoading(true);
 

    try{
        await axios.delete(`${apiUrl}/products/${id}`);
       
        Swal.fire({
          icon: "success",
          title: "Deleted Successfully",
          text: "Product has been removed from the list.",
      });
      setRecordsData((prevRecords:any) => prevRecords.filter((record:any) => record._id !== id));
      

    }catch(error:any){
      Swal.fire({
          icon: "error",
          title:"Failed To Delete This Product"
         
        
        });
    }finally{
      setIsLoading(false);
    }
    
}else if(results.isDenied) {
        await Swal.fire({ title: "No changes made.", text: "", icon: "info" });
      }




}


    // const rowData = [];
    const rowData: any[] = [];

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
            const from = (page - 1) * pageSize;
            const to = from + pageSize;
            setRecordsData(initialRecords.slice(from, to)); // Correct paginated data
        }, [page, pageSize, initialRecords]);
    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);

   
   

  
    async  function fetchProductData(){
        setIsLoading(true);
        let apiBaseUrl= import.meta.env.VITE_REACT_APP_API_URL;

        try{
           response= await axios(`${apiBaseUrl}/products`);
             console.log("ManageProducts");
               console.log(response.data);
              
        //    setRecordsData(response.data); 
           const products = response.data;
           setInitialRecords(products); // Update initial records
           setRecordsData(products.slice(0, pageSize)); // Show paginated data
   
        
          

      }catch(error){
        console.error("Error fetching product data:", error);
        Swal.fire({
            icon: "error",
            title: "Error fetching product data"
           
          
          });
      

      }finally{
        setIsLoading(false);
      }

}
useEffect(() => {
    fetchProductData();
}, []);
function gotToProductEdit(slugTitle:string){
    navigate(`/edit-product/${slugTitle}`);


}


    return (
        <div>
           <PageLoader loading={isLoading}/>
           
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3">Documentation: </span>
                <a href="https://www.npmjs.com/package/mantine-datatable" target="_blank" className="block hover:underline">
                    https://www.npmjs.com/package/mantine-datatable
                </a>
            </div>
            <div className="panel mt-6">


             <ExportButtons/>




                <h5 className="font-semibold text-lg dark:text-white-light mb-5">Advanced</h5>
                <div className="datatables">
            <DataTable
                noRecordsText="No results match your search query"
                highlightOnHover
                className="whitespace-nowrap table-hover"
                records={recordsData}
                columns={[
                 

                    {
                        accessor: 'productImage',
                        title: 'Image',
                        render: ({ productImage }) => (
                            <img
                                src={`${apiImage}${productImage}`}
                                alt="product"
                                className="w-12 h-12 rounded-md max-w-none"
                                // onError={(e) => {
                                //     const target = e.target as HTMLImageElement;
                                //     target.src = 'https://via.placeholder.com/150';
                                //   }}
                            />
                        ),
                    },
                    {
                        accessor: 'title',
                        title: 'Title',
                        render: ({ title }) => <div>{title}</div>, // Render Title
                    },
                    
                    {
                        accessor: 'productCode',
                        title: 'Product Code',
                        render: ({ productCode }) => <div>{productCode || 'N/A'}</div>, // Render Product Code
                    },
                    {
                        accessor: 'brand',
                        title: 'Brand',
                        render: ({ brand }) => <div>{brand || 'Unknown'}</div>, // Render Brand (if available)
                    },
                   
                    {
                        accessor: 'sellingPrice',
                        title: 'Price',
                        render: ({ sellingPrice}) => <div>{sellingPrice || 'N/A'}</div>, // Render Price (if available)
                    },


                    {
                        accessor: '_id',
                        title: 'Action',
                        render: ({_id,slugTitle}) => (
                            <div className="flex space-x-2">
                                <button
                                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 text-md"
                                    onClick={() => gotToProductEdit(slugTitle)}
                                >
                                    Edit
                                </button>

                            {role==="super-admin" &&
                                <button
                            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 text-md"
                            onClick={()=>{deletePrdouct(_id)}}
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
    );
};

export default ManageProducts;
