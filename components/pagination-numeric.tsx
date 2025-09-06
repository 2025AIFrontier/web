
interface PaginationNumericProps {
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  showPrevNext?: boolean
}

export default function PaginationNumeric({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  showPrevNext = true
}: PaginationNumericProps) {
  const renderPageNumbers = () => {
    const pages = []
    const showEllipsis = totalPages > 5
    
    if (showEllipsis && currentPage > 3) {
      pages.push(1)
      if (currentPage > 4) {
        pages.push('...')
      }
    }
    
    let start = showEllipsis ? Math.max(1, currentPage - 1) : 1
    let end = showEllipsis ? Math.min(totalPages, currentPage + 1) : totalPages
    
    if (showEllipsis) {
      if (currentPage <= 3) {
        end = Math.min(4, totalPages)
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - 3, 1)
      }
    }
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }
    
    if (showEllipsis && currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pages.push('...')
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const handlePageClick = (page: number) => {
    if (onPageChange && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const pages = renderPageNumbers()

  return (
    <div className="flex justify-center">
      <nav className="flex" role="navigation" aria-label="Navigation">
        {showPrevNext && (
          <div className="mr-2">
            <button 
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center justify-center rounded-lg leading-5 px-2.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 ${
                currentPage === 1 
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-violet-500 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'
              }`}
            >
              <span className="sr-only">Previous</span><wbr />
              <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16">
                <path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z" />
              </svg>
            </button>
          </div>
        )}
        <ul className="inline-flex text-sm font-medium -space-x-px rounded-lg shadow-sm">
          {pages.map((page, index) => (
            <li key={index}>
              {page === '...' ? (
                <span className="inline-flex items-center justify-center leading-5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 text-gray-400 dark:text-gray-500">…</span>
              ) : (
                <button
                  onClick={() => handlePageClick(page as number)}
                  className={`inline-flex items-center justify-center leading-5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 ${
                    currentPage === page
                      ? 'text-violet-500 cursor-default'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'
                  } ${
                    index === 0 ? 'rounded-l-lg' : ''
                  } ${
                    index === pages.length - 1 ? 'rounded-r-lg' : ''
                  }`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
        </ul>
        {showPrevNext && (
          <div className="ml-2">
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center justify-center rounded-lg leading-5 px-2.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 shadow-sm ${
                currentPage === totalPages 
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-violet-500 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'
              }`}
            >
              <span className="sr-only">Next</span><wbr />
              <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16">
                <path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
              </svg>
            </button>
          </div>
        )}
      </nav>
    </div>
  )
}