"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Account Information */}
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <p className="text-foreground">lemniscatetools@gmail.com</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Display Name</label>
            <p className="text-foreground">Lemniscate Lab</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
