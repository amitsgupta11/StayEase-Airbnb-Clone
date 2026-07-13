import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { listingService } from "../../services/listing.service.js";
import { PROPERTY_TYPES } from "../../utils/helpers.js";
import LoadingPage from "../../components/ui/LoadingPage.jsx";
import { useListings } from "../../hooks/useListings.js";

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentListing, loading, fetchListingById } = useListings();
  const { register, handleSubmit, reset, formState:{ errors } } = useForm();

  useEffect(() => {
    fetchListingById(id).then(listing => {
      if (listing) reset({
        title: listing.title, description: listing.description, propertyType: listing.propertyType,
        pricePerNight: listing.pricePerNight, cleaningFee: listing.cleaningFee,
        maxGuests: listing.maxGuests, bedrooms: listing.bedrooms, beds: listing.beds, bathrooms: listing.bathrooms,
        "location.city": listing.location?.city, "location.country": listing.location?.country,
        "location.state": listing.location?.state, "location.address": listing.location?.address,
      });
    });
  }, [id]);

  const onSubmit = async (data) => {
    try {
      await listingService.update(id, {
        ...data,
        location: { city:data["location.city"], country:data["location.country"], state:data["location.state"]||"", address:data["location.address"]||"" },
      });
      toast.success("Listing updated!");
      navigate("/host");
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <LoadingPage/>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold dark:text-white mb-8">Edit Listing</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="text-sm font-medium dark:text-white block mb-1">Title</label>
          <input className="input-field" {...register("title", { required:true, minLength:10 })}/>
          {errors.title && <p className="text-red-500 text-xs mt-1">Min 10 characters</p>}
        </div>
        <div>
          <label className="text-sm font-medium dark:text-white block mb-1">Description</label>
          <textarea className="input-field" rows={5} {...register("description", { required:true, minLength:20 })}/>
        </div>
        <div>
          <label className="text-sm font-medium dark:text-white block mb-1">Property Type</label>
          <select className="input-field" {...register("propertyType", { required:true })}>
            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium dark:text-white block mb-1">City</label>
            <input className="input-field" {...register("location.city", { required:true })}/>
          </div>
          <div>
            <label className="text-sm font-medium dark:text-white block mb-1">Country</label>
            <input className="input-field" {...register("location.country", { required:true })}/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium dark:text-white block mb-1">Price/night (₹)</label>
            <input type="number" className="input-field" {...register("pricePerNight", { required:true, valueAsNumber:true, min:1 })}/>
          </div>
          <div>
            <label className="text-sm font-medium dark:text-white block mb-1">Cleaning fee (₹)</label>
            <input type="number" className="input-field" {...register("cleaningFee", { valueAsNumber:true, min:0 })}/>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {["maxGuests","bedrooms","beds","bathrooms"].map(f => (
            <div key={f}>
              <label className="text-xs font-medium dark:text-white block mb-1 capitalize">{f.replace(/([A-Z])/g, ' $1')}</label>
              <input type="number" className="input-field" {...register(f, { valueAsNumber:true, min:0 })}/>
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate("/host")} className="btn-ghost flex-1 border border-gray-300 dark:border-gray-600">Cancel</button>
          <button type="submit" className="btn-primary flex-1">Save changes</button>
        </div>
      </form>
    </div>
  );
}
