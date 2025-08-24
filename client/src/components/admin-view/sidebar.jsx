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
  ImageIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Fragment } from "react";

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
  {
    id: 'marketing',
    label: 'M.Campaigns',
    path: '/admin/marketing-campaign',
    icon: <Mail size={20} />,
    isSubItem: true
  },
  {
    id: 'email-templates',
    label: 'E.Templates',
    path: '/admin/email-templates',
    icon: <BookTemplate size={20} />,
    isSubItem: true
  },
  {
    id: 'newsletter',
    label: 'Newsletters',
    path: '/admin/newsletter',
    icon: <MessageSquare size={20} />,
    isSubItem: true
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/admin/analysis',
    icon: <BarChart3 size={20} />
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

  return (
    <nav className="mt-8 flex-col flex gap-3">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 ${
            menuItem.isSubItem ? 'ml-4 text-sm' : 'text-base font-medium'
          }`}
        >
          <div className="flex-shrink-0">
            {menuItem.icon}
          </div>
          <span className="truncate">{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-4">
              <SheetTitle className="flex gap-3 mt-6 mb-6">
                <ChartNoAxesCombined size={32} className="text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-72 flex-col border-r bg-background p-6 lg:flex shadow-sm">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-3 mb-8 hover:opacity-80 transition-opacity duration-200"
        >
          <ChartNoAxesCombined size={32} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;