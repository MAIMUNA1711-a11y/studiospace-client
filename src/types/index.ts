export const STUDIO_CATEGORIES = [
  "Photo Studio",
  "Sound Stage",
  "Podcast Room",
  "Music Suite",
  "Art Workshop",
] as const;
export type StudioCategory = (typeof STUDIO_CATEGORIES)[number];

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerImage?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  studioCategory: StudioCategory;
  ownerEmail: string;
  ownerName: string;
  userEmail: string;
  userName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  hourlyRate: number;
  totalPrice: number;
  securityDeposit: number;
  notes?: string;
  status: BookingStatus;
  cancelReason?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  studioId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StudioFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "rating";
  page?: number;
  limit?: number;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}