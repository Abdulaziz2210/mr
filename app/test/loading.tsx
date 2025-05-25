export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold mb-2">Loading Test...</h2>
      <p className="text-gray-500 dark:text-gray-400">Please wait while we prepare your test.</p>
    </div>
  )
}
