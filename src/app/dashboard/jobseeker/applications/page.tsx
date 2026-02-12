import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate, getStatusColor } from '@/lib/utils'
import Link from 'next/link'

export default async function ApplicationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      job:jobs(id, title, company_name, location)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

      {applications && applications.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
          {applications.map((app: any) => (
            <div key={app.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    href={`/jobs/${app.job.id}`}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {app.job.title}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{app.job.company_name}</p>
                  <p className="text-sm text-gray-500 mt-1">{app.job.location}</p>
                </div>
                <div className="ml-4 text-right">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    Applied {formatDate(app.created_at)}
                  </p>
                </div>
              </div>
              {app.cover_letter && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Cover Letter:</h4>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{app.cover_letter}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Start applying to jobs to see your applications here.
          </p>
          <Link
            href="/jobs"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  )
}