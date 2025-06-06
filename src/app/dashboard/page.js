"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Rocket, CheckCircle, Clock, Calendar } from "lucide-react"

const initialMissions = [
  {
    id: "1",
    title: "Mars Rover Deployment",
    createdAt: "2025-06-01T10:30:00Z",
    status: "active",
  },
  {
    id: "2",
    title: "ISS Resupply Mission",
    createdAt: "2025-05-28T08:15:00Z",
    status: "active",
  },
  {
    id: "3",
    title: "Satellite Launch Alpha",
    createdAt: "2025-05-20T14:45:00Z",
    status: "completed",
  },
  {
    id: "4",
    title: "Lunar Base Setup",
    createdAt: "2025-05-15T09:00:00Z",
    status: "completed",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [missions] = useState(initialMissions)

  const filteredMissions = missions.filter((mission) => {
    if (activeTab === "all") return true
    return mission.status === activeTab
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const activeMissions = missions.filter((m) => m.status === "active").length
  const completedMissions = missions.filter((m) => m.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <h1 className="text-3xl font-bold mb-2">Mission Control Dashboard</h1>
        <p className="text-slate-400">Monitor and manage all space missions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Missions</p>
              <p className="text-2xl font-bold">{missions.length}</p>
            </div>
            <Rocket className="text-cyan-400" size={32} />
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Missions</p>
              <p className="text-2xl font-bold text-green-400">{activeMissions}</p>
            </div>
            <div className="relative">
              <Clock className="text-green-400" size={32} />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-slate-400">{completedMissions}</p>
            </div>
            <CheckCircle className="text-slate-400" size={32} />
          </div>
        </div>
      </div>

      {/* Mission List */}
      <div className="glass-panel p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">All Missions</h2>
            <div className="flex space-x-2">
              {["all", "active", "completed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    activeTab === tab
                      ? "glass-button border-cyan-500/50 text-cyan-400"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Link href="/create-mission">
            <button className="glass-button px-4 py-2 flex items-center gap-2">
              <Plus size={18} />
              <span>Create Mission</span>
            </button>
          </Link>
        </div>

        {filteredMissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMissions.map((mission) => (
              <div
                key={mission.id}
                className="glass-panel p-4 hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg">{mission.title}</h3>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      mission.status === "active"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                    }`}
                  >
                    {mission.status === "active" ? (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={12} />
                        <span>Completed</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-sm text-slate-400 mb-4">
                  <Calendar size={14} className="mr-1" />
                  <span>Created {formatDate(mission.createdAt)}</span>
                </div>

                <Link
                  href={`/missions/${mission.id}`}
                  className="glass-button inline-flex items-center gap-2 px-3 py-2 text-sm w-full justify-center"
                >
                  <Rocket size={16} />
                  <span>View Details</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Rocket size={48} className="text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No missions found</h3>
            <p className="text-slate-400 mb-6">
              {activeTab === "all" ? "Create your first mission to get started" : `No ${activeTab} missions`}
            </p>
            <Link href="/create-mission">
              <button className="glass-button px-6 py-3 flex items-center gap-2 mx-auto">
                <Plus size={18} />
                <span>Create Mission</span>
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <Link href="/create-mission" className="md:hidden">
        <button className="fixed bottom-6 right-6 glass-button h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Plus size={24} />
        </button>
      </Link>
    </div>
  )
}
