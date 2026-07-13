import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setListings, setCurrentListing, setLoading, setError } from "../redux/slices/listingSlice.js";
import { listingService } from "../services/listing.service.js";

export const useListings = () => {
  const dispatch = useDispatch();
  const { listings, currentListing, pagination, filters, loading } = useSelector(s => s.listings);

  const fetchListings = useCallback(async (params = {}) => {
    dispatch(setLoading(true));
    try {
      const { data } = await listingService.getAll(params);
      dispatch(setListings({ listings: data.data.listings, pagination: data.pagination }));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to fetch listings"));
    } finally { dispatch(setLoading(false)); }
  }, [dispatch]);

  const fetchListingById = useCallback(async (id) => {
    dispatch(setLoading(true));
    try {
      const { data } = await listingService.getById(id);
      dispatch(setCurrentListing(data.data.listing));
      return data.data.listing;
    } catch (err) {
      toast.error("Listing not found");
      return null;
    } finally { dispatch(setLoading(false)); }
  }, [dispatch]);

  const createListing = async (formData) => {
    try {
      const { data } = await listingService.create(formData);
      toast.success("Listing created! 🏠");
      return data.data.listing;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create listing");
      return null;
    }
  };

  const deleteListing = async (id) => {
    try {
      await listingService.delete(id);
      toast.success("Listing deleted");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete listing");
      return false;
    }
  };

  return { listings, currentListing, pagination, filters, loading, fetchListings, fetchListingById, createListing, deleteListing };
};
