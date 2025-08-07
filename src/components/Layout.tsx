import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MENU_ITEMS } from '../utils/constants';
import { DropdownState, ActiveTab } from '../types/common';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarPinned, setSidebarPinned] = useState(true); // 고정 모드
  const [sidebarHovered, setSidebarHovered] = useState(false); // 호버 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({
    inquiry: true,
    request: true
  });

  const toggleDropdown = (menuId: string) => {
    setDropdownOpen(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const toggleSidebar = () => {
    setSidebarPinned(!sidebarPinned);
    setSidebarOpen(!sidebarPinned);
  };

  const handleSidebarMouseEnter = () => {
    if (!sidebarPinned) {
      setSidebarHovered(true);
      setSidebarOpen(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (!sidebarPinned) {
      setSidebarHovered(false);
      setSidebarOpen(false);
    }
  };

  // 실제 사이드바 표시 상태 계산
  const shouldShowSidebar = sidebarPinned || sidebarHovered;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        <Sidebar
          sidebarOpen={shouldShowSidebar}
          setSidebarOpen={toggleSidebar}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          dropdownOpen={dropdownOpen}
          toggleDropdown={toggleDropdown}
          menuItems={MENU_ITEMS}
          sidebarPinned={sidebarPinned}
        />
      </div>
      
      {/* 메인 콘텐츠 영역 */}
      <div className={`transition-all duration-300 ${shouldShowSidebar ? 'ml-72' : 'ml-20'} h-screen overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
};