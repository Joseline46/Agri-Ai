"use client"

import React, { useState } from "react"

// Components
import Button from "@/ui/button/button"
import Input  from "@/ui/input/input"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import Main from '@/layouts/main/main'

// Styles
import styles from '@/styles/signin.module.css'

// Hooks
import useSignin from '@/hooks/useSignin'

const SignIn = () => {
  const { values, errors, isLoading, signIn, changeValues } = useSignin()

  return (
    <Main hideHeader>
      <div className={styles.signInContainer}>
      <div className={styles.card}>
          <div className={styles.header}>
            <a href="/" className={styles.logo}>
              {/* <h2 className={styles.logoText}>Agri-AI</h2> */}
              <h2 className={styles.logoText}>Sign-In</h2>
            </a>
          {/* <h1 className={styles.heading}>Sign In</h1> */}
          <p className={styles.subText}>Enter your credentials to access your account</p>
          </div>

          <form className={styles.form}>
            <div className={styles.inputGroup}>
                <div className={styles.inputField}>
                  <Input label='Username' errorMessage='Username is required' placeholder='ruemapara@gmail.com' name='username' type='text' value={values.username} error={errors.username} change={changeValues}>
                    <User color='#808080' size={17} />
                  </Input>
                </div>

                <div className={styles.inputField}>
                <div className={styles.passwordHeader}>
                    <a href="/forgot-password" className={styles.forgotPasswordLink} >
                      Forgot password?
                    </a>
                </div>
                <div className={styles.inputWrapper}>
                  <Input label='Password' errorMessage='Password is required' placeholder='***********' name='password' type='text' value={values.password} error={errors.password} change={changeValues}>
                    <Lock color='#808080' size={17} />
                  </Input>
                </div>
                </div>
            </div>

            <Button click={signIn} disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className={styles.createAccountText}>
              Don't have an account?{" "}
              <a href="/sign-up" className={styles.createAccountLink}>
                Create account
              </a>
            </p>
          </form>
      </div>
      </div>
    </Main>
  )
}

export default SignIn
