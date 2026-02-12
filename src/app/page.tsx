import Link from 'next/link'
import { Briefcase, Users, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
            Find Your Dream Job
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/jobs"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              Browse Jobs
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
              Quality Jobs
            </h3>
            <p className="mt-2 text-base text-gray-500 text-center">
              Access thousands of verified job opportunities from top employers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
              Easy Application
            </h3>
            <p className="mt-2 text-base text-gray-500 text-center">
              Apply to multiple jobs with just a few clicks. Track all your applications in one place.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
              Career Growth
            </h3>
            <p className="mt-2 text-base text-gray-500 text-center">
              Find opportunities that align with your career goals and help you grow professionally.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Create your account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
              >
                View Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-400">
            &copy; 2026 JobBoard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}