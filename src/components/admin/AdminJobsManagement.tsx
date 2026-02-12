'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Job } from '@/types/database'
import { formatDate, formatJobType, getStatusColor } from '@/lib/utils'
import { CheckCircle, XCircle, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface AdminJobsManagementProps {
  jobs: Job[]
}

export default function AdminJobsManagement({ jobs: initialJobs }: AdminJobsManagementProps) {
  const [jobs, setJobs] = useState(initialJobs)
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleApprove = async (jobId: string) => {
    setLoading(jobId)

    const { error } = await supabase
      .from('jobs')
      .update({ status: 'approved' })
      .eq('id', jobId)

    if (error) {
      toast.error('Failed to approve job')
    } else {
      toast.success('Job approved successfully')
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'approved' as const } : j))
      router.refresh()
    }

    setLoading(null)
  }

  const handleReject = async (jobId: string) => {
    setLoading(jobId)

    const { error } = await supabase
      .from('jobs')
      .update({ status: 'rejected' })
      .eq('id', jobId)

    if (error) {
      toast.error('Failed to reject job')
    } else {
      toast.success('Job rejected')
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'rejected' as const } : j))
      router.refresh()
    }

    setLoading(null)
  }

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    setLoading(jobId)

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId)

    if (error) {
      toast.error('Failed to delete job')
    } else {
      toast.success('Job deleted successfully')
      setJobs(jobs.filter(j => j.id !== jobId))
      router.refresh()
    }

    setLoading(null)
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Employer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Posted
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.company_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.employer?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatJobType(job.job_type)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(job.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {job.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(job.id)}
                          disabled={loading === job.id}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 disabled:opacity-50"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(job.id)}
                          disabled={loading === job.id}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={loading === job.id}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}