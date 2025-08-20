import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";
import WhatsAppButton from "../common/whatsApp";
import ContactBar from "./adds";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Common header, made sticky to stay at the top */}
      <div className="sticky top-0 z-50 bg-white shadow-md w-full h-20">
        <ShoppingHeader/>
      </div>
      <pr/>
      <pr/>
      <pr/>
      {/* Main content area - full screen outlet */}
      <main className="flex-1 w-full">
        <Outlet /> {/* This is where nested routes will render full screen */}
      </main>
     
    
      
      {/* Footer */}
      <div className="w-full mt-auto">
        <WhatsAppButton />
        <Footer />
      </div>
    </div>
  );
}

export default ShoppingLayout;