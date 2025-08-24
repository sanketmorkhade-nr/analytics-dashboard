import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { BarChart3, User } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Analytics Dashboard</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link 
            to="/dashboard" 
            className={`text-md font-medium transition-colors hover:text-primary ${
              isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/events" 
            className={`text-md font-medium transition-colors hover:text-primary ${
              isActive('/events') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Event Explorer
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
