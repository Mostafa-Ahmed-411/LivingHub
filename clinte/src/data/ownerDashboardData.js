import { Building2, Users, DollarSign, Eye } from "lucide-react";

export const ownerStats = [
  {
    id: 1,
    icon: Building2,
    label: "Active Listings",
    value: 4,
    change: 12,
    color: "blue",
  },
  {
    id: 2,
    icon: Users,
    label: "Current Tenants",
    value: 7,
    change: 5,
    color: "green",
  },
  {
    id: 3,
    icon: DollarSign,
    label: "Monthly Income",
    value: "EGP 18.4K",
    change: 8,
    color: "amber",
  },
  {
    id: 4,
    icon: Eye,
    label: "Profile Views",
    value: 284,
    change: 23,
    color: "purple",
  },
];

export const recentBookings = [
  {
    id: 1,
    tenant: "Youssef Mahmoud",
    property: "Studio in Zamalek",
    date: "Jul 1, 2025",
    rent: "EGP 2,800",
    status: "Active",
  },
  {
    id: 2,
    tenant: "Nada El-Sayed",
    property: "Room in Heliopolis",
    date: "Jun 15, 2025",
    rent: "EGP 1,800",
    status: "Active",
  },
  {
    id: 3,
    tenant: "Omar Ashraf",
    property: "Apartment in Maadi",
    date: "Aug 1, 2025",
    rent: "EGP 4,200",
    status: "Pending",
  },
  {
    id: 4,
    tenant: "Laila Karim",
    property: "Bed Space - Nasr City",
    date: "Jul 20, 2025",
    rent: "EGP 900",
    status: "Active",
  },
];