// Redux store setup
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import submissionsSlice from './submissionsSlice';

export default configureStore({
  reducer: {
    auth: authSlice,
    submissions: submissionsSlice,
  },
});