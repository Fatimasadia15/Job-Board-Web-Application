import Link from 'next/link'

export default function BlockedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Account Blocked
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your account has been blocked by an administrator.
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Please contact support if you believe this is an error.
          </p>
        </div>
        <div>
          <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}