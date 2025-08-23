"use client"

import CommonForm from "@/components/common/form"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { resetPasswordFormControls } from "@/config"
import { useNavigate } from "react-router-dom"
import { resetPassword } from "@/store/auth-slice"

const initialState = {
  newPassword: "",
  confirmPassword: "",
}

function ResetPassword({ onSuccess }) {
  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { resetToken } = useSelector((state) => state.auth)

  function onSubmit(event) {
    event.preventDefault()

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      toast({
        title: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    dispatch(
      resetPassword({
        resetToken,
        newPassword: formData.newPassword,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message || "Password reset successful",
        })
        if (onSuccess) {
          onSuccess()
        } else {
          navigate(
            "/auth/login?message=" +
              encodeURIComponent("Password reset successful! Please log in with your new password."),
          )
        }
      } else {
        toast({
          title: data?.payload?.message || "Failed to reset password",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Set new password</h1>
        <p className="mt-2 text-sm text-gray-600">Enter your new password below</p>
      </div>
      <CommonForm
        formControls={resetPasswordFormControls}
        buttonText={"Reset Password"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default ResetPassword

