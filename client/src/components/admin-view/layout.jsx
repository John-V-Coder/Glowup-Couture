import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="min-h-screen w-full">
      {/* Admin sidebar - positioned like header */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      
      {/* Admin header */}
      <AdminHeader setOpen={setOpenSidebar} />
      
      {/* Main content area */}
      <main className="flex-1 flex flex-col p-6 lg:p-8 lg:pl-80 overflow-y-auto">
        <div className="flex-1 space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;