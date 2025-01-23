import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
//@ts-ignore;
import authReducer from "../features/auth/authSlice.js";

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    auth: authReducer,
   
});

export default configureStore({
    reducer: rootReducer,

  
});

export type IRootState = ReturnType<typeof rootReducer>;
