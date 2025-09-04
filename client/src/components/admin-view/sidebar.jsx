// File: src/components/admin/AdminSideBar.jsx

import { 
  BadgeCheck, 
  LayoutDashboard, 
  ShoppingBasket, 
  ChartNoAxesCombined,
  Mail,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  BookTemplate,
  ImageIcon,
  Tag
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Fragment, useState } from "react";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket size={20} />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck size={20} />,
  },
  {
    id: "gallery",
    label: "Gallery",
    path: "/admin/gallery",
    icon: <ImageIcon size={20} />,
  },
  {
    id: 'customers',
    label: 'Customers',
    path: '/admin/customers',
    icon: <Users size={20} />
  },
  // New Menu Item for Email Management
  {
    id: 'email',
    label: 'Email Marketing',
    icon: <Mail size={20} />,
    isCollapsible: true, // Indicates this is a collapsible parent item
    subItems: [
      {
        id: 'campaigns',
        label: 'Marketing Campaigns',
        path: '/admin/email/campaigns',
        icon: <MessageSquare size={20} />,
      },
      {
        id: 'templates',
        label: 'Email Templates',
        path: '/admin/email/templates',
        icon: <BookTemplate size={20} />,
      },
      {
        id: 'subscribers',
        label: 'Email Subscribers',
        path: '/admin/email/subscribers',
        icon: <Users size={20} />,
      }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/admin/analysis',
    icon: <BarChart3 size={20} />
  },
  {
    id: 'coupons',
    label: 'Coupons',
    path: '/admin/coupons',
    icon: <Tag size={20} />
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: <Settings size={20} />
  }
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleSubMenuClick = (id) => {
    setOpenSubMenu(openSubMenu === id ? null : id);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <nav className="mt-6 flex-col flex gap-1 px-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <Fragment key={menuItem.id}>
          {menuItem.isCollapsible ? (
            // Collapsible parent item
            <div
              onClick={() => handleSubMenuClick(menuItem.id)}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 text-sm font-medium mb-1"
            >
              <div className="flex-shrink-0">
                {menuItem.icon}
              </div>
              <span className="truncate">{menuItem.label}</span>
            </div>
          ) : (
            // Regular menu item
            <div
              onClick={() => handleNavigation(menuItem.path)}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 text-sm font-medium mb-1"
            >
              <div className="flex-shrink-0">
                {menuItem.icon}
              </div>
              <span className="truncate">{menuItem.label}</span>
            </div>
          )}

          {/* Render sub-items if the parent is collapsible and open */}
          {menuItem.isCollapsible && openSubMenu === menuItem.id && (
            <div className="ml-6 mb-2">
              <div className="border-l-2 border-muted pl-4 flex flex-col gap-1">
                {menuItem.subItems.map((subItem) => (
                  <div
                    key={subItem.id}
                    onClick={() => handleNavigation(subItem.path)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 text-sm"
                  >
                    <div className="flex-shrink-0">
                      {subItem.icon}
                    </div>
                    <span className="truncate">{subItem.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b px-6 py-6">
              <SheetTitle className="flex gap-3 items-center">
                <ChartNoAxesCombined size={28} className="text-primary" />
                <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              <MenuItems setOpen={setOpen} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden lg:block fixed left-0 top-0 w-72 h-screen bg-background z-20">
        <div className="flex flex-col h-full">
          <div className="px-6 py-6">
            <div
              onClick={() => navigate("/admin/dashboard")}
              className="flex cursor-pointer items-center gap-3 hover:opacity-80 transition-opacity duration-200"
            >
              <ChartNoAxesCombined size={28} className="text-primary" />
              <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <MenuItems />
          </div>
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;