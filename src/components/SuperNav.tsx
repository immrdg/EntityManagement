import { useState } from 'react';
import {
  Building2,
  Search,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { NotificationPopover } from './NotificationPopover';

export function SuperNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
      <div className="max-w-[2000px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Building2 className="h-7 w-7 text-white" />
            <span className="ml-2 text-white text-lg font-semibold">EntityHub</span>
          </div>

          {/* Desktop Navigation */}

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 bg-blue-800/40 text-white placeholder-gray-300 pl-9 pr-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
            </div>

            {/* Notifications */}
            <NotificationPopover />

            {/* Profile */}
            <button className="flex items-center gap-2 text-sm text-gray-100 hover:text-white focus:outline-none">
              <img
                className="h-8 w-8 rounded-full border border-white/20"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar"
              />
              <span className="font-medium">John Doe</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-100 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-800/95 backdrop-blur-sm">
          <div className="border-t border-blue-700">
            <div className="flex items-center px-4 py-3">
              <div className="flex-shrink-0">
                <img
                  className="h-9 w-9 rounded-full border border-white/20"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">John Doe</div>
                <div className="text-sm font-medium text-gray-300">john@example.com</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}