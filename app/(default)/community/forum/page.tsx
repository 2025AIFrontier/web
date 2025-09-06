export const metadata = {
  title: '공지 - Mosaic',
  description: 'Page description',
}

import ForumEntries from './forum-entries'

export default function Forum() {
  return (
    <>
      {/* Buttons group */}
      <div className="mb-4">
        <div className="w-full flex flex-wrap -space-x-px">
          <button className="btn grow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 text-violet-500 rounded-none first:rounded-l-lg last:rounded-r-lg">Popular</button>
          <button className="btn grow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/20 text-gray-600 dark:text-gray-300 rounded-none first:rounded-l-lg last:rounded-r-lg">Newest</button>
          <button className="btn grow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/20 text-gray-600 dark:text-gray-300 rounded-none first:rounded-l-lg last:rounded-r-lg">Following</button>
        </div>
      </div>

      {/* Forum Entries */}
      <div className="space-y-2">
        <ForumEntries />
      </div>

      {/* Pagination */}
      <div className="mt-6 text-right">
        <nav className="inline-flex" role="navigation" aria-label="Navigation">
          <ul className="flex justify-center">
            <li className="ml-3 first:ml-0">
              <span className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 text-gray-300 dark:text-gray-600">&lt;- Previous</span>
            </li>
            <li className="ml-3 first:ml-0">
              <a className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" href="#0">Next -&gt;</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
