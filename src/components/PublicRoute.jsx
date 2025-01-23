import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
export default function PublicRoute(props) {
   const {isAuth} = useSelector((state) => state.auth);
   if(isAuth==true){
    return  <Navigate to={"/"} />
   }
   return props.children;
 
}
