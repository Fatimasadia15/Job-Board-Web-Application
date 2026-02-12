'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ApplyButtonProps {
  jobId: string
  hasApplied: boolean
  userId?: string
}

export default function ApplyButton({ jobId, hasApplied, userId }: ApplyButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleApply = async () => {
    if (!userId) {
      router.push('/auth/login')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('applications')
      .insert({
        job_id: jobId,
        user_id: userId,
        cover_letter: coverLetter || null,
      })

    if (error) {
      toast.error('Failed to submit application')
    } else {
      toast.success('Application submitted successfully!')
      setShowModal(false)
      router.refresh()
    }

    setLoading(false)
  }

  if (hasApplied) {
    return (
      <div className="text-center py-4 bg-green-50 rounded-md">
        <p className="text-green-800 font-medium">You have already applied for this job</p>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
      >
        Apply Now
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Apply for this job</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                rows={6}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell the employer why you're a great fit..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApply}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}