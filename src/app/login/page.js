"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Rocket } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    setTimeout(() => {
      if (formData.email && formData.password) {
        router.push("/dashboard")
      } else {
        setError("Please enter both email and password")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-8">
        <div className="flex flex-col items-center mb-8">
          <Rocket size={48} className="text-cyan-400 mb-4" />
          <h1 className="text-3xl font-bold">Mission Control</h1>
          <p className="text-slate-400 mt-2">Access your command center</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-center text-sm">{error}</div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="glass-input w-full p-3 text-white"
              value={formData.email}
              onChange={handleChange}
              placeholder="astronaut@space.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="glass-input w-full p-3 text-white"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="glass-button w-full py-3 font-medium relative overflow-hidden group"
          >
            <span className={`${isLoading ? "opacity-0" : "opacity-100"}`}>Launch Mission Control</span>
            {isLoading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
