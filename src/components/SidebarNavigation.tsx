
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, ChevronRight, Menu, X, Home, Settings, Users, BookOpen, UserCheck, 
  DollarSign, Award, Truck, Activity, Landmark, BookOpen as Book, LifeBuoy, Library 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  isActive?: boolean;
  to?: string;
}

const NavItem = ({ title, icon, children, isActive = false, to }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = !!children;
  
  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li className="mb-1">
      {hasChildren ? (
        <div 
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all",
            isActive && !hasChildren ? "bubble-menu-item-active" : "hover:bg-bubble-soft hover:text-bubble-primary"
          )}
          onClick={handleClick}
        >
          <div className="flex items-center gap-3">
            <span className="bubble-icon">{icon}</span>
            <span className="font-medium">{title}</span>
          </div>
          <span className="text-gray-400">
            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
        </div>
      ) : (
        <Link 
          to={to || '#'} 
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all",
            isActive ? "bubble-menu-item-active" : "hover:bg-bubble-soft hover:text-bubble-primary"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="bubble-icon">{icon}</span>
            <span className="font-medium">{title}</span>
          </div>
        </Link>
      )}
      
      {hasChildren && isOpen && (
        <ul className="ml-9 mt-1 border-l-2 border-bubble-soft pl-2 animate-fade-in">
          {children}
        </ul>
      )}
    </li>
  );
};

const SubNavItem = ({ title, isActive = false, to }: { title: string; isActive?: boolean; to: string }) => {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "block px-3 py-2 text-sm rounded-lg transition-all",
          isActive ? "bubble-menu-item-active" : "hover:bg-bubble-soft hover:text-bubble-primary"
        )}
      >
        {title}
      </Link>
    </li>
  );
};

