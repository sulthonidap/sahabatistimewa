'use client'

import { useToast } from '@/hooks/use-toast'
import { Toast, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'

export function ToastDisplay() {
  const { toasts, dismiss } = useToast()

  const getIcon = (variant: 'default' | 'destructive' = 'default') => {
    switch (variant) {
      case 'destructive':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'default':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          className="border-l-4 border-l-red-500 bg-red-50"
        >
          <div className="flex items-start space-x-3">
            {getIcon(toast.variant)}
            <div className="flex-1">
              <ToastTitle className="text-sm font-semibold text-gray-900">
                {toast.title}
              </ToastTitle>
              {toast.description && (
                <ToastDescription className="text-sm text-gray-600 mt-1">
                  {toast.description}
                </ToastDescription>
              )}
            </div>
          </div>
          <ToastClose onClick={() => dismiss(toast.id)} />
        </Toast>
      ))}
    </>
  )
}
