"use client"

import  React from "react"

import { AppLayout } from "@/components/app-layout"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  addErrorLog,
  deleteMission,
  getErrorLogs,
  getMissionById,
  startTimer,
  stopTimer,
  updateMissionStatus,
  
} from "@/lib/missions"
import { Play, Square, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function MissionDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [mission, setMission] = useState<Mission | null>(null)
  const [errorLogs, setErrorLogs] = useState<ErrorLog>([])
  const [newErrorMessage, setNewErrorMessage] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  const missionId = params.id 

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const foundMission = getMissionById(missionId, user.email)
    if (!foundMission) {
      router.push("/404")
      return
    }

    setMission(foundMission)
    setErrorLogs(getErrorLogs(missionId))
  }, [user, missionId, router])

  // Update current time every second for timer display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleStatusToggle = () => {
    if (!mission || !user) return

    const newStatus = mission.status === "active" ? "completed" : "active"
    if (updateMissionStatus(mission.id, newStatus, user.email)) {
      setMission({ ...mission, status: newStatus })
      toast({
        title: "Status updated",
        description: `Mission marked as ${newStatus}`,
      })
    }
  }

  const handleDelete = () => {
    if (!mission || !user) return

    if (confirm("Are you sure you want to delete this mission?")) {
      if (deleteMission(mission.id, user.email)) {
        toast({
          title: "Mission deleted",
          description: "Mission has been deleted successfully",
        })
        router.push("/dashboard")
      }
    }
  }

  const handleStartTimer = () => {
    if (!mission || !user) return

    if (startTimer(mission.id, user.email)) {
      const updatedMission = getMissionById(mission.id, user.email)
      if (updatedMission) {
        setMission(updatedMission)
        toast({
          title: "Timer started",
          description: "Mission timer has been started",
        })
      }
    }
  }

  const handleStopTimer = () => {
    if (!mission || !user) return

    if (stopTimer(mission.id, user.email)) {
      const updatedMission = getMissionById(mission.id, user.email)
      if (updatedMission) {
        setMission(updatedMission)
        toast({
          title: "Timer stopped",
          description: "Mission timer has been stopped",
        })
      }
    }
  }

  const handleAddError = (e) => {
    e.preventDefault()
    if (!newErrorMessage.trim() || !mission) return

    const errorLog = addErrorLog(mission.id, newErrorMessage.trim())
    setErrorLogs([...errorLogs, errorLog])
    setNewErrorMessage("")
    toast({
      title: "Error logged",
      description: "Error has been added to the mission log",
    })
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getElapsedTime = () => {
    if (!mission?.timer?.startTime) return 0
    if (mission.timer.endTime) return mission.timer.duration || 0
    return Math.floor((currentTime.getTime() - mission.timer.startTime.getTime()) / 1000)
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (!user || !mission) return null

  const isTimerRunning = mission.timer?.startTime && !mission.timer.endTime

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Title & Status Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{mission.title}</h1>
            <Badge variant={mission.status === "active" ? "default" : "secondary"} className="text-sm">
              {mission.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleStatusToggle} variant="outline">
              Toggle Status
            </Button>
            <Button onClick={handleDelete} variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            Created: {formatDate(mission.createdAt)} · By: {user.email}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Description Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{mission.description}</p>
            </CardContent>
          </Card>

          {/* Timer Section */}
          <Card>
            <CardHeader>
              <CardTitle>Timer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold">{formatDuration(getElapsedTime())}</div>
                <p className="text-sm text-muted-foreground">
                  {isTimerRunning ? "Running" : mission.timer?.duration ? "Completed" : "Not started"}
                </p>
              </div>
              <div className="flex justify-center">
                {!mission.timer?.startTime ? (
                  <Button onClick={handleStartTimer} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Timer
                  </Button>
                ) : isTimerRunning ? (
                  <Button onClick={handleStopTimer} variant="destructive" className="w-full">
                    <Square className="h-4 w-4 mr-2" />
                    Stop Timer
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Duration: {formatDuration(mission.timer.duration || 0)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Logs Section */}
          <Card>
            <CardHeader>
              <CardTitle>Error Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-64 overflow-y-auto space-y-2">
                {errorLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No errors logged yet</p>
                ) : (
                  errorLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3 space-y-1">
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddError} className="flex gap-2">
                <Input
                  placeholder="Enter error message"
                  value={newErrorMessage}
                  onChange={(e) => setNewErrorMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!newErrorMessage.trim()}>
                  Log Error
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
