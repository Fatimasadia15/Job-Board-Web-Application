import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EmployerJobsList from '@/components/employer/EmployerJobsList'

export default async function EmployerJobsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('employer_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Jobs</h1>
      <EmployerJobsList jobs={jobs || []} />
    </div>
  )
}