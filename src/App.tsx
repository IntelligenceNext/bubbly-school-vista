
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Profile Module Routes
import ProfilePage from "./pages/profile/index";
import ProfileSettings from "./pages/profile/settings";
import SecurityPage from "./pages/profile/security";
import DocumentsPage from "./pages/profile/documents";
import AttendancePage from "./pages/profile/attendance";
import PermissionsPage from "./pages/profile/permissions";
import ActivityPage from "./pages/profile/activity";

// School Management Routes
import SchoolDashboard from "./pages/school-management/Dashboard";
import Schools from "./pages/school-management/Schools";
import Classes from "./pages/school-management/Classes";
import Sessions from "./pages/school-management/Sessions";
import SchoolManagementSettings from "./pages/school-management/Settings";

// School Routes
import SchoolHome from "./pages/school/Dashboard";
import Inquiries from "./pages/school/Inquiries";
import SchoolSettings from "./pages/school/Settings";
import Logs from "./pages/school/Logs";

// Academic Routes
import AcademicDashboard from "./pages/academic/Dashboard";
import ClassSections from "./pages/academic/ClassSections";
import Medium from "./pages/academic/Medium";
import StudentType from "./pages/academic/StudentType";
import Subjects from "./pages/academic/Subjects";
import ClassTimeTable from "./pages/academic/ClassTimeTable";
import Attendance from "./pages/academic/Attendance";
import StudentLeaves from "./pages/academic/StudentLeaves";
import StudyMaterials from "./pages/academic/StudyMaterials";
import Homework from "./pages/academic/Homework";
import Noticeboard from "./pages/academic/Noticeboard";
import Event from "./pages/academic/Event";
import LiveClasses from "./pages/academic/LiveClasses";
import StaffRatting from "./pages/academic/StaffRatting";
import StudentBirthdays from "./pages/academic/StudentBirthdays";

// Student Routes
import StudentDashboard from "./pages/student/Dashboard";
import Admission from "./pages/student/Admission";
import Students from "./pages/student/Students";
import IDCards from "./pages/student/IDCards";
import Promote from "./pages/student/Promote";
import TransferStudent from "./pages/student/TransferStudent";
import Certificates from "./pages/student/Certificates";
import Notifications from "./pages/student/Notifications";

// Administrator Routes
import AdminDashboard from "./pages/administrator/Dashboard";
import Admins from "./pages/administrator/Admins";
import Roles from "./pages/administrator/Roles";
import StaffList from "./pages/administrator/StaffList";
import StaffAttendance from "./pages/administrator/StaffAttendance";
import StaffLeaves from "./pages/administrator/StaffLeaves";

// Accounting Routes
import AccountingDashboard from "./pages/accounting/Dashboard";
import Income from "./pages/accounting/Income";
import Expenses from "./pages/accounting/Expenses";
import FeeInvoices from "./pages/accounting/FeeInvoices";
import CollectPayments from "./pages/accounting/CollectPayments";
import FeeTypes from "./pages/accounting/FeeTypes";
import BulkInvoicePrints from "./pages/accounting/BulkInvoicePrints";
import InvoicesReport from "./pages/accounting/InvoicesReport";

// Examination Routes
import ExaminationDashboard from "./pages/examination/Dashboard";
import ManageExams from "./pages/examination/ManageExams";
import ManageGroups from "./pages/examination/ManageGroups";
import AdmitCards from "./pages/examination/AdmitCards";
import AdmitCardsBulkPrint from "./pages/examination/AdmitCardsBulkPrint";
import ExamResults from "./pages/examination/ExamResults";
import BulkPrintResults from "./pages/examination/BulkPrintResults";
import AcademicReport from "./pages/examination/AcademicReport";

// Transportation Routes
import TransportationDashboard from "./pages/transportation/Dashboard";
import Vehicles from "./pages/transportation/Vehicles";
import TransportRoutes from "./pages/transportation/Routes"; // Renamed to TransportRoutes
import Report from "./pages/transportation/Report";

// Activities Routes
import ActivitiesDashboard from "./pages/activities/Dashboard";
import ActivitiesList from "./pages/activities/Activities";
import Categories from "./pages/activities/Categories";
import Participation from "./pages/activities/Participation";
import Reports from "./pages/activities/Reports";

// Hostel Routes
import HostelDashboard from "./pages/hostel/Dashboard";
import Hostels from "./pages/hostel/Hostels";
import Rooms from "./pages/hostel/Rooms";

// Lessons Routes
import Lessons from "./pages/lessons/Lessons";
import Chapters from "./pages/lessons/Chapters";

// Tickets Routes
import TicketsDashboard from "./pages/tickets/Dashboard";
import Tickets from "./pages/tickets/Tickets";

