import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import PageWrapper from "@/components/common/page-wrapper";
import CommonForm from "@/components/common/form";
import { requestPasswordReset } from "@/store/auth-slice";

const initialState = {
  email: "",
};

const forgotPasswordFormControls = [
  {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email address",
    type: "email",
    required: true,
  },
];

function ForgotPassword() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const onSubmit = (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast({
        title: "Email is required",
        variant: "destructive",
      });
      return;
    }

    dispatch(requestPasswordReset(formData.email)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message || "Password reset link sent!",
        });
        setFormData(initialState);
      } else {
        toast({
          title: data?.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <PageWrapper message="Loading reset password...">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        <CommonForm
          formControls={forgotPasswordFormControls}
          buttonText={isLoading ? "Sending..." : "Send Reset Link"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />

        <div className="text-center text-sm">
          <Link to="/auth/login" className="text-primary hover:underline">
            ← Back to Login
          </Link>
          <div className="mt-2">
            Don’t have an account?{" "}
            <Link to="/auth/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default ForgotPassword;
