"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [candidateNumber, setCandidateNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = sessionStorage.getItem("isLoggedIn")
    if (isLoggedIn) {
      const currentUser = sessionStorage.getItem("currentUser")
      if (currentUser === "superadmin8071") {
        router.push("/admin")
      } else {
        router.push("/listening") // Redirect to listening test first
      }
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple validation
    if (!candidateNumber || !password) {
      setError("Please enter both candidate number and password")
      setIsLoading(false)
      return
    }

    // Check for admin login (using candidate number field)
    if (candidateNumber === "superadmin8071" && password === "08268071") {
      // Set admin session
      sessionStorage.setItem("isLoggedIn", "true")
      sessionStorage.setItem("currentUser", candidateNumber)

      // Redirect to admin dashboard
      setTimeout(() => {
        router.push("/admin")
      }, 500)
      return
    }

    // Check if user exists in localStorage by candidate number
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const user = users.find(
        (u: any) =>
          u.candidateNumber &&
          u.candidateNumber.trim().toLowerCase() === candidateNumber.trim().toLowerCase() &&
          u.password === password,
      )

      if (user) {
        // Mark password as used
        const updatedUsers = users.map((u: any) => {
          if (u.candidateNumber && u.candidateNumber.trim().toLowerCase() === candidateNumber.trim().toLowerCase()) {
            return { ...u, used: true, lastLoginAt: new Date().toISOString() }
          }
          return u
        })
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

        // Set login status in sessionStorage
        sessionStorage.setItem("isLoggedIn", "true")
        sessionStorage.setItem("currentUser", candidateNumber)
        sessionStorage.setItem("studentName", user.fullName)

        // Redirect to test page
        setTimeout(() => {
          router.push("/listening") // Redirect to listening test first
        }, 500)
      } else {
        // Check if candidate number exists but password is wrong
        const userExists = users.find(
          (u: any) =>
            u.candidateNumber && u.candidateNumber.trim().toLowerCase() === candidateNumber.trim().toLowerCase(),
        )
        if (userExists) {
          setError("Invalid password for this candidate number")
        } else {
          setError("Invalid candidate number. Please contact administrator if you don't have one.")
        }
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Error checking credentials:", err)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Enter your credentials to access the IELTS test</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="candidateNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Candidate Number
            </label>
            <input
              id="candidateNumber"
              type="text"
              value={candidateNumber}
              onChange={(e) => setCandidateNumber(e.target.value)}
              placeholder="e.g., IELTS-2025-0001"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <p className="text-gray-600">
              Don't have credentials?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Register here
              </Link>
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact administrator via{" "}
              <a
                href="https://t.me/T0pSpeed524kmh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Telegram
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">&copy; 2025 Dream Zone. All rights reserved.</div>
      </div>
    </div>
  )
}
