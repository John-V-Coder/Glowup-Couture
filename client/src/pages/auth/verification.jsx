"use client"

import CommonForm from "@/components/common/form"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { verifyCodeFormControls } from "@/config"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { verifyResetCode } from "@/store/auth-slice"

function VerifyCode({ email: propEmail, onSuccess }) {
  const [searchParams] = useSearchParams()
  const emailFromUrl = searchParams.get("email")

  const [formData, setFormData] = useState({
    email: propEmail || emailFromUrl || "",
    code: "",
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (propEmail) {
      setFormData((prev) => ({ ...prev, email: propEmail }))
    }
  }, [propEmail])

  function onSubmit(event) {
    event.preventDefault()
    dispatch(verifyResetCode({ email: formData.email, code: formData.code })).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message || "Code verified successfully",
        })
        if (onSuccess) {
          onSuccess()
        } else {
          navigate("/auth/reset-password")
        }
      } else {
        toast({
          title: data?.payload?.message || "Invalid or expired code",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Verify reset code</h1>
        <p className="mt-2 text-sm text-gray-600">Enter the 6-digit code sent to your email</p>
      </div>
      <CommonForm
        formControls={verifyCodeFormControls}
        buttonText={"Verify Code"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <div className="text-center">
        <Link className="text-sm text-primary hover:underline" to="/auth/forgot-password">
          Didn't receive code? Request new one
        </Link>
      </div>
    </div>
  )
}

export default VerifyCode;
