'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ReactNode } from 'react'

interface SelectOption {
  value: string
  label: string
  icon?: ReactNode
}

interface EnhancedSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  options: SelectOption[]
  disabled?: boolean
  className?: string
}

export function EnhancedSelect({
  value,
  onValueChange,
  placeholder = "Pilih opsi",
  options,
  disabled = false,
  className = ""
}: EnhancedSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={`border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent 
        className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden" 
        position="popper" 
        sideOffset={4}
      >
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {option.icon && <span className="text-gray-400">{option.icon}</span>}
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
