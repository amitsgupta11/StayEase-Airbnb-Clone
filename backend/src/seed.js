// seed.js — Run this ONCE to add 10 sample listings to your database
// Command: node src/seed.js

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/User.model.js";
import Listing from "./models/Listing.model.js";

const SAMPLE_LISTINGS = [
  {
    title: "Stunning Beachfront Villa in Goa",
    description: "A breathtaking beachfront villa with direct ocean access and a private infinity pool. Wake up to the sound of waves and enjoy spectacular sunsets from your private terrace. This luxurious 3-bedroom villa is perfect for families and groups seeking a premium Goa experience with all modern amenities.",
    propertyType: "villa",
    pricePerNight: 8500,
    cleaningFee: 1500,
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    amenities: ["WiFi", "Air conditioning", "Kitchen", "Pool", "Free parking", "Beachfront", "TV", "Workspace"],
    location: { city: "Goa", state: "Goa", country: "India", address: "Calangute Beach Road", coordinates: { lat: 15.5449, lng: 73.7517 } },
    images: [
      { url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=800&fit=crop", public_id: "seed/goa_villa_1" },
      { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop", public_id: "seed/goa_villa_2" },
      { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop", public_id: "seed/goa_villa_3" },
    ],
    avgRating: 4.92,
    reviewCount: 128,
  },
  {
    title: "Cozy Mountain Chalet in Manali",
    description: "A charming wooden chalet nestled in the heart of Manali's snow-capped mountains. Enjoy a cozy fireplace, stunning Himalayan views, and easy access to skiing and trekking trails. Perfect for couples and adventure seekers wanting to escape the city.",
    propertyType: "cabin",
    pricePerNight: 5200,
    cleaningFee: 800,
    maxGuests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
    amenities: ["WiFi", "Heating", "Kitchen", "Indoor fireplace", "Free parking", "TV", "Workspace"],
    location: { city: "Manali", state: "Himachal Pradesh", country: "India", address: "Old Manali Road", coordinates: { lat: 32.2396, lng: 77.1887 } },
    images: [
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop", public_id: "seed/manali_chalet_1" },
      { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop", public_id: "seed/manali_chalet_2" },
      { url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&h=800&fit=crop", public_id: "seed/manali_chalet_3" },
    ],
    avgRating: 4.85,
    reviewCount: 94,
  },
  {
    title: "Luxury Coffee Estate Homestay, Coorg",
    description: "Stay amidst lush coffee and spice plantations in this beautiful colonial-era bungalow. Wake up to fresh coffee brewed from our own estate, take nature walks through the plantation, and experience the tranquil beauty of Coorg. Breakfast included.",
    propertyType: "house",
    pricePerNight: 4100,
    cleaningFee: 600,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 2,
    amenities: ["WiFi", "Breakfast", "Free parking", "Kitchen", "Pet friendly", "TV"],
    location: { city: "Coorg", state: "Karnataka", country: "India", address: "Madikeri Estate Road", coordinates: { lat: 12.4244, lng: 75.7382 } },
    images: [
      { url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&h=800&fit=crop", public_id: "seed/coorg_estate_1" },
      { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop", public_id: "seed/coorg_estate_2" },
      { url: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1200&h=800&fit=crop", public_id: "seed/coorg_estate_3" },
    ],
    avgRating: 4.96,
    reviewCount: 67,
  },
  {
    title: "Heritage Palace Suite, Udaipur",
    description: "Experience royal Rajasthani hospitality in this magnificent heritage palace overlooking Lake Pichola. Your suite features hand-painted frescoes, antique furnishings, and a private balcony with breathtaking lake views. Butler service, fine dining, and a rooftop pool complete this regal experience.",
    propertyType: "resort",
    pricePerNight: 22000,
    cleaningFee: 3000,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Air conditioning", "Pool", "Hot tub", "Breakfast", "Gym", "TV", "Workspace"],
    location: { city: "Udaipur", state: "Rajasthan", country: "India", address: "City Palace Road, Lake Pichola", coordinates: { lat: 24.5854, lng: 73.6836 } },
    images: [
      { url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200&h=800&fit=crop", public_id: "seed/udaipur_palace_1" },
      { url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=800&fit=crop", public_id: "seed/udaipur_palace_2" },
      { url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=800&fit=crop", public_id: "seed/udaipur_palace_3" },
    ],
    avgRating: 4.99,
    reviewCount: 45,
  },
  {
    title: "Modern Studio Apartment, Bandra Mumbai",
    description: "A sleek, fully furnished studio apartment in the heart of Bandra West — Mumbai's trendiest neighbourhood. Walking distance to cafes, restaurants, and the sea link. Perfect for business travellers and solo explorers. High-speed WiFi and a dedicated workspace included.",
    propertyType: "apartment",
    pricePerNight: 3800,
    cleaningFee: 500,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Air conditioning", "Kitchen", "Washer", "TV", "Workspace", "Gym"],
    location: { city: "Mumbai", state: "Maharashtra", country: "India", address: "Bandra West, Linking Road", coordinates: { lat: 19.0596, lng: 72.8295 } },
    images: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop", public_id: "seed/mumbai_apt_1" },
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop", public_id: "seed/mumbai_apt_2" },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop", public_id: "seed/mumbai_apt_3" },
    ],
    avgRating: 4.78,
    reviewCount: 211,
  },
  {
    title: "Secluded Island Cottage, Andaman",
    description: "A magical escape on the pristine shores of Havelock Island. This private beachside cottage offers crystal-clear turquoise waters right at your doorstep. Snorkelling gear included. Daily boat tours and scuba diving can be arranged. Truly a paradise for water lovers.",
    propertyType: "cottage",
    pricePerNight: 12000,
    cleaningFee: 2000,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Air conditioning", "Kitchen", "Beachfront", "Breakfast", "Free parking", "TV"],
    location: { city: "Andaman Islands", state: "Andaman and Nicobar", country: "India", address: "Havelock Island, Radhanagar Beach", coordinates: { lat: 11.9833, lng: 92.9833 } },
    images: [
      { url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&h=800&fit=crop", public_id: "seed/andaman_cottage_1" },
      { url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop", public_id: "seed/andaman_cottage_2" },
      { url: "https://images.unsplash.com/photo-1586374579358-9d19d632b6df?w=1200&h=800&fit=crop", public_id: "seed/andaman_cottage_3" },
    ],
    avgRating: 4.88,
    reviewCount: 83,
  },
  {
    title: "Tea Garden Bungalow, Darjeeling",
    description: "A classic colonial bungalow set within a working tea garden with panoramic views of Kanchenjunga. Sip freshly-brewed Darjeeling tea on your verandah as the mist rolls in. An ideal retreat for those seeking peace, mountain air, and authentic hill station charm.",
    propertyType: "house",
    pricePerNight: 3500,
    cleaningFee: 500,
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    amenities: ["WiFi", "Heating", "Kitchen", "Breakfast", "Free parking", "TV", "Pet friendly"],
    location: { city: "Darjeeling", state: "West Bengal", country: "India", address: "Happy Valley Tea Estate", coordinates: { lat: 27.0410, lng: 88.2663 } },
    images: [
      { url: "https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?w=1200&h=800&fit=crop", public_id: "seed/darjeeling_bungalow_1" },
      { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=800&fit=crop", public_id: "seed/darjeeling_bungalow_2" },
      { url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&h=800&fit=crop", public_id: "seed/darjeeling_bungalow_3" },
    ],
    avgRating: 4.76,
    reviewCount: 102,
  },
  {
    title: "Luxury Houseboat, Kerala Backwaters",
    description: "Drift through the serene backwaters of Kerala on this fully-equipped luxury houseboat. Watch village life unfold on the banks, spot exotic birds, and enjoy authentic Kerala cuisine prepared by your onboard chef. The ultimate slow travel experience in God's Own Country.",
    propertyType: "house",
    pricePerNight: 9500,
    cleaningFee: 1500,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Air conditioning", "Kitchen", "Breakfast", "TV", "Waterfront"],
    location: { city: "Alleppey", state: "Kerala", country: "India", address: "Vembanad Lake, Alleppey", coordinates: { lat: 9.4981, lng: 76.3388 } },
    images: [
      { url: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1200&h=800&fit=crop", public_id: "seed/kerala_houseboat_1" },
      { url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&h=800&fit=crop", public_id: "seed/kerala_houseboat_2" },
      { url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&h=800&fit=crop", public_id: "seed/kerala_houseboat_3" },
    ],
    avgRating: 4.91,
    reviewCount: 156,
  },
  {
    title: "Desert Camp Luxury Tent, Jaisalmer",
    description: "Sleep under a billion stars in this premium luxury desert camp on the golden sand dunes of Jaisalmer. Your spacious tent features a king-size bed, private bathroom, and a private deck. Enjoy camel rides at sunset, folk music by the campfire, and a traditional Rajasthani dinner.",
    propertyType: "hotel",
    pricePerNight: 7200,
    cleaningFee: 1000,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ["Air conditioning", "Breakfast", "BBQ grill", "Free parking", "TV"],
    location: { city: "Jaisalmer", state: "Rajasthan", country: "India", address: "Sam Sand Dunes, Jaisalmer", coordinates: { lat: 26.9157, lng: 70.9083 } },
    images: [
      { url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&h=800&fit=crop", public_id: "seed/jaisalmer_camp_1" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop", public_id: "seed/jaisalmer_camp_2" },
      { url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=800&fit=crop", public_id: "seed/jaisalmer_camp_3" },
    ],
    avgRating: 4.87,
    reviewCount: 189,
  },
  {
    title: "Spacious 2BHK Flat, Connaught Place Delhi",
    description: "A modern, well-appointed 2-bedroom apartment in the heart of New Delhi, just 5 minutes walk from Connaught Place. Metro access right around the corner. Perfect for families visiting Delhi's iconic monuments — India Gate, Red Fort, and Qutub Minar all within 30 minutes.",
    propertyType: "apartment",
    pricePerNight: 4500,
    cleaningFee: 700,
    maxGuests: 5,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    amenities: ["WiFi", "Air conditioning", "Kitchen", "Washer", "TV", "Workspace", "Free parking"],
    location: { city: "Delhi", state: "Delhi", country: "India", address: "Connaught Place, New Delhi", coordinates: { lat: 28.6315, lng: 77.2167 } },
    images: [
      { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&h=800&fit=crop", public_id: "seed/delhi_flat_1" },
      { url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop", public_id: "seed/delhi_flat_2" },
      { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop", public_id: "seed/delhi_flat_3" },
    ],
    avgRating: 4.73,
    reviewCount: 234,
  },
  
];

async function seedDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected!");

    // Create a host user for all listings
    let hostUser = await User.findOne({ email: "host@stayease.com" });
    if (!hostUser) {
      hostUser = await User.create({
        name: "StayEase Host",
        email: "host@stayease.com",
        password: "Host@123456",
        role: "host",
        isVerified: true,
        bio: "Official StayEase sample host account",
      });
      console.log("✅ Host user created → host@stayease.com / Host@123456");
    } else {
      console.log("✅ Host user already exists");
    }

    // Delete old seeded listings to avoid duplicates
    await Listing.deleteMany({ "images.public_id": /^seed\// });
    console.log("🗑️  Old seed listings removed");

    // Insert all listings
    const listingsWithHost = SAMPLE_LISTINGS.map((l) => ({
      ...l,
      host: hostUser._id,
    }));
    const created = await Listing.insertMany(listingsWithHost);
    console.log(`✅ ${created.length} listings added to database!`);

    console.log("\n🎉 Done! Open → http://localhost:5173/listings");
    console.log("\n📋 Host Login:");
    console.log("   Email:    host@stayease.com");
    console.log("   Password: Host@123456");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seedDatabase();