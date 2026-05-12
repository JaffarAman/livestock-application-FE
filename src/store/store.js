import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import branchReducer from './slices/branchSlice';
import userReducer from './slices/userSlice';
import batchReducer from './slices/batchSlice';
import allocationReducer from './slices/allocationSlice';
import dashboardReducer from './slices/dashboardSlice';
import inventoryReducer from './slices/inventorySlice';
import slaughterReducer from './slices/slaughterSlice';
import processReducer from './slices/processSlice';
import reportReducer from './slices/reportSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    branch: branchReducer,
    user: userReducer,
    batch: batchReducer,
    allocation: allocationReducer,
    dashboard: dashboardReducer,
    inventory: inventoryReducer,
    slaughter: slaughterReducer,
    process: processReducer,
    report: reportReducer,

  },
});
