import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ApplyButton from '@/components/jobs/ApplyButton'
import { formatSalary, formatDate, formatJobType } from '@/lib/utils'
import { MapPin, Briefcase, DollarSign, Calendar, Building2 } from 'lucide-react'
import Link from 'next/link'

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select(`
      *,
      employer:profiles!jobs_employer_id_fkey(full_name, email)
    `)
    .eq('id', id)
    .single()

  if (!job || job.status !== 'approved') {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let hasApplied = false
  if (user) {
    const { data: application } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', id)
      .eq('user_id', user.id)
      .single()

    hasApplied = !!application
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/jobs"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to Jobs
        </Link>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-xl text-gray-600 mt-2">{job.company_name}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                {formatJobType(job.job_type)}
              </div>
              {(job.salary_min || job.salary_max) && (
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  {formatSalary(job.salary_min, job.salary_max)}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Posted {formatDate(job.created_at)}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <ApplyButton jobId={job.id} hasApplied={hasApplied} userId={user?.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}