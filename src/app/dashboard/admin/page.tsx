import { createClient } from '@/lib/supabase/server'
import { Users, Briefcase, FileText } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: totalJobs } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })

  const { count: totalApplications } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })

  const stats = [
    {
      name: 'Total Users',
      value: totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Jobs',
      value: totalJobs || 0,
      icon: Briefcase,
      color: 'bg-green-500',
    },
    {
      name: 'Total Applications',
      value: totalApplications || 0,
      icon: FileText,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/admin/users"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Manage Users</h3>
              <p className="text-xs text-gray-500">View and manage all users</p>
            </div>
          </Link>
          <Link
            href="/dashboard/admin/jobs"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            <Briefcase className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Manage Jobs</h3>
              <p className="text-xs text-gray-500">Approve or reject job posts</p>
            </div>
          </Link>
          <Link
            href="/dashboard/admin/applications"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
          >
            <FileText className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">View Applications</h3>
              <p className="text-xs text-gray-500">Monitor all job applications</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}