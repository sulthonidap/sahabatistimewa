'use client'

import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  itemsPerPage: number
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  itemsPerPage
}: PaginationProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  if (totalItems === 0) return null

  return (
    <div className="border-t border-gray-200 mt-6 pt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Info */}
        <div className="text-sm text-gray-600">
          Menampilkan {formatNumber(startIndex + 1)} - {formatNumber(Math.min(endIndex, totalItems))} dari {formatNumber(totalItems)} data
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-300 hover:bg-gray-50"
            >
              Sebelumnya
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={
                    currentPage === page
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "border-gray-300 hover:bg-gray-50"
                  }
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-gray-300 hover:bg-gray-50"
            >
              Selanjutnya
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
