import { createClient } from '@/lib/supabase/server'
import AdminJobsManagement from '@/components/admin/AdminJobsManagement'

export default async function AdminJobsPage() {
  const supabase = await createClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select(`
      *,
      employer:profiles!jobs_employer_id_fkey(full_name, email)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Management</h1>
      <AdminJobsManagement jobs={jobs || []} />
    </div>
  )
}