'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import type { User } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface DashboardNavProps {
  user: User
  profile: Profile
}

export default function DashboardNav({ user, profile }: DashboardNavProps) {
  const router = useRouter()
  const supabase = createClient()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/')
    router.refresh()
  }

  const getNavItems = () => {
    switch (profile.role) {
      case 'admin':
        return [
          { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/dashboard/admin/users', label: 'Users', icon: Users },
          { href: '/dashboard/admin/jobs', label: 'Jobs', icon: Briefcase },
          { href: '/dashboard/admin/applications', label: 'Applications', icon: FileText },
        ]
      case 'employer':
        return [
          { href: '/dashboard/employer', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/dashboard/employer/jobs', label: 'My Jobs', icon: Briefcase },
          { href: '/dashboard/employer/jobs/new', label: 'Post Job', icon: FileText },
        ]
      case 'job_seeker':
        return [
          { href: '/dashboard/job-seeker', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
          { href: '/dashboard/job-seeker/applications', label: 'My Applications', icon: FileText },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                JobBoard
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <div className="text-sm text-gray-700">
              {profile.full_name || user.email}
              <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {profile.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4 flex items-center">
              <div className="text-sm font-medium text-gray-900">{profile.full_name || user.email}</div>
              <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {profile.role}
              </span>
            </div>
            <div className="mt-3 px-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
