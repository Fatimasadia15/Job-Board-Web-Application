import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, FileText } from 'lucide-react'

export default async function JobSeekerDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { count: totalApplications } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: pendingApplications } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'pending')

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Seeker Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Applications
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {totalApplications || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Applications
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {pendingApplications || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/jobs"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Browse Jobs</h3>
              <p className="text-xs text-gray-500">Find new job opportunities</p>
            </div>
          </Link>
          <Link
            href="/dashboard/job-seeker/applications"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            <FileText className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">My Applications</h3>
              <p className="text-xs text-gray-500">Track your job applications</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}