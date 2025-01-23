import React, { useState } from 'react';
import axios from 'axios';

export default function Checkout() {
    const [billingFormData, setBillingFormData] = useState<any>({
        firstname: "",
        lastname: "",
        billCompany: "",
        country: "",
        address: "",
        apt: "",
        city: "",
        state: "",
        postalCode: "",
        cellPhone: "",
        email: "",
    });
    const [isChecked, setIsChecked] = useState<any>(false);
    const [stateAndAddress, setStateAndAddress] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<any>({
        firstname: "",
        lastname: "",
        country: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        cellPhone: "",
        email: ""
    });
    const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState<any>(false);

    const handleBillingData = (event: any) => {
        const { name, value } = event.target;
        setBillingFormData({ ...billingFormData, [name]: value });

        // Check postal code and fetch state and address data
        if (name === "postalCode" && value.length >= 6) {
            fetchStateAndAddress(`https://api.zippopotam.us/IN/${value}`);
        }

        // Reset error messages for the field
        setErrorMessage({
            ...errorMessage,
            [name]: value ? "" : `${name} field is required`,
        });
    };

    const handleCheckBoxChange = () => {
        setIsChecked(!isChecked);
    };

    const formSubmit = (event: any) => {
        event.preventDefault();
        
        const { firstname, lastname, country, address, city, state, postalCode, cellPhone, email } = billingFormData;

        // Validate if fields are empty
        const errors = { ...errorMessage };
        let hasError = false;

        if (!firstname) {
            errors.firstname = "First name is required";
            hasError = true;
        }
        if (!lastname) {
            errors.lastname = "Last name is required";
            hasError = true;
        }
        if (!country) {
            errors.country = "Country is required";
            hasError = true;
        }
        if (!address) {
            errors.address = "Address is required";
            hasError = true;
        }
        if (!city) {
            errors.city = "City is required";
            hasError = true;
        }
        if (!state) {
            errors.state = "State is required";
            hasError = true;
        }
        if (!postalCode) {
            errors.postalCode = "Postal code is required";
            hasError = true;
        }
        if (!cellPhone) {
            errors.cellPhone = "Cell phone is required";
            hasError = true;
        }
        if (!email) {
            errors.email = "Email is required";
            hasError = true;
        }

        if (hasError) {
            setErrorMessage(errors);
            return; // Stop submission if there are validation errors
        }

        // If all fields are valid, proceed with form submission (console log in this case)
        console.log(billingFormData);
    };

    const fetchStateAndAddress = async (endpoint: string) => {
        try {
            let response = await axios.get(endpoint);
            setStateAndAddress(response.data);
        } catch (error) {
            console.error("Error fetching state and address:", error);
        }
    };


  return (
    <div>
   
 


      <div id="site-main" className="site-main">
        <div id="main-content" className="main-content">
          <div id="primary" className="content-area">
            <div id="title" className="page-title">
              <div className="section-container">
                <div className="content-title-heading">
                  <h1 className="text-title-heading">
                    Checkout
                  </h1>
                </div>
                <div className="breadcrumbs">
                  <a href="index.html">Home</a><span className="delimiter" /><a href="shop-grid-left.html">Shop</a><span className="delimiter" />Checkout
                </div>
              </div>
            </div>
            <div id="content" className="site-content" role="main">
              <div className="section-padding">
                <div className="section-container p-l-r">
                  <div className="shop-checkout">
                    <form name="checkout" method="post" className="checkout" action="#" autoComplete="off">
                      <div className="row">
                        <div className="col-xl-8 col-lg-7 col-md-12 col-12">
                          <div className="customer-details">
                            <div className="billing-fields">
                              <h3>Billing Information</h3>
                              <div className="billing-fields-wrapper">
                                <p className="form-row form-row-first validate-required">
                                  <label>First Name <span className="required" title="required">*</span></label>
                                  <span className="input-wrapper"><input type="text" className="input-text" name="firstname" onChange={handleBillingData} /></span>
                                  
                                  <span className='text-danger mt-3'>{errorMessage.firstname}</span>
                                </p>
                                
                                <p className="form-row form-row-last validate-required">
                                  <label>Last Name <span className="required" title="required">*</span></label>
                                  <span className="input-wrapper"><input type="text" className="input-text" name="lastname"  onChange={handleBillingData}/></span>

                                  {
                                    billingFormData.firstname==="" && isSubmitButtonClicked===true ?<span className="text-danger mt-3">{errorMessage.firstname}</span>:null
                                   }

                                </p>
                                <p className="form-row form-row-wide">
                                  <label>Bill Company<span className="optional">(optional)</span></label>
                                  <span className="input-wrapper"><input type="text" className="input-text" name="billCompany"/></span>
                                </p>
                                <p className="form-row form-row-wide validate-required">
                                  <label>Country<span className="required" title="required">*</span></label>
                                  <span className="input-wrapper" onChange={handleBillingData}>
                                    <select name="country" className="country-select custom-select">
                                      <option value="">Select a country / region…</option>
                                      <option value="AF">Afghanistan</option>
                                      <option value="AX">Åland Islands</option>
                                      <option value="AL">Albania</option>
                                      <option value="DZ">Algeria</option>
                                      <option value="AS">American Samoa</option>
                                      <option value="AD">Andorra</option>
                                    </select>
                                  </span>
                                </p>
                                <p className="form-row address-field validate-required form-row-wide">
                                  <label>Address <span className="required" title="required">*</span></label>
                                  <span className="input-wrapper">
                                    <input type="text" className="input-text" name="address" onChange={handleBillingData} />
                                  </span>
                                  {
                                    billingFormData.firstname==="" && isSubmitButtonClicked===true ? <span className="text-danger mt-3">{errorMessage.firstname}</span>:null
                                   }
                                </p>
                                <p className="form-row address-field form-row-wide">
                                  <label>Apt/Bldg&nbsp;<span className="optional">(optional)</span></label>
                                  <span className="input-wrapper">
                                    <input type="text" className="input-text" name="apt" onChange={handleBillingData}/>
                                  </span>
                                </p>
                                <p className="form-row address-field validate-required form-row-wide">
                                  <label htmlFor="billing_city" className="">City <span className="required" title="required">*</span></label>
                                  <span className="input-wrapper">
                                    <input type="text" className="input-text" name="city" onChange={handleBillingData}/>
                                  </span>
                                  {
                                    billingFormData.firstname==="" && isSubmitButtonClicked===true ? <span className="text-danger mt-3">{errorMessage.firstname}</span>:null
                                   }
                                </p>
                                <p className="form-row address-field validate-required validate-state form-row-wide">
                                  <label>State<span className="required" title="required">*</span></label>
                                  <span className="input-wrapper">
                                    <select name="state" className="state-select custom-select" onChange={handleBillingData}>
                                      <option value="">Select a state / county…</option>
                                      <option value="VN">Vinnytsia Oblast</option>
                                      <option value="VL">Volyn Oblast</option>
                                      <option value="DP">Dnipropetrovsk Oblast</option>
                                      <option value="DT">Donetsk Oblast</option>
                                      <option value="ZT">Zhytomyr Oblast</option>
                                    </select>
                                  </span>
                                </p>
                                <p className="form-row address-field validate-required validate-postcode form-row-wide">
                                  <label>ZI / Postcode  <span className="required" title="required">*</span></label>
                                  <span className="input-wrapper">
                                    <input type="text" className="input-text" name="billing_postcode"  onChange={handleBillingData}/>
                                  </span>
                                  {
                                    billingFormData.firstname==="" && isSubmitButtonClicked===true ? <span className="text-danger mt-3">{errorMessage.firstname}</span>:null
                                   }
                                </p>
                                <p className="form-row form-row-wide validate-required validate-phone">
                                  <label>CellPhone <span className="required" title="required">*</span></label>
                                  <span className="input-wrapper">
                                    <input type="tel" className="input-text" name="cellPhone" onChange={handleBillingData}/>
                                    {
                                    billingFormData.firstname.length===10 && isSubmitButtonClicked===true ? <span className="text-danger mt-3">{errorMessage.firstname}</span>:null
                                   }
                                  </span>
                                </p>
                                <p className="form-row form-row-wide validate-required validate-email">
                                  <label>Email Address <span className="required" title="required">*</span></label>
                                  <span className="input-wrapper">
                                    <input type="email" className="input-text" name="email" autoComplete="off" onChange={handleBillingData}/>
                                    {
                                    billingFormData.firstname==="" && isSubmitButtonClicked===true ? <span className="text-danger mt-3">{errorMessage.firstname}</span>:null
                                   }
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="account-fields">
                              <p className="form-row form-row-wide">
                                <label className="checkbox">
                                  <input className="input-checkbox" type="checkbox" name="createaccount" defaultValue={1} /> 
                                  <span>Create an account?</span>
                                </label>
                              </p>
                              <div className="create-account">
                                <p className="form-row validate-required">
                                  <label>Create account password <span className="required" title="required">*</span></label>
                                  <span className="input-wrapper password-input">
                                    <input type="password" className="input-text" name="account_password" autoComplete="off" />
                                    <span className="show-password-input" />
                                  </span>
                                </p>								
                                <div className="clear" />
                              </div>
                            </div>
                          </div>
                          <div className="shipping-fields">
                            <p className="form-row form-row-wide ship-to-different-address">
                              <label className="checkbox">
                                <input className="input-checkbox" type="checkbox" name="ship_to_different_address" onChange={handleCheckBoxChange} checked={isChecked}/> 
                                <span>Send me Exclusive Deals And More From Fat Brain Toys.</span>
                              </label>
                            </p>
                            {isChecked===true &&

                            <div className="shipping-address">
                              <p className="form-row form-row-first validate-required">
                                <label>First name <span className="required" title="required">*</span></label>
                                <span className="input-wrapper">
                                  <input type="text" className="input-text" name="shipping_first_name" />
                                </span>
                              </p>
                              <p className="form-row form-row-last validate-required">
                                <label>Last name <span className="required" title="required">*</span></label>
                                <span className="input-wrapper">
                                  <input type="text" className="input-text" name="shipping_last_name"/>
                                </span>
                              </p>
                              <p className="form-row form-row-wide">
                                <label>Company name <span className="optional">(optional)</span></label>
                                <span className="input-wrapper">
                                  <input type="text" className="input-text" name="shipping_company"/>
                                </span>
                              </p>
                              <p className="form-row form-row-wide address-field validate-required">
                                <label htmlFor="shipping_country" className="">Country / Region <span className="required" title="required">*</span></label>
                                <span className="input-wrapper">
                                  <select name="billing_state" className="state-select custom-select">
                                    <option value="">Select a country / region…</option>
                                    <option value="VN">Vinnytsia Oblast</option>
                                    <option value="VL">Volyn Oblast</option>
                                    <option value="DP">Dnipropetrovsk Oblast</option>
                                    <option value="DT">Donetsk Oblast</option>
                                    <option value="ZT">Zhytomyr Oblast</option>
                                  </select>
                                </span>
                              </p>
                              <p className="form-row address-field validate-required form-row-wide">
                                <label>Street address <span className="required" title="required">*</span></label>
                                <span className="input-wrapper">
                                  <input type="text" className="input-text" name="shipping_address_1"/>
                                </span>
                              </p>
                              <p className="form-row address-field form-row-wide">
                                <label>Apartment, suite, unit, etc. <span className="optional">(optional)</span></label>
                                <span className="input-wrapper">
                                  <input type="text" className="input-text" name="shipping_address_2" placeholder="Apartment, suite, unit, etc. (optional)"  />
                                </span>
                              </p>
                              <p className="form-row address-field validate-required form-row-wide">
                                <label>Town / City <span className="required" title="required">*</span></label>
                                <span className="input-wrapper"><input type="text" className="input-text" name="shipping_city"/></span>
                              </p>
                              <p className="form-row address-field validate-required validate-state form-row-wide">
                                <label htmlFor="shipping_state" className="">State / County <span className="required" title="required">*</span></label>
                                <span className="input-wrapper">
                                  <select name="billing_state" className="state-select custom-select">
                                    <option value="">Select a state / county…</option>
                                    <option value="VN">Vinnytsia Oblast</option>
                                    <option value="VL">Volyn Oblast</option>
                                    <option value="DP">Dnipropetrovsk Oblast</option>
                                    <option value="DT">Donetsk Oblast</option>
                                    <option value="ZT">Zhytomyr Oblast</option>
                                  </select>
                                </span>
                              </p>
                              <p className="form-row address-field validate-required validate-postcode form-row-wide">
                                <label>Postcode / ZIP <span className="required" title="required">*</span></label>
                                <span className="input-wrapper">
                                  <input type="text" className="input-text" name="shipping_postcode"/>
                                </span>
                              </p>
                            </div>
                             }
                          </div>
                          <div className="additional-fields">
                            <p className="form-row notes">
                              <label>Order notes <span className="optional">(optional)</span></label>
                              <span className="input-wrapper">
                                <textarea name="order_comments" className="input-text" placeholder="Notes about your order, e.g. special notes for delivery." rows={2} cols={5} defaultValue={""} />
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="col-xl-4 col-lg-5 col-md-12 col-12">
                          <div className="checkout-review-order">
                            <div className="checkout-review-order-table">
                              <h3 className="review-order-title">Product</h3>
                              <div className="cart-items">
                                <div className="cart-item">
                                  <div className="info-product">
                                    <div className="product-thumbnail">
                                      <img width={600} height={600} src="media/product/3.jpg" alt="" />					
                                    </div>
                                    <div className="product-name">
                                      Twin Hoops
                                      <strong className="product-quantity">QTY : 2</strong>											
                                    </div>
                                  </div>
                                  <div className="product-total">
                                    <span>$300.00</span>
                                  </div>
                                </div>
                                <div className="cart-item">
                                  <div className="info-product">
                                    <div className="product-thumbnail">
                                      <img width={600} height={600} src="media/product/1.jpg" alt="" />					
                                    </div>
                                    <div className="product-name">
                                      Medium Flat Hoops
                                      <strong className="product-quantity">QTY : 1</strong>											
                                    </div>
                                  </div>
                                  <div className="product-total">
                                    <span>$180.00</span>
                                  </div>
                                </div>
                              </div>
                              <div className="cart-subtotal">
                                <h2>Subtotal</h2>
                                <div className="subtotal-price">
                                  <span>$480.00</span>
                                </div>
                              </div>
                              <div className="shipping-totals shipping">
                                <h2>Shipping</h2>
                                <div data-title="Shipping">
                                  <ul className="shipping-methods custom-radio">
                                    <li>
                                      <input type="radio" name="shipping_method" data-index={0} defaultValue="free_shipping" className="shipping_method" /><label>Free shipping</label>
                                    </li>
                                    <li>
                                      <input type="radio" name="shipping_method" data-index={0} defaultValue="flat_rate" className="shipping_method" /><label>Flat rate</label>					
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="order-total">
                                <h2>Total</h2>
                                <div className="total-price">
                                  <strong>
                                    <span>$480.00</span>
                                  </strong> 
                                </div>
                              </div>
                            </div>
                            <div id="payment" className="checkout-payment">
                              <ul className="payment-methods methods custom-radio">
                                <li className="payment-method">
                                  <input type="radio" className="input-radio" name="payment_method" defaultValue="bacs" />
                                  <label htmlFor="payment_method_bacs">Direct bank transfer</label>
                                  <div className="payment-box">
                                    <p>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                                  </div>
                                </li>
                                <li className="payment-method">
                                  <input type="radio" className="input-radio" name="payment_method" defaultValue="cheque" />
                                  <label>Check payments</label>
                                  <div className="payment-box">
                                    <p>Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.</p>
                                  </div>
                                </li>
                                <li className="payment-method">
                                  <input type="radio" className="input-radio" name="payment_method" defaultValue="cod" />
                                  <label>Cash on delivery</label>
                                  <div className="payment-box">
                                    <p>Pay with cash upon delivery.</p>
                                  </div>
                                </li>
                                <li className="payment-method">
                                  <input type="radio" className="input-radio" name="payment_method" defaultValue="paypal" />
                                  <label>PayPal</label>
                                  <div className="payment-box">
                                    <p>Pay via PayPal; you can pay with your credit card if you don’t have a PayPal account.</p>
                                  </div>
                                </li>
                              </ul>
                              <div className="form-row place-order">
                                <div className="terms-and-conditions-wrapper">
                                  <div className="privacy-policy-text" />
                                </div>
                                <button type="button" className="button alt" value="Place order" onChange={formSubmit}>Place order</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>{/* #content */}
          </div>{/* #primary */}
        </div>{/* #main-content */}
      </div>
  
  


     </div>
  
  
);


}
