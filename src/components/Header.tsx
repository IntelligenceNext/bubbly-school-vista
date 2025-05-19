
import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  setIsSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
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
          <div className="h-9 w-9 rounded-full bg-gradient-bubble flex items-center justify-center">
            <span className="text-sm font-bold text-white">JS</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
