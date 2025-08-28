import Image from 'next/image'
import GroupAvatar01 from '@/public/images/group-avatar-01.png'
import GroupAvatar02 from '@/public/images/group-avatar-02.png'
import GroupAvatar03 from '@/public/images/group-avatar-03.png'
import GroupAvatar04 from '@/public/images/group-avatar-04.png'
import UserImage01 from '@/public/images/user-32-01.jpg'
import UserImage02 from '@/public/images/user-32-02.jpg'
import UserImage04 from '@/public/images/user-32-04.jpg'
import UserImage05 from '@/public/images/user-32-05.jpg'

export default function NoticeRightContent() {
  return (
    <div className="w-full hidden xl:block xl:w-[18rem]">
      <div className="lg:sticky lg:top-16 lg:h-[calc(100dvh-64px)] lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar">
        <div className="md:py-8">

          {/* Create post */}
          <div className="mb-6">
            <button className="btn w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
              <svg className="shrink-0 fill-current mr-2" width="16" height="16" viewBox="0 0 16 16">
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              <span>Create Post</span>
            </button>
          </div>

          {/* Search form */}
          <div className="mb-6">
            <form className="relative">
              <label htmlFor="feed-search-desktop" className="sr-only">
                Search
              </label>
              <input id="feed-search-desktop" className="form-input w-full pl-9 bg-white dark:bg-gray-800" type="search" placeholder="Search…" />
              <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
                <svg
                  className="shrink-0 fill-current text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 ml-3 mr-2"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Blocks */}
          <div className="space-y-4">
            
            {/* Block 1 - Top Communities */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-4">Top Communities</div>
              <ul className="space-y-3">
                <li>
                  <div className="flex items-center justify-between">
                    <div className="grow flex items-center">
                      <div className="relative mr-3">
                        <Image className="w-8 h-8 rounded-full" src={GroupAvatar01} width={32} height={32} alt="Group 01" />
                      </div>
                      <div className="truncate">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Introductions</span>
                      </div>
                    </div>
                    <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                      Join
                    </button>
                  </div>
                </li>
                <li>
                  <div className="flex items-center justify-between">
                    <div className="grow flex items-center">
                      <div className="relative mr-3">
                        <Image className="w-8 h-8 rounded-full" src={GroupAvatar02} width={32} height={32} alt="Group 02" />
                      </div>
                      <div className="truncate">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">HackerNews</span>
                      </div>
                    </div>
                    <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                      Join
                    </button>
                  </div>
                </li>
                <li>
                  <div className="flex items-center justify-between">
                    <div className="grow flex items-center">
                      <div className="relative mr-3">
                        <Image className="w-8 h-8 rounded-full" src={GroupAvatar03} width={32} height={32} alt="Group 03" />
                      </div>
                      <div className="truncate">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">ReactJs</span>
                      </div>
                    </div>
                    <button className="text-xs inline-flex font-medium bg-green-500/20 text-green-700 rounded-full text-center px-2.5 py-1">
                      <svg className="fill-current shrink-0" width="16" height="16" viewBox="0 0 16 16">
                        <path d="m2.457 8.516.969-.99 2.516 2.481 5.324-5.304.985.989-6.309 6.284z" />
                      </svg>
                    </button>
                  </div>
                </li>
                <li>
                  <div className="flex items-center justify-between">
                    <div className="grow flex items-center">
                      <div className="relative mr-3">
                        <Image className="w-8 h-8 rounded-full" src={GroupAvatar04} width={32} height={32} alt="Group 04" />
                      </div>
                      <div className="truncate">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">JustChatting</span>
                      </div>
                    </div>
                    <button className="btn-xs text-xs border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-full shadow-none">
                      Join
                    </button>
                  </div>
                </li>
              </ul>
              <div className="mt-4">
                <button className="btn-sm w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300">View All</button>
              </div>
            </div>
            
            {/* Block 2 - Who to follow */}
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

          </div>
        </div>
      </div>
    </div>
  )
}