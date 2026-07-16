export const cities = ["Cairo", "Giza", "Alexandria", "Mansoura", "Tanta", "Assiut"];

export const propertyTypes = ["All", "Apartment", "Room", "Studio", "Bed"];

export const properties = [
  {
    id: 1,
    title: "Modern Studio near Cairo University",
    type: "Studio",
    price: 2800,
    period: "month",
    location: "Said, Assiut",
    governorate: "Assiut",
    district: "Said",
    listingFor: "Rent",
    floor: 3,
    availableFrom: "2025-07-01",
    availableTo: "2026-07-01",
    university: "Cairo University",
    beds: 1,
    baths: 1,
    area: 38,
    rating: 4.9,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop&auto=format",
    image2: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&auto=format",
    verified: true,
    available: true,
    landlord: "Ahmed Hassan",
    // Specs
    roomBeds: 2,
    roomBedNumber: 1,
    aptPeople: 4,
    includesWater: true,
    includesGas: false,
    includesElectricity: false,
    gasType: "Natural Gas",
    description: "A very clean and quiet studio apartment designed for students who want privacy. Located close to the university gate and transportation hubs.",
    // Shared features
    hasFridge: true,
    hasWashingMachine: true,
    hasBathroom: true,
    hasKitchen: true,
    hasHeater: true,
    // Room features
    hasBalcony: false,
    hasWindow: true,
    hasAC: true,
    hasTV: true,
    hasWardrobe: true,
    // Services features
    hasWiFi: true,
    hasCleaner: true,
    hasSecurity: true,
    hasCameras: true,
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=200&fit=crop&auto=format"
    ]
  },
  {
    id: 2,
    title: "Cozy Room in Zamalek",
    type: "Room",
    price: 1800,
    period: "month",
    location: "Zamalek, Cairo",
    governorate: "Cairo",
    district: "Zamalek",
    listingFor: "Rent",
    floor: 5,
    availableFrom: "2025-08-01",
    availableTo: "2026-08-01",
    university: "AUC",
    beds: 1,
    baths: 2,
    area: 25,
    rating: 4.7,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&auto=format",
    image2: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop&auto=format",
    verified: true,
    available: true,
    landlord: "Sara Mohamed",
    // Specs
    roomBeds: 1,
    roomBedNumber: 1,
    aptPeople: 3,
    includesWater: true,
    includesGas: true,
    includesElectricity: true,
    gasType: "Natural Gas",
    description: "A lovely single room with a balcony in a shared student flat in the safe neighborhood of Zamalek. All bills included in the rent.",
    // Shared features
    hasFridge: true,
    hasWashingMachine: true,
    hasBathroom: true,
    hasKitchen: true,
    hasHeater: true,
    // Room features
    hasBalcony: true,
    hasWindow: true,
    hasAC: true,
    hasTV: true,
    hasWardrobe: true,
    // Services features
    hasWiFi: true,
    hasCleaner: false,
    hasSecurity: true,
    hasCameras: false,
    gallery: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=200&fit=crop&auto=format"
    ]
  },
  {
    id: 3,
    title: "Spacious Apartment in Mohandessin",
    type: "Apartment",
    price: 5500,
    period: "month",
    location: "Mohandessin, Giza",
    governorate: "Giza",
    district: "Mohandessin",
    listingFor: "Sale",
    floor: 12,
    availableFrom: "2025-06-15",
    availableTo: "2026-06-15",
    university: "Ain Shams University",
    beds: 3,
    baths: 2,
    area: 120,
    rating: 4.8,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop&auto=format",
    image2: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop&auto=format",
    verified: true,
    available: true,
    landlord: "Khaled Ibrahim",
    // Specs
    roomBeds: 3,
    roomBedNumber: 1,
    aptPeople: 6,
    includesWater: false,
    includesGas: false,
    includesElectricity: false,
    gasType: "Cylinder",
    description: "A huge, beautiful apartment for sale or long-term lease. Located in Mohandessin, very close to shops, restaurants, and medical clinics.",
    // Shared features
    hasFridge: true,
    hasWashingMachine: true,
    hasBathroom: true,
    hasKitchen: true,
    hasHeater: true,
    // Room features
    hasBalcony: true,
    hasWindow: true,
    hasAC: false,
    hasTV: false,
    hasWardrobe: true,
    // Services features
    hasWiFi: false,
    hasCleaner: true,
    hasSecurity: true,
    hasCameras: true,
    gallery: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=200&fit=crop&auto=format"
    ]
  },
  {
    id: 4,
    title: "Affordable Bed Space in Nasr City",
    type: "Bed",
    price: 900,
    period: "month",
    location: "Nasr City, Cairo",
    governorate: "Cairo",
    district: "Nasr City",
    listingFor: "Rent",
    floor: 1,
    availableFrom: "2025-07-20",
    availableTo: "2026-07-20",
    university: "Al-Azhar University",
    beds: 1,
    baths: 1,
    area: 12,
    rating: 4.5,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop&auto=format",
    image2: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=400&fit=crop&auto=format",
    verified: true,
    available: true,
    landlord: "Mariam Ali",
    // Specs
    roomBeds: 5,
    roomBedNumber: 2,
    aptPeople: 5,
    includesWater: true,
    includesGas: true,
    includesElectricity: false,
    gasType: "Cylinder",
    description: "Cheap bed space in a shared room with 4 other students. Right next to the Al-Azhar University campus. High-speed internet is included.",
    // Shared features
    hasFridge: true,
    hasWashingMachine: false,
    hasBathroom: true,
    hasKitchen: true,
    hasHeater: true,
    // Room features
    hasBalcony: false,
    hasWindow: true,
    hasAC: false,
    hasTV: false,
    hasWardrobe: true,
    // Services features
    hasWiFi: true,
    hasCleaner: false,
    hasSecurity: false,
    hasCameras: false,
    gallery: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=200&fit=crop&auto=format"
    ]
  },
  {
    id: 5,
    title: "Premium Studio in New Cairo",
    type: "Studio",
    price: 4200,
    period: "month",
    location: "Al-Azhar, Assiut",
    governorate: "Assiut",
    district: "Al-Azhar",
    listingFor: "Sale",
    floor: 16,
    availableFrom: "2025-07-01",
    availableTo: "2026-07-01",
    university: "GUC",
    beds: 1,
    baths: 1,
    area: 52,
    rating: 4.9,
    reviews: 15,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop&auto=format",
    image2: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop&auto=format",
    verified: true,
    available: true,
    landlord: "Tarek Fouad",
    // Specs
    roomBeds: 2,
    roomBedNumber: 1,
    aptPeople: 2,
    includesWater: true,
    includesGas: true,
    includesElectricity: true,
    gasType: "Natural Gas",
    description: "Premium single studio apartment for sale. High-end finishing, fully furnished, stunning views, and located in a very modern residential building.",
    // Shared features
    hasFridge: true,
    hasWashingMachine: true,
    hasBathroom: true,
    hasKitchen: true,
    hasHeater: true,
    // Room features
    hasBalcony: true,
    hasWindow: true,
    hasAC: true,
    hasTV: true,
    hasWardrobe: true,
    // Services features
    hasWiFi: true,
    hasCleaner: true,
    hasSecurity: true,
    hasCameras: true,
    gallery: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=200&fit=crop&auto=format"
    ]
  },
  {
    id: 6,
    title: "Shared Room near Ain Shams",
    type: "Room",
    price: 1200,
    period: "month",
    location: "Heliopolis, Cairo",
    governorate: "Cairo",
    district: "Heliopolis",
    listingFor: "Rent",
    floor: 2,
    availableFrom: "2025-09-01",
    availableTo: "2026-09-01",
    university: "Ain Shams University",
    beds: 2,
    baths: 1,
    area: 20,
    rating: 4.6,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=400&fit=crop&auto=format",
    image2: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop&auto=format",
    verified: false,
    available: true,
    landlord: "Nour El-Din",
    // Specs
    roomBeds: 2,
    roomBedNumber: 2,
    aptPeople: 4,
    includesWater: true,
    includesGas: false,
    includesElectricity: false,
    gasType: "Cylinder",
    description: "Shared room for two students. Bright and spacious room, fully furnished, close to Heliopolis Metro and Ain Shams University.",
    // Shared features
    hasFridge: true,
    hasWashingMachine: false,
    hasBathroom: true,
    hasKitchen: true,
    hasHeater: true,
    // Room features
    hasBalcony: true,
    hasWindow: true,
    hasAC: true,
    hasTV: true,
    hasWardrobe: true,
    // Services features
    hasWiFi: true,
    hasCleaner: false,
    hasSecurity: true,
    hasCameras: true,
    gallery: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=300&h=200&fit=crop&auto=format"
    ]
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Youssef Mahmoud",
    university: "Cairo University",
    year: "3rd Year, Engineering",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
    rating: 5,
    text: "Maeesha made finding my studio so easy. I found the perfect place near campus within 3 days. The verification system gave me complete confidence."
  },
  {
    id: 2,
    name: "Nada El-Sayed",
    university: "AUC",
    year: "2nd Year, Business",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format",
    rating: 5,
    text: "As an out-of-town student, I was worried about finding safe housing. The verified listings and direct chat with landlords made everything seamless."
  },
  {
    id: 3,
    name: "Omar Ashraf",
    university: "Ain Shams",
    year: "4th Year, Medicine",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format",
    rating: 5,
    text: "The platform is beautifully designed and so intuitive. Managed my entire apartment search and rent payments through Maeesha. Highly recommend!"
  },
  {
    id: 4,
    name: "Mariam Hassan",
    university: "GUC",
    year: "1st Year, Pharmacy",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format",
    rating: 5,
    text: "I found a roommate and a perfect double room in Heliopolis through the community tab. It saved me a lot of money and time."
  },
  {
    id: 5,
    name: "Kareem Aly",
    university: "Alexandria University",
    year: "3rd Year, Computer Science",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&auto=format",
    rating: 5,
    text: "The security deposit payment and contracts are handled online, making it very transparent and professional. Best student housing site in Egypt!"
  }
];

