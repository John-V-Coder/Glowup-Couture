import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetPassword, logoutUser } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid or missing reset token.",
        description: "Please request a new password reset link.",
        variant: "destructive",
      });
      navigate("/auth/login");
    }
  }, [token, navigate, toast]);

  const handleReset = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    dispatch(resetPassword({ token, password: formData.password }))
      .unwrap()
      .then((res) => {
        toast({
          title: res.message || "Password has been reset successfully.",
        });
        // Log out any active session before redirecting to login
        dispatch(logoutUser());
        setTimeout(() => navigate("/auth/login", { replace: true }), 2000);
      })
      .catch((err) => {
        toast({
          title: err.message || "An error occurred.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!token) {
    return null; // or a loading/error state while redirecting
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Reset Your Password
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter and confirm your new password.
        </p>
      </div>
      <form onSubmit={handleReset} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
