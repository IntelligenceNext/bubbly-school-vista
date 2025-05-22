
// This file exports common types used across the application

// DataTable column size type
export type ColumnSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

// Attendance status type - add "weekend" to fix the type error
export type AttendanceStatus = "present" | "absent" | "late" | "half-day" | "leave" | "weekend";
