"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

import { auth, db } from "@/lib/firebaseclient"
import { onAuthStateChanged } from "firebase/auth"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function CreateMissionPage() {
  const router = useRouter()
  const { toast } = useToast()

  // track auth state
  const [user, setUser] = useState(undefined)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u)
      } else {
        router.push("/login")
      }
    })
    return () => unsub()
  }, [router])

  // form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!title.trim()) e.title = "Title is required"
    if (!description.trim()) e.description = "Description is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    if (!validate()) return

    setIsLoading(true)
    try {
      await addDoc(collection(db, "missions"), {
        title: title.trim(),
        description: description.trim(),
        status: "active",
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
      })
      toast({ title: "Mission created!", description: "Success." })
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: "Could not create mission", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  // while auth initializes, you might render nothing or a loader
  if (user === undefined) return null

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <h1 className="text-3xl font-bold">Create New Mission</h1>
        <Card>
          <CardHeader>
            <CardTitle>Mission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter mission title"
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Enter mission description"
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Mission"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
