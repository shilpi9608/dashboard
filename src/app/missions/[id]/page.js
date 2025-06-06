"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Clock, Trash2, AlertTriangle, Play, Pause, Send, ArrowLeft, MapPin } from "lucide-react"

const missionData = {
  1: {
    id: "1",
    title: "Mars Rover Deployment",
    description:
      "Deploy rover to Mars surface and establish communication with mission control. Monitor initial system checks and prepare for first surface exploration.",
    createdAt: "2025-06-01T10:30:00Z",
    status: "active",
    logs: [
      { timestamp: "2025-06-01T10:35:00Z", message: "Mission initialized successfully" },
      { timestamp: "2025-06-01T11:42:00Z", message: "Communication error with base station" },
      { timestamp: "2025-06-01T12:15:00Z", message: "Communication restored" },
    ],
  },
  2: {
    id: "2",
    title: "ISS Resupply Mission",
    description: "Deliver essential supplies and equipment to the International Space Station.",
    createdAt: "2025-05-28T08:15:00Z",
    status: "active",
    logs: [
      { timestamp: "2025-05-28T08:20:00Z", message: "Launch sequence initiated" },
      { timestamp: "2025-05-28T09:30:00Z", message: "Orbit achieved successfully" },
    ],
  },
}

export default function MissionDetailPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [mission, setMission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newLog, setNewLog] = useState("")
  const [timer, setTimer] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      const foundMission = missionData[id]
      if (foundMission) {
        setMission(foundMission)
      }
      setLoading(false)
    }, 500)
  }, [id])

  useEffect(() => {
    let interval
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerRunning])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleStatus = () => {
    setMission({
      ...mission,
      status: mission.status === "active" ? "completed" : "active",
    })
  }

  const deleteMission = () => {
    router.push("/dashboard")
  }

  const addLog = (e) => {
    e.preventDefault()
    if (!newLog.trim()) return

    const now = new Date().toISOString()
    setMission({
      ...mission,
      logs: [{ timestamp: now, message: newLog }, ...mission.logs],
    })
    setNewLog("")
  }

  const toggleTimer = () => {
    if (!timer && !timerRunning) {
      setTimer(new Date())
      setTimerRunning(true)
      setElapsedTime(0)
    } else if (timerRunning) {
      setTimerRunning(false)
    } else {
      setTimerRunning(true)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6">
          <div className="flex items-center gap-4">
            <div className="animate-spin h-8 w-8 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"></div>
            <p>Loading mission data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!mission) {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Mission Not Found</h1>
          <p className="text-slate-400 mb-4">The requested mission could not be found.</p>
          <Link href="/dashboard">
            <button className="glass-button px-4 py-2">Return to Dashboard</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard">
            <button className="glass-button p-2">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{mission.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={toggleStatus}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
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
                    <CheckCircle size={16} />
                    <span>Completed</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all"
                title="Delete Mission"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center text-sm text-slate-400">
          <Clock size={16} className="mr-2" />
          <span>Created: {formatDate(mission.createdAt)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Description */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-medium mb-3">Mission Description</h2>
            <p className="text-slate-300">{mission.description}</p>
          </div>

          {/* Mission Location */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <MapPin size={18} className="text-cyan-400 mr-2" />
              Mission Location
            </h2>
            <div className="bg-slate-800/50 rounded-xl p-8 text-center">
              <MapPin size={48} className="text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400">Location data will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Error Logs */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <AlertTriangle size={18} className="text-amber-400 mr-2" />
              Mission Logs
            </h2>

            <form onSubmit={addLog} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newLog}
                onChange={(e) => setNewLog(e.target.value)}
                placeholder="Add new log entry..."
                className="glass-input flex-1 p-2 text-sm"
              />
              <button type="submit" className="glass-button p-2">
                <Send size={16} />
              </button>
            </form>

            <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
              {mission.logs.map((log, index) => (
                <div key={index} className="glass-panel p-3 text-sm">
                  <div className="text-xs text-slate-400 mb-1">{formatDate(log.timestamp)}</div>
                  <div>{log.message}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Clock size={18} className="text-cyan-400 mr-2" />
              Mission Timer
            </h2>

            <div className="flex flex-col items-center">
              <div className="text-4xl font-mono mb-4 glass-panel px-6 py-3 rounded-xl">{formatTime(elapsedTime)}</div>

              <button onClick={toggleTimer} className="glass-button px-6 py-2 flex items-center gap-2">
                {!timer ? (
                  <>
                    <Play size={16} />
                    <span>Start Timer</span>
                  </>
                ) : timerRunning ? (
                  <>
                    <Pause size={16} />
                    <span>Pause Timer</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Resume Timer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Delete Mission</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete this mission? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteDialog(false)} className="glass-button px-4 py-2 flex-1">
                Cancel
              </button>
              <button
                onClick={deleteMission}
                className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 px-4 py-2 rounded-xl flex-1 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
