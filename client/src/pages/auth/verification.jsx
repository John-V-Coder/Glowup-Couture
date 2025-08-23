"use client"

import CommonForm from "@/components/common/form"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { verifyCodeFormControls } from "@/config"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { verifyResetCode, clearAllMessages } from "@/store/auth-slice"

function VerifyCode({ email: propEmail, onSuccess }) {
  const [searchParams] = useSearchParams()
  const emailFromUrl = searchParams.get("email")
  const codeFromUrl = searchParams.get("code")

  const [formData, setFormData] = useState({
    email: propEmail || emailFromUrl || "",
    code: codeFromUrl || "",
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { isLoading } = useSelector((state) => state.auth)

  // Clear previous errors/messages on mount
  useEffect(() => {
    dispatch(clearAllMessages())
  }, [dispatch])

  // If code is in the URL, try to submit automatically
  useEffect(() => {
    if (emailFromUrl && codeFromUrl) {
      dispatch(verifyResetCode({ email: emailFromUrl, code: codeFromUrl })).then((data) => {
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
          // If auto-submit fails, user can still correct the code in the form.
        }
      })
    }
  }, [emailFromUrl, codeFromUrl, dispatch, navigate, onSuccess, toast])

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

  // Disable form fields if auto-submitting from URL params
  const formControls = useMemo(() => verifyCodeFormControls.map((control) => ({
    ...control,
    disabled: !!(emailFromUrl && codeFromUrl && isLoading),
  })), [emailFromUrl, codeFromUrl, isLoading]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Verify reset code</h1>
        <p className="mt-2 text-sm text-gray-600">
          {codeFromUrl ? "Verifying code from URL..." : "Enter the 6-digit code sent to your email"}
        </p>
      </div>
      <CommonForm
        formControls={formControls}
        buttonText={isLoading ? "Verifying..." : "Verify Code"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        disabled={isLoading}
      />
      <div className="text-center">
        <Link className="text-sm text-primary hover:underline" to="/auth/request-reset-password">
          Didn't receive code? Request new one
        </Link>
      </div>
    </div>
  )
}

export default VerifyCode;
