// components/auth/RequestLoginCode.jsx
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // Link added for potential future use or if a register link is re-added
import { useToast } from "@/components/ui/use-toast"; // Changed to relative path
import { requestLoginCode } from "@/store/auth-slice"; // Changed to relative path
import { requestLoginCodeFormControls } from "@/config"; // Changed to relative path
import CommonForm from "@/components/common/form"; // Changed to relative path

const RequestLoginCode = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading } = useSelector((state) => state.auth);

  const handleRequestCode = async (event) => {
    event.preventDefault();
    if (!formData.email) {
      toast({
        title: "Please enter your email.",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = await dispatch(requestLoginCode(formData.email)).unwrap();
      toast({
        title: data.message || "A login code has been sent to your email.",
      });
      // Navigate to the verification page, passing email as state
      navigate("/auth/verify-code", { state: { email: formData.email } });
    } catch (err) {
      toast({
        title: err.message || "Failed to send code.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-8 rounded-lg shadow-md bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign In
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email to receive a login code.
        </p>
      </div>

      <CommonForm
        formControls={requestLoginCodeFormControls}
        buttonText={isLoading ? "Sending..." : "Send Login Code"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleRequestCode}
        disabled={isLoading}
      />

      {/* Optional: Link to a registration page if you have one */}
      {/* <div className="text-center mt-4">
        <Link className="text-sm text-primary hover:underline" to="/auth/register">
          Create a new account
        </Link>
      </div> */}
    </div>
  );
};

export default RequestLoginCode;