export const revenueData = [
  { month: "Jan", revenue: 18400, bookings: 42 },
  { month: "Feb", revenue: 22100, bookings: 58 },
  { month: "Mar", revenue: 19800, bookings: 51 },
  { month: "Apr", revenue: 28500, bookings: 74 },
  { month: "May", revenue: 31200, bookings: 82 },
  { month: "Jun", revenue: 26700, bookings: 69 },
  { month: "Jul", revenue: 35400, bookings: 91 }
];

export const growthData = [
  { month: "Jan", users: 38000, props: 11200 },
  { month: "Feb", users: 41200, props: 12400 },
  { month: "Mar", users: 43800, props: 13100 },
  { month: "Apr", users: 47300, props: 13900 },
  { month: "May", users: 50200, props: 14500 },
  { month: "Jun", users: 52100, props: 14900 },
  { month: "Jul", users: 52847, props: 15230 }
];

export const unitTypeData = [
  { name: "Studio", value: 40, color: "#2563EB" },
  { name: "Room", value: 30, color: "#10B981" },
  { name: "Apartment", value: 20, color: "#F59E0B" },
  { name: "Bed", value: 10, color: "#8B5CF6" }
];

export const notifData = [
  { id: 1, type: "check", title: "Booking Confirmed", message: "Your booking for Zamalek Studio has been confirmed.", time: "2 hours ago", read: false },
  { id: 2, type: "message", title: "New Message", message: "Ahmed Hassan sent you a message.", time: "4 hours ago", read: false },
  { id: 3, type: "payment", title: "Payment Received", message: "Rent payment for July 2025 has been received.", time: "1 day ago", read: true },
  { id: 4, type: "eye", title: "Profile View", message: "A landlord viewed your profile.", time: "2 days ago", read: true },
  { id: 5, type: "shield", title: "ID Verified", message: "Your government ID has been successfully verified.", time: "3 days ago", read: true }
];

