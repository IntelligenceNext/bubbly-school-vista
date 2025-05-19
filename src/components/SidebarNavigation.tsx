
import React, { useState } from 'react';
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
}

const NavItem = ({ title, icon, children, isActive = false }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = !!children;

  return (
    <li className="mb-1">
      <div 
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all",
          isActive && !hasChildren ? "bubble-menu-item-active" : "hover:bg-bubble-soft hover:text-bubble-primary"
        )}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <span className="bubble-icon">{icon}</span>
          <span className="font-medium">{title}</span>
        </div>
        {hasChildren && (
          <span className="text-gray-400">
            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
        )}
      </div>
      {hasChildren && isOpen && (
        <ul className="ml-9 mt-1 border-l-2 border-bubble-soft pl-2 animate-fade-in">
          {children}
        </ul>
      )}
    </li>
  );
};

const SubNavItem = ({ title, isActive = false }: { title: string; isActive?: boolean }) => {
  return (
    <li>
      <a
        href="#"
        className={cn(
          "block px-3 py-2 text-sm rounded-lg transition-all",
          isActive ? "bubble-menu-item-active" : "hover:bg-bubble-soft hover:text-bubble-primary"
        )}
      >
        {title}
      </a>
    </li>
  );
};

interface SidebarNavigationProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const SidebarNavigation = ({ isSidebarOpen, setIsSidebarOpen }: SidebarNavigationProps) => {
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col w-64 transition-all duration-300 ease-in-out transform bg-white border-r border-gray-100 shadow-lg lg:translate-x-0 lg:static lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 bg-gradient-bubble rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-bubble">MySchool</h2>
        </div>
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
            <NavItem title="School Management" icon={<Home size={18} />} isActive={true}>
              <SubNavItem title="Dashboard" isActive={true} />
              <SubNavItem title="Schools" />
              <SubNavItem title="Classes" />
              <SubNavItem title="Sessions" />
              <SubNavItem title="Settings" />
            </NavItem>
            
            <NavItem title="School" icon={<Settings size={18} />}>
              <SubNavItem title="Dashboard" />
              <SubNavItem title="Inquiries" />
              <SubNavItem title="Settings" />
              <SubNavItem title="Logs" />
            </NavItem>
            
            <NavItem title="Academic" icon={<BookOpen size={18} />}>
              <SubNavItem title="Dashboard" />
              <SubNavItem title="Manage Class Sections" />
              <SubNavItem title="Manage Medium" />
              <SubNavItem title="Manage Student Type" />
              <SubNavItem title="Subjects" />
              <SubNavItem title="Class Time Table" />
              <SubNavItem title="Attendance" />
              <SubNavItem title="Student Leaves" />
              <SubNavItem title="Study Materials" />
              <SubNavItem title="Homework" />
              <SubNavItem title="Noticeboard" />
              <SubNavItem title="Event" />
              <SubNavItem title="Live Classes" />
              <SubNavItem title="Staff Ratting" />
              <SubNavItem title="Student Birthdays" />
            </NavItem>
            
            <NavItem title="Student" icon={<Users size={18} />}>
              <SubNavItem title="Dashboard" />
              <SubNavItem title="Admission" />
              <SubNavItem title="Students" />
              <SubNavItem title="ID Cards" />
              <SubNavItem title="Promote" />
              <SubNavItem title="Transfer Student" />
              <SubNavItem title="Certificates" />
              <SubNavItem title="Notifications" />
            </NavItem>
            
            <NavItem title="Administrator" icon={<UserCheck size={18} />}>
              <SubNavItem title="Dashboard" />
              <SubNavItem title="Admins" />
              <SubNavItem title="Roles" />
              <SubNavItem title="Staff List" />
              <SubNavItem title="Staff Attendance" />
              <SubNavItem title="Staff Leaves" />
            </NavItem>
            
            <NavItem title="Accounting" icon={<DollarSign size={18} />}>
              <SubNavItem title="Dashboard" />
              <SubNavItem title="Income" />
              <SubNavItem title="Expenses" />
              <SubNavItem title="Fee Invoices" />
              <SubNavItem title="Collect Payments" />
              <SubNavItem title="Fee Types" />
              <SubNavItem title="Bulk Invoice Prints" />
              <SubNavItem title="Invoices Report" />
            </NavItem>
            
            <NavItem title="Examination" icon={<Award size={18} />}>
              <SubNavItem title="Dashboard" />
              <SubNavItem title="Manage Exams" />
              <SubNavItem title="Manage Groups" />
              <SubNavItem title="Admit Cards" />
              <SubNavItem title="Admit Cards Bulk Print" />
              <SubNavItem title="Exam Results" />
              <SubNavItem title="Bulk Print Results" />
              <SubNavItem title="Academic Report" />
            </NavItem>
            
            <NavItem title="Transportation" icon={<Truck size={18} />}>
              <SubNavItem title="Dashboard" />
              <SubNavItem title="Vehicles" />
              <SubNavItem title="Routes" />
              <SubNavItem title="Report" />
            </NavItem>
            
            <NavItem title="Activities" icon={<Activity size={18} />} />
            
            <NavItem title="Hostel" icon={<Landmark size={18} />}>
              <SubNavItem title="Dashboard" />
              <SubNavItem title="Hostels" />
              <SubNavItem title="Rooms" />
            </NavItem>
            
            <NavItem title="Lessons" icon={<Book size={18} />}>
              <SubNavItem title="Lessons" />
              <SubNavItem title="Chapters" />
            </NavItem>
            
            <NavItem title="Tickets" icon={<LifeBuoy size={18} />}>
              <SubNavItem title="Dashboard" />
              <SubNavItem title="Tickets" />
            </NavItem>
            
            <NavItem title="Library" icon={<Library size={18} />}>
              <SubNavItem title="Dashboard" />
              <SubNavItem title="All Books" />
              <SubNavItem title="Books Issued" />
              <SubNavItem title="Library Cards" />
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
