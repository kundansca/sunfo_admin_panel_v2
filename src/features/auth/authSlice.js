// authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


// Initial state
const initialState = {
  userData: JSON.parse(localStorage.getItem("userData")) || null,
  isAuth: !!localStorage.getItem("userData"),
  loading: false,
  error: null,
  errorComponent:''
 
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, thunkapi) => {
   
   try {
    const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const response = await axios.post(`${apiBaseUrl}/auth/adminLogin`, loginData);

    return response.data;
  } catch (error) {
    // Error handle 
    
    
    const errorMessage = error.response?.data?.message || "Login failed";
    


    // Error ko thunkapi.rejectWithValue ke through pass karen
    return thunkapi.rejectWithValue({ message: errorMessage });
  }
}











  

  
);





export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (token, thunkapi) => {
    console.log("token in logout page");
   console.log(token);
   try {
    const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const response = await axios.post(`${apiBaseUrl}/auth/logout`,{},{
      headers:{
        Authorization:`Bearer ${token.token}`
      }
    });
    console.log("logout response");
    console.log(response.data);
    console.log(response.data);

    return response.data
  } catch (error) {
    // Error handle 
    
    
    const errorMessage = error.response?.data?.message || "Something went wrong";
    


    // Error ko thunkapi.rejectWithValue ke through pass karen
    return thunkapi.rejectWithValue({ message: errorMessage });
  }
}

);















// Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorComponent='';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action);
        let {email,firstName,lastName,profileImage,token}=action.payload;
         
         
          state.loading = false;
        state.error=null;
        state.userData = {email,firstName,lastName,profileImage,token,role:action.payload.session.role};

         localStorage.setItem("userData",JSON.stringify({email,firstName,lastName,profileImage,token,role:action.payload.session.role}));
         state.isAuth = true;
       
        
      })
      .addCase(loginUser.rejected, (state, action) => {
       
        state.loading = false;
        state.error = action.payload.message || "An unknown error occurred";
        state.errorComponent="login"



       
      }).addCase(logoutUser.pending, (state) => {
          state.loading = true;
        state.error = null;
        state.errorComponent=''
      }).addCase(logoutUser.fulfilled,(state)=>{
        state.userData=null,
        state.loading=false,
        state.isAuth=false,
        localStorage.removeItem("userData");
        
      }).addCase(logoutUser.rejected,(state,action)=>{
         state.loading=false,
         state.error=action.payload.message || "An unknown error occurred";
         state.errorComponent="logout"
      });
  },
});

// Export logout action
export const { logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
