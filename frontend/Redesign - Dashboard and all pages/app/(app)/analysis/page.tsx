"use client"

import { FileText, Eye, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const analyses = [
  {
    id: 1,
    name: "Neha Verma",
    birthDate: "1986-02-08",
    place: "Bangalore",
    generatedAt: "2026-04-14",
  },
  {
    id: 2,
    name: "Aditya Sharma",
    birthDate: "1998-05-07",
    place: "Mumbai",
    generatedAt: "2026-04-14",
  },
  {
    id: 3,
    name: "aoud",
    birthDate: "2026-01-01",
    place: "Santiago Ixtaltepec, Mexico,Me",
    generatedAt: "2026-04-14",
  },
  {
    id: 4,
    name: "qefqAkshay Patel",
    birthDate: "2007-05-08",
    place: "Kolkata",
    generatedAt: "2026-04-14",
  },
  {
    id: 5,
    name: "23112Neha Verma",
    birthDate: "1995-04-22",
    place: "Kolkata",
    generatedAt: "2026-04-14",
  },
]

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Analysis</h1>
        <p className="text-muted-foreground mt-1">View and download your generated analyses</p>
      </div>

      {/* Analysis list */}
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{analysis.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysis.birthDate} &bull; {analysis.place}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Generated: {analysis.generatedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
