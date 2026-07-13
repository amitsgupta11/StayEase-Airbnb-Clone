import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "./slices/authSlice.js";
import listingReducer from "./slices/listingSlice.js";
import bookingReducer from "./slices/bookingSlice.js";
import wishlistReducer from "./slices/wishlistSlice.js";
import uiReducer from "./slices/uiSlice.js";

const rootReducer = combineReducers({
  auth:     authReducer,
  listings: listingReducer,
  booking:  bookingReducer,
  wishlist: wishlistReducer,
  ui:       uiReducer,
});

const persistConfig = { key:"root", storage, whitelist:["auth","ui"] };
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck:{ ignoredActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER] } }),
});

export const persistor = persistStore(store);
