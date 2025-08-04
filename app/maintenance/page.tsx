export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto h-24 w-24 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="h-12 w-12 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Service Temporarily Unavailable
        </h1>
        
        <p className="text-gray-600 mb-6">
          We're performing scheduled maintenance on our phone service. 
          We'll be back online shortly.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Expected to be back online within a few minutes.
            Thank you for your patience.
          </p>
        </div>
        
        <div className="text-sm text-gray-500">
          If you need immediate assistance, please email us at{' '}
          <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
            support@example.com
          </a>
        </div>
      </div>
    </div>
  )
}