'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Job } from '@/types/database'
import { formatSalary, formatDate, formatJobType, getStatusColor } from '@/lib/utils'
import { Edit, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface EmployerJobsListProps {
  jobs: Job[]
}

export default function EmployerJobsList({ jobs: initialJobs }: EmployerJobsListProps) {
  const [jobs, setJobs] = useState(initialJobs)
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return
    }

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

  if (jobs.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900">No jobs posted yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          Get started by posting your first job.
        </p>
        <Link
          href="/dashboard/employer/jobs/new"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Post a Job
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="divide-y divide-gray-200">
        {jobs.map((job) => (
          <div key={job.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{job.company_name}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{formatJobType(job.job_type)}</span>
                  {(job.salary_min || job.salary_max) && (
                    <>
                      <span>•</span>
                      <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                    </>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    Posted {formatDate(job.created_at)}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex gap-2">
                {job.status === 'approved' && (
                  <Link
                    href={`/jobs/${job.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                )}
                <Link
                  href={`/dashboard/employer/jobs/${job.id}/edit`}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  disabled={loading === job.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}