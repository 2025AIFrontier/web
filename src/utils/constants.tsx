import { DollarSign, FileText, Search, Send, User, BookOpen, Truck, Calendar, Home, Settings, CalendarDays } from 'lucide-react';
import { MenuItem } from '../types/common';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    name: '대시보드',
    icon: <Home size={20} />,
    isDropdown: false
  },
  // 조회 탭 다시 활성화 - 범인 찾기 테스트
  ...(true ? [{
    id: 'inquiry',
    name: '조회',
    icon: <Search size={20} />,
    isDropdown: true,
    subItems: [
      {
        id: 'exchange',
        name: '환율조회',
        icon: <DollarSign size={18} />,
        tag: 'Crew'
      },
      {
        id: 'manager',
        name: '담당자 조회',
        icon: <User size={18} />,
        tag: 'Crew'
      },
      {
        id: 'task',
        name: '과제 조회',
        icon: <BookOpen size={18} />,
        tag: 'Frontier'
      },
      {
        id: 'scm',
        name: 'SCM 조회',
        icon: <Truck size={18} />
      }
    ]
  }] : []),
  // 요청 탭 다시 활성화
  ...(true ? [{
    id: 'request',
    name: '요청',
    icon: <Send size={20} />,
    isDropdown: true,
    subItems: [
      {
        id: 'collect',
        name: '취합 요청',
        icon: <FileText size={18} />
      },
      {
        id: 'meeting-room',
        name: '회의실 예약',
        icon: <Calendar size={18} />,
        tag: 'Frontier'
      },
    ]
  }] : []),
  // 달력 탭 다시 활성화
  ...(true ? [{
    id: 'calendar',
    name: '달력',
    icon: <CalendarDays size={20} />,
    isDropdown: false
  }] : []),
  // 관리자 탭 다시 활성화
  ...(true ? [{
    id: 'admin',
    name: '관리자',
    icon: <Settings size={20} />,
    isDropdown: false
  }] : [])
];