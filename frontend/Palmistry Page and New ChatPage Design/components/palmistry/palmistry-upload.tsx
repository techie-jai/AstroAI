"use client"

import { useState, useRef, useCallback } from "react"
import { Hand, Upload, Camera, Lightbulb, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PalmistryUploadProps {
  onImageUpload: (imageUrl: string) => void
}

export function PalmistryUpload({ onImageUpload }: PalmistryUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      processFile(file)
    }
  }, [])

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      onImageUpload(result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      setCameraStream(stream)
      setShowCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setShowCamera(false)
    setCapturedImage(null)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageUrl = canvas.toDataURL("image/jpeg", 0.9)
        setCapturedImage(imageUrl)
      }
    }
  }

  const confirmCapture = () => {
    if (capturedImage) {
      stopCamera()
      onImageUpload(capturedImage)
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
  }

  const tips = [
    "Use good lighting - natural daylight works best",
    "Keep your palm flat and fingers slightly apart",
    "Ensure your entire palm is visible in the frame",
    "Avoid shadows falling across your palm",
    "Remove rings or jewelry for clearer reading"
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-primary/20 glow-pink">
            <Hand className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-pink-400 to-primary bg-clip-text text-transparent">
            Palm Reading
          </h1>
        </div>
        <p className="text-muted-foreground">
          Upload or scan your palm to discover insights about your life path
        </p>
      </div>

      {!showCamera ? (
        <>
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300",
              isDragging
                ? "border-primary bg-primary/10 scale-[1.02]"
                : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
            )}
          >
            {/* Hand outline guide */}
            <div className="mb-6 relative inline-block">
              <div className="w-40 h-48 mx-auto border-2 border-primary/30 rounded-t-[100px] rounded-b-lg relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Hand className="h-20 w-20 text-primary/40" />
                </div>
                {/* Scanning line effect */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-2">
              Drop your palm image here
            </h3>
            <p className="text-muted-foreground mb-6">
              or use the buttons below to upload or scan
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <Button
                variant="outline"
                onClick={startCamera}
                className="border-primary/50 hover:bg-primary/10"
              >
                <Camera className="h-4 w-4 mr-2" />
                Scan Palm
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Tips Section */}
          <div className="rounded-2xl border border-border bg-card p-6 gradient-border">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-accent">Tips for Best Results</h3>
            </div>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Which Hand Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-6 gradient-border">
              <h4 className="font-semibold text-foreground mb-2">Left Hand</h4>
              <p className="text-sm text-muted-foreground">
                Represents your potential, inherited traits, and what you were born with. Shows your natural talents and predispositions.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 gradient-border">
              <h4 className="font-semibold text-foreground mb-2">Right Hand</h4>
              <p className="text-sm text-muted-foreground">
                Represents your current state, what you have done with your life, and how you have developed your potential.
              </p>
            </div>
          </div>
        </>
      ) : (
        /* Camera View */
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
          {!capturedImage ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Hand alignment guide overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-72 border-2 border-primary/60 rounded-t-[120px] rounded-b-xl flex items-center justify-center">
                  <span className="text-primary/80 text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                    Align your palm here
                  </span>
                </div>
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={stopCamera}
                  className="bg-black/50 border-white/30 text-white hover:bg-black/70"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={capturePhoto}
                  className="bg-primary hover:bg-primary/90 text-white px-8"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </div>
            </>
          ) : (
            <>
              <img
                src={capturedImage}
                alt="Captured palm"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={retakePhoto}
                  className="bg-black/50 border-white/30 text-white hover:bg-black/70"
                >
                  <X className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={confirmCapture}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Use This Photo
                </Button>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  )
}
