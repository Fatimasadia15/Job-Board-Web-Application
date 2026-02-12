export type UserRole = 'admin' | 'employer' | 'job_seeker'
export type UserStatus = 'active' | 'blocked'
export type JobStatus = 'pending' | 'approved' | 'rejected'
export type JobType = 'full-time' | 'part-time' | 'remote' | 'contract'
export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  employer_id: string
  title: string
  company_name: string
  location: string
  job_type: JobType
  salary_min: number | null
  salary_max: number | null
  description: string
  status: JobStatus
  created_at: string
  updated_at: string
  employer?: Profile
}

export interface Application {
  id: string
  job_id: string
  user_id: string
  status: ApplicationStatus
  cover_letter: string | null
  created_at: string
  job?: Job
  user?: Profile
}

export interface DashboardStats {
  totalUsers: number
  totalJobs: number
  totalApplications: number
}