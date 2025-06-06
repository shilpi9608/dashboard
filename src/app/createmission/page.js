"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Rocket, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateMissionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim()) {
      setError("Mission title is required")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/dashboard">
            <button className="glass-button p-2">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Mission</h1>
        </div>
        <p className="text-slate-400">Launch a new space mission</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <div className="glass-panel p-8">
          <div className="flex items-center gap-3 mb-6">
            <Rocket className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold">Mission Details</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center justify-between">
              <p className="text-sm">{error}</p>
              <button onClick={() => setError("")}>
                <X size={16} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Mission Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="glass-input w-full p-3 text-white"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter mission name..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Mission Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                className="glass-input w-full p-3 text-white resize-none"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the mission objectives and details..."
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link href="/dashboard">
                <button type="button" className="text-slate-400 hover:text-white transition-colors px-4 py-2">
                  Cancel
                </button>
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="glass-button px-8 py-3 relative overflow-hidden group"
              >
                <span className={`${isSubmitting ? "opacity-0" : "opacity-100"}`}>Launch Mission</span>
                {isSubmitting && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
