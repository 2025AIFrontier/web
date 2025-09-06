export const metadata = {
  title: 'Prompting 제안 - AI 서비스',
  description: 'AI 프롬프팅 제안 페이지',
}

export default function PromptingPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Prompting 제안</h1>
      </div>

      {/* Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Card */}
        <div className="col-span-full bg-white dark:bg-gray-800 shadow rounded-xl">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">AI Prompting 제안 서비스</h2>
            <p className="text-gray-600 dark:text-gray-400">효과적인 AI 프롬프트 작성을 위한 가이드와 제안 사항이 여기에 표시됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}