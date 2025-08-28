export interface NavigationPage {
  title: string;
  href: string;
  category: string;
  keywords?: string[];
}

export const navigationPages: NavigationPage[] = [
  // Dashboard 페이지들
  { title: '환율', href: '/dashboard/exchange', category: 'Dashboard', keywords: ['exchange', 'rate', '환율'] },
  { title: 'Main', href: '/dashboard', category: 'Dashboard', keywords: ['main', 'dashboard', '대시보드'] },
  
  // Human Network 페이지들
  { title: '사외 담당자', href: '/human-network/employees', category: 'Human Network', keywords: ['employees', '직원', '사외', '담당자'] },
  { title: '사내 담당자 찾기', href: '/human-network/contacts', category: 'Human Network', keywords: ['contacts', '연락처', 'contact', '사내', '담당자'] },
  
  // Community 페이지들
  { title: '공지', href: '/community/notice', category: 'Community', keywords: ['notice', '공지', 'announcement'] },
  { title: '자주 묻는 질문', href: '/community/faqs', category: 'Community', keywords: ['faqs', 'questions', '질문', '자주묻는질문'] },
  
  // Calendar
  { title: '캘린더', href: '/calendar', category: 'Calendar', keywords: ['calendar', '캘린더', '일정'] },
  
  // Settings 페이지들
  { title: 'My Account', href: '/settings/account', category: 'Settings', keywords: ['account', '계정', 'settings'] },
  { title: 'Notifications', href: '/settings/notifications', category: 'Settings', keywords: ['notifications', '알림', 'alert'] },
  { title: 'Connected Apps', href: '/settings/apps', category: 'Settings', keywords: ['apps', '앱', 'applications'] },
  { title: 'Plans', href: '/settings/plans', category: 'Settings', keywords: ['plans', '플랜', 'pricing'] },
  { title: 'Billing', href: '/settings/billing', category: 'Settings', keywords: ['billing', '청구', 'payment'] },
  { title: 'Feedback', href: '/settings/feedback', category: 'Settings', keywords: ['feedback', '피드백', 'review'] },
  
  // Utility 페이지들
  { title: 'Changelog', href: '/utility/changelog', category: 'Utility', keywords: ['changelog', '변경사항', 'updates'] },
  { title: 'Roadmap', href: '/utility/roadmap', category: 'Utility', keywords: ['roadmap', '로드맵', 'plan'] },
  { title: 'FAQs', href: '/utility/faqs', category: 'Utility', keywords: ['faqs', 'questions', '질문'] },
  { title: 'Empty State', href: '/utility/empty-state', category: 'Utility', keywords: ['empty', 'state', '빈'] },
  { title: '404', href: '/utility/404', category: 'Utility', keywords: ['404', 'error', '오류'] },
]

export function searchPages(query: string): NavigationPage[] {
  if (!query) return []
  
  const normalizedQuery = query.toLowerCase().trim()
  
  return navigationPages.filter(page => {
    // 제목에서 검색
    if (page.title.toLowerCase().includes(normalizedQuery)) return true
    
    // 카테고리에서 검색
    if (page.category.toLowerCase().includes(normalizedQuery)) return true
    
    // URL 경로에서 검색
    if (page.href.toLowerCase().includes(normalizedQuery)) return true
    
    // 키워드에서 검색
    if (page.keywords?.some(keyword => keyword.toLowerCase().includes(normalizedQuery))) return true
    
    return false
  })
}