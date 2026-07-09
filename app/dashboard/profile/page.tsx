"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/dashboard/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Mail, Calendar } from "lucide-react"

function formatName(name: string) {
  if (!name || name.trim() === "") return "User"
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

function formatCreatedAt(createdAt?: string) {
  if (!createdAt) return "Unknown"
  const date = new Date(createdAt)
  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
  })

  const user = {
    name: "User",
    email: "user@example.com",
    createdAt: new Date().toISOString(),
  }

  useEffect(() => {
    setProfile({
      full_name: user.name,
      email: user.email,
    })
  }, [])
  
  return (
    <>
      <PageHeader
        title="Profile"
        description="View your account information."
      />
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="bg-card border border-border">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/profile.jfif" />
                <AvatarFallback className="text-2xl">
                  {profile.full_name.trim().split(" ").map(n => n[0]).join("").toUpperCase() || (profile.email?.[0]?.toUpperCase() ?? "U")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{formatName(profile.full_name)}</h2>
              <p className="text-sm text-muted-foreground">{profile.email || ""}</p>

              <Separator className="my-6" />

              <div className="w-full space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{profile.email || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm"> Joined {formatCreatedAt(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.full_name}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  )
}