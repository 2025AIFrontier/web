import AuthHeader from './auth-header'
import AuthImage from './auth-image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col">
            {/* Header */}
            <AuthHeader />
            
            {/* Main content */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="w-full max-w-sm">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <AuthImage />
      </div>
    </main>
  )
}