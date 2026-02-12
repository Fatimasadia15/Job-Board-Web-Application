import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/auth/login')
  }

  // Redirect to role-specific dashboard
  switch (profile.role) {
    case 'admin':
      redirect('/dashboard/admin')
    case 'employer':
      redirect('/dashboard/employer')
    case 'job_seeker':
      redirect('/dashboard/job-seeker')
    default:
      redirect('/')
  }
}