export const paymentHistory = [
  { id: "TXN-87654321", property: "Modern Studio in Zamalek", amount: 2800, date: "2025-07-01", method: "Instapay", status: "confirmed" },
  { id: "TXN-87654320", property: "Cozy Room in Heliopolis", amount: 1800, date: "2025-06-15", method: "Vodafone Cash", status: "confirmed" },
  { id: "TXN-87654319", property: "Apartment in Mohandessin", amount: 5500, date: "2025-06-01", method: "Bank Transfer", status: "pending" }
];

export const convList = [
  {
    id: 1,
    name: "Ahmed Hassan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
    online: true,
    time: "14:32",
    property: "Modern Studio in Zamalek",
    last: "Can we schedule a viewing for tomorrow?",
    unread: 2
  },
  {
    id: 2,
    name: "Sara Mohamed",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format",
    online: false,
    time: "Yesterday",
    property: "Cozy Room in Heliopolis",
    last: "The deposit has been received. Thank you!",
    unread: 0
  }
];

export const initMsgs = [
  { id: 1, text: "Hello! I am interested in your Zamalek studio listing.", time: "10:15 AM", sent: true, read: true },
  { id: 2, text: "Hi! It is still available. When would you like to visit?", time: "10:18 AM", sent: false, read: true },
  { id: 3, text: "Can we schedule a viewing for tomorrow at 4 PM?", time: "10:20 AM", sent: true, read: true }
];

