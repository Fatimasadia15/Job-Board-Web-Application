export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return 'Not specified'
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  if (min) return `From $${min.toLocaleString()}`
  if (max) return `Up to $${max.toLocaleString()}`
  return 'Not specified'
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatJobType(type: string): string {
  return type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'approved':
    case 'active':
    case 'accepted':
      return 'text-green-600 bg-green-50'
    case 'pending':
    case 'reviewed':
      return 'text-yellow-600 bg-yellow-50'
    case 'rejected':
    case 'blocked':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}