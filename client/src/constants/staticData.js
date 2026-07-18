export const cities = ["Assiut"];

export const propertyTypes = ["All", "Apartment", "Room", "Studio", "Bed"];

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
