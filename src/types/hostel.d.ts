
export interface Hostel {
  id: string;
  name: string;
  type: "Boys" | "Girls" | "Co-ed" | string; // Added string to allow any string temporarily
  capacity: number;
  warden_name: string;
  contact_number: string;
  school_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Room {
  id: string;
  hostel_id: string;
  room_number: string;
  floor: string;
  capacity: number;
  occupancy: number;
  type: string;
  status: string;
  has_bathroom: boolean;
  amenities: string[];
  created_at: string;
  updated_at: string;
}
