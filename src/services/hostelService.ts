import { db } from "@/lib/db";
import { Hostel, Room, StudentAllocation } from "@/types";

// Function to fetch all hostels
export const getHostels = async (): Promise<Hostel[]> => {
  const hostels = await db.hostel.findMany();
  return hostels.map(hostel => ({
    ...hostel,
    type: hostel.type as "Boys" | "Girls" | "Co-ed" // Type assertion for hostel type
  })) as Hostel[];
};

// Function to fetch a single hostel by ID
export const getHostel = async (id: string): Promise<Hostel | null> => {
  const hostel = await db.hostel.findUnique({
    where: {
      id: id,
    },
  });
  if (!hostel) return null;
  return {
    ...hostel,
    type: hostel.type as "Boys" | "Girls" | "Co-ed"
  } as Hostel;
};

// Function to create a new hostel
export const createHostel = async (data: Omit<Hostel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Hostel> => {
  const hostel = await db.hostel.create({
    data: {
      ...data,
    },
  });
   return {
    ...hostel,
    type: hostel.type as "Boys" | "Girls" | "Co-ed"
  } as Hostel;
};

// Function to update an existing hostel
export const updateHostel = async (id: string, data: Partial<Omit<Hostel, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Hostel | null> => {
  const hostel = await db.hostel.update({
    where: {
      id: id,
    },
    data: data,
  });
  if (!hostel) return null;
   return {
    ...hostel,
    type: hostel.type as "Boys" | "Girls" | "Co-ed"
  } as Hostel;
};

// Function to delete a hostel by ID
export const deleteHostel = async (id: string): Promise<Hostel | null> => {
  const hostel = await db.hostel.delete({
    where: {
      id: id,
    },
  });
  return hostel;
};

// Function to fetch all rooms
export const getRooms = async (): Promise<Room[]> => {
  const rooms = await db.room.findMany();
   return rooms.map(room => ({
    ...room,
    type: room.type as "Single" | "Double" | "Triple" | "Dormitory"
  })) as Room[];
};

// Function to fetch a single room by ID
export const getRoom = async (id: string): Promise<Room | null> => {
  const room = await db.room.findUnique({
    where: {
      id: id,
    },
  });
  if (!room) return null;
   return {
    ...room,
    type: room.type as "Single" | "Double" | "Triple" | "Dormitory"
  } as Room;
};

// Function to create a new room
export const createRoom = async (data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<Room> => {
  const room = await db.room.create({
    data: {
      ...data,
    },
  });
   return {
    ...room,
    type: room.type as "Single" | "Double" | "Triple" | "Dormitory"
  } as Room;
};

// Function to update an existing room
export const updateRoom = async (id: string, data: Partial<Omit<Room, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Room | null> => {
  const room = await db.room.update({
    where: {
      id: id,
    },
    data: data,
  });
  if (!room) return null;
   return {
    ...room,
    type: room.type as "Single" | "Double" | "Triple" | "Dormitory"
  } as Room;
};

// Function to delete a room by ID
export const deleteRoom = async (id: string): Promise<Room | null> => {
  const room = await db.room.delete({
    where: {
      id: id,
    },
  });
  return room;
};

// Function to fetch all student allocations
export const getStudentAllocations = async (): Promise<StudentAllocation[]> => {
  return await db.studentAllocation.findMany();
};

// Function to fetch a single student allocation by ID
export const getStudentAllocation = async (id: string): Promise<StudentAllocation | null> => {
  return await db.studentAllocation.findUnique({
    where: {
      id: id,
    },
  });
};

// Function to create a new student allocation
export const createStudentAllocation = async (data: Omit<StudentAllocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudentAllocation> => {
  return await db.studentAllocation.create({
    data: {
      ...data,
    },
  });
};

// Function to update an existing student allocation
export const updateStudentAllocation = async (id: string, data: Partial<Omit<StudentAllocation, 'id' | 'createdAt' | 'updatedAt'>>): Promise<StudentAllocation | null> => {
  return await db.studentAllocation.update({
    where: {
      id: id,
    },
    data: data,
  });
};

// Function to delete a student allocation by ID
export const deleteStudentAllocation = async (id: string): Promise<StudentAllocation | null> => {
  return await db.studentAllocation.delete({
    where: {
      id: id,
    },
  });
};
