'use client'

import { Fragment, useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function DropdownSort({ align = 'right' }: { align?: 'left' | 'right' }) {
  const [selected, setSelected] = useState<string>('최신순')

  const options = [
    { value: 'latest', label: '최신순' },
    { value: 'name', label: '이름순' },
    { value: 'department', label: '부서순' },
    { value: 'position', label: '직급순' },
  ]

  return (
    <Menu as="div" className="relative inline-flex">
      <MenuButton className="btn-sm justify-between min-w-[11rem] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
        <span className="flex items-center">
          <span>{selected}</span>
        </span>
        <svg className="shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" width="11" height="7" viewBox="0 0 11 7">
          <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
        </svg>
      </MenuButton>
      <MenuItems
        as={Fragment}
        className={`origin-top-right z-10 absolute top-full min-w-[11rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 pt-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}
      >
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3">정렬</div>
        <ul className="mb-4">
          {options.map((option) => (
            <MenuItem key={option.value} as={Fragment}>
              {({ focus }) => (
                <button
                  className={`font-medium text-sm w-full text-left py-1 px-3 ${
                    focus ? 'bg-gray-50 dark:bg-gray-700/20' : ''
                  } ${selected === option.label ? 'text-violet-500' : 'text-gray-600 dark:text-gray-300'}`}
                  onClick={() => setSelected(option.label)}
                >
                  {option.label}
                </button>
              )}
            </MenuItem>
          ))}
        </ul>
      </MenuItems>
    </Menu>
  )
}