interface SidebarNavigationProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const SidebarNavigation = ({ isSidebarOpen, setIsSidebarOpen }: SidebarNavigationProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col w-64 transition-all duration-300 ease-in-out transform bg-white border-r border-gray-100 shadow-lg lg:translate-x-0 lg:static lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <Link to="/" className="flex items-center">
          <div className="w-8 h-8 mr-2 bg-gradient-bubble rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-bubble">MySchool</h2>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(false)} 
          className="p-1 rounded-full hover:bg-gray-100 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <nav>
          <ul className="space-y-1">
            <NavItem 
              title="School Management" 
              icon={<Home size={18} />} 
              isActive={currentPath.startsWith('/school-management')}
            >
              <SubNavItem 
                title="Dashboard" 
                isActive={currentPath === '/school-management/dashboard'} 
                to="/school-management/dashboard" 
              />
              <SubNavItem 
                title="Schools" 
                isActive={currentPath === '/school-management/schools'} 
                to="/school-management/schools" 
              />
              <SubNavItem 
                title="Classes" 
                isActive={currentPath === '/school-management/classes'} 
                to="/school-management/classes" 
              />
              <SubNavItem 
                title="Sessions" 
                isActive={currentPath === '/school-management/sessions'} 
                to="/school-management/sessions" 
              />
              <SubNavItem 
                title="Settings" 
                isActive={currentPath === '/school-management/settings'} 
                to="/school-management/settings" 
              />
            </NavItem>
            
            <NavItem 
              title="School" 
              icon={<Settings size={18} />}
              isActive={currentPath.startsWith('/school')}
            >
              <SubNavItem 
                title="Dashboard" 
                isActive={currentPath === '/school/dashboard'} 
                to="/school/dashboard" 
              />
              <SubNavItem 
                title="Inquiries" 
                isActive={currentPath === '/school/inquiries'} 
                to="/school/inquiries" 
              />
              <SubNavItem 
                title="Settings" 
                isActive={currentPath === '/school/settings'} 
                to="/school/settings" 
              />
              <SubNavItem 
                title="Logs" 
                isActive={currentPath === '/school/logs'} 
                to="/school/logs" 
              />
            </NavItem>
            
            <NavItem 
              title="Academic" 
              icon={<BookOpen size={18} />}
              isActive={currentPath.startsWith('/academic')}
            >
              <SubNavItem 
                title="Dashboard" 
                isActive={currentPath === '/academic/dashboard'} 
                to="/academic/dashboard" 
              />
              <SubNavItem 
                title="Manage Class Sections" 
                isActive={currentPath === '/academic/class-sections'} 
                to="/academic/class-sections" 
              />
              <SubNavItem 
                title="Manage Medium" 
                isActive={currentPath === '/academic/medium'} 
                to="/academic/medium" 
              />
              <SubNavItem 
                title="Manage Student Type" 
                isActive={currentPath === '/academic/student-type'} 
                to="/academic/student-type" 
              />
              <SubNavItem 
                title="Subjects" 
                isActive={currentPath === '/academic/subjects'} 
                to="/academic/subjects" 
              />
              <SubNavItem 
                title="Class Time Table" 
                isActive={currentPath === '/academic/class-time-table'} 
                to="/academic/class-time-table" 
              />
              <SubNavItem 
                title="Attendance" 
                isActive={currentPath === '/academic/attendance'} 
                to="/academic/attendance" 
              />
              <SubNavItem 
                title="Student Leaves" 
                isActive={currentPath === '/academic/student-leaves'} 
                to="/academic/student-leaves" 
              />
              <SubNavItem 
                title="Study Materials" 
                isActive={currentPath === '/academic/study-materials'} 
                to="/academic/study-materials" 
              />
              <SubNavItem 
                title="Homework" 
                isActive={currentPath === '/academic/homework'} 
                to="/academic/homework" 
              />
              <SubNavItem 
                title="Noticeboard" 
                isActive={currentPath === '/academic/noticeboard'} 
                to="/academic/noticeboard" 
              />
              <SubNavItem 
                title="Event" 
                isActive={currentPath === '/academic/event'} 
                to="/academic/event" 
              />
              <SubNavItem 
                title="Live Classes" 
                isActive={currentPath === '/academic/live-classes'} 
                to="/academic/live-classes" 
              />
              <SubNavItem 
                title="Staff Ratting" 
                isActive={currentPath === '/academic/staff-ratting'} 
                to="/academic/staff-ratting" 
              />
              <SubNavItem 
                title="Student Birthdays" 
                isActive={currentPath === '/academic/student-birthdays'} 
                to="/academic/student-birthdays" 
              />
            </NavItem>
            
            <NavItem 
              title="Student" 
              icon={<Users size={18} />}
              isActive={currentPath.startsWith('/student')}
            >
              <SubNavItem 
                title="Dashboard" 
                isActive={currentPath === '/student/dashboard'} 
                to="/student/dashboard" 
              />
              <SubNavItem 
                title="Admission" 
                isActive={currentPath === '/student/admission'} 
                to="/student/admission" 
              />
              <SubNavItem 
                title="Students" 
                isActive={currentPath === '/student/students'} 
                to="/student/students" 
              />
              <SubNavItem 
                title="ID Cards" 
                isActive={currentPath === '/student/id-cards'} 
                to="/student/id-cards" 
              />
              <SubNavItem 
                title="Promote" 
                isActive={currentPath === '/student/promote'} 
                to="/student/promote" 
              />
              <SubNavItem 
                title="Transfer Student" 
                isActive={currentPath === '/student/transfer-student'} 
                to="/student/transfer-student" 
              />
              <SubNavItem 
                title="Certificates" 
                isActive={currentPath === '/student/certificates'} 
                to="/student/certificates" 
              />
              <SubNavItem 
                title="Notifications" 
                isActive={currentPath === '/student/notifications'} 
                to="/student/notifications" 
              />
            </NavItem>
            
            <NavItem 
              title="Administrator" 
              icon={<UserCheck size={18} />}
              isActive={currentPath.startsWith('/administrator')}
            >
              <SubNavItem 
                title="Dashboard" 
                isActive={currentPath === '/administrator/dashboard'} 
                to="/administrator/dashboard" 
              />
              <SubNavItem 
                title="Admins" 
                isActive={currentPath === '/administrator/admins'} 
                to="/administrator/admins" 
              />
              <SubNavItem 
                title="Roles" 
                isActive={currentPath === '/administrator/roles'} 
                to="/administrator/roles" 
              />
              <SubNavItem 
                title="Staff List" 
                isActive={currentPath === '/administrator/staff-list'} 
                to="/administrator/staff-list" 
              />
              <SubNavItem 
                title="Staff Attendance" 
                isActive={currentPath === '/administrator/staff-attendance'} 
                to="/administrator/staff-attendance" 
              />
              <SubNavItem 
                title="Staff Leaves" 
                isActive={currentPath === '/administrator/staff-leaves'} 
                to="/administrator/staff-leaves" 
              />
            </NavItem>
            
            <NavItem 
              title="Accounting" 
              icon={<DollarSign size={18} />}
              isActive={currentPath.startsWith('/accounting')}
            >
              <SubNavItem 
                title="Dashboard" 
                isActive={currentPath === '/accounting/dashboard'} 
                to="/accounting/dashboard" 
              />
              <SubNavItem 
                title="Income" 
                isActive={currentPath === '/accounting/income'} 
                to="/accounting/income" 
              />
              <SubNavItem 
                title="Expenses" 
                isActive={currentPath === '/accounting/expenses'} 
                to="/accounting/expenses" 
              />
              <SubNavItem 
                title="Fee Invoices" 
                isActive={currentPath === '/accounting/fee-invoices'} 
                to="/accounting/fee-invoices" 
              />
              <SubNavItem 
                title="Collect Payments" 
                isActive={currentPath === '/accounting/collect-payments'} 
                to="/accounting/collect-payments" 
              />
              <SubNavItem 
                title="Fee Types" 
                isActive={currentPath === '/accounting/fee-types'} 
                to="/accounting/fee-types" 
              />
              <SubNavItem 
                title="Bulk Invoice Prints" 
                isActive={currentPath === '/accounting/bulk-invoice-prints'} 
                to="/accounting/bulk-invoice-prints" 
              />
              <SubNavItem 
                title="Invoices Report" 
                isActive={currentPath === '/accounting/invoices-report'} 
                to="/accounting/invoices-report" 
              />
            </NavItem>
            
            <NavItem 
              title="Examination" 
              icon={<Award size={18} />}
              isActive={currentPath.startsWith('/examination')}
            >
              <SubNavItem 
                title="Dashboard" 
                isActive={currentPath === '/examination/dashboard'} 
                to="/examination/dashboard" 
              />
              <SubNavItem 
                title="Manage Exams" 
                isActive={currentPath === '/examination/manage-exams'} 
                to="/examination/manage-exams" 
              />
              <SubNavItem 
                title="Manage Groups" 
                isActive={currentPath === '/examination/manage-groups'} 
                to="/examination/manage-groups" 
              />
              <SubNavItem 
                title="Admit Cards" 
                isActive={currentPath === '/examination/admit-cards'} 
                to="/examination/admit-cards" 
              />
              <SubNavItem 
                title="Admit Cards Bulk Print" 
                isActive={currentPath === '/examination/admit-cards-bulk-print'} 
                to="/examination/admit-cards-bulk-print" 
              />
              <SubNavItem 
                title="Exam Results" 
                isActive={currentPath === '/examination/exam-results'} 
                to="/examination/exam-results" 
              />
              <SubNavItem 
                title="Bulk Print Results" 
                isActive={currentPath === '/examination/bulk-print-results'} 
                to="/examination/bulk-print-results" 
              />
              <SubNavItem 
                title="Academic Report" 
                isActive={currentPath === '/examination/academic-report'} 
                to="/examination/academic-report" 
              />
            </NavItem>
            
            <NavItem 
              title="Transportation" 
              icon={<Truck size={18} />}
              isActive={currentPath.startsWith('/transportation')}
            >
              <SubNavItem 
                title="Dashboard" 
                isActive={currentPath === '/transportation/dashboard'} 
                to="/transportation/dashboard" 
              />
              <SubNavItem 
                title="Vehicles" 
                isActive={currentPath === '/transportation/vehicles'} 
                to="/transportation/vehicles" 
              />
              <SubNavItem 
                title="Routes" 
                isActive={currentPath === '/transportation/routes'} 
                to="/transportation/routes" 
              />
              <SubNavItem 
                title="Report" 
                isActive={currentPath === '/transportation/report'} 
                to="/transportation/report" 
              />
            </NavItem>
            
            {/* Activities with submenu */}
            <NavItem 
              title="Activities" 
              icon={<Activity size={18} />} 
              isActive={currentPath.startsWith('/activities')}
            >
              <SubNavItem 
                title="Dashboard" 
                isActive={currentPath === '/activities/dashboard'} 
                to="/activities/dashboard" 
              />
              <SubNavItem 
                title="Activities" 
                isActive={currentPath === '/activities'} 
                to="/activities" 
              />
              <SubNavItem 
                title="Categories" 
                isActive={currentPath === '/activities/categories'} 
                to="/activities/categories" 
              />
              <SubNavItem 
                title="Participation" 
                isActive={currentPath === '/activities/participation'} 
                to="/activities/participation" 
              />
              <SubNavItem 
                title="Reports" 
                isActive={currentPath === '/activities/reports'} 
                to="/activities/reports" 
              />
            </NavItem>
            
            <NavItem 
              title="Hostel" 
              icon={<Landmark size={18} />}
              isActive={currentPath.startsWith('/hostel')}
            >
              <SubNavItem 
                title="Dashboard" 
                isActive={currentPath === '/hostel/dashboard'} 
                to="/hostel/dashboard" 
              />
              <SubNavItem 
                title="Hostels" 
                isActive={currentPath === '/hostel/hostels'} 
                to="/hostel/hostels" 
              />
              <SubNavItem 
                title="Rooms" 
                isActive={currentPath.startsWith('/hostel/rooms')} 
                to="/hostel/rooms" 
              />
              <SubNavItem 
                title="Allocations" 
                isActive={currentPath === '/hostel/allocations'} 
                to="/hostel/allocations" 
              />
              <SubNavItem 
                title="Attendance" 
                isActive={currentPath === '/hostel/attendance'} 
                to="/hostel/attendance" 
              />
              <SubNavItem 
                title="Meal Plans" 
                isActive={currentPath === '/hostel/meal-plans'} 
                to="/hostel/meal-plans" 
              />
            </NavItem>
            
            <NavItem 
              title="Lessons" 
              icon={<Book size={18} />}
              isActive={currentPath.startsWith('/lessons')}
            >
              <SubNavItem 
                title="Lessons" 
                isActive={currentPath === '/lessons'} 
                to="/lessons" 
              />
              <SubNavItem 
                title="Chapters" 
                isActive={currentPath === '/lessons/chapters'} 
                to="/lessons/chapters" 
              />
            </NavItem>
            
            <NavItem 
              title="Tickets" 
              icon={<LifeBuoy size={18} />}
              isActive={currentPath.startsWith('/tickets')}
            >
              <SubNavItem 
                title="Dashboard" 
                isActive={currentPath === '/tickets/dashboard'} 
                to="/tickets/dashboard" 
              />
              <SubNavItem 
                title="Tickets" 
                isActive={currentPath === '/tickets/tickets'} 
                to="/tickets/tickets" 
              />
            </NavItem>
            
            <NavItem 
              title="Library" 
              icon={<Library size={18} />}
              isActive={currentPath.startsWith('/library')}
            >
              <SubNavItem 
                title="Dashboard" 
                isActive={currentPath === '/library/dashboard'} 
                to="/library/dashboard" 
              />
              <SubNavItem 
                title="All Books" 
                isActive={currentPath === '/library/all-books'} 
                to="/library/all-books" 
              />
              <SubNavItem 
                title="Books Issued" 
                isActive={currentPath === '/library/books-issued'} 
                to="/library/books-issued" 
              />
              <SubNavItem 
                title="Library Cards" 
                isActive={currentPath === '/library/library-cards'} 
                to="/library/library-cards" 
              />
            </NavItem>
          </ul>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-bubble-primary/20 flex items-center justify-center">
            <span className="text-sm font-bold text-bubble-primary">JS</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNavigation;
