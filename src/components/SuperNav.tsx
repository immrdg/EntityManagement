import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users2,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const ListItem = ({ className, title, children, ...props }: any) => {
  return (
    <li>
      <a
        className={cn(
          "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-blue-700",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-gray-500">
          {children}
        </p>
      </a>
    </li>
  );
};

export function SuperNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);

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
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-gray-100 hover:text-white hover:bg-white/10 px-3 py-2">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 p-2 w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2">
                      <ListItem title="Overview" href="#">
                        View your dashboard overview and key metrics
                      </ListItem>
                      <ListItem title="Analytics" href="#">
                        Detailed analytics and reports
                      </ListItem>
                      <ListItem title="Performance" href="#">
                        System performance metrics
                      </ListItem>
                      <ListItem title="Statistics" href="#">
                        Statistical data and trends
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-gray-100 hover:text-white hover:bg-white/10 px-3 py-2">
                    <Users2 className="w-4 h-4 mr-2" />
                    Entities
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 p-2 w-[200px]">
                      <ListItem title="View All" href="#">
                        Browse all entities
                      </ListItem>
                      <ListItem title="Add New" href="#">
                        Create a new entity
                      </ListItem>
                      <ListItem title="Reports" href="#">
                        Entity reports and analytics
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-gray-100 hover:text-white hover:bg-white/10 px-3 py-2">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 p-2 w-[200px]">
                      <ListItem title="Profile" href="#">
                        Manage your profile
                      </ListItem>
                      <ListItem title="Preferences" href="#">
                        System preferences
                      </ListItem>
                      <ListItem title="Security" href="#">
                        Security settings
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
            <button className="relative text-gray-100 hover:text-white focus:outline-none">
              <Bell className="h-6 w-6" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

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
          <div className="py-2">
            <a href="#" className="text-gray-100 hover:text-white block px-3 py-2 text-base font-medium">
              <LayoutDashboard className="w-4 h-4 inline-block mr-2" />
              Dashboard
            </a>
            <a href="#" className="text-gray-100 hover:text-white block px-3 py-2 text-base font-medium">
              <Users2 className="w-4 h-4 inline-block mr-2" />
              Entities
            </a>
            <a href="#" className="text-gray-100 hover:text-white block px-3 py-2 text-base font-medium">
              <Settings className="w-4 h-4 inline-block mr-2" />
              Settings
            </a>
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