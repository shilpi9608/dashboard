"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

import { AppLayout } from "@/components/app-layout"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { auth, db } from "@/lib/firebaseclient"
import { onAuthStateChanged } from "firebase/auth"
import {
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { Play, Square, Trash2 } from "lucide-react"

export default function MissionDetailPage() {
  const router = useRouter()
  const { id: missionId } = useParams()
  const { toast } = useToast()

  // Auth and mission state
  const [user, setUser] = useState(undefined)
  const [mission, setMission] = useState(null)
  const [errorLogs, setErrorLogs] = useState([])

  // Timer state
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

  // Error input
  const [newError, setNewError] = useState("")

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u)
      else router.push("/login")
    })
    return () => unsub()
  }, [router])

  // Mission snapshot
  useEffect(() => {
    if (user === undefined) return
    const ref = doc(db, "missions", missionId)
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return router.push("/404")
      const data = snap.data()
      setMission({ id: snap.id, ...data })
    })
    return () => unsub()
  }, [user, missionId, router])

  // Error logs snapshot
  useEffect(() => {
    if (!mission) return
    const logsRef = collection(db, "missions", missionId, "errorLogs")
    const unsub = onSnapshot(logsRef, (snap) => {
      setErrorLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [mission, missionId])

  
// Alternative approach with more robust time calculation
useEffect(() => {
  // Clear existing interval
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
  
  if (!mission?.timer) {
    setElapsed(0);
    return;
  }
  
  const { timer } = mission;
  
  const calculateElapsed = () => {
    if (!timer.startTime) return 0;
    
    const startMs = timer.startTime.toMillis();
    const endMs = timer.endTime ? timer.endTime.toMillis() : Date.now();
    
    // Ensure we don't get negative values
    return Math.max(0, Math.floor((endMs - startMs) / 1000));
  };
  
  // Set initial elapsed time
  const initialElapsed = calculateElapsed();
  setElapsed(initialElapsed);
  
  // If timer is running (has start time but no end time), start interval
  if (timer.startTime && !timer.endTime) {
    intervalRef.current = setInterval(() => {
      const currentElapsed = calculateElapsed();
      setElapsed(currentElapsed);
    }, 1000);
  }
  
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [mission]);
  if (user === undefined || mission === null) return null

  const missionRef = doc(db, "missions", missionId)
  const isRunning = mission.timer?.startTime && !mission.timer?.endTime

  // Formatters
  const formatDuration = (s) =>
    [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
      .map((n) => String(n).padStart(2, "0"))
      .join(":")

  const formatDate = (ts) => {
    if (!ts?.toDate) return ""
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(ts.toDate())
  }

  // Handlers
  const toggleStatus = async () => {
    const newStatus = mission.status === "active" ? "completed" : "active"
    await updateDoc(missionRef, { status: newStatus })
    toast({ title: "Status updated", description: newStatus })
  }

  const removeMission = async () => {
    if (confirm("Delete this mission?")) {
      await deleteDoc(missionRef)
      toast({ title: "Mission deleted" })
      router.push("/dashboard")
    }
  }

  const startTimer = async () => {
    try {
      await updateDoc(missionRef, {
        timer: {
          startTime: serverTimestamp(),
          endTime: null,
          duration: null,
        },
      })
      toast({ title: "Timer started" })
    } catch (err) {
      console.error("startTimer failed:", err)
      toast({ title: "Error", description: "Could not start timer", variant: "destructive" })
    }
  }

  const stopTimer = async () => {
    try {
      await updateDoc(missionRef, {
        timer: {
          startTime: mission.timer.startTime,
          endTime: serverTimestamp(),
          duration: elapsed,
        },
      })
      toast({ title: "Timer stopped", description: formatDuration(elapsed) })
    } catch (err) {
      console.error("stopTimer failed:", err)
      toast({ title: "Error", description: "Could not stop timer", variant: "destructive" })
    }
  }

  const addError = async (e) => {
    e.preventDefault()
    if (!newError.trim()) return
    const logsRef = collection(db, "missions", missionId, "errorLogs")
    await addDoc(logsRef, { message: newError.trim(), timestamp: serverTimestamp() })
    setNewError("")
    toast({ title: "Error logged" })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{mission.title}</h1>
            <Badge variant={mission.status === "active" ? "default" : "secondary"}>
              {mission.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button onClick={toggleStatus} variant="outline">
              Toggle Status
            </Button>
            <Button onClick={removeMission} variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            Created {formatDate(mission.createdAt)} · By {user.email}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Description */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{mission.description}</p>
            </CardContent>
          </Card>

          {/* Timer */}
          <Card>
            <CardHeader>
              <CardTitle>Timer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold">{formatDuration(elapsed)}</div>
                <p className="text-sm text-muted-foreground">
                  {isRunning ? "Running" : mission.timer?.duration != null ? "Completed" : "Not started"}
                </p>
              </div>
              <div className="flex">
                {!isRunning ? (
                  <Button onClick={startTimer} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={stopTimer} variant="destructive" className="w-full">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Error Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-64 overflow-y-auto space-y-2">
                {errorLogs.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">No errors logged</p>
                ) : (
                  errorLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3 space-y-1">
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={addError} className="flex gap-2">
                <Input
                  placeholder="New error"
                  value={newError}
                  onChange={(e) => setNewError(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!newError.trim()}>
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
