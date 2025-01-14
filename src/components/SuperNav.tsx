import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  Search,
  Menu,
  X,
  ChevronDown,
  Code2
} from 'lucide-react';
import { NotificationPopover } from './NotificationPopover';

export function SuperNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname === '/evaluator' ? 'evaluator' : 'entities';

  const handleViewChange = (view: 'entities' | 'evaluator') => {
    navigate(view === 'entities' ? '/' : '/evaluator');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
      <div className="max-w-[2000px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => handleViewChange('entities')}
            >
              <Building2 className="h-7 w-7 text-white" />
              <span className="ml-2 text-white text-lg font-semibold">EntityHub</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-4">
              <button
                onClick={() => handleViewChange('entities')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'entities'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                Entities
              </button>
              <button
                onClick={() => handleViewChange('evaluator')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'evaluator'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Code2 className="w-4 h-4" />
                Expression Evaluator
              </button>
            </div>
          </div>

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
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleViewChange('entities')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                currentView === 'entities'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              Entities
            </button>
            <button
              onClick={() => handleViewChange('evaluator')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                currentView === 'evaluator'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Expression Evaluator
            </button>
          </div>
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