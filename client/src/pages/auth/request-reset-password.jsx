"use client"

import CommonForm from "@/components/common/form"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { requestResetFormControls } from "@/config"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { requestPasswordReset } from "@/store/auth-slice"

const initialState = {
  email: "",
}

function RequestPasswordReset({ onSuccess }) {
  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()

  function onSubmit(event) {
    event.preventDefault()
    dispatch(requestPasswordReset(formData.email)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message || "Reset code sent to your email",
        })
        if (onSuccess) {
          onSuccess(formData.email)
        } else {
          navigate(`/auth/verify-code?email=${encodeURIComponent(formData.email)}`)
        }
      } else {
        toast({
          title: data?.payload?.message || "Failed to send reset code",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reset your password</h1>
        <p className="mt-2 text-sm text-gray-600">Enter your email address and we'll send you a verification code</p>
      </div>
      <CommonForm
        formControls={requestResetFormControls}
        buttonText={"Send Reset Code"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <div className="text-center">
        <Link className="text-sm text-primary hover:underline" to="/auth/login">
          Back to login
        </Link>
      </div>
    </div>
  )
}

export default RequestPasswordReset;
