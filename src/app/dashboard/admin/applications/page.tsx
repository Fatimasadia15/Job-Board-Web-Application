import { createClient } from '@/lib/supabase/server'
import { formatDate, getStatusColor } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminApplicationsPage() {
  const supabase = await createClient()

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      job:jobs(id, title, company_name),
      user:profiles!applications_user_id_fkey(full_name, email)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Applications</h1>

      {applications && applications.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Applied
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app: any) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {app.user?.full_name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">{app.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/jobs/${app.job.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {app.job.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.job.company_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(app.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500">No applications yet</p>
        </div>
      )}
    </div>
  )
}