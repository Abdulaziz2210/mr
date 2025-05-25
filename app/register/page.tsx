"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import Link from "next/link"

// Function to generate a random password
const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export default function Register() {
  const { t } = useLanguage()
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [copied, setCopied] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setCopied(false)

    if (!fullName.trim()) {
      setError(t("name_required"))
      return
    }

    try {
      // Generate a random password
      const password = generatePassword()
      setGeneratedPassword(password)

      // Get existing users or initialize empty array
      const existingUsersJSON = localStorage.getItem("registeredUsers") || "[]"
      const existingUsers = JSON.parse(existingUsersJSON)

      // Check if user already exists
      const existingUser = existingUsers.find((u: any) => u.fullName.toLowerCase() === fullName.trim().toLowerCase())

      if (existingUser) {
        setError("A user with this name is already registered. Please contact the administrator.")
        return
      }

      // Add new user (without candidate number - admin will assign)
      const newUser = {
        fullName: fullName.trim(),
        password,
        registeredAt: new Date().toISOString(),
        used: false,
        candidateNumber: null, // Will be assigned by admin
      }

      existingUsers.push(newUser)
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

      // Show success message without password
      setSuccess(true)

      // Log to console for testing
      console.log("Registered user:", newUser)

      // Send registration notification to Telegram
      try {
        const message = `
📝 *New Registration Request*

👤 *Student*: ${fullName.trim()}
🔑 *Temporary Password*: ${password}
⏰ *Registered*: ${new Date().toLocaleString()}

⚠️ *Action Required:*
1. Assign a candidate number to this student
2. Send both candidate number and password to student
3. Student cannot login without candidate number

*Note*: Student has been instructed to contact admin for credentials.
        `

        fetch("/api/send-telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }).catch((err) => console.error("Failed to send registration to Telegram:", err))
      } catch (err) {
        console.error("Error sending registration to Telegram:", err)
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(t("registration_error"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-4">Register for IELTS Test</h1>
        <p className="text-gray-600 text-center mb-6">Register to request access to the IELTS test system</p>

        {success ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
              Registration successful! Your request has been submitted.
            </div>

            <div className="mt-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
                <p className="text-blue-800 mb-3">
                  To obtain your login credentials (candidate number and password), please contact the administrator via
                  Telegram:
                </p>
                <a
                  href="https://t.me/T0pSpeed524kmh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.377 2.618-1.415 3.051-2.896 1.899l-2.837-2.135-1.415 1.36c-.896.896-1.415 1.415-2.896.896l.896-2.837L18.314 7.264c.377-.338-.169-.507-.896-.169L8.426 11.46l-2.837-.896c-.896-.169-.896-.896.169-1.415L18.314 6.368c.896-.338 1.733.169 1.415 1.792z" />
                  </svg>
                  Contact @T0pSpeed524kmh
                </a>
                <p className="text-sm text-blue-600 mt-2">
                  Please mention your full name: <strong>{fullName}</strong> to receive your candidate number and
                  password
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-700">
                  <strong>Important:</strong> You will receive both a candidate number and password from the
                  administrator. Both are required to log in to the test system.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <h4 className="font-medium text-gray-900 mb-1">What you'll receive:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Unique candidate number (for login)</li>
                  <li>• Secure password (single-use)</li>
                  <li>• Test instructions and guidelines</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Go to Login
              </button>
              <button
                onClick={() => {
                  setSuccess(false)
                  setFullName("")
                  setGeneratedPassword("")
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                Register Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-6">
              <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">This name will be used for your test certificate</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Submit Registration Request
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have credentials?{" "}
                <Link href="/" className="text-blue-600 hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm">&copy; 2025 Dream Zone</div>
      </div>
    </div>
  )
}
