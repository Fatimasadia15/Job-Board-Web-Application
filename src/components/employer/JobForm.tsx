'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { Job, JobType } from '@/types/database'

interface JobFormProps {
  job?: Job
}

export default function JobForm({ job }: JobFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: job?.title || '',
    company_name: job?.company_name || '',
    location: job?.location || '',
    job_type: job?.job_type || 'full-time' as JobType,
    salary_min: job?.salary_min?.toString() || '',
    salary_max: job?.salary_max?.toString() || '',
    description: job?.description || '',
  })

  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error('You must be logged in')
        return
      }

      const jobData = {
        title: formData.title,
        company_name: formData.company_name,
        location: formData.location,
        job_type: formData.job_type,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        description: formData.description,
        employer_id: user.id,
        status: 'pending' as const,
      }

      if (job) {
        // Update existing job
        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', job.id)

        if (error) throw error
        toast.success('Job updated successfully')
      } else {
        // Create new job
        const { error } = await supabase
          .from('jobs')
          .insert([jobData])

        if (error) throw error
        toast.success('Job posted successfully! It will be visible after admin approval.')
      }

      router.push('/dashboard/employer/jobs')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
            Company Name *
          </label>
          <input
            type="text"
            id="company_name"
            required
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <input
            type="text"
            id="location"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="job_type" className="block text-sm font-medium text-gray-700">
            Job Type *
          </label>
          <select
            id="job_type"
            required
            value={formData.job_type}
            onChange={(e) => setFormData({ ...formData, job_type: e.target.value as JobType })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="remote">Remote</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div>
          <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700">
            Minimum Salary
          </label>
          <input
            type="number"
            id="salary_min"
            value={formData.salary_min}
            onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700">
            Maximum Salary
          </label>
          <input
            type="number"
            id="salary_max"
            value={formData.salary_max}
            onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Job Description *
        </label>
        <textarea
          id="description"
          required
          rows={10}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the job role, responsibilities, requirements, etc."
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : job ? 'Update Job' : 'Post Job'}
        </button>
      </div>
    </form>
  )
}