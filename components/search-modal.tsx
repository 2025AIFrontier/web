'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { useRouter, usePathname } from 'next/navigation'

interface SearchModalProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

interface SearchResult {
  id: string
  title: string
  content: string
  url: string
  type: 'page' | 'content' | 'recent'
}

// 페이지 매핑 정의
const pageRoutes = [
  { title: 'Dashboard', url: '/dashboard', keywords: ['dashboard', 'home', '홈', '대시보드', 'main'] },
  { title: 'Exchange Dashboard', url: '/dashboard/exchange', keywords: ['exchange', 'fintech', 'finance', '환율', '금융', '핀테크', 'financial'] },
  { title: 'Calendar', url: '/calendar', keywords: ['calendar', 'schedule', '캘린더', '일정', 'date'] },
  
  // E-commerce
  { title: 'Customers', url: '/ecommerce/customers', keywords: ['customers', 'users', '고객', '사용자', 'clients'] },
  { title: 'Orders', url: '/ecommerce/orders', keywords: ['orders', 'purchase', '주문', '구매', 'sales'] },
  { title: 'Invoices', url: '/ecommerce/invoices', keywords: ['invoices', 'bill', '송장', '청구서', 'billing'] },
  { title: 'Shop', url: '/ecommerce/shop', keywords: ['shop', 'products', '쇼핑', '상품', 'store'] },
  { title: 'Shop 2', url: '/ecommerce/shop-2', keywords: ['shop2', 'products', '쇼핑2', '상품', 'store'] },
  { title: 'Product', url: '/ecommerce/product', keywords: ['product', 'item', '제품', '아이템', 'detail'] },
  { title: 'Cart', url: '/ecommerce/cart', keywords: ['cart', 'basket', '장바구니', 'shopping cart'] },
  { title: 'Cart 2', url: '/ecommerce/cart-2', keywords: ['cart2', 'basket', '장바구니2'] },
  { title: 'Cart 3', url: '/ecommerce/cart-3', keywords: ['cart3', 'basket', '장바구니3'] },
  { title: 'Payment', url: '/ecommerce/pay', keywords: ['pay', 'payment', '결제', '지불', 'checkout'] },
  
  // Jobs
  { title: 'Job Listing', url: '/ecommerce/jobs', keywords: ['jobs', 'career', '채용', '구인', 'employment'] },
  { title: 'Job Post', url: '/ecommerce/jobs/post', keywords: ['job post', 'hiring', '채용공고', '구인공고'] },
  { title: 'Company Profile', url: '/ecommerce/jobs/company', keywords: ['company', 'profile', '회사', '프로필', 'employer'] },
  
  // Community
  { title: 'Community Feed', url: '/community/feed', keywords: ['feed', 'posts', '피드', '게시물', 'timeline'] },
  { title: 'Community Forum', url: '/community/forum', keywords: ['forum', 'discussion', '포럼', '토론', 'board'] },
  { title: 'Forum Post', url: '/community/forum/post', keywords: ['forum post', 'thread', '포럼 글', '토론글'] },
  { title: 'Meetups', url: '/community/meetups', keywords: ['meetups', 'events', '모임', '이벤트', 'gathering'] },
  { title: 'Meetup Post', url: '/community/meetups/post', keywords: ['meetup post', 'event detail', '모임 상세', '이벤트 상세'] },
  { title: 'Users Tabs', url: '/community/users-tabs', keywords: ['users', 'members', '사용자', '회원', 'people'] },
  { title: 'Users Tiles', url: '/community/users-tiles', keywords: ['users grid', 'members', '사용자 그리드', '회원목록'] },
  { title: 'Profile', url: '/community/profile', keywords: ['profile', 'user profile', '프로필', '사용자 프로필'] },
  
  // Settings
  { title: 'Account Settings', url: '/settings/account', keywords: ['account', 'settings', '계정', '설정', 'preferences'] },
  { title: 'Notifications', url: '/settings/notifications', keywords: ['notifications', 'alerts', '알림', '알림설정'] },
  { title: 'Apps Settings', url: '/settings/apps', keywords: ['apps', 'integrations', '앱', '연동', 'connections'] },
  { title: 'Billing', url: '/settings/billing', keywords: ['billing', 'subscription', '결제', '구독', 'payment'] },
  { title: 'Feedback', url: '/settings/feedback', keywords: ['feedback', 'support', '피드백', '지원', 'help'] },
  
  // Auth
  { title: 'Sign In', url: '/signin', keywords: ['signin', 'login', '로그인', 'auth'] },
  { title: 'Sign Up', url: '/signup', keywords: ['signup', 'register', '회원가입', 'join'] },
  { title: 'Reset Password', url: '/reset-password', keywords: ['reset', 'password', '비밀번호', '재설정', 'forgot'] },
  
  // Utility
  { title: 'Roadmap', url: '/utility/roadmap', keywords: ['roadmap', 'plan', '로드맵', '계획'] },
  { title: 'FAQs', url: '/utility/faqs', keywords: ['faq', 'help', '자주묻는질문', '도움말', 'questions'] },
  { title: 'Empty State', url: '/utility/empty-state', keywords: ['empty', 'blank', '비어있음', '빈상태'] },
  { title: '404', url: '/utility/404', keywords: ['404', 'not found', '찾을수없음', 'error'] },
  { title: 'Changelog', url: '/utility/changelog', keywords: ['changelog', 'updates', '변경사항', '업데이트'] },
  
  // Components Library
  { title: 'Buttons', url: '/components-library/button', keywords: ['button', 'buttons', '버튼', 'click'] },
  { title: 'Forms', url: '/components-library/form', keywords: ['form', 'input', '폼', '입력', 'fields'] },
  { title: 'Tabs', url: '/components-library/tabs', keywords: ['tabs', 'tab', '탭', 'navigation'] },
  { title: 'Icons', url: '/components-library/icons', keywords: ['icons', 'icon', '아이콘', 'symbols'] },
  { title: 'Modal', url: '/components-library/modal', keywords: ['modal', 'dialog', '모달', '대화상자', 'popup'] },
  { title: 'Tooltip', url: '/components-library/tooltip', keywords: ['tooltip', 'hint', '툴팁', '힌트', 'popover'] },
  { title: 'Dropdown', url: '/components-library/dropdown', keywords: ['dropdown', 'select', '드롭다운', '선택'] },
  { title: 'Alerts', url: '/components-library/alert', keywords: ['alert', 'notification', '알림', '경고'] },
  { title: 'Accordion', url: '/components-library/accordion', keywords: ['accordion', 'collapse', '아코디언', '접기'] },
  { title: 'Avatar', url: '/components-library/avatar', keywords: ['avatar', 'profile pic', '아바타', '프로필사진'] },
  { title: 'Badge', url: '/components-library/badge', keywords: ['badge', 'tag', '뱃지', '태그', 'label'] },
  { title: 'Breadcrumb', url: '/components-library/breadcrumb', keywords: ['breadcrumb', 'navigation', '브레드크럼', '경로'] },
  { title: 'Pagination', url: '/components-library/pagination', keywords: ['pagination', 'pages', '페이지네이션', '페이지'] },
  
  // Onboarding
  { title: 'Onboarding 01', url: '/onboarding-01', keywords: ['onboarding', 'welcome', '온보딩', '환영'] },
  { title: 'Onboarding 02', url: '/onboarding-02', keywords: ['onboarding', 'setup', '온보딩', '설정'] },
  { title: 'Onboarding 03', url: '/onboarding-03', keywords: ['onboarding', 'tutorial', '온보딩', '튜토리얼'] },
  { title: 'Onboarding 04', url: '/onboarding-04', keywords: ['onboarding', 'complete', '온보딩', '완료'] },
]

