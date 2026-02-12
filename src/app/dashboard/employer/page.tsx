import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, Users, Eye } from 'lucide-react'

export default async function EmployerDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Get employer's jobs count
  const { count: totalJobs } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', user.id)

  const { count: pendingJobs } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', user.id)
    .eq('status', 'pending')

  const { count: approvedJobs } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', user.id)
    .eq('status', 'approved')

  // Get total applications to employer's jobs
  const { data: employerJobs } = await supabase
    .from('jobs')
    .select('id')
    .eq('employer_id', user.id)

  const jobIds = employerJobs?.map(job => job.id) || []

  const { count: totalApplications } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .in('job_id', jobIds.length > 0 ? jobIds : ['none'])

  const stats = [
    {
      name: 'Total Jobs Posted',
      value: totalJobs || 0,
      icon: Briefcase,
      color: 'bg-blue-500',
    },
    {
      name: 'Pending Approval',
      value: pendingJobs || 0,
      icon: Eye,
      color: 'bg-yellow-500',
    },
    {
      name: 'Total Applications',
      value: totalApplications || 0,
      icon: Users,
      color: 'bg-green-500',
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
        <Link
          href="/dashboard/employer/jobs/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Post New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
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

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/employer/jobs"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">My Jobs</h3>
              <p className="text-xs text-gray-500">View and manage your job postings</p>
            </div>
          </Link>
          <Link
            href="/dashboard/employer/jobs/new"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            <Briefcase className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Post New Job</h3>
              <p className="text-xs text-gray-500">Create a new job posting</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}