import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { BarChart3, User, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity" onClick={closeMobileMenu}>
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-xl font-bold hidden sm:inline">Analytics Dashboard</span>
            <span className="text-lg font-bold sm:hidden">Analytics</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
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
          <Link 
            to="/retention" 
            className={`text-md font-medium transition-colors hover:text-primary ${
              isActive('/retention') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Retention
          </Link>
        </nav>

        {/* User Menu and Mobile Menu Button */}
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {theme === 'light' ? (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Light Mode
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link 
              to="/dashboard" 
              className={`block py-2 px-3 rounded-md text-base font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary hover:bg-muted'
              }`}
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>
            <Link 
              to="/events" 
              className={`block py-2 px-3 rounded-md text-base font-medium transition-colors ${
                isActive('/events') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary hover:bg-muted'
              }`}
              onClick={closeMobileMenu}
            >
              Event Explorer
            </Link>
            <Link 
              to="/retention" 
              className={`block py-2 px-3 rounded-md text-base font-medium transition-colors ${
                isActive('/retention') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary hover:bg-muted'
              }`}
              onClick={closeMobileMenu}
            >
              Retention
            </Link>
            <div className="pt-2 border-t">
              <div className="flex items-center space-x-2 py-2 px-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">User Menu</span>
              </div>
              <div className="space-y-1">
                <button 
                  className="block w-full text-left py-2 px-3 rounded-md text-sm text-muted-foreground hover:text-primary hover:bg-muted flex items-center"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Light Mode
                    </>
                  )}
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
