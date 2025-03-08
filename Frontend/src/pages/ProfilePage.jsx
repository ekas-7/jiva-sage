"use client"

import { useState } from "react"
import { useUser } from "@/context/userContext"
import { motion } from "framer-motion"
import { Calendar, Edit2, Mail, MapPin, Phone, Save, User, X, Camera, Heart } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

function Profile({ darkMode }) {
  const { profile } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  const user = profile?.user?.[0] || {
    name: "John Doe",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    contact: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    password: "",
    emergencyContact: {
      name: "Jane Doe",
      relation: "Spouse",
      phone: "+1 (555) 987-6543",
    },
    profileImage: "/placeholder.svg?height=200&width=200"
  }

  // Form state for editing
  const [formData, setFormData] = useState(user)

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log("Saving profile data:", formData)
    setIsEditing(false)
    // In a real app, you would update the context or call an API here
  }

  const handleCancel = () => {
    setFormData(user)
    setIsEditing(false)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  // Set colors based on dark mode
  const bgColor = darkMode ? "bg-gray-900" : "bg-white";
  const cardBgColor = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const mutedTextColor = darkMode ? "text-gray-400" : "text-gray-500";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const inputBgColor = darkMode ? "bg-gray-700" : "bg-muted/20";
  const inputTextColor = darkMode ? "text-gray-300" : "text-gray-700";
  const iconColor = darkMode ? "text-gray-400" : "text-gray-500";

  return (
    <motion.div 
      className={`container min-h-screen mx-auto py-6 px-3 sm:px-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`} 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
    >
      {/* Profile Header */}
      <motion.div className="flex flex-col items-center mb-6 sm:mb-8" variants={itemVariants}>
        <div className="relative mb-4 group">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-[#FFB6C1] shadow-xl">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className={`text-3xl sm:text-4xl bg-[#FFE6EA] text-[#FF9CAD]`}>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button size="sm" variant="secondary" className="absolute bottom-0 right-0 rounded-full bg-[#FFB6C1] hover:bg-[#FF9CAD] text-white">
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>
        <motion.h1
          className={`text-2xl sm:text-3xl font-bold mb-1 ${textColor}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {user.name}
        </motion.h1>
        
        <div className="flex gap-2 mt-1 mb-3">
          <Badge className="bg-[#FFE6EA] text-[#FF7C8C] hover:bg-[#FFE6EA] hover:text-[#FF7C8C]">{user.bloodGroup}</Badge>
          <Badge className="bg-[#FFE6EA] text-[#FF7C8C] hover:bg-[#FFE6EA] hover:text-[#FF7C8C]">{user.gender}</Badge>
          <Badge className="bg-[#FFE6EA] text-[#FF7C8C] hover:bg-[#FFE6EA] hover:text-[#FF7C8C]">{user.age} years</Badge>
        </div>

        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="flex items-center gap-1 bg-[#FFB6C1] hover:bg-[#FF9CAD] text-white border-0">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-1 border-[#FFB6C1] text-[#FF7C8C] hover:bg-[#FFE6EA] hover:text-[#FF7C8C]">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-1 bg-[#FFB6C1] hover:bg-[#FF9CAD] text-black border-0">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </motion.div>
      </motion.div>

      {/* Profile Content */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 text-black bg-[#FFB6C1] p-1 rounded-lg max-w-md mx-auto">
            <TabsTrigger 
              value="personal" 
              className={`rounded-md text-sm ${activeTab === "personal" ? "bg-white shadow-sm" : "text-black hover:bg-[#FFC1CA]"}`}
            >
              Personal Info
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className={`rounded-md text-sm ${activeTab === "contact" ? "bg-white shadow-sm" : "text-black hover:bg-[#FFC1CA]"}`}
            >
              Contact Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className={`${cardBgColor} ${borderColor} border shadow-sm`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-[#FFB6C1]" />
                    <CardTitle className={`${textColor}`}>Personal Information</CardTitle>
                  </div>
                  <CardDescription className={`${mutedTextColor}`}>Your basic personal details</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className={`${textColor}`}>Full Name</Label>
                      {isEditing ? (
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          className={`${inputBgColor} ${inputTextColor} border-[#FFB6C1] focus-visible:ring-[#FFB6C1]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} ${textColor}`}>{user.name}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender" className={`${textColor}`}>Gender</Label>
                      {isEditing ? (
                        <Input 
                          id="gender" 
                          name="gender" 
                          value={formData.gender} 
                          onChange={handleInputChange} 
                          className={`${inputBgColor} ${inputTextColor} border-[#FFB6C1] focus-visible:ring-[#FFB6C1]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} ${textColor}`}>{user.gender}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup" className={`${textColor}`}>Blood Group</Label>
                      {isEditing ? (
                        <Input
                          id="bloodGroup"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          className={`${inputBgColor} ${inputTextColor} border-[#FFB6C1] focus-visible:ring-[#FFB6C1]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} ${textColor}`}>{user.bloodGroup}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupation" className={`${textColor}`}>Occupation</Label>
                      {isEditing ? (
                        <Input
                          id="occupation"
                          name="occupation"
                          value={formData.occupation || ""}
                          onChange={handleInputChange}
                          className={`${inputBgColor} ${inputTextColor} border-[#FFB6C1] focus-visible:ring-[#FFB6C1]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} ${textColor}`}>{user.occupation || "Not specified"}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className={`${cardBgColor} ${borderColor} border shadow-sm`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-[#FFB6C1]" />
                    <CardTitle className={`${textColor}`}>Contact Information</CardTitle>
                  </div>
                  <CardDescription className={`${mutedTextColor}`}>Your contact details and emergency contact</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className={`${textColor}`}>Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`${inputBgColor} ${inputTextColor} border-[#FFB6C1] focus-visible:ring-[#FFB6C1]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} flex items-center gap-2 ${textColor}`}>
                          <Mail className={`h-4 w-4 ${iconColor}`} />
                          {user.email}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact" className={`${textColor}`}>Phone Number</Label>
                      {isEditing ? (
                        <Input 
                          id="contact" 
                          name="contact" 
                          value={formData.contact} 
                          onChange={handleInputChange} 
                          className={`${inputBgColor} ${inputTextColor} border-[#FFB6C1] focus-visible:ring-[#FFB6C1]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} flex items-center gap-2 ${textColor}`}>
                          <Phone className={`h-4 w-4 ${iconColor}`} />
                          {user.contact}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className={`${textColor}`}>Address</Label>
                      {isEditing ? (
                        <Input 
                          id="address" 
                          name="address" 
                          value={formData.address || ""} 
                          onChange={handleInputChange} 
                          className={`${inputBgColor} ${inputTextColor} border-[#FFB6C1] focus-visible:ring-[#FFB6C1]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} flex items-center gap-2 ${textColor}`}>
                          <MapPin className={`h-4 w-4 ${iconColor}`} />
                          {user.address || "Not specified"}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className={darkMode ? "bg-gray-700" : "bg-gray-200"} />

                  <div>
                    <h3 className={`text-lg font-medium mb-4 flex items-center gap-2 ${textColor}`}>
                      <User className="h-5 w-5 text-[#FFB6C1]" />
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact.name" className={`${textColor}`}>Name</Label>
                        {isEditing ? (
                          <Input
                            id="emergencyContact.name"
                            name="emergencyContact.name"
                            value={formData.emergencyContact.name}
                            onChange={handleInputChange}
                            className={`${inputBgColor} ${inputTextColor} border-[#FFB6C1] focus-visible:ring-[#FFB6C1]`}
                          />
                        ) : (
                          <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} flex items-center gap-2 ${textColor}`}>
                            <User className={`h-4 w-4 ${iconColor}`} />
                            {user.emergencyContact.name}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact.relation" className={`${textColor}`}>Relationship</Label>
                        {isEditing ? (
                          <Input
                            id="emergencyContact.relation"
                            name="emergencyContact.relation"
                            value={formData.emergencyContact.relation}
                            onChange={handleInputChange}
                            className={`${inputBgColor} ${inputTextColor} border-[#FFB6C1] focus-visible:ring-[#FFB6C1]`}
                          />
                        ) : (
                          <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} ${textColor}`}>{user.emergencyContact.relation}</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact.phone" className={`${textColor}`}>Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="emergencyContact.phone"
                            name="emergencyContact.phone"
                            value={formData.emergencyContact.phone}
                            onChange={handleInputChange}
                            className={`${inputBgColor} ${inputTextColor} border-[#FFB6C1] focus-visible:ring-[#FFB6C1]`}
                          />
                        ) : (
                          <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} flex items-center gap-2 ${textColor}`}>
                            <Phone className={`h-4 w-4 ${iconColor}`} />
                            {user.emergencyContact.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

export default Profile