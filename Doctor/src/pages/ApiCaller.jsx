"use client"
import React,{ useState } from "react"
import axios from "axios"
import { Loader2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useNavigate } from "react-router-dom"

import { useDoctor } from "@/context/DoctorContext"

export default function ApiCaller() {
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const {setUserProfile} = useDoctor();
  const navigate = useNavigate();

  const HOST_URI = import.meta.env.HOST_URI
  const HOST = import.meta.env.HOST
  const userId = "67c8359e593e11d7a2400a20"

  const handleButtonClick = () => {
    setShowInput(true)
    setError("")
    setSuccess(false)
  }

  const handleInputChange = (e) => {
    // Only allow digits and limit to 4 characters
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setInputValue(value)
  }

  const handleSubmit = async () => {
    // Validate 4-digit number
    if (inputValue.length !== 4) {
      setError("Please enter a 4-digit number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Call API with the 4-digit number
      const response = await axios.post(`http://localhost:4000/api/doctor/qr-data`, { userId, inputValue })
      const data = response.data

      if(data.success){
        setUserProfile(data.data)
        navigate('/user-data')
      }

      // Show success message
      setSuccess(true)

      // Reset form after successful submission
      setTimeout(() => {
        setShowInput(false)
        setInputValue("")
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError("Error calling API. Please try again.")
      console.error("API Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setShowInput(false)
    setInputValue("")
    setError("")
    setSuccess(false)
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">QR Code Verification</CardTitle>
          <CardDescription className="text-center">Enter the 4-digit code from the QR scanner</CardDescription>
        </CardHeader>
        <CardContent>
          {!showInput ? (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleButtonClick}
                className="w-full sm:w-auto px-8 py-6 text-lg font-medium transition-all"
              >
                Start Verification
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {success ? (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <AlertDescription>Verification successful! Redirecting...</AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="flex flex-col space-y-2">
                    <div className="relative">
                      <Input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        maxLength={4}
                        placeholder="Enter 4-digit code"
                        className="text-center text-lg py-6 tracking-widest"
                        disabled={isLoading}
                        autoFocus
                      />
                      {inputValue.length > 0 && (
                        <div className="absolute top-1/2 right-3 -translate-y-1/2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setInputValue("")}
                            className="h-6 w-6"
                            type="button"
                            disabled={isLoading}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center mt-1">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-1 rounded-full ${i < inputValue.length ? "bg-primary" : "bg-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={handleCancel} className="flex-1" disabled={isLoading}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading || inputValue.length !== 4} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          {!showInput && "Secure verification system"}
        </CardFooter>
      </Card>
    </div>
  )
}

