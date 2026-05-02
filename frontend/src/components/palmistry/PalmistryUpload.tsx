import React, { useState, useRef } from 'react'
import { Upload, Camera, Hand, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface PalmistryUploadProps {
  onImageUpload: (leftHandImage: string, rightHandImage: string, handedness: 'left' | 'right') => void
}

export default function PalmistryUpload({ onImageUpload }: PalmistryUploadProps) {
  const [handedness, setHandedness] = useState<'left' | 'right' | null>(null)
  const [step, setStep] = useState<'handedness' | 'upload'>('handedness')
  const [currentHand, setCurrentHand] = useState<'left' | 'right'>('left')
  const [leftHandImage, setLeftHandImage] = useState<string | null>(null)
  const [rightHandImage, setRightHandImage] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleHandednessSelect = (selected: 'left' | 'right') => {
    setHandedness(selected)
    setStep('upload')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      processFile(file)
    } else {
      toast.error('Please drop an image file')
    }
  }

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (currentHand === 'left') {
        setLeftHandImage(result)
        setCurrentHand('right')
        toast.success('Left hand image captured! Now upload right hand.')
      } else {
        setRightHandImage(result)
        if (handedness) {
          onImageUpload(leftHandImage || '', result, handedness)
        }
      }
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
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      setCameraStream(stream)
      setShowCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      toast.error('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9)
        stopCamera()
        processFile(new File([imageUrl], 'palm.jpg', { type: 'image/jpeg' }))
      }
    }
  }

  if (step === 'handedness') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Hand className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Palm Reading</h1>
            <p className="text-slate-300">Let's start by understanding your handedness</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleHandednessSelect('right')}
              className="w-full p-6 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition transform hover:scale-105"
            >
              <div className="font-bold text-lg">Right-Handed</div>
              <div className="text-sm text-purple-100 mt-2">Your right hand shows current reality</div>
            </button>

            <button
              onClick={() => handleHandednessSelect('left')}
              className="w-full p-6 bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition transform hover:scale-105"
            >
              <div className="font-bold text-lg">Left-Handed</div>
              <div className="text-sm text-cyan-100 mt-2">Your left hand shows current reality</div>
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center mt-6">
            In palmistry, your dominant hand reveals your current reality and what you've done with your gifts, while your non-dominant hand shows your potential and birth gifts.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              leftHandImage ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'
            }`}>
              {leftHandImage ? <CheckCircle className="w-6 h-6" /> : '1'}
            </div>
            <span className="text-slate-300">Left Hand</span>
          </div>
          
          <div className="flex-1 h-1 mx-4 bg-slate-700/50 rounded-full">
            <div className={`h-full bg-purple-500 rounded-full transition-all ${
              leftHandImage ? 'w-full' : 'w-0'
            }`}></div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              rightHandImage ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/20 text-slate-400'
            }`}>
              {rightHandImage ? <CheckCircle className="w-6 h-6" /> : '2'}
            </div>
            <span className={rightHandImage ? 'text-slate-300' : 'text-slate-500'}>Right Hand</span>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      {!showCamera ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition ${
            isDragging
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-slate-600 hover:border-slate-500'
          }`}
        >
          <div className="mb-6">
            <Hand className="w-20 h-20 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Upload {currentHand === 'left' ? 'Left' : 'Right'} Hand
            </h2>
            <p className="text-slate-400">Drop your palm image here or use the buttons below</p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition"
            >
              <Upload className="w-5 h-5" />
              Upload Image
            </button>

            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition"
            >
              <Camera className="w-5 h-5" />
              Scan From Camera
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Privacy Disclaimer */}
          <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">
                Your hand images are processed securely and never used for identification. We analyze palmistry patterns only.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Camera View */
        <div className="bg-slate-900 rounded-2xl overflow-hidden">
          <div className="relative bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-96 object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Camera Guide Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-80 border-2 border-cyan-400 rounded-2xl opacity-50"></div>
            </div>
          </div>

          <div className="p-6 flex gap-4 justify-center">
            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition font-medium"
            >
              Capture Photo
            </button>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 p-6 bg-slate-800/50 border border-slate-700/50 rounded-lg">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          Tips for Best Results
        </h3>
        <ul className="space-y-2 text-slate-300 text-sm">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Use good lighting - natural daylight works best
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Keep your hand flat and fingers slightly apart
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Ensure your entire palm is visible in the image
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Avoid shadows and reflections on your palm
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Remove any rings or jewelry from your hands
          </li>
        </ul>
      </div>
    </div>
  )
}
