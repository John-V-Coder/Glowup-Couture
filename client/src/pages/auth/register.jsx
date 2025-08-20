import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerFormControls } from "@/config";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/store/auth-slice";
import PageWrapper from "@/components/common/page-wrapper";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister({ embedded = false, redirectTo = "/shop/home" }) {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        // After registration, send user to checkout to continue
        navigate(redirectTo || "/auth/login");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <PageWrapper message="Loading registration...">
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create Account
        </h1>
        {!embedded && (
          <p className="mt-2">
            Already Registered Account
            <Link
              className="font-medium ml-2 text-primary hover:underline border border-gray-300 px-3 py-1 rounded"
              to="/auth/login"
            >
              Login
            </Link>
          </p>
        )}
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
    </PageWrapper>
  );
}

export default AuthRegister;
