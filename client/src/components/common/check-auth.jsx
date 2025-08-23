import RequestPasswordReset from "@/pages/auth/request-reset-password"
import ResetPassword from "@/pages/auth/reset-password"
import VerifyCode from "@/pages/auth/verification"
import { useState } from "react"
import { useNavigate, useLocation, Navigate } from "react-router-dom"
export function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  console.log(pathname, isAuthenticated)

  if (pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/shop/home" replace />
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />
      } else {
        return <Navigate to="/shop/home" replace />
      }
    }
  }

  // Allow unauthenticated users to access shopping pages (except checkout)
  if (
    !isAuthenticated &&
    pathname.includes("/shop") &&
    !pathname.includes("/checkout") &&
    !pathname.includes("/account")
  ) {
    return <>{children}</>
  }

  // Redirect unauthenticated users to login for checkout and account pages
  if (!isAuthenticated && (pathname.includes("/checkout") || pathname.includes("/account"))) {
    return <Navigate to="/auth/login" replace />
  }

  // Redirect unauthenticated users to login for admin pages
  if (!isAuthenticated && pathname.includes("/admin")) {
    return <Navigate to="/auth/login" replace />
  }

  // Redirect authenticated users away from login/register pages
  if (isAuthenticated && (pathname.includes("/login") || pathname.includes("/register"))) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />
    } else {
      return <Navigate to="/shop/home" replace />
    }
  }

  // Protect admin routes from non-admin users
  if (isAuthenticated && user?.role !== "admin" && pathname.includes("admin")) {
    return <Navigate to="/unauth-page" replace />
  }

  // Redirect admin users away from shop pages
  if (isAuthenticated && user?.role === "admin" && pathname.includes("shop")) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <>{children}</>
}

export function PasswordResetFlow() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  const handleRequestSuccess = (userEmail) => {
    setEmail(userEmail)
    setStep(2)
  }

  const handleVerifySuccess = () => {
    setStep(3)
  }

  const handleResetSuccess = () => {
    navigate(
      "/auth/login?message=" + encodeURIComponent("Password reset successful! Please log in with your new password."),
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {step === 1 && <RequestPasswordReset onSuccess={handleRequestSuccess} />}
        {step === 2 && <VerifyCode email={email} onSuccess={handleVerifySuccess} />}
        {step === 3 && <ResetPassword onSuccess={handleResetSuccess} />}
      </div>
    </div>
  )
}

export default CheckAuth

