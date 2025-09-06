import Image, { StaticImageData } from 'next/image'

interface Job {
  id: number
  image: StaticImageData
  name: string
  position: string
  department: string
  company: string
  link: string
  contact: string
  email: string
  products: string
  type: string
  fav: boolean
}

interface JobsItemProps {
  job: Job
  isFavorite?: boolean
  onToggleFavorite?: (employee: { id: number; name: string; department: string }) => void
}

export default function JobsItem({ job, isFavorite = false, onToggleFavorite }: JobsItemProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-sm rounded-xl px-5 py-4`}
    >
      <div className="md:flex justify-between items-center space-y-4 md:space-y-0 space-x-2">
        {/* Left side */}
        <div className="flex items-start space-x-3 md:space-x-4 md:w-1/3">
          <div className="w-9 h-9 shrink-0 mt-1">
            <Image className="w-9 h-9 rounded-full" src={job.image} width={36} height={36} alt={job.name} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex font-semibold text-gray-800 dark:text-gray-100">
                {job.name}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{job.position}</span>
              {(job.position === '그룹장' || job.position === '팀장') && (
                <span className="text-xs inline-flex font-medium rounded-full text-center px-2 py-0.5 bg-violet-500/20 text-violet-700">
                  임원
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{job.department}</div>
          </div>
        </div>
        {/* Center - Tags */}
        <div className="md:w-1/3 flex justify-center">
          <div className="flex flex-wrap gap-1.5 justify-center items-center">
            {job.products && job.products.split(',').map((product, index) => (
              <span 
                key={index}
                className="text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-400"
              >
                {product.trim()}
              </span>
            ))}
            {/* Add Tag Button */}
            <button 
              className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-200 ml-1"
              onClick={(e) => {
                e.stopPropagation()
                // TODO: 태그 추가 기능 구현
                console.log('Add tag for employee:', job.name)
              }}
              title="태그 추가"
            >
              <svg 
                className="w-3 h-3 text-gray-600 dark:text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center justify-end space-x-4 pl-10 md:pl-0 md:w-1/3">
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">{job.contact}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">{job.email}</div>
          </div>
          <button 
            onClick={() => onToggleFavorite?.({ id: job.id, name: job.name, department: job.department })}
            className={`transition-colors duration-200 ${
              isFavorite 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500'
            }`}
          >
            <span className="sr-only">즐겨찾기</span>
            <svg className="w-3 h-4 fill-current" width="12" height="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 0C.9 0 0 .9 0 2v14l6-3 6 3V2c0-1.1-.9-2-2-2H2Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}