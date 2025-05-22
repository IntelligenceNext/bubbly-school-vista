
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, Menu, Settings, User, LogOut, UserCog, FileText, Calendar, Shield, Key, Moon, Sun, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  setIsSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3">
      <div className="flex items-center lg:hidden">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 w-96 border border-gray-100">
        <Search className="h-4 w-4 text-gray-400 mr-2" />
        <input 
          type="text"
          placeholder="Search anything..."
          className="bg-transparent border-none outline-none text-sm flex-1"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button className="bubble-icon">
            <Bell size={18} />
          </button>
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-bubble-primary">
            3
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0 relative">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/profile-placeholder.jpg" alt="User profile" />
                  <AvatarFallback className="bg-gradient-bubble text-white">JS</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Smith</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@school.edu</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile/documents">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Documents</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile/attendance">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Attendance & Leave</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/profile/permissions">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Permissions</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile/security">
                    <Key className="mr-2 h-4 w-4" />
                    <span>Security</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === 'light' ? (
                    <Moon className="mr-2 h-4 w-4" />
                  ) : (
                    <Sun className="mr-2 h-4 w-4" />
                  )}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile/activity">
                    <History className="mr-2 h-4 w-4" />
                    <span>Activity Log</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
