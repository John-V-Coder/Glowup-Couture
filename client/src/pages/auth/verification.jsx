// components/auth/VerifyLoginCode.jsx
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"; // Changed to relative path
import { verifyLoginCode, requestLoginCode } from "@/store/auth-slice"; // Changed to relative path
import { verifyLoginCodeFormControls } from "@/config"; // Changed to relative path
import CommonForm from "@/components/common/form"; // Changed to relative path

const VerifyLoginCode = () => {
  const location = useLocation();
  const initialEmail = location.state?.email || ""; // Get email from navigation state

  const [formData, setFormData] = useState({
    email: initialEmail,
    code: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading } = useSelector((state) => state.auth);

  // Redirect if no email is provided (e.g., direct access)
  useEffect(() => {
    if (!initialEmail) {
      toast({
        title: "Please request a login code first.",
        variant: "destructive",
      });
      navigate("/auth/login"); // Redirect back to the request page
    }
  }, [initialEmail, navigate, toast]);

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    if (!formData.email || !formData.code) {
      toast({
        title: "Please enter both email and code.",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = await dispatch(verifyLoginCode(formData)).unwrap();
      toast({
        title: data.message || "Login successful!",
      });

      // Navigate based on user role
      if (data.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/shop/home");
      }
    } catch (err) {
      toast({
        title: err.message || "Invalid or expired code.",
        variant: "destructive",
      });
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-8 rounded-lg shadow-md bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Verify Login
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          A code has been sent to{" "}
          <span className="font-semibold">{formData.email}</span>.
        </p>
      </div>

      <CommonForm
        formControls={verifyLoginCodeFormControls}
        buttonText={isLoading ? "Verifying..." : "Verify & Log In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleVerifyCode}
        disabled={isLoading}
      />
      
      <div className="flex flex-col space-y-2 text-center mt-4">
        {/* Link to go back to the initial login page (absolute path) */}
        <Link
          className="text-sm text-gray-500 hover:underline"
          to="/auth/login" // Changed to absolute path
        >
          Didn't receive a code? Resend
        </Link>
      </div>
    </div>
  );
};

export default VerifyLoginCode;
