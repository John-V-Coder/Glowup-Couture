import { BadgeCheck, LayoutDashboard,  ShoppingBasket, ChartNoAxesCombined} from "lucide-react";
import { useNavigate } from "react-router-dom"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Fragment } from "react";
import { Mail } from "lucide-react";
import { Users } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { Settings } from "lucide-react";
import { BookTemplate } from "lucide-react";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
  {
    id: "gallery",
    label: "Gallery",
    path: "/admin/gallery",
    icon: <LayoutDashboard />,
  },
  {
    id: 'customers',
    label: 'Customers',
    path: '/admin/customers',
    icon: <Users />
  },
  {
    id: 'marketing',
    label: 'M.Campaigns',
    path: '/admin/marketing-campaign',
    icon: <Mail />,
    isSubItem: true
  },
  {
    id: 'email-templates',
    label: 'E.Templates',
    path: '/admin/email-templates',
    icon: <BookTemplate />,
    isSubItem: true
  },
  {
    id: 'newsletter',
    label: 'Newsletters',
    path: '/admin/newsletter',
    icon: <MessageSquare />,
    isSubItem: true
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/admin/analytics',
    icon: <BarChart3 />
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: <Settings />
  }
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
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
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
