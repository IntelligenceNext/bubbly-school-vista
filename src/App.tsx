import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrentSchoolProvider } from "@/contexts/CurrentSchoolContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { TenantSelectionPage } from "@/components/common/TenantSelector";
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
import CreateInquiry from "./pages/school/CreateInquiry";
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentSchoolProvider>
        <TenantProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Auth Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/select-tenant" element={<TenantSelectionPage />} />
              
              {/* Profile Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/profile/settings" element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              } />
              <Route path="/profile/security" element={
                <ProtectedRoute>
                  <SecurityPage />
                </ProtectedRoute>
              } />
              <Route path="/profile/documents" element={
                <ProtectedRoute>
                  <DocumentsPage />
                </ProtectedRoute>
              } />
              <Route path="/profile/attendance" element={
                <ProtectedRoute>
                  <AttendancePage />
                </ProtectedRoute>
              } />
              <Route path="/profile/permissions" element={
                <ProtectedRoute>
                  <PermissionsPage />
                </ProtectedRoute>
              } />
              <Route path="/profile/activity" element={
                <ProtectedRoute>
                  <ActivityPage />
                </ProtectedRoute>
              } />
              
              {/* School Management Routes */}
              <Route path="/school-management/dashboard" element={
                <ProtectedRoute requiredModule="administration">
                  <SchoolDashboard />
                </ProtectedRoute>
              } />
              <Route path="/school-management/schools" element={
                <ProtectedRoute requiredPermission={{ resource: 'system.schools', action: 'manage' }}>
                  <Schools />
                </ProtectedRoute>
              } />
              <Route path="/school-management/classes" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.classes', action: 'manage' }}>
                  <Classes />
                </ProtectedRoute>
              } />
              <Route path="/school-management/sessions" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.sessions', action: 'manage' }}>
                  <Sessions />
                </ProtectedRoute>
              } />
              <Route path="/school-management/settings" element={
                <ProtectedRoute requiredPermission={{ resource: 'system.settings', action: 'manage' }}>
                  <SchoolManagementSettings />
                </ProtectedRoute>
              } />
              
              {/* School Routes */}
              <Route path="/school/dashboard" element={<SchoolHome />} />
              <Route path="/school/inquiries" element={<Inquiries />} />
              <Route path="/school/inquiries/create" element={<CreateInquiry />} />
              <Route path="/school/settings" element={<SchoolSettings />} />
              <Route path="/school/logs" element={<Logs />} />
              
              {/* Academic Routes */}
              <Route path="/academic/dashboard" element={
                <ProtectedRoute requiredModule="academic">
                  <AcademicDashboard />
                </ProtectedRoute>
              } />
              <Route path="/academic/class-sections" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.classes', action: 'manage' }}>
                  <ClassSections />
                </ProtectedRoute>
              } />
              <Route path="/academic/medium" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.settings', action: 'manage' }}>
                  <Medium />
                </ProtectedRoute>
              } />
              <Route path="/academic/student-type" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.settings', action: 'manage' }}>
                  <StudentType />
                </ProtectedRoute>
              } />
              <Route path="/academic/subjects" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.subjects', action: 'manage' }}>
                  <Subjects />
                </ProtectedRoute>
              } />
              <Route path="/academic/class-time-table" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.timetable', action: 'manage' }}>
                  <ClassTimeTable />
                </ProtectedRoute>
              } />
              <Route path="/academic/attendance" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.attendance', action: 'manage' }}>
                  <Attendance />
                </ProtectedRoute>
              } />
              <Route path="/academic/student-leaves" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.leaves', action: 'manage' }}>
                  <StudentLeaves />
                </ProtectedRoute>
              } />
              <Route path="/academic/study-materials" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.materials', action: 'read' }}>
                  <StudyMaterials />
                </ProtectedRoute>
              } />
              <Route path="/academic/homework" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.homework', action: 'manage' }}>
                  <Homework />
                </ProtectedRoute>
              } />
              <Route path="/academic/noticeboard" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.noticeboard', action: 'manage' }}>
                  <Noticeboard />
                </ProtectedRoute>
              } />
              <Route path="/academic/event" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.events', action: 'manage' }}>
                  <Event />
                </ProtectedRoute>
              } />
              <Route path="/academic/live-classes" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.live_classes', action: 'manage' }}>
                  <LiveClasses />
                </ProtectedRoute>
              } />
              <Route path="/academic/staff-ratting" element={
                <ProtectedRoute requiredPermission={{ resource: 'staff.ratings', action: 'manage' }}>
                  <StaffRatting />
                </ProtectedRoute>
              } />
              <Route path="/academic/student-birthdays" element={
                <ProtectedRoute requiredPermission={{ resource: 'students.birthdays', action: 'read' }}>
                  <StudentBirthdays />
                </ProtectedRoute>
              } />
              
              {/* Student Routes */}
              <Route path="/student/dashboard" element={
                <ProtectedRoute requiredModule="student_management">
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/admission" element={
                <ProtectedRoute requiredPermission={{ resource: 'students.admissions', action: 'manage' }}>
                  <Admission />
                </ProtectedRoute>
              } />
              <Route path="/student/students" element={
                <ProtectedRoute requiredPermission={{ resource: 'students', action: 'read' }}>
                  <Students />
                </ProtectedRoute>
              } />
              <Route path="/student/id-cards" element={
                <ProtectedRoute requiredPermission={{ resource: 'students.id_cards', action: 'manage' }}>
                  <IDCards />
                </ProtectedRoute>
              } />
              <Route path="/student/promote" element={
                <ProtectedRoute requiredPermission={{ resource: 'students.promotion', action: 'manage' }}>
                  <Promote />
                </ProtectedRoute>
              } />
              <Route path="/student/transfer-student" element={
                <ProtectedRoute requiredPermission={{ resource: 'students.transfer', action: 'manage' }}>
                  <TransferStudent />
                </ProtectedRoute>
              } />
              <Route path="/student/certificates" element={
                <ProtectedRoute requiredPermission={{ resource: 'students.certificates', action: 'manage' }}>
                  <Certificates />
                </ProtectedRoute>
              } />
              <Route path="/student/notifications" element={
                <ProtectedRoute requiredPermission={{ resource: 'students.notifications', action: 'manage' }}>
                  <Notifications />
                </ProtectedRoute>
              } />
              
              {/* Administrator Routes */}
              <Route path="/administrator/dashboard" element={
                <ProtectedRoute requiredModule="staff_management">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/administrator/admins" element={
                <ProtectedRoute requiredPermission={{ resource: 'system.users', action: 'manage' }}>
                  <Admins />
                </ProtectedRoute>
              } />
              <Route path="/administrator/roles" element={
                <ProtectedRoute requiredPermission={{ resource: 'system.roles', action: 'manage' }}>
                  <Roles />
                </ProtectedRoute>
              } />
              <Route path="/administrator/staff-list" element={
                <ProtectedRoute requiredPermission={{ resource: 'staff', action: 'read' }}>
                  <StaffList />
                </ProtectedRoute>
              } />
              <Route path="/administrator/staff-attendance" element={
                <ProtectedRoute requiredPermission={{ resource: 'staff.attendance', action: 'manage' }}>
                  <StaffAttendance />
                </ProtectedRoute>
              } />
              <Route path="/administrator/staff-leaves" element={
                <ProtectedRoute requiredPermission={{ resource: 'staff.leaves', action: 'manage' }}>
                  <StaffLeaves />
                </ProtectedRoute>
              } />
              
              {/* Accounting Routes */}
              <Route path="/accounting/dashboard" element={
                <ProtectedRoute requiredModule="accounting">
                  <AccountingDashboard />
                </ProtectedRoute>
              } />
              <Route path="/accounting/income" element={
                <ProtectedRoute requiredPermission={{ resource: 'accounting.income', action: 'manage' }}>
                  <Income />
                </ProtectedRoute>
              } />
              <Route path="/accounting/expenses" element={
                <ProtectedRoute requiredPermission={{ resource: 'accounting.expenses', action: 'manage' }}>
                  <Expenses />
                </ProtectedRoute>
              } />
              <Route path="/accounting/fee-invoices" element={
                <ProtectedRoute requiredPermission={{ resource: 'accounting.invoices', action: 'manage' }}>
                  <FeeInvoices />
                </ProtectedRoute>
              } />
              <Route path="/accounting/collect-payments" element={
                <ProtectedRoute requiredPermission={{ resource: 'accounting.payments', action: 'manage' }}>
                  <CollectPayments />
                </ProtectedRoute>
              } />
              <Route path="/accounting/fee-types" element={
                <ProtectedRoute requiredPermission={{ resource: 'accounting.fee_types', action: 'manage' }}>
                  <FeeTypes />
                </ProtectedRoute>
              } />
              <Route path="/accounting/bulk-invoice-prints" element={
                <ProtectedRoute requiredPermission={{ resource: 'accounting.reports', action: 'export' }}>
                  <BulkInvoicePrints />
                </ProtectedRoute>
              } />
              <Route path="/accounting/invoices-report" element={
                <ProtectedRoute requiredPermission={{ resource: 'accounting.reports', action: 'read' }}>
                  <InvoicesReport />
                </ProtectedRoute>
              } />
              
              {/* Examination Routes */}
              <Route path="/examination/dashboard" element={
                <ProtectedRoute requiredModule="examination">
                  <ExaminationDashboard />
                </ProtectedRoute>
              } />
              <Route path="/examination/manage-exams" element={
                <ProtectedRoute requiredPermission={{ resource: 'examination.exams', action: 'manage' }}>
                  <ManageExams />
                </ProtectedRoute>
              } />
              <Route path="/examination/manage-groups" element={
                <ProtectedRoute requiredPermission={{ resource: 'examination.groups', action: 'manage' }}>
                  <ManageGroups />
                </ProtectedRoute>
              } />
              <Route path="/examination/admit-cards" element={
                <ProtectedRoute requiredPermission={{ resource: 'examination.admit_cards', action: 'manage' }}>
                  <AdmitCards />
                </ProtectedRoute>
              } />
              <Route path="/examination/admit-cards-bulk-print" element={
                <ProtectedRoute requiredPermission={{ resource: 'examination.reports', action: 'export' }}>
                  <AdmitCardsBulkPrint />
                </ProtectedRoute>
              } />
              <Route path="/examination/exam-results" element={
                <ProtectedRoute requiredPermission={{ resource: 'examination.results', action: 'manage' }}>
                  <ExamResults />
                </ProtectedRoute>
              } />
              <Route path="/examination/bulk-print-results" element={
                <ProtectedRoute requiredPermission={{ resource: 'examination.reports', action: 'export' }}>
                  <BulkPrintResults />
                </ProtectedRoute>
              } />
              <Route path="/examination/academic-report" element={
                <ProtectedRoute requiredPermission={{ resource: 'examination.reports', action: 'read' }}>
                  <AcademicReport />
                </ProtectedRoute>
              } />
              
              {/* Transportation Routes */}
              <Route path="/transportation/dashboard" element={
                <ProtectedRoute requiredModule="transportation">
                  <TransportationDashboard />
                </ProtectedRoute>
              } />
              <Route path="/transportation/vehicles" element={
                <ProtectedRoute requiredPermission={{ resource: 'transportation.vehicles', action: 'manage' }}>
                  <Vehicles />
                </ProtectedRoute>
              } />
              <Route path="/transportation/routes" element={
                <ProtectedRoute requiredPermission={{ resource: 'transportation.routes', action: 'manage' }}>
                  <TransportRoutes />
                </ProtectedRoute>
              } />
              <Route path="/transportation/report" element={
                <ProtectedRoute requiredPermission={{ resource: 'transportation.reports', action: 'read' }}>
                  <Report />
                </ProtectedRoute>
              } />
              
              {/* Activities Routes */}
              <Route path="/activities/dashboard" element={
                <ProtectedRoute requiredModule="activities">
                  <ActivitiesDashboard />
                </ProtectedRoute>
              } />
              <Route path="/activities" element={
                <ProtectedRoute requiredPermission={{ resource: 'activities', action: 'read' }}>
                  <ActivitiesList />
                </ProtectedRoute>
              } />
              <Route path="/activities/categories" element={
                <ProtectedRoute requiredPermission={{ resource: 'activities.categories', action: 'manage' }}>
                  <Categories />
                </ProtectedRoute>
              } />
              <Route path="/activities/participation" element={
                <ProtectedRoute requiredPermission={{ resource: 'activities.participation', action: 'manage' }}>
                  <Participation />
                </ProtectedRoute>
              } />
              <Route path="/activities/reports" element={
                <ProtectedRoute requiredPermission={{ resource: 'activities.reports', action: 'read' }}>
                  <Reports />
                </ProtectedRoute>
              } />
              
              {/* Hostel Routes */}
              <Route path="/hostel/dashboard" element={
                <ProtectedRoute requiredModule="hostel">
                  <HostelDashboard />
                </ProtectedRoute>
              } />
              <Route path="/hostel/hostels" element={
                <ProtectedRoute requiredPermission={{ resource: 'hostel.hostels', action: 'manage' }}>
                  <Hostels />
                </ProtectedRoute>
              } />
              <Route path="/hostel/rooms" element={
                <ProtectedRoute requiredPermission={{ resource: 'hostel.rooms', action: 'manage' }}>
                  <Rooms />
                </ProtectedRoute>
              } />
              
              {/* Lessons Routes */}
              <Route path="/lessons" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.lessons', action: 'read' }}>
                  <Lessons />
                </ProtectedRoute>
              } />
              <Route path="/lessons/chapters" element={
                <ProtectedRoute requiredPermission={{ resource: 'academic.chapters', action: 'manage' }}>
                  <Chapters />
                </ProtectedRoute>
              } />
              
              {/* Tickets Routes */}
              <Route path="/tickets/dashboard" element={
                <ProtectedRoute requiredModule="tickets">
                  <TicketsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/tickets/tickets" element={
                <ProtectedRoute requiredPermission={{ resource: 'tickets', action: 'manage' }}>
                  <Tickets />
                </ProtectedRoute>
              } />
              
              {/* Library Routes */}
              <Route path="/library/dashboard" element={
                <ProtectedRoute requiredModule="library">
                  <LibraryDashboard />
                </ProtectedRoute>
              } />
              <Route path="/library/all-books" element={
                <ProtectedRoute requiredPermission={{ resource: 'library.books', action: 'read' }}>
                  <AllBooks />
                </ProtectedRoute>
              } />
              <Route path="/library/books-issued" element={
                <ProtectedRoute requiredPermission={{ resource: 'library.issued_books', action: 'manage' }}>
                  <BooksIssued />
                </ProtectedRoute>
              } />
              <Route path="/library/library-cards" element={
                <ProtectedRoute requiredPermission={{ resource: 'library.cards', action: 'manage' }}>
                  <LibraryCards />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CurrentSchoolProvider>
    </QueryClientProvider>
  );
}

export default App;
