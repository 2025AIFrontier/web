export const metadata = {
  title: 'BI Matrix - Dashboard',
  description: 'BI Matrix Dashboard Page',
}

export default function BiMatrix() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">BI Matrix</h1>
      </div>

      {/* Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Card */}
        <div className="col-span-full bg-white dark:bg-gray-800 shadow rounded-xl">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Business Intelligence Matrix</h2>
            <p className="text-gray-600 dark:text-gray-400">BI Matrix 콘텐츠가 여기에 표시됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}