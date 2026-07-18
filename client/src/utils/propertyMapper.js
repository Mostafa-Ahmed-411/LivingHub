import { BACKEND_URL } from "../api/client";

export const mapBackendUnitToProperty = (u) => {
  if (!u) return {};
  
  // If it's already mapped, return it
  if (u.gallery) return u;

  let images = u.images || [];
  let image = u.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&fit=crop";
  if (image && !image.startsWith('http') && !image.startsWith('data:')) {
    image = `${BACKEND_URL}/uploads/units/${image}`;
  }
  let image2 = "";
  if (images.length > 0) {
    image = images[0] && !images[0].startsWith('http') ? `${BACKEND_URL}/uploads/units/${images[0]}` : images[0];
  }
  if (images.length > 1) {
    image2 = images[1] && !images[1].startsWith('http') ? `${BACKEND_URL}/uploads/units/${images[1]}` : images[1];
  }
  const resolvedGallery = images.map(img => img && !img.startsWith('http') ? `${BACKEND_URL}/uploads/units/${img}` : img);

  const city = u.address?.city || "Cairo";
  const gov = u.address?.governorate || "Egypt";
  const street = u.address?.street ? `, ${u.address.street}` : "";
  const locationStr = `${city}, ${gov}${street}`;

  const specs = u.specifications || {};
  const ams = specs.amenities || {};

  return {
    id: u._id || u.id,
    _id: u._id,
    title: u.title || `${u.unitType?.charAt(0).toUpperCase() + u.unitType?.slice(1)} in ${city}`,
    type: u.unitType ? (u.unitType.charAt(0).toUpperCase() + u.unitType.slice(1)) : "Studio",
    listingFor: u.listingType === "rent" || u.listingType === "Rent" ? "Rent" : "Sale",
    location: locationStr,
    governorate: gov,
    district: city,
    price: u.price || 0,
    period: u.listingType === "rent" || u.listingType === "Rent" ? "month" : "total",
    floor: u.floorNumber || 0,
    image,
    image2,
    gallery: resolvedGallery,
    roomBedNumber: u.bedsPerRoom || 1,
    roomBeds: u.bedsPerRoom || 1,
    aptPeople: specs.aptPeople || (u.bedsPerRoom || 1) * (u.roomsPerApartment || 1) || 1,
    beds: u.roomsPerApartment || u.bedsPerRoom || 1,
    baths: specs.baths || 1,
    area: specs.area || 100,
    deposit: specs.deposit,
    rating: u.rating || 4.5,
    reviewsCount: u.reviewsCount || 0,
    reviewsList: u.reviewsList || [],
    verified: u.status === "available",
    includesWater: specs.includesWater,
    includesElectricity: specs.includesElectricity,
    includesGas: specs.includesGas,
    gasType: specs.gasType || "Natural Gas",
    availableFrom: u.availableFrom ? new Date(u.availableFrom).toLocaleDateString() : "N/A",
    landlord: u.ownerId?.fullName || "Owner",
    landlordPhone: u.ownerId?.phone || "",
    landlordEmail: u.ownerId?.email || "",
    ownerId: u.ownerId?._id || u.ownerId || "",
    description: u.description || "",

    // Shared Amenities
    hasFridge: ams.shared?.fridge !== false,
    hasWashingMachine: ams.shared?.washingMachine !== false,
    hasBathroom: ams.shared?.sharedBathroom !== false,
    hasKitchen: ams.shared?.sharedKitchen !== false,
    hasHeater: ams.shared?.heater !== false,

    // Room Amenities
    hasBalcony: ams.room?.balcony !== false,
    hasWindow: ams.room?.window !== false,
    hasAC: ams.room?.ac !== false,
    hasTV: ams.room?.tvScreen !== false,
    hasWardrobe: ams.room?.wardrobe !== false,

    // Building Services
    hasWiFi: ams.building?.wifi !== false,
    hasCleaner: ams.building?.cleaner !== false,
    hasSecurity: ams.building?.security !== false,
    hasCameras: ams.building?.securityCameras !== false
  };
};