// Library Routes
import LibraryDashboard from "./pages/library/Dashboard";
import AllBooks from "./pages/library/AllBooks";
import BooksIssued from "./pages/library/BooksIssued";
import LibraryCards from "./pages/library/LibraryCards";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          
          {/* Profile Routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/settings" element={<ProfileSettings />} />
          <Route path="/profile/security" element={<SecurityPage />} />
          <Route path="/profile/documents" element={<DocumentsPage />} />
          <Route path="/profile/attendance" element={<AttendancePage />} />
          <Route path="/profile/permissions" element={<PermissionsPage />} />
          <Route path="/profile/activity" element={<ActivityPage />} />
          
          {/* School Management Routes */}
          <Route path="/school-management/dashboard" element={<SchoolDashboard />} />
          <Route path="/school-management/schools" element={<Schools />} />
          <Route path="/school-management/classes" element={<Classes />} />
          <Route path="/school-management/sessions" element={<Sessions />} />
          <Route path="/school-management/settings" element={<SchoolManagementSettings />} />
          
          {/* School Routes */}
          <Route path="/school/dashboard" element={<SchoolHome />} />
          <Route path="/school/inquiries" element={<Inquiries />} />
          <Route path="/school/settings" element={<SchoolSettings />} />
          <Route path="/school/logs" element={<Logs />} />
          
          {/* Academic Routes */}
          <Route path="/academic/dashboard" element={<AcademicDashboard />} />
          <Route path="/academic/class-sections" element={<ClassSections />} />
          <Route path="/academic/medium" element={<Medium />} />
          <Route path="/academic/student-type" element={<StudentType />} />
          <Route path="/academic/subjects" element={<Subjects />} />
          <Route path="/academic/class-time-table" element={<ClassTimeTable />} />
          <Route path="/academic/attendance" element={<Attendance />} />
          <Route path="/academic/student-leaves" element={<StudentLeaves />} />
          <Route path="/academic/study-materials" element={<StudyMaterials />} />
          <Route path="/academic/homework" element={<Homework />} />
          <Route path="/academic/noticeboard" element={<Noticeboard />} />
          <Route path="/academic/event" element={<Event />} />
          <Route path="/academic/live-classes" element={<LiveClasses />} />
          <Route path="/academic/staff-ratting" element={<StaffRatting />} />
          <Route path="/academic/student-birthdays" element={<StudentBirthdays />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/admission" element={<Admission />} />
          <Route path="/student/students" element={<Students />} />
          <Route path="/student/id-cards" element={<IDCards />} />
          <Route path="/student/promote" element={<Promote />} />
          <Route path="/student/transfer-student" element={<TransferStudent />} />
          <Route path="/student/certificates" element={<Certificates />} />
          <Route path="/student/notifications" element={<Notifications />} />
          
          {/* Administrator Routes */}
          <Route path="/administrator/dashboard" element={<AdminDashboard />} />
          <Route path="/administrator/admins" element={<Admins />} />
          <Route path="/administrator/roles" element={<Roles />} />
          <Route path="/administrator/staff-list" element={<StaffList />} />
          <Route path="/administrator/staff-attendance" element={<StaffAttendance />} />
          <Route path="/administrator/staff-leaves" element={<StaffLeaves />} />
          
          {/* Accounting Routes */}
          <Route path="/accounting/dashboard" element={<AccountingDashboard />} />
          <Route path="/accounting/income" element={<Income />} />
          <Route path="/accounting/expenses" element={<Expenses />} />
          <Route path="/accounting/fee-invoices" element={<FeeInvoices />} />
          <Route path="/accounting/collect-payments" element={<CollectPayments />} />
          <Route path="/accounting/fee-types" element={<FeeTypes />} />
          <Route path="/accounting/bulk-invoice-prints" element={<BulkInvoicePrints />} />
          <Route path="/accounting/invoices-report" element={<InvoicesReport />} />
          
          {/* Examination Routes */}
          <Route path="/examination/dashboard" element={<ExaminationDashboard />} />
          <Route path="/examination/manage-exams" element={<ManageExams />} />
          <Route path="/examination/manage-groups" element={<ManageGroups />} />
          <Route path="/examination/admit-cards" element={<AdmitCards />} />
          <Route path="/examination/admit-cards-bulk-print" element={<AdmitCardsBulkPrint />} />
          <Route path="/examination/exam-results" element={<ExamResults />} />
          <Route path="/examination/bulk-print-results" element={<BulkPrintResults />} />
          <Route path="/examination/academic-report" element={<AcademicReport />} />
          
          {/* Transportation Routes */}
          <Route path="/transportation/dashboard" element={<TransportationDashboard />} />
          <Route path="/transportation/vehicles" element={<Vehicles />} />
          <Route path="/transportation/routes" element={<TransportRoutes />} /> {/* Updated to TransportRoutes */}
          <Route path="/transportation/report" element={<Report />} />
          
          {/* Activities Routes */}
          <Route path="/activities/dashboard" element={<ActivitiesDashboard />} />
          <Route path="/activities" element={<ActivitiesList />} />
          <Route path="/activities/categories" element={<Categories />} />
          <Route path="/activities/participation" element={<Participation />} />
          <Route path="/activities/reports" element={<Reports />} />
          
          {/* Hostel Routes */}
          <Route path="/hostel/dashboard" element={<HostelDashboard />} />
          <Route path="/hostel/hostels" element={<Hostels />} />
          <Route path="/hostel/rooms" element={<Rooms />} />
          
          {/* Lessons Routes */}
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/chapters" element={<Chapters />} />
          
          {/* Tickets Routes */}
          <Route path="/tickets/dashboard" element={<TicketsDashboard />} />
          <Route path="/tickets/tickets" element={<Tickets />} />
          
          {/* Library Routes */}
          <Route path="/library/dashboard" element={<LibraryDashboard />} />
          <Route path="/library/all-books" element={<AllBooks />} />
          <Route path="/library/books-issued" element={<BooksIssued />} />
          <Route path="/library/library-cards" element={<LibraryCards />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
