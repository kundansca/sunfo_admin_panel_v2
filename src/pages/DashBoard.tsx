import { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';

import IconMultipleForwardRight from '../components/Icon/IconMultipleForwardRight';
import { FaBox, FaClipboardList, FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function DashBoard() {
    // const stats = [
    //     { label: "Paid Orders", value: 52, bgColor: "bg-red-500" },
    //     { label: "Orders", value: 47, bgColor: "bg-blue-500" },
    //     { label: "Products", value: 382, bgColor: "bg-green-500" },
    //     { label: "COD Orders", value: 156, bgColor: "bg-yellow-500" },
    //   ];
    const navigate=useNavigate();


   const [recentOrders,setRecentOrders]=useState<any>([]);
   const [laoding,setIsloading]=useState<any>(false);
   const [totalOrders,setTotalOrders]=useState();

   const stats = [
    { label: "Paid Orders", value: totalOrders, icon: <FaMoneyBillWave />, bgColor: "bg-red-500" },
    { label: "Orders", value:totalOrders , icon: <FaClipboardList />, bgColor: "bg-blue-500" },
    { label: "Products", value: 382, icon: <FaBox />, bgColor: "bg-green-500" },
    { label: "Transaction", value: totalOrders, icon: <FaShoppingCart />, bgColor: "bg-yellow-500" },
  ];


    


   
    

    //   const recentOrders = [
    //     { customer: "Luke Ivory", product: "Headphone", orderId: "#46894", price: "$56.07", status: "Paid", statusBg: "bg-success", avatar: "/assets/images/profile-6.jpeg" ,orderDate:"15-06-2024"},
    //     { customer: "Andy King", product: "Nike Sport", orderId: "#76894", price: "$126.04", status: "Shipped", statusBg: "bg-secondary", avatar: "/assets/images/profile-7.jpeg" ,orderDate:"15-06-2024"},
    //     { customer: "Laurie Fox", product: "Sunglasses", orderId: "#66894", price: "$56.07", status: "Paid", statusBg: "bg-success", avatar: "/assets/images/profile-8.jpeg" ,orderDate:"15-06-2024"},
    //     { customer: "Ryan Collins", product: "Sport", orderId: "#75844", price: "$110.00", status: "Shipped", statusBg: "bg-secondary", avatar: "/assets/images/profile-9.jpeg",orderDate:"15-06-2024"},
    //     { customer: "Irene Collins", product: "Speakers", orderId: "#46894", price: "$56.07", status: "Paid", statusBg: "bg-success", avatar: "/assets/images/profile-10.jpeg",orderDate:"15-06-2024"},
    //   ];



      const recentTranscations = [
        {
            _id:"1234525",
           username:"Demo",
           transactionID:"TXN123456789",
           paymentDate:"	25 Dec 2024, 10:00 AM",
           amount:"₹1800 (Product ₹1500 + Tax ₹300)",
           paymentMethod:"UPI (Google Pay)",
           accountHolderName:"Kundan",
           paymentStatus:"Success",
           refundStatus:"Not Applicable"
        },
        {   _id:"1235687",
            username:"Demo2",
           transactionID:"TXN123456874",
           paymentDate:"	30 Dec 2023, 11:55 PM",
           amount:"₹1800 (Product ₹1300 + Tax ₹200)",
           accountHolderName:"chandan",
           paymentMethod:"UPI (Phone Pay)",
           paymentStatus:"Failed",
           refundStatus:"Not Applicable"
        }
      ];
      const fetchOrderData = async () => {
        setIsloading(true);
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
            const response = await axios.get(`${apiUrl}/orders/getAllOrders`);
            console.log("order data");
            console.log(response.data);
          let orders=response.data.orders;
          setTotalOrders(orders.length);
          if(orders.length>5){
            orders=(orders.slice(orders.length-6));
        }

             orders =orders.map((order: any) => ({
                _id: order._id,
                orderId: order.razorpay_order_id,
                date: new Date(order.createdAt).toLocaleDateString(),
                username: `${order.firstName} ${order.lastName}`,
                mobile: order.mobile,
                title: order.products[0]?.title || 'N/A',
                productImage: order.products[0]?.productImage || '',
                paymentStatus: order.paymentDetails?.paymentStatus || 'Pending',
                totalAmount: order?.total,
                transactionId:order?.paymentDetails?.razorpay_payment_id,
                paymentDetails:order?.paymentDetails,
                paymentDate:new Date(order?.updatedAt).toLocaleString(),


              
            }));
           
            setRecentOrders(orders);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching orders',
            });
        } finally {
            setIsloading(false);
        }
    };
   useEffect(()=>{
   fetchOrderData();


   },[])


  



      let ordersFormateTable=recentOrders.map((order:any)=>{

        return (
        <>
        <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
        <td className="min-w-[150px] text-black dark:text-white">
        <div className="flex items-center">
            {/* <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-6.jpeg" alt="avatar" /> */}
            <span className="whitespace-nowrap">{order.username}</span>
        </div>
    </td>
    
    <td className="text-[#1f2937]">{order.mobile}</td>
    <td className="text-[#1f2937]">{order.orderId}</td>
    <td className="text-[#1f2937]">{order.date}</td>
    {/* <td>
        <Link to="/apps/invoice/preview">#46894</Link>
    </td> */}
    <td className="text-[#1f2937]">{order.totalAmount}</td>
    <td>
        <span className={`badge bg-success shadow-md dark:group-hover:bg-transparent text-md px-5 py-2`}>{order.paymentStatus}</span>
    </td>
</tr>
</>
        );


      });


    let   transactionFormateTable=recentOrders.map((transaction:any)=>{

        return (
            <>
            <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
            <td className="min-w-[150px] text-black dark:text-white">
            <div className="flex items-center">
                {/* <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-6.jpeg" alt="avatar" /> */}
                <span className="whitespace-nowrap">{transaction.username}</span>
            </div>
        </td>
        <td className="text-[#1f2937]">{transaction?.paymentDetails?.razorpay_payment_id}</td>
        <td className="text-[#1f2937]">{transaction.paymentDate}</td>
        <td className="text-[#1f2937]">{transaction.totalAmount}</td>
        <td className="text-[#1f2937]">{transaction?.paymentDetails?.paymentType}</td>
        {/* <td className="text-[#1f2937]">{transaction.accountHolderName}</td> */}
     
        <td className="text-[#1f2937]">{transaction?.paymentDetails?.paymentStatus}</td>

        {/* <td>
            <Link to="/apps/invoice/preview">#46894</Link>
        </td> */}
     
        {/* <td>
            <span className={`badge ${order.statusBg} shadow-md dark:group-hover:bg-transparent text-md px-5 py-2`}>{order.status}</span>
        </td> */}
    </tr>
    </>
            );
    

    });
    
    
  return (
    <>
    
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 mb-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg text-white shadow-md flex items-center space-x-4 ${stat.bgColor}`}
        >
          <div className="text-4xl">{stat.icon}</div>
          <div>
            <h3 className="text-lg font-semibold">{stat.label}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>

    
    <div className="grid lg:grid-cols-1 grid-cols-1 gap-6">
                    <div className="panel h-full w-full">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Recent Orders</h5>
                        </div>
                        <div className="table-responsive">
                        
                            <table>
                                <thead>
                                    <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Customer</th>
                                        <th>Mobile</th>
                                        <th>Order Id</th>
                                      
                                        <th>Date</th>
                                        <th>Total Amount</th>
                                        <th className="ltr:rounded-r-md rtl:rounded-l-md">Payment Status</th>

                                    </tr>
                                </thead>
                                <tbody>
                                 


                                    {ordersFormateTable}
                                </tbody>
                            </table>
                        </div>
                   
                     {/* Button to redirect */}
            <div className="flex justify-center mt-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => navigate('/view-orders')}
                >
                    View All Orders
                </button>
            </div>
                   
                    </div>

                    <div className="panel h-full w-full">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">
                            React Transcription</h5>
                        </div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr className="border-b-0">
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Username</th>
                                        <th>Transaction Id</th>
                                        <th>Payment Date & Time</th>
                                        <th>Amount</th>
                                        <th>Payment Method</th>
                                        {/* <th>Account Holder Name</th> */}
                                        
                                        <th>Payment Status</th>
                                        {/* <th className="ltr:rounded-r-md rtl:rounded-l-md">Source</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                
                                    {
                                transactionFormateTable
                                    
                                    }
                                </tbody>
                            </table>
                        </div>



                            {/* Button to redirect */}
            <div className="flex justify-center mt-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => navigate('/view-transcations')}
                >
                    View All Transcription
                </button>
            </div>
                    </div>


                    
                </div>
            </>
  )
}
