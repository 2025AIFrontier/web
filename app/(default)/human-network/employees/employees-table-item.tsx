'use client'

import Image from 'next/image'
import { Employee } from './employees-table'

interface EmployeesTableItemProps {
  employee: Employee
  onCheckboxChange: (id: number, checked: boolean) => void
  isSelected: boolean
}

export default function EmployeesTableItem({ 
  employee, 
  onCheckboxChange, 
  isSelected 
}: EmployeesTableItemProps) {
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(employee.id, e.target.checked)
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active':
        return (
          <div className="inline-flex items-center justify-center w-2 h-2">
            <span className="block w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        )
      case 'away':
        return (
          <div className="inline-flex items-center justify-center w-2 h-2">
            <span className="block w-2 h-2 bg-yellow-500 rounded-full"></span>
          </div>
        )
      case 'busy':
        return (
          <div className="inline-flex items-center justify-center w-2 h-2">
            <span className="block w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
        )
      default:
        return (
          <div className="inline-flex items-center justify-center w-2 h-2">
            <span className="block w-2 h-2 bg-gray-400 rounded-full"></span>
          </div>
        )
    }
  }


  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="flex items-center">
          <label className="inline-flex">
            <span className="sr-only">Select</span>
            <input 
              className="form-checkbox" 
              type="checkbox" 
              onChange={handleCheckboxChange} 
              checked={isSelected} 
            />
          </label>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="flex items-center">
          {getStatusIcon(employee.status)}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
            <Image 
              className="rounded-full" 
              src={employee.image} 
              width={40} 
              height={40} 
              alt={employee.name} 
            />
          </div>
          <div className="font-medium text-gray-800 dark:text-gray-100">{employee.name}</div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{employee.department}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{employee.role}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{employee.position}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{employee.email}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{employee.phone}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full">
          <span className="sr-only">Menu</span>
          <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="2" />
            <circle cx="10" cy="16" r="2" />
            <circle cx="22" cy="16" r="2" />
          </svg>
        </button>
      </td>
    </tr>
  )
}