export const communityPosts = [
  {
    id: 1,
    author: "Omar Ashraf",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format",
    university: "Ain Shams",
    time: "2 hours ago",
    content: "Looking for roommates to share an apartment in Maadi. Budget is around 2000 EGP per person. Drop a comment if interested!",
    tags: ["roommate", "maadi", "studenthousing"],
    likes: 12,
    liked: false,
    comments: 5
  },
  {
    id: 2,
    author: "Nada El-Sayed",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format",
    university: "AUC",
    time: "5 hours ago",
    content: "Highly recommend the studios listed in Zamalek! The area is super safe and full of cafes. Great for studying too.",
    tags: ["review", "zamalek", "studentlife"],
    likes: 24,
    liked: true,
    comments: 3
  }
];

export const recentActivity = [
  { id: 1, type: "user", title: "New User Registered", desc: "Ahmed Hassan joined as Student", time: "10 mins ago", color: "bg-blue-50 text-blue-600" },
  { id: 2, type: "unit", title: "New Unit Added", desc: "Studio in Zamalek listed by Sara", time: "1 hour ago", color: "bg-green-50 text-green-600" },
  { id: 3, type: "payment", title: "Payment Approved", desc: "Rent payment for TXN-87654320", time: "3 hours ago", color: "bg-emerald-50 text-emerald-600" },
  { id: 4, type: "report", title: "New Report Opened", desc: "Complaint regarding maintenance", time: "5 hours ago", color: "bg-red-50 text-red-600" },
  { id: 5, type: "audit", title: "Audit Log Flagged", desc: "Failed login attempt detected", time: "1 day ago", color: "bg-purple-50 text-purple-600" },
  { id: 6, type: "user", title: "User Verified", desc: "Nada El-Sayed verified their ID", time: "1 day ago", color: "bg-blue-50 text-blue-600" },
  { id: 7, type: "unit", title: "Unit Approved", desc: "Apartment in Mohandessin approved", time: "2 days ago", color: "bg-green-50 text-green-600" }
];
