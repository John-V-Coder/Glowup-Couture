import { LogOut, AlignJustify } from "lucide-react";
import { Button } from "../ui/button";
import { logoutUser, resetAuthState } from "@/store/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  function handleLogout() {
    // First attempt server logout
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        // Server logout successful
        sessionStorage.clear();
        localStorage.clear(); // Also clear localStorage for completeness
        navigate("/shop/home");
      })
      .catch((error) => {
        // Server logout failed, but still clear client state
        console.warn("Server logout failed:", error);
        dispatch(resetAuthState());
        sessionStorage.clear();
        localStorage.clear();
        navigate("/shop/home");
      });
  }

  // Alternative simpler logout if you don't need server-side logout
  function handleSimpleLogout() {
    dispatch(resetAuthState());
    sessionStorage.clear();
    localStorage.clear();
    navigate("/shop/home");
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background sticky top-0 z-10 lg:ml-72">
      <Button 
        onClick={() => setOpen(true)} 
        className="lg:hidden sm:block"
        variant="ghost"
        size="sm"
      >
        <AlignJustify className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 transition-all duration-200"
          variant="default"
        >
          <LogOut className="h-4 w-4" />
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;