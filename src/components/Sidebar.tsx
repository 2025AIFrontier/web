import React from 'react';
import { Menu, Search, ChevronDown, ChevronRight, Database, Pin, PinOff, X } from 'lucide-react';
import { MenuItem, DropdownState, ActiveTab } from '../types/common';
import { CacheFactory } from '../cache/cacheFactory';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  dropdownOpen: DropdownState;
  toggleDropdown: (menuId: string) => void;
  menuItems: MenuItem[];
  sidebarPinned: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  dropdownOpen,
  toggleDropdown,
  menuItems,
  sidebarPinned
}) => {
  // 캐시 통계 가져오기
  const cacheStats = CacheFactory.getCacheStats();

  // 검색 기능
  const filterMenuItems = () => {
    if (!searchQuery.trim()) {
      return menuItems;
    }

    const query = searchQuery.toLowerCase();
    return menuItems.map(item => {
      if (item.isDropdown) {
        const filteredSubItems = item.subItems?.filter(subItem =>
          subItem.name.toLowerCase().includes(query)
        ) || [];
        
        // 부모 카테고리 이름이 검색어와 일치하거나, 하위 항목이 있으면 표시
        if (item.name.toLowerCase().includes(query) || filteredSubItems.length > 0) {
          return {
            ...item,
            subItems: filteredSubItems.length > 0 ? filteredSubItems : item.subItems
          };
        }
        return null;
      } else {
        // 단일 메뉴 항목
        return item.name.toLowerCase().includes(query) ? item : null;
      }
    }).filter(Boolean) as MenuItem[];
  };

  const filteredMenuItems = filterMenuItems();

  return (
    <div className={`bg-white shadow-xl transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'} border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-50`}>
      {/* 헤더 - 로고 영역 */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-3 hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition-colors group"
            >
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-opacity-30 transition-colors">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">A.IPC</span>
                <p className="text-blue-100 text-sm">Dashboard</p>
              </div>
            </button>
          )}
          <button
            onClick={sidebarOpen ? setSidebarOpen : () => setActiveTab('dashboard')}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            title={sidebarOpen ? "메뉴" : "대시보드로 이동"}
          >
            {sidebarOpen ? (
              <Menu size={20} className="text-white" />
            ) : (
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-md flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 검색 기능 */}
      {sidebarOpen && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="메뉴 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                title="검색어 지우기"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 내비게이션 메뉴 */}
      <nav className="mt-6 flex-1">
        <ul className="space-y-2 px-4">
          {filteredMenuItems.map((item) => (
            <li key={item.id}>
              {item.isDropdown ? (
                <div>
                  {/* 드롭다운 헤더 */}
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-500 group-hover:text-gray-700 transition-colors">{item.icon}</span>
                      {sidebarOpen && (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </div>
                    {sidebarOpen && (
                      <span className="text-gray-400 transition-transform duration-200">
                        {dropdownOpen[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>
                    )}
                  </button>
                  
                  {/* 드롭다운 서브메뉴 */}
                  {dropdownOpen[item.id] && sidebarOpen && (
                    <ul className="mt-2 ml-6 space-y-1">
                      {item.subItems?.map((subItem) => (
                        <li key={subItem.id}>
                          <button
                            onClick={() => setActiveTab(subItem.id as ActiveTab)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm group ${
                              activeTab === subItem.id
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                          >
                            <span className={`transition-colors ${
                              activeTab === subItem.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                            }`}>
                              {subItem.icon}
                            </span>
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{subItem.name}</span>
                              {subItem.tag && (
                                <span className={`px-1 py-0.5 text-[8px] rounded text-xs font-medium ml-2 shrink-0 ${
                                  subItem.tag === 'Frontier' 
                                    ? 'bg-blue-100 text-blue-600'
                                    : subItem.tag === 'Crew'
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-blue-100 text-blue-600'
                                }`}>
                                  {subItem.tag}
                                </span>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <span className={`transition-colors ${
                    activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    {item.icon}
                  </span>
                  {sidebarOpen && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* 캐시 정보 푸터 */}
      {sidebarOpen && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 relative">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Database size={12} className="text-gray-400" />
            <span> {cacheStats.totalSizeKB}kB 서버 최적화 완료 </span>
          </div>
          {cacheStats.sessionCacheCount > 0 && (
            <div className="mt-1 text-xs text-gray-400">
              {cacheStats.sessionCacheCount} cache({cacheStats.usagePercent}%) running
            </div>
          )}
          
          {/* 핀 버튼 - 우측 하단 */}
          <button
            onClick={setSidebarOpen}
            className="absolute bottom-2 right-2 p-1.5 rounded-md hover:bg-gray-200 transition-colors"
            title={sidebarPinned ? "숨기기" : "펼치기"}
          >
            {sidebarPinned ? (
              <Pin size={14} className="text-gray-600" />
            ) : (
              <PinOff size={14} className="text-gray-400" />
            )}
          </button>
        </div>
      )}
      
      {/* 사이드바가 축소된 상태일 때 핀 버튼 */}
      {!sidebarOpen && (
        <div className="p-2 border-t border-gray-200 bg-gray-50 flex justify-center">
          <button
            onClick={setSidebarOpen}
            className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
            title={sidebarPinned ? "숨기기" : "펼치기"}
          >
            {sidebarPinned ? (
              <Pin size={14} className="text-gray-600" />
            ) : (
              <PinOff size={14} className="text-gray-400" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};