export default function SearchModal({
  isOpen,
  setIsOpen
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const highlightedElementsRef = useRef<Element[]>([])
  const router = useRouter()
  const pathname = usePathname()

  // 최근 검색어 로드
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved).slice(0, 5))
        } catch (e) {
          console.error('Failed to load recent searches:', e)
        }
      }
      // 포커스 설정
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // 하이라이트 제거 함수
  const clearHighlights = useCallback(() => {
    highlightedElementsRef.current.forEach(el => {
      el.classList.remove('search-highlight')
    })
    highlightedElementsRef.current = []
  }, [])

  // 페이지 내용 검색 및 하이라이트
  const searchInPage = useCallback((query: string) => {
    // 이전 하이라이트 제거
    clearHighlights()

    if (!query || query.length < 2) {
      return []
    }

    const results: SearchResult[] = []
    const highlighted: Element[] = []
    
    try {
      // 현재 페이지의 텍스트 노드들을 검색
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement
            if (!parent) return NodeFilter.FILTER_REJECT
            
            // 검색 모달 자체는 제외
            if (parent.closest('[role="dialog"]')) return NodeFilter.FILTER_REJECT
            
            // script, style 태그 제외
            if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
              return NodeFilter.FILTER_REJECT
            }
            
            // 텍스트 내용이 있는 경우만
            const text = node.textContent?.trim() || ''
            if (text.length > 0) {
              return NodeFilter.FILTER_ACCEPT
            }
            
            return NodeFilter.FILTER_REJECT
          }
        }
      )

      const foundTexts = new Set<string>()
      let node
      let matchCount = 0

      while ((node = walker.nextNode()) && matchCount < 10) {
        const text = node.textContent || ''
        const lowerText = text.toLowerCase()
        const lowerQuery = query.toLowerCase()
        
        if (lowerText.includes(lowerQuery)) {
          const parent = node.parentElement
          if (parent && !foundTexts.has(text)) {
            // 하이라이트 추가
            parent.classList.add('search-highlight')
            highlighted.push(parent)
            
            // 검색 결과 추가
            const context = text.length > 100 ? 
              text.substring(0, 100) + '...' : 
              text
            
            results.push({
              id: `content-${matchCount}`,
              title: `Page Content Match ${matchCount + 1}`,
              content: context,
              url: pathname,
              type: 'content'
            })
            
            foundTexts.add(text)
            matchCount++
          }
        }
      }

      highlightedElementsRef.current = highlighted
    } catch (e) {
      console.error('Search error:', e)
    }

    return results
  }, [pathname, clearHighlights])

  // 페이지 라우트 검색
  const searchPages = useCallback((query: string) => {
    if (!query || query.length < 2) return []
    
    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []
    
    pageRoutes.forEach(page => {
      // 제목이나 키워드에서 매칭
      const titleMatch = page.title.toLowerCase().includes(lowerQuery)
      const keywordMatch = page.keywords.some(k => k.toLowerCase().includes(lowerQuery))
      
      if (titleMatch || keywordMatch) {
        results.push({
          id: `page-${page.url}`,
          title: page.title,
          content: `Navigate to ${page.title}`,
          url: page.url,
          type: 'page'
        })
      }
    })
    
    return results
  }, [])

  // 검색 실행
  useEffect(() => {
    if (!isOpen) return

    if (!searchQuery) {
      setSearchResults([])
      clearHighlights()
      return
    }

    // 디바운싱
    const timer = setTimeout(() => {
      const pageResults = searchPages(searchQuery)
      const contentResults = searchInPage(searchQuery)
      setSearchResults([...pageResults, ...contentResults])
      setSelectedIndex(0)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, searchPages, searchInPage, clearHighlights, isOpen])

  // 검색 결과 선택
  const handleSelectResult = (result: SearchResult) => {
    // 최근 검색어에 추가
    if (searchQuery) {
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
      setRecentSearches(newRecent)
      localStorage.setItem('recentSearches', JSON.stringify(newRecent))
    }

    // 페이지 이동 또는 스크롤
    if (result.type === 'page') {
      router.push(result.url)
      setIsOpen(false)
    } else if (result.type === 'content') {
      // 해당 요소로 스크롤
      const index = parseInt(result.id.split('-')[1])
      if (highlightedElementsRef.current[index]) {
        highlightedElementsRef.current[index].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
      setIsOpen(false)
    }
  }

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : 0)
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      e.preventDefault()
      handleSelectResult(searchResults[selectedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  // 모달 닫을 때 정리
  useEffect(() => {
    if (!isOpen) {
      clearHighlights()
      setSearchQuery('')
      setSearchResults([])
      setSelectedIndex(0)
    }
  }, [isOpen, clearHighlights])

  return (
    <>
      {/* 하이라이트 스타일 추가 */}
      <style jsx global>{`
        .search-highlight {
          background-color: yellow !important;
          color: black !important;
          padding: 2px 4px;
          border-radius: 2px;
          animation: highlight-pulse 1s ease-in-out;
        }
        
        @keyframes highlight-pulse {
          0% { background-color: #fef08a; }
          50% { background-color: #fde047; }
          100% { background-color: yellow; }
        }

        .dark .search-highlight {
          background-color: #854d0e !important;
          color: #fef3c7 !important;
        }
      `}</style>

      <Transition appear show={isOpen}>
        <Dialog as="div" onClose={() => setIsOpen(false)}>
          <TransitionChild
            as="div"
            className="fixed inset-0 bg-gray-900/30 z-50 transition-opacity"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            aria-hidden="true"
          />
          <TransitionChild
            as="div"
            className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
            enter="transition ease-in-out duration-200"
            enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in-out duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-4"
          >
            <DialogPanel className="bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700/60 overflow-auto max-w-2xl w-full max-h-[70vh] rounded-lg shadow-lg">
              {/* Search form */}
              <form className="border-b border-gray-200 dark:border-gray-700/60" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <label htmlFor="search-modal" className="sr-only">Search</label>
                  <input 
                    ref={searchInputRef}
                    id="search-modal" 
                    className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 border-0 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 pl-10 pr-4" 
                    type="search" 
                    placeholder="Search pages, content, or type keywords..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="absolute inset-0 flex items-center justify-center right-auto group pointer-events-none">
                    <svg className="shrink-0 fill-current text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 ml-4 mr-2" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                      <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setSearchQuery('')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </form>
              
              <div className="py-4 px-2 overflow-y-auto max-h-[calc(70vh-60px)]">
                {/* Search Results */}
                {searchQuery && searchResults.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">
                      Search Results ({searchResults.length})
                    </div>
                    <ul className="text-sm">
                      {searchResults.map((result, index) => (
                        <li key={result.id}>
                          <button
                            className={`w-full text-left flex items-center p-2 rounded-lg transition-colors ${
                              index === selectedIndex 
                                ? 'bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' 
                                : 'text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20'
                            }`}
                            onClick={() => handleSelectResult(result)}
                          >
                            {result.type === 'page' ? (
                              <svg className="shrink-0 mr-3 w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h8l5-5V1c0-.6-.4-1-1-1zM3 2h10v8H9v4H3V2z" />
                              </svg>
                            ) : (
                              <svg className="shrink-0 mr-3 w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11.7 9.3l-3-3a1 1 0 0 0-1.4 0l-3 3a1 1 0 0 0 1.4 1.4L7 9.4V15a1 1 0 0 0 2 0V9.4l1.3 1.3a1 1 0 0 0 1.4-1.4z" />
                                <path d="M4 3h8a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2z" />
                              </svg>
                            )}
                            <div className="flex-1 overflow-hidden">
                              <div className="font-medium truncate">{result.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.content}</div>
                            </div>
                            {index === selectedIndex && (
                              <kbd className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">↵</kbd>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* No results */}
                {searchQuery && searchResults.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-sm">No results found for "{searchQuery}"</p>
                    <p className="text-xs mt-2">Try different keywords or check the spelling</p>
                  </div>
                )}

                {/* Recent searches */}
                {!searchQuery && recentSearches.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">Recent searches</div>
                    <ul className="text-sm">
                      {recentSearches.map((search, index) => (
                        <li key={index}>
                          <button
                            className="w-full text-left flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                            onClick={() => setSearchQuery(search)}
                          >
                            <svg className="fill-current text-gray-400 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                              <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                            </svg>
                            <span>{search}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick navigation */}
                {!searchQuery && (
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">Quick Navigation</div>
                    <ul className="text-sm">
                      <li>
                        <Link
                          className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                          href="/"
                          onClick={() => setIsOpen(false)}
                        >
                          <svg className="fill-current text-gray-400 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M8 0L0 6v2h1v8h14V8h1V6L8 0zm5 14H3V6.414l5-3.536 5 3.536V14z" />
                          </svg>
                          <span>Dashboard</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                          href="/messages"
                          onClick={() => setIsOpen(false)}
                        >
                          <svg className="fill-current text-gray-400 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2 0v8h12V4H2zm1 1l5 3 5-3v1.5L8 9.5 3 6.5V5z" />
                          </svg>
                          <span>Messages</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                          href="/settings/account"
                          onClick={() => setIsOpen(false)}
                        >
                          <svg className="fill-current text-gray-400 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M10.5 1a.5.5 0 01.5.5v4a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5h4zM11 0H6a1.5 1.5 0 00-1.5 1.5v4A1.5 1.5 0 006 7h4a1.5 1.5 0 001.5-1.5v-4A1.5 1.5 0 0011 0zM4.5 9a.5.5 0 01.5.5v4a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5h4zM5 8H1a1.5 1.5 0 00-1.5 1.5v4A1.5 1.5 0 001 15h4a1.5 1.5 0 001.5-1.5v-4A1.5 1.5 0 005 8zm6 1a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H8a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5h3zm0-1H8a1.5 1.5 0 00-1.5 1.5v4A1.5 1.5 0 008 15h3a1.5 1.5 0 001.5-1.5v-4A1.5 1.5 0 0011 8z" />
                          </svg>
                          <span>Settings</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Tips */}
                <div className="px-2 py-2">
                  <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center space-x-4">
                    <span className="flex items-center">
                      <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs mr-1">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center">
                      <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs mr-1">↵</kbd>
                      Select
                    </span>
                    <span className="flex items-center">
                      <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs mr-1">ESC</kbd>
                      Close
                    </span>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  )
}