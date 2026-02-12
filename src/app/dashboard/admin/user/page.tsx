import { createClient } from '@/lib/supabase/server'
import UserManagement from '@/components/admin/UserManagement'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>
      <UserManagement users={users || []} />
    </div>
  )
}