import { createClient } from '@/lib/supabase/server'
import JobsList from '@/components/jobs/JobsList'
import JobFilters from '@/components/jobs/JobFilters'

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; location?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('jobs')
    .select(`
      *,
      employer:profiles!jobs_employer_id_fkey(full_name, email)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  // Apply filters
  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,company_name.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }

  if (params.type) {
    query = query.eq('job_type', params.type)
  }

  if (params.location) {
    query = query.ilike('location', `%${params.location}%`)
  }

  const { data: jobs } = await query

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="mt-2 text-sm text-gray-600">
            {jobs?.length || 0} jobs available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <JobFilters />
          </div>
          <div className="lg:col-span-3">
            <JobsList jobs={jobs || []} />
          </div>
        </div>
      </div>
    </div>
  )
}