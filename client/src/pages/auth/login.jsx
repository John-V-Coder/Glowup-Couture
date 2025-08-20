import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { loginFormControls } from "@/config";
import Preloader from "@/components/common/preloader";
import PageWrapper from "@/components/common/page-wrapper";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin({ embedded = false, redirectTo = "/shop/home" }) {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate(redirectTo || "/shop/home");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <PageWrapper message="Loading login...">
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          LogIn Account
        </h1>
        {!embedded && (
          <p className="mt-2">
            Don't Have Account
            <Link
              className="font-medium ml-2 text-primary hover:underline border border-gray-300 px-3 py-1 rounded"
              to="/auth/register"
            >
              Register
            </Link>
          </p>
        )}
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
    </PageWrapper>
  );
}

export default AuthLogin;
