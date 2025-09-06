import Image from 'next/image'
import UserImage01 from '@/public/images/user-32-01.jpg'
import UserImage02 from '@/public/images/user-32-02.jpg'
import UserImage04 from '@/public/images/user-32-04.jpg'
import UserImage05 from '@/public/images/user-32-05.jpg'

export default function ForumRightContent() {
  return (
    <div className="w-full hidden xl:block xl:w-[18rem]">
      <div className="lg:sticky lg:top-16 lg:h-[calc(100dvh-64px)] lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar">
        <div className="md:py-8">
          {/* Button */}
          <div className="mb-6">
            <button className="btn w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">Create Post</button>
          </div>

          {/* Blocks */}
          <div className="space-y-4">

            {/* Block 1 - Who to follow */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-4">Who to follow</div>
              <ul className="space-y-3">
                <li>
                  <div className="flex items-center justify-between">
                    <div className="grow flex items-center">
                      <div className="relative mr-3">
                        <Image className="w-8 h-8 rounded-full" src={UserImage02} width={32} height={32} alt="User 02" />
                      </div>
                      <div className="truncate">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Elly Boutin</span>
                      </div>
                    </div>
                    <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                      Follow
                    </button>
                  </div>
                </li>
                <li>
                  <div className="flex items-center justify-between">
                    <div className="grow flex items-center">
                      <div className="relative mr-3">
                        <Image className="w-8 h-8 rounded-full" src={UserImage04} width={32} height={32} alt="User 04" />
                      </div>
                      <div className="truncate">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Rich Harris</span>
                      </div>
                    </div>
                    <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                      Follow
                    </button>
                  </div>
                </li>
                <li>
                  <div className="flex items-center justify-between">
                    <div className="grow flex items-center">
                      <div className="relative mr-3">
                        <Image className="w-8 h-8 rounded-full" src={UserImage05} width={32} height={32} alt="User 05" />
                      </div>
                      <div className="truncate">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Mary Porzio</span>
                      </div>
                    </div>
                    <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                      Follow
                    </button>
                  </div>
                </li>
                <li>
                  <div className="flex items-center justify-between">
                    <div className="grow flex items-center">
                      <div className="relative mr-3">
                        <Image className="w-8 h-8 rounded-full" src={UserImage01} width={32} height={32} alt="User 01" />
                      </div>
                      <div className="truncate">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Brian Lovin</span>
                      </div>
                    </div>
                    <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                      Follow
                    </button>
                  </div>
                </li>
              </ul>
              <div className="mt-4">
                <button className="btn-sm w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300">View All</button>
              </div>
            </div>

            {/* Block 2 - Trends for you */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-4">Trends for you</div>
              <ul className="space-y-3">
                <li>
                  <div className="text-sm mb-1">
                    <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">
                      Tracking your website traffic on launch day 📈
                    </a>
                  </div>
                  <div className="text-xs text-gray-500">248 comments</div>
                </li>
                <li>
                  <div className="text-sm mb-1">
                    <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">
                      Freemium model questions
                    </a>
                  </div>
                  <div className="text-xs text-gray-500">47 comments</div>
                </li>
                <li>
                  <div className="text-sm mb-1">
                    <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">
                      Slack and Community
                    </a>
                  </div>
                  <div className="text-xs text-gray-500">24 comments</div>
                </li>
                <li>
                  <div className="text-sm mb-1">
                    <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">
                      Who owns user onboarding in your company?
                    </a>
                  </div>
                  <div className="text-xs text-gray-500">17 comments</div>
                </li>
                <li>
                  <div className="text-sm mb-1">
                    <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">
                      Questions from a very confused Web3 startup founder 🤔
                    </a>
                  </div>
                  <div className="text-xs text-gray-500">9 comments</div>
                </li>
              </ul>
              <div className="mt-4">
                <button className="btn-sm w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300">View All</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}