import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Store, BarChart3, User, Leaf } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Explore Stores",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Retailer Dashboard",
    url: createPageUrl("RetailerDashboard"),
    icon: BarChart3,
  },
  {
    title: "My Profile",
    url: createPageUrl("MyProfile"),
    icon: User,
  },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary: 142 76% 36%;
            --primary-foreground: 0 0% 100%;
            --secondary: 142 32% 92%;
            --accent: 142 76% 46%;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <Sidebar className="border-r border-emerald-100 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-emerald-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">EcoRate</h2>
                <p className="text-xs text-emerald-600 font-medium">Sustainability Tracker</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`mb-1 rounded-xl transition-all duration-200 ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md hover:shadow-lg' 
                            : 'hover:bg-emerald-50 text-gray-700 hover:text-emerald-700'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-8 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Make an Impact</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Your ratings help promote sustainable shopping and encourage eco-friendly practices.
                  </p>
                </div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-emerald-50 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <Leaf className="w-6 h-6 text-emerald-600" />
                <h1 className="text-xl font-bold text-gray-900">EcoRate</h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
