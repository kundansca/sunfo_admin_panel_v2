import React, { useEffect, useState } from 'react';
import "./Invoice.css";
import logo from '../../public/assets/images/logo.jpeg';
import { useParams } from 'react-router-dom';
import axios from 'axios';
//@ts-ignore
import { toWords } from 'number-to-words'
import Swal from 'sweetalert2';
const Invoice = () => {
  const [isLoading,setIsLoading]=useState<Boolean>(false);
    let {orderId}=useParams();
   
    const [data,setData]=useState<any>();
  const handlePrint = () => {
    window.print();
  };
    
  useEffect(() => {
    document.title = "Invoice";
  });

  let total=0,tax=0;
  let apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

   data?.products.forEach((product:any)=>{
        total+=product.total;
        tax+=product.tax;

   });

  const fetchInvoiceData=async()=>{
    setIsLoading(true);
    try{
   
    let response=await axios.get(`${apiUrl}/orders/${orderId}`);
    console.log("invoice data");
    console.log(response.data);
    setData(response.data.orderData);
    }catch(error:any){
         
     Swal.fire({
                  icon: "error",
                  title:error.response.data.message
                 
                
                });

    }finally{

     setIsLoading(false);
    }

  

   }

   useEffect(() => {
  
    fetchInvoiceData();  // fetchInvoiceData ko yahan call karein
  }, [orderId]);

  return (
    
    <div className="p-4 bg-gray-50 min-h-screen print">
      {/* Outer Container */}
      <div className="max-w-5xl mx-auto bg-white shadow-md border rounded-lg">
        {/* Header */}

        <div className="grid grid-cols-1 md:grid-cols-2 items-center border-b p-4 text-center md:text-left">
  {/* Logo */}
  <div className="flex justify-center md:justify-start mb-4 md:mb-0">
    <img
      src={logo} // Apne logo ka URL yahaan dalen
      alt="Company Logo"
      className="h-16 w-16 object-contain"
    />
  </div>

  {/* Title and Subtitle */}
  <div>
    <h1 className="text-2xl font-bold text-center lg:text-right">Invoice</h1>
    <p className="text-sm italic text-center lg:text-right">(Original for Recipient)</p>
  </div>
</div>
        
       


        {/* <div className="text-center border-b p-4">
          <h1 className="text-2xl font-bold">Tax Invoice/Bill of Supply/Cash Memo</h1>
          <p className="text-sm italic">(Original for Recipient)</p>
        </div> */}

        {/* Seller and Billing Details */}
        <div className="p-4 border-b text-sm grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-2">
          <div>
            <p><strong>Sold By:</strong></p>
            <p>Appario Retail Private Ltd</p>
            <p>LGF, Plot No 89, C/o En Pointe Adwisers LLP</p>
            <p>Sector 44, Gurgaon, Haryana, 122003, IN</p>
            <div className='mt-5'>
              <p><strong>PAN No:</strong> AALCA0171E</p>
              <p><strong>GST Registration No:</strong> 06AALCA0171E1Z3</p>
            </div>
          </div>
          <div>
            <p><strong>Billing Address:</strong></p>
            <p>{data?.firstName} {data?.lastName}</p>
            <p>{data?.address}</p>
            <p>City-{data?.city}, KALYANPUR, {data?.state}, {data?.postalCode},{data?.country}</p>
          </div>
          <div>
            <p><strong>Shipping Address:</strong></p>
            <p>{data?.firstName} {data?.lastName}</p>
            <p>{data?.shippingAddress}</p>
            <p>City-{data?.shippingCity}, KALYANPUR, {data?.state}, {data?.shippingPostalCode},{data?.shippingCountry}</p>
          </div>
        </div>

        {/* Invoice and Order Details */}
        <div className="p-4 border-b text-sm grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
          <div>
            <p><strong>Order Number:</strong> {data?.razorpay_order_id}</p>
            <p><strong>Order Date:</strong>{new Date(data?.createdAt).toLocaleString()}</p>
          </div>
          <div>
          <p><strong>Payment Type:</strong> {data?.paymentDetails?.paymentType}</p>
            <p><strong>Payment Status:</strong> {data?.paymentDetails?.paymentStatus}</p>
            
          </div>
        </div>

        {/* Product Table */}
        <div className="p-4 overflow-x-auto">
          <table className="table-auto w-full border-collapse border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Sl. No</th>
                <th className="border px-2 py-1">Description</th>
                {/* <th className="border px-2 py-1">Unit Price</th> */}
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Net Amount</th>
                {/* <th className="border px-2 py-1">Tax Rate</th> */}
                <th className="border px-2 py-1">Tax Amount</th>
                <th className="border px-2 py-1">Total Amount</th>
              </tr>
            </thead>
            <tbody>

              {data?.products.map((proudct:any,index:any)=>{
                 return  <tr>
                 <td className=" px-2 py-1 text-center">{index+1}</td>
                 <td className="border px-2 py-1">{proudct?.title}</td>
                 {/* <td className="border px-2 py-1 text-right">{proudct?.sellingPrice}</td> */}
                 <td className="border px-2 py-1 text-center">{proudct?.quantity}</td>
                 <td className="border px-2 py-1 text-right">₹{proudct?.sellingPrice}</td>
                 {/* <td className="border px-2 py-1 text-center">18%</td> */}
                 <td className="border px-2 py-1 text-right">₹{proudct?.tax}</td>
                 <td className="border px-2 py-1 text-right">₹{proudct?.total}</td>
               </tr>

              })}
              {/* <tr>
                <td className=" px-2 py-1 text-center">1</td>
                <td className="border px-2 py-1">Amazon Brand-Solimo Basic Case for Samsung Galaxy M33 5G</td>
                <td className="border px-2 py-1 text-right">₹117.80</td>
                <td className="border px-2 py-1 text-center">1</td>
                <td className="border px-2 py-1 text-right">₹117.80</td>
                <td className="border px-2 py-1 text-center">18%</td>
                <td className="border px-2 py-1 text-right">₹21.20</td>
                <td className="border px-2 py-1 text-right">₹139.00</td>
              </tr> */}
              {/* <tr>
              
                <td className=" border border-t-0 px-2 py-1">Shipping Charges</td>
                <td className="border border-t-0 px-2 py-1 text-right">₹33.90</td>
               
                <td className="border border-t-0 px-2 py-1 text-right">₹33.90</td>
                <td className="border border-t-0 px-2 py-1 text-center">18%</td>
                <td className="border border-t-0 px-2 py-1 text-right">₹6.10</td>
                <td className="border border-t-0 px-2 py-1 text-right">₹40.00</td>
              </tr> */}
              <tr>
                <td className="border-2 col-span-6 px-2 py-1 text-left text-lg" colSpan={4}><strong>Total</strong></td>
                <td className="border px-2 py-1 text-right">₹{tax}</td>
                <td className="border px-2 py-1 text-right">₹{total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Amount */}
        <div className="p-4 border-4 text-sm flex justify-start">
          <div>
            <p className='text-lg'><strong>Amount in Words:</strong></p>
            <p className='text-lg'><strong>{toWords(total)?.toUpperCase()}</strong></p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="p-4 border-t overflow-x-auto">
          <table className="table-auto w-full border-collapse border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Payment Transaction ID</th>
                <th className="border px-2 py-1">Date & Time</th>
                <th className="border px-2 py-1">Invoice Value</th>
                <th className="border px-2 py-1">Mode of Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">{data?.paymentDetails?.razorpay_payment_id}</td>
                <td className="border px-2 py-1">{new Date(data?.updatedAt)?.toLocaleString()}</td>
                <td className="border px-2 py-1">₹{total}</td>
                <td className="border px-2 py-1">{data?.paymentDetails?.paymentType}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center p-4 border-t">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
