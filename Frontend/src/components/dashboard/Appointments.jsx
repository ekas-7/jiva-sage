"use client"

import { useState } from "react"
import { useUser } from "../../context/userContext"
import { Calendar, MapPin, ExternalLink, FileText, Video, User } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const Appointments = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState("upcoming")
  const { profile } = useUser()

  const appointments = profile?.appointments || []

  // Separate upcoming and past appointments dynamically
  const upcomingAppointments = appointments.filter((appointment) => !appointment.prescription)
  const pastAppointments = appointments.filter((appointment) => appointment.prescription)

  return (
    <Card className={`h-full overflow-hidden ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
      <CardHeader className={` px-3 sm:px-4 ${darkMode ? "border-gray-800" : "border-gray-100"} border-b`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
          <div>
            <CardTitle className={`text-lg sm:text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Appointments & Consultations
            </CardTitle>
            <CardDescription className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Upcoming and past medical appointments
            </CardDescription>
          </div>
          <Button className="bg-[#FFB6C1] hover:bg-[#fba8b5] text-black font-medium transition-colors border-0 text-sm h-9 px-3 py-2 self-start sm:self-auto">
            Schedule Now
          </Button>
        </div>
      </CardHeader>

      <div className="px-3 sm:px-4 pt-2">
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full text-black max-w-[350px] grid-cols-2 bg-[#FFB6C1] p-1 rounded-lg text-xs sm:text-sm">
            <TabsTrigger
              value="upcoming"
              className={`rounded-md ${activeTab === "upcoming" ? "bg-white shadow-sm" : ""}`}
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" className={`rounded-md ${activeTab === "past" ? "bg-white shadow-sm" : ""}`}>
              Past Consultations
            </TabsTrigger>
          </TabsList>

          <CardContent className="px-0 py-2">
            <div className="h-70 overflow-y-auto pr-1">
              <TabsContent value="upcoming" className="m-0">
                <div className="space-y-2">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        darkMode={darkMode}
                        isPast={false}
                      />
                    ))
                  ) : (
                    <EmptyState
                      icon={<Calendar className={`h-10 w-10 sm:h-12 sm:w-12 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />}
                      message="No upcoming appointments"
                      darkMode={darkMode}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="past" className="m-0">
                <div className="space-y-2">
                  {pastAppointments.length > 0 ? (
                    pastAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        darkMode={darkMode}
                        isPast={true}
                      />
                    ))
                  ) : (
                    <EmptyState
                      icon={<FileText className={`h-10 w-10 sm:h-12 sm:w-12 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />}
                      message="No past consultations"
                      darkMode={darkMode}
                    />
                  )}
                </div>
              </TabsContent>
            </div>
          </CardContent>
        </Tabs>
      </div>
    </Card>
  )
}

const AppointmentCard = ({ appointment, darkMode, isPast }) => {
  return (
    <div
      className={`p-2 rounded-xl border ${
        darkMode
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-100 hover:border-gray-200"
        } transition-all shadow-sm hover:shadow`}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-0">
        {/* Doctor Details */}
        <div className="flex items-start gap-3">
          <div
            className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                isPast
                ? darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-50 text-gray-500"
                : appointment.isOnline
                  ? darkMode
                    ? "bg-blue-900 text-blue-300"
                    : "bg-blue-50 text-blue-500"
                  : darkMode
                    ? "bg-[#ffdde2] bg-opacity-20 text-[#ffdde2]"
                    : "bg-[#ffdde2] text-pink-700"
              }`}
          >
            {isPast ? <FileText size={18} /> : appointment.isOnline ? <Video size={18} /> : <User size={18} />}
          </div>
          <div>
            <h3 className={`font-medium text-sm sm:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
              {appointment.doctor}
            </h3>
            <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{appointment.department}</p>
            <div className={`flex items-center mt-1 text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <MapPin className={`h-3 w-3 mr-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              {appointment.location}
            </div>
          </div>
        </div>

        {/* Appointment Time & Badge */}
        <div className="text-left sm:text-right ml-10 sm:ml-0 mt-1 sm:mt-0">
          <p className={`text-xs sm:text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
          </p>
          {!isPast && (
            <Badge
              className={`mt-1 font-normal text-xs ${
                appointment.isOnline
                  ? darkMode
                    ? "bg-blue-900 text-blue-300"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-50"
                  : darkMode
                    ? "bg-[#ffdde2] bg-opacity-20 text-[#ffdde2]"
                    : "bg-[#ffdde2] text-pink-700 hover:bg-[#ffdde2]"
                }`}
            >
              {appointment.isOnline ? "Online" : "In-person"}
            </Badge>
          )}
        </div>
      </div>

      {/* Diagnosis & Prescription Section for Past Appointments */}
      {isPast && appointment.diagnosis && (
        <div className="mt-3 ml-10 sm:ml-12">
          <div className={`pl-3 sm:pl-4 border-l ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
            <h4 className={`text-xs sm:text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Diagnosis:</h4>
            <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{appointment.diagnosis}</p>

            <h4 className={`text-xs sm:text-sm font-medium mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Prescription:
            </h4>
            <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{appointment.prescription}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-3 sm:mt-4 ml-10 sm:ml-16">
        {isPast ? (
          <Button
            variant="outline"
            size="sm"
            className={`text-xs h-8 px-2 py-1 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "bg-[#FFB6C1]"}`}
          >
            View Summary
            <ExternalLink size={12} className="ml-1 sm:ml-2" />
          </Button>
        ) : (
          appointment.isOnline && (
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-8 px-2 py-1 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""} border-[#ffdde2] hover:border-[#ffcbd3] hover:bg-[#ffdde2] hover:bg-opacity-10`}
            >
              Join Meeting
              <ExternalLink size={12} className="ml-1 sm:ml-2" />
            </Button>
          )
        )}
      </div>
    </div>
  )
}

const EmptyState = ({ icon, message, darkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-32 sm:h-40 text-center p-4 sm:p-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 bg-opacity-50">
      <div className="mb-2 sm:mb-3">{icon}</div>
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>{message}</p>
      <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-500" : "text-gray-400"} mt-1`}>
        Your appointments will appear here
      </p>
    </div>
  )
}

export default Appointments