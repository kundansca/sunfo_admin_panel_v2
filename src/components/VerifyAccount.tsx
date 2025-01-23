import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
 import axios from 'axios';
 import { useNavigate } from 'react-router-dom';
 import PageLoader from '../extra/PageLoader';
import Swal from 'sweetalert2';

export default function VerifyAccount() {
    const [isLoading,setIsLoading]=useState<Boolean>(false);
    const navigate=useNavigate();
       const {token}=useParams();

 
    

    const validateAccount=async ()=>{
        setIsLoading(true);
         try{
          const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
     
            let response=await axios.post(`${apiBaseUrl}/verify-account/${token}`);
        
            Swal.fire({
                icon: 'success',
                title: response.data.message,
                confirmButtonText: 'OK',
            }).then((result)=>{
                if(result.isConfirmed){
                  navigate("/login",{replace:true});
                    
                }

            });
        
             
         }catch(error:any){
          await Swal.fire({
            icon: 'error',
            title: error.response.data.message,
            confirmButtonText: 'OK',
        }).then((result)=>{
            if(result.isConfirmed){
              navigate("/login",{replace:true});
                
            }

        });
         

         }finally{
            setIsLoading(false);

         }


    }
    useEffect(()=>{
        validateAccount();

    },[token])
  return (
   <>
   <PageLoader laoding={isLoading}/>
   
   </>
  )
}
