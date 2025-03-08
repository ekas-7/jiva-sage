"use client"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useUser } from "../context/userContext"
import { 
  BarChart3, 
  Wallet, 
  Home, 
  LogOut, 
  PieChart, 
  LineChart, 
  Settings, 
  User,
  CreditCard,
  Calendar,
  HelpCircle
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {   
  Sidebar as ShadcnSidebar,   
  SidebarContent,   
  SidebarFooter,   
  SidebarHeader,   
  SidebarMenu,  
  SidebarMenuItem,   
  SidebarProvider,   
  SidebarTrigger, 
} from "@/components/ui/sidebar"
import { useEffect } from "react"

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, setToken } = useUser()
  const user = profile?.user?.[0] || {
    name: "Dwayne Tatum",
    role: "CEO Assistant",
    email: "dwayne@example.com",
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

  // Navigation items with icons - updated for financial theme
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/accounts", label: "Accounts", icon: CreditCard },
    { path: "/transactions", label: "Transactions", icon: Wallet },
    { path: "/investments", label: "Investments", icon: LineChart },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    { path: "/analytics", label: "Analytics", icon: PieChart },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/settings", label: "Settings", icon: Settings },
  ]

  // Logout handler
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login")
  }

  return (
    <div className="h-screen">
      <SidebarProvider>
        <ShadcnSidebar className="border-r bg-white">
          <SidebarHeader className="flex items-center justify-between px-4 py-5">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-black p-2">
                <span className="text-white font-bold text-sm">N9</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">Financial</span>
                <span className="text-xs text-gray-500">Dashboard</span>
              </div>
            </div>
            <SidebarTrigger className="text-gray-400" />
          </SidebarHeader>
          
          <SidebarContent className="px-3">
            <SidebarMenu className="space-y-1 py-3">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-colors ${
                      location.pathname === item.path 
                        ? "bg-gray-100 text-black font-medium" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${location.pathname === item.path ? "text-black" : "text-gray-400"}`} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <div className="mx-4 my-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <HelpCircle className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Need help?</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Contact our support team for assistance</p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg">
                Contact Support
              </Button>
            </div>
          </div>
          
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-gray-800"
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