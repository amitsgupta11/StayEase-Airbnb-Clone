import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiUpload, FiX } from "react-icons/fi";
import { listingService } from "../../services/listing.service.js";
import { PROPERTY_TYPES, AMENITIES_LIST, AMENITY_ICONS } from "../../utils/helpers.js";

const STEPS = ["Basic Info", "Location", "Details", "Amenities", "Images", "Pricing"];

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState:{ errors }, trigger, getValues } = useForm({
    defaultValues: { bedrooms:1, beds:1, bathrooms:1, maxGuests:2, pricePerNight:1000, cleaningFee:0 }
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(p => [...p, ...files].slice(0, 10));
    setPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))].slice(0, 10));
  };

  const removeImage = (i) => {
    setImages(p => p.filter((_,idx) => idx !== i));
    setPreviews(p => p.filter((_,idx) => idx !== i));
  };

  const toggleAmenity = (a) => setSelectedAmenities(p => p.includes(a) ? p.filter(x=>x!==a) : [...p, a]);

  const nextStep = async () => {
    const fieldsToValidate = {
      0: ["title","description","propertyType"],
      1: ["location.city","location.country"],
      2: ["bedrooms","beds","bathrooms","maxGuests"],
    }[step];
    if (fieldsToValidate) { const ok = await trigger(fieldsToValidate); if (!ok) return; }
    setStep(p => Math.min(p+1, STEPS.length-1));
  };

  const onSubmit = async (data) => {
    if (images.length === 0) { toast.error("Please add at least one image"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("description", data.description);
      fd.append("propertyType", data.propertyType);
      fd.append("pricePerNight", data.pricePerNight);
      fd.append("cleaningFee", data.cleaningFee || 0);
      fd.append("maxGuests", data.maxGuests);
      fd.append("bedrooms", data.bedrooms);
      fd.append("beds", data.beds);
      fd.append("bathrooms", data.bathrooms);
      fd.append("amenities", JSON.stringify(selectedAmenities));
      fd.append("location", JSON.stringify({ city:data.location.city, country:data.location.country, address:data.location.address||"", state:data.location.state||"" }));
      images.forEach(img => fd.append("images", img));
      const { data: res } = await listingService.create(fd);
      toast.success("Listing created! 🎉");
      navigate(`/listings/${res.data.listing._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to create listing");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold dark:text-white mb-2">Create a new listing</h1>

      {/* Progress */}
      <div className="flex gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`}/>
        ))}
      </div>
      <p className="text-sm text-gray-400 mb-6">Step {step+1} of {STEPS.length} — {STEPS[step]}</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium dark:text-white block mb-1">Listing title *</label>
              <input className="input-field" placeholder="e.g. Cozy beachfront villa in Goa"
                {...register("title", { required:"Title is required", minLength:{ value:10, message:"Min 10 characters" } })}/>
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium dark:text-white block mb-1">Description *</label>
              <textarea className="input-field" rows={5} placeholder="Describe your space in detail..."
                {...register("description", { required:"Description is required", minLength:{ value:20, message:"Min 20 characters" } })}/>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium dark:text-white block mb-1">Property type *</label>
              <select className="input-field" {...register("propertyType", { required:"Select a type" })}>
                <option value="">Select type</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
              {errors.propertyType && <p className="text-red-500 text-xs mt-1">{errors.propertyType.message}</p>}
            </div>
          </div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium dark:text-white block mb-1">City *</label>
              <input className="input-field" placeholder="e.g. Goa"
                {...register("location.city", { required:"City is required" })}/>
              {errors.location?.city && <p className="text-red-500 text-xs mt-1">{errors.location.city.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium dark:text-white block mb-1">State</label>
              <input className="input-field" placeholder="e.g. Maharashtra" {...register("location.state")}/>
            </div>
            <div>
              <label className="text-sm font-medium dark:text-white block mb-1">Country *</label>
              <input className="input-field" placeholder="e.g. India"
                {...register("location.country", { required:"Country is required" })}/>
              {errors.location?.country && <p className="text-red-500 text-xs mt-1">{errors.location.country.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium dark:text-white block mb-1">Full address</label>
              <input className="input-field" placeholder="Street address (optional)" {...register("location.address")}/>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-5">
            {[
              { name:"maxGuests", label:"Max guests", min:1, max:20 },
              { name:"bedrooms",  label:"Bedrooms",   min:0, max:20 },
              { name:"beds",      label:"Beds",       min:1, max:30 },
              { name:"bathrooms", label:"Bathrooms",  min:0, max:20 },
            ].map(f => (
              <div key={f.name} className="flex items-center justify-between">
                <label className="font-medium dark:text-white">{f.label}</label>
                <div className="flex items-center gap-3">
                  <button type="button" className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 dark:text-white flex items-center justify-center text-lg"
                    onClick={() => { const el = document.querySelector(`[name="${f.name}"]`); if(el && parseInt(el.value)>f.min) el.value=parseInt(el.value)-1; }}>−</button>
                  <input type="number" className="w-12 text-center outline-none dark:bg-gray-900 dark:text-white text-sm font-medium"
                    min={f.min} max={f.max} {...register(f.name, { valueAsNumber:true, min:f.min })}/>
                  <button type="button" className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 dark:text-white flex items-center justify-center text-lg"
                    onClick={() => { const el = document.querySelector(`[name="${f.name}"]`); if(el && parseInt(el.value)<f.max) el.value=parseInt(el.value)+1; }}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Amenities */}
        {step === 3 && (
          <div>
            <p className="text-sm text-gray-400 mb-4">Select all amenities your place offers</p>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES_LIST.map(a => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm text-left transition-colors ${selectedAmenities.includes(a) ? "border-primary bg-primary-light text-primary" : "border-gray-200 dark:border-gray-700 dark:text-gray-300 hover:border-gray-400"}`}>
                  <span>{AMENITY_ICONS[a]}</span> {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Images */}
        {step === 4 && (
          <div>
            <p className="text-sm text-gray-400 mb-4">Add up to 10 photos (required)</p>
            <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
              <FiUpload className="mx-auto text-3xl text-gray-400 mb-2"/>
              <p className="text-sm dark:text-gray-300">Click to upload photos</p>
              <p className="text-xs text-gray-400">JPEG, PNG, WebP · Max 5MB each</p>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange}/>
            </label>
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                    <img src={src} className="w-full h-full object-cover" alt=""/>
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5">
                      <FiX size={12}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Pricing */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium dark:text-white block mb-1">Price per night (₹) *</label>
              <input type="number" className="input-field" placeholder="1000"
                {...register("pricePerNight", { required:true, valueAsNumber:true, min:{ value:1, message:"Min ₹1" } })}/>
            </div>
            <div>
              <label className="text-sm font-medium dark:text-white block mb-1">Cleaning fee (₹)</label>
              <input type="number" className="input-field" placeholder="0"
                {...register("cleaningFee", { valueAsNumber:true, min:0 })}/>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm dark:text-gray-300">
              <p className="font-medium mb-2 dark:text-white">Fee breakdown for guests:</p>
              <p className="text-gray-500">Service fee: 14% of base price</p>
              <p className="text-gray-500">Taxes: 18% GST (on subtotal + fees)</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button type="button" onClick={() => setStep(p=>p-1)} className="btn-ghost flex-1 border border-gray-300 dark:border-gray-600">Back</button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={nextStep} className="btn-primary flex-1">Continue</button>
          ) : (
            <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-60">
              {submitting ? "Creating listing..." : "Publish listing 🎉"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
