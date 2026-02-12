import type { Job } from '@/types/database'
import { formatSalary, formatDate, formatJobType } from '@/lib/utils'
import { MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react'

interface JobsListProps {
  jobs: Job[]
}

export default function JobsList({ jobs }: JobsListProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your filters or check back later for new opportunities.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/jobs/${job.id}`}
          className="block bg-white rounded-lg shadow hover:shadow-md transition p-6"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                {job.title}
              </h3>
              <p className="text-lg text-gray-600 mt-1">{job.company_name}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              {formatJobType(job.job_type)}
            </div>
            {(job.salary_min || job.salary_max) && (
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {formatSalary(job.salary_min, job.salary_max)}
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(job.created_at)}
            </div>
          </div>

          <p className="mt-4 text-gray-700 line-clamp-2">{job.description}</p>

          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              View Details
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
