import React, { useEffect,useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Navigate} from 'react-router-dom';
import axios from 'axios';
import {logoutUser} from "../features/auth/authSlice"; 


export default function Protected(props) {
    const { userData, isAuth } = useSelector((state) => state.auth);
    const [isTokenVerified,setIsTokenVerfied]=useState(false);
    const dispatch=useDispatch();

    useEffect(() => {
        async function tokenValidation() {
            try {
            
                let apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
                     await axios.post(
                    `${apiBaseUrl}/auth/isAuthenticated`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${userData.token}` },
                    }
                );
                setIsTokenVerfied(true)
              
              
            } catch (error) {
              dispatch(logoutUser());
              return <Navigate to="/login" />;
            
            }
        }

        if (isAuth===true) {
            tokenValidation();
         
        }
    
        
    }, [isAuth]);

    if (isAuth === false) {
        return <Navigate to="/login" />;
    }
    if(isTokenVerified===true){
      return props.children;
    }

   
}
