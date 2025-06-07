"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { AppLayout } from "@/components/app-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

import { auth, db } from "@/lib/firebaseclient"
import { onAuthStateChanged } from "firebase/auth"
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(undefined)    // undefined = loading, null = no user
  const [missions, setMissions] = useState([])
  const [filter, setFilter] = useState("all")

  // 1) watch auth
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u)
      } else {
        setUser(null)
        router.push("/login")
      }
    })
    return () => unsubAuth()
  }, [router])

  // 2) once we have a user, subscribe to their missions in real time
  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, "missions"),
      where("userEmail", "==", user.email)
    )
    // onSnapshot gives you live updates
    const unsubSnap = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setMissions(data)
      },
      (error) => {
        console.error("Mission snapshot error:", error)
      }
    )
    return () => unsubSnap()
  }, [user])

  // while auth is initializing
  if (user === undefined) return null

  // now filter & render
  const filtered = missions.filter((m) =>
    filter === "all" ? true : m.status === filter
  )

  const formatDate = (ts) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(ts?.toDate?.() ?? new Date(ts))

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">All Missions</h1>
            <p className="text-muted-foreground">Manage and track your missions</p>
          </div>
          <Button asChild>
            <Link href="/create-mission">
              <Plus className="h-4 w-4 mr-2" />
              Create Mission
            </Link>
          </Button>
        </div>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No missions yet</h3>
                <p className="text-muted-foreground">Create your first mission to get started</p>
                <Button asChild>
                  <Link href="/create-mission">Create Mission</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((mission) => (
              <Card key={mission.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{mission.title}</CardTitle>
                    <Badge
                      variant={mission.status === "active" ? "default" : "secondary"}
                    >
                      {mission.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created {formatDate(mission.createdAt)}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {mission.description}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/missions/${mission.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="fixed bottom-6 right-6 md:hidden">
          <Button asChild size="lg" className="rounded-full h-14 w-14 shadow-lg">
            <Link href="/create-mission">
              <Plus className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
