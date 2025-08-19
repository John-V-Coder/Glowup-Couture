import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";
import WhatsAppButton from "../common/whatsApp";
import ContactBar from "./adds";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Common header, made sticky to stay at the top */}
      <div className="sticky top-0 z-50 bg-white shadow-md w-full h-20"> {/* Added h-20 for explicit height */}
        <ShoppingHeader/>
      </div>
      {/* Main content area, pushed down by the header's height */}
      <main className="flex-1 flex flex-col w-full pt-20"> {/* Added pt-20 to offset the sticky header */}
        <Outlet /> {/* This is where nested routes (like ShoppingHome) will render */}
      </main>
     <ContactBar />
      {/* Footer can be added here if needed */}
      <div className="w-full mt-auto"> 
        <WhatsAppButton />{/* mt-auto pushes footer to bottom */}
        <Footer />
      </div>
    </div>
  );
}

export default ShoppingLayout;
