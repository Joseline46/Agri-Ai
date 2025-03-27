"use client"

import React, { useState } from "react"
import Button from "@/ui/button/button"
import Input from "@/ui/input/input"
import { ArrowLeft, Mail } from "lucide-react"

// Hooks
import useForgotPassword from '@/hooks/useForgotPassword'

// Layouts
import MainLayout from "@/layouts/main/main"

// Styles
import styles from '@/styles/forgotPassword.module.css' // Importing the CSS file

const ForgotPassword = () => {
  const { values, errors, isLoading, isSubmitted, setIsSubmitted, recoverPassword, changeValues } = useForgotPassword()

  return (
    <MainLayout hideHeader>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className="text-center">
            <a href="/" className={styles.logo}>
              <h2 className={styles.title}>Agri-AI</h2>
            </a>
            <h1 className={styles.formTitle}>Forgot Password</h1>
            <p className={styles.formSubtitle}>
              {isSubmitted
                ? "Check your email for a reset link"
                : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {!isSubmitted ? (
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <div className={styles.formField}>
                    <Input label='Email' errorMessage='Email is required' placeholder='ruemapara@gmail.com' name='username' type='text' value={values.username} error={errors.username} change={changeValues}>
                        <Mail color='#808080' size={17} />
                    </Input>
                </div>
              </div>

                <Button click={recoverPassword} disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
            </form>
          ) : (
            <div className={styles.submittedMessage}>
              <p className={styles.submittedText}>
                We've sent a password reset link to <strong>{values.username}</strong>. 
                Please check your inbox and follow the instructions.
              </p>
              <Button click={()=>setIsSubmitted(false)} disabled={isLoading}>
                Try another email
              </Button>
            </div>
          )}

          <div className={styles.backToSignIn}>
            <a
              href="/sign-in"
              className={styles.backLink}
            >
              <ArrowLeft className={styles.arrowIcon} />
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ForgotPassword
