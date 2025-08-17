import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";


function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex-1 flex flex-col w-full min-h-[calc(100vh-5rem)]">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
