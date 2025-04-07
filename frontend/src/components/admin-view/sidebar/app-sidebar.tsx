"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react"

import { NavMain } from "./nav-main" 
import { NavProjects } from "./nav-projects" 
import { NavUser } from "./nav-user" 
import { TeamSwitcher } from "./team-switcher" 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Product ",
      url: "/admin/product",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Fruit",
          url: "/admin/product",
        },
        {
          title: "Category",
          url: "/admin/category",
        },
        {
          title: "Fruit Type",
          url: "/admin/fruitType",
        },
        {
          title: "Product Image",
          url: "/admin/productImage",
        },
      ],
    },
    {
      title: "Discount Program",
      url: "/admin/promotion",
      icon: Bot,
      items: [
        {
          title: "promotion",
          url: "/admin/promotion",
        },
        {
          title: "Coupon",
          url: "/admin/discount",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Customer",
      url: "/admin/user",
      icon: User,
      items: [
        {
          title: "User",
          url: "/admin/user",
        },
        {
          title: "Order",
          url: "/admin/order",
        },
        {
          title: "Review",
          url: "/admin/approveReview",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
