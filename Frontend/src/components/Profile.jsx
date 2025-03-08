"use client"

import { useState } from "react"
import { useUser } from "@/context/userContext"
import { motion } from "framer-motion"
import { Calendar, Edit2, Mail, MapPin, Phone, Save, User, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function Profile() {
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

  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  return (
    <motion.div className="container mx-auto py-8 px-4" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Profile Header */}
      <motion.div className="flex flex-col items-center mb-8" variants={itemVariants}>
        <div className="relative mb-4 group">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="text-4xl">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button size="sm" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <motion.h1
          className="text-3xl font-bold mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {user.name}
        </motion.h1>
        {/* <motion.div
          className="flex items-center text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <MapPin className="h-4 w-4 mr-1" />
          <span>{user.address}</span>
        </motion.div> */}

        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-1">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-1">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </motion.div>
      </motion.div>

      {/* Profile Content */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
            {/* <TabsTrigger value="medical">Medical Info</TabsTrigger> */}
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic personal details</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/20">{user.name}</div>
                      )}
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="birthDate">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="birthDate"
                          name="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/20 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(user.birthDate).toLocaleDateString()} ({calculateAge(user.birthDate)} years)
                        </div>
                      )}
                    </div> */}

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      {isEditing ? (
                        <Input id="gender" name="gender" value={formData.gender} onChange={handleInputChange} />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/20">{user.gender}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      {isEditing ? (
                        <Input
                          id="bloodGroup"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/20">{user.bloodGroup}</div>
                      )}
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      {isEditing ? (
                        <Input id="height" name="height" value={formData.height} onChange={handleInputChange} />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/20">{user.height}</div>
                      )}
                    </div> */}

                    {/* <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      {isEditing ? (
                        <Input id="weight" name="weight" value={formData.weight} onChange={handleInputChange} />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/20">{user.weight}</div>
                      )}
                    </div> */}

                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      {isEditing ? (
                        <Input
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/20">{user.occupation}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Your contact details and emergency contact</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/20 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {user.email}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact">Phone Number</Label>
                      {isEditing ? (
                        <Input id="contact" name="contact" value={formData.contact} onChange={handleInputChange} />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/20 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {user.contact}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/20 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {user.address}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact.name">Name</Label>
                        {isEditing ? (
                          <Input
                            id="emergencyContact.name"
                            name="emergencyContact.name"
                            value={formData.emergencyContact.name}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/20 flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {user.emergencyContact.name}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact.relation">Relationship</Label>
                        {isEditing ? (
                          <Input
                            id="emergencyContact.relation"
                            name="emergencyContact.relation"
                            value={formData.emergencyContact.relation}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/20">{user.emergencyContact.relation}</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact.phone">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="emergencyContact.phone"
                            name="emergencyContact.phone"
                            value={formData.emergencyContact.phone}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/20 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
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

          {/* <TabsContent value="medical" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                  <CardDescription>Your medical details and allergies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Allergies</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.allergies.map((allergy, index) => (
                          <motion.div
                            key={index}
                            className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {allergy}
                          </motion.div>
                        ))}
                        {isEditing && (
                          <Button variant="outline" size="sm" className="rounded-full">
                            + Add Allergy
                          </Button>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Medical History</h3>
                      <p className="text-muted-foreground">
                        Your complete medical history is available in the Medical Records section.
                      </p>
                      <Button variant="outline" className="mt-4">
                        View Medical Records
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent> */}
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

export default Profile

