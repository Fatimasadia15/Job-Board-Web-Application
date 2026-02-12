import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import JobForm from '@/components/employer/JobForm'

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('employer_id', user.id)
    .single()

  if (!job) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Job</h1>
      <JobForm job={job} />
    </div>
  )
}