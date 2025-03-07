"use client"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useUser } from "../context/userContext"
import { Calendar, FileText, Home, LogOut, PieChart, Pill, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {   
  Sidebar as ShadcnSidebar,   
  SidebarContent,   
  SidebarFooter,   
  SidebarHeader,   
  SidebarMenu,   
  SidebarMenuButton,   
  SidebarMenuItem,   
  SidebarProvider,   
  SidebarTrigger, 
} from "@/components/ui/sidebar"
import { useEffect } from "react"

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useUser()
  const user = profile?.user?.[0] || {
    name: "Guest User",
    age: null,
    gender: "",
    bloodGroup: "",
    contact: "",
    email: "",
    password: "",
    emergencyContact: {
      name: "",
      relation: "",
      phone: "",
    },
    profileImage: "/placeholder.svg?height=40&width=40",
  }

  // Redirect to dashboard if no specific route is selected
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "") {
      navigate("/dashboard")
    }
  }, [location, navigate])


  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Navigation items with icons
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home, isActive: true },
    { path: "/profile", label: "Profile", icon: User, isActive: false },
    { path: "/appointments", label: "Appointments", icon: Calendar, isActive: false },
    { path: "/medical-records", label: "Medical Records", icon: FileText, isActive: false },
    { path: "/lab-reports", label: "Lab Reports", icon: PieChart, isActive: false },
    { path: "/medications", label: "Medications", icon: Pill, isActive: false },
    { path: "/settings", label: "Settings", icon: Settings, isActive: false },
  ]

  // Logout handler
  const handleLogout = () => {
    // Add logout logic here (e.g., clearing user session, tokens)
    navigate("/login")
  }

  return (
<div>
    <SidebarProvider>
      <ShadcnSidebar className="border-r">
        <SidebarHeader className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-teal-600 p-1">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">MediCare</span>
          </div>
          <SidebarTrigger />
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <Link 
                  to={item.path} 
                  className={`flex items-center space-x-2 w-full p-2 ${
                    location.pathname === item.path 
                      ? "bg-gray-100 text-primary" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </SidebarFooter>
      </ShadcnSidebar>
    </SidebarProvider>
    </div>
  )
}

export default Sidebar