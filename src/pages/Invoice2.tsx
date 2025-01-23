import React,{useState} from 'react'
// import "../../libs/bootstrap/css/bootstrap.min.css";

// import "../../libs/bootstrap/css/all.min.css";
import "./Invoice.css";
//@ts-ignore
import { toWords } from 'number-to-words';



export default function Invoice() {
  const [invoiceData,setInvoiceData]=useState<any>({
    transactionId:"TXN123456789",
    paymentDate:"25 Dec 2024, 10:00 AM",
    proudctName:"hp notebook",
    amount:25000,
    mode:"Online",

    

  });    
  return (
    <div className="container-fluid invoice-container p-4">
      {/* <div id="loader" className="d-none">
        <img src="../../assets/images/media/loader.svg" alt="Loading..." />
      </div> */}
      
      {/* Header */}
      <header className="mb-4">
        <div className="row align-items-center gy-3">
          <div className="col-sm-4 text-center text-sm-start">
            <img src="/assets/images/logo.jpeg" alt="Logo" className="img-fluid" width="190px" />
          </div>
          <div className="col-sm-4 text-center text-sm-start">
            <h2 className="fw-semibold" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>Transaction Invoice</h2>
          </div>
          {/* <div className="col-sm-4 text-center text-sm-end">
            <img id="logo qr_code" className="qr_code img-fluid" src="../../media/invoiceqrcode.png" title="QR Code" alt="QR Code" width="150px" />
          </div> */}
        </div>

        <div className="row align-items-center gy-3">
          <div className="col-sm-4 text-sm-start">
            <span><strong>IRN :</strong> a8165431fa267d6da3ca0fc55ea82a9</span><br />
            <span><strong>Ack No. :</strong> 172416019112450</span><br />
            <span><strong>Ack Date :</strong> 11-Nov-2024</span><br />
          </div>
        </div>
        <hr />
      </header>

      {/* Main Content */}
      <main>
        <div className="row">
          <div className="col-sm-5"><strong>Dated:</strong> <span className="invoice_date">{invoiceData.paymentDate}</span></div>
          <div className="col-sm-3"><strong>Mode:</strong> <span className="payment_mode">Online</span></div>
          <div className="col-sm-4 text-sm-end"> <strong>Transaction No:</strong>{invoiceData.transactionId}</div>
        </div>
        <hr />

        <div className="row">
          <div className="col-sm-4 text-sm-end order-sm-1">
            <i>Buyer (Bill to):</i>
            <address>
              <span className="bill_to_name"><strong>John Doe</strong></span><br />
              <span className="bill_to_company"><strong>ABC Corporation</strong></span><br />
              <span className="bill_to_address">1234 Elm St, City, Country</span><br />
              <span><strong>GSTIN/UIN:</strong> 1234ABCD5678EFGH</span><br />
              <span><strong>State Name:</strong> Maharashtra</span>
            </address>
          </div>

          <div className="col-sm-4">
            <strong>Sunfo CORPORATE TRAINING</strong>
            <address>
              Pocket 1, Flat No. 09, Sector 19<br />
              Dwarka, New Delhi, 110075.<br />
              <span><strong>GSTIN/UIN:</strong> 07AHIPK0486D1ZH</span><br />
              <span><strong>State Name:</strong> Delhi, Code: 07</span>
            </address>
          </div>

          <div className="col-sm-4 text-sm-end order-sm-1">
            <i>Consignee (Ship to):</i>
            <address>
              <span className="ship_to_company"><strong>XYZ Pvt Ltd</strong></span><br />
              <span className="ship_to_address">5678 Oak Rd, City, Country</span><br />
              <span><strong>GSTIN/UIN:</strong> 9876WXYZ1234LMNO</span><br />
              <span><strong>State Name:</strong> Tamil Nadu</span>
            </address>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered mb-0">
            <thead className="bg-light">
              <tr>
                <th className="text-center">SI No.</th>
                <th>Particulars</th>
                <th className="text-center">HSN/SAC</th>
                <th className="text-center">Rate</th>
                <th className="text-end">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">1</td>
                <td className="payment_type">{invoiceData.proudctName.toUpperCase()}</td>
                <td className="text-center">999511</td>
                <td className="text-end">₹{invoiceData.amount}</td>
                <td className="text-end">₹{invoiceData.amount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-responsive mt-4">
          <table className="table table-bordered mb-0">
            <tbody>
              <tr className="bg-light">
                <td className="text-end"><strong>Total Taxable Value :</strong></td>
                <td className="text-end sub_total">₹1000</td>
              </tr>
              <tr className="bg-light igst-row">
                <td className="text-end"><strong>Add IGST (18%) :</strong></td>
                <td className="text-end tax igst">₹180</td>
              </tr>
              <tr className="bg-light cgst-row">
                <td className="text-end"><strong>Add CGST (9%) :</strong></td>
                <td className="text-end tax cgst">₹90</td>
              </tr>
              <tr className="bg-light sgst-row">
                <td className="text-end"><strong>Add SGST (9%) :</strong></td>
                <td className="text-end tax sgst">₹90</td>
              </tr>
              <tr className="bg-light">
                <td className="text-end"><strong>Grand Total :</strong></td>
                <td className="text-end grand_total"><b>₹1360</b></td>
              </tr>
            </tbody>
          </table>

          <span><strong>Amount Chargeable (in words):</strong></span>
          <p className="text-1 amount_in_words" style={{fontSize:"50px"}}><strong>{toWords(invoiceData.amount)} Only</strong></p>
        </div>

        {/* <div className="row align-items-center gy-3 mt-4" style={{ border: "1px dashed grey" }}>
          <div className="col-sm-4 text-center text-sm-start">
            <span><strong>Transaction ID :</strong> 11-Nov-2024</span><br />
            <span><strong>Order ID :</strong> 11-Nov-2024</span><br />
            <span><strong>Payment Time :</strong> 16:30:27</span><br />
            <span><strong>Buyer Email :</strong> buyer@example.com</span><br />
            <span><strong>Buyer Phone :</strong> 123-456-7890</span>
          </div>
        </div> */}
      </main>

      {/* Footer */}
      <footer className="text-center mt-4">
        <p className="text-1"><strong>NOTE:</strong> This is a computer-generated receipt and does not require a physical signature.</p>
        <div className="btn-group btn-group-sm d-print-none">
          <a href="javascript:window.print()" className="btn btn-light border text-black-50 shadow-none">
            <i className="fa fa-print"></i> Print & Download
          </a>
        </div>
      </footer>
    </div>
  );
}
