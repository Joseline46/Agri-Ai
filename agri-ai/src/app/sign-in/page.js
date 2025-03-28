"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'

// Components
import Button from "@/ui/button/button"
import Input  from "@/ui/input/input"
import { Lock, User } from "lucide-react"

// Context
import { UserAuth } from '@/contexts/auth'

// Styles
import styles from '@/styles/signin.module.css'

// Hooks
import useSignin from '@/hooks/useSignin'

const SignIn = () => {
  const { user } = UserAuth()
  const router = useRouter()
  const { values, errors, isLoading, signIn, changeValues } = useSignin()

  useEffect(()=>{
    if(user){
      router.push('/dashboard')
    }
  },[user, router])

  return (
    <div className={styles.signInContainer}>
      <div className={styles.card}>
          <div className={styles.header}>
            <a href="/" className={styles.logo}>
              <h2 className={styles.logoText}>Sign-In</h2>
            </a>
          <p className={styles.subText}>Enter your credentials to access your account</p>
          </div>

          <section className={styles.form}>
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
                  <Input label='Password' errorMessage='Password is required' placeholder='***********' name='password' type='password' value={values.password} error={errors.password} change={changeValues}>
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
          </section>
      </div>
    </div>
  )
}

export default SignIn
