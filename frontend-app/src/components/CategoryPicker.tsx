import React, { useState, useMemo } from 'react'
import { CategoryIcons, DefaultCategoryIcon } from '../icons/CategoryIcons'
import { JobCategory } from '../services/jobService'

interface Props {
  categories: JobCategory[]
  onSelect: (cat: JobCategory) => void
}

const POPULAR_CATEGORY_CODES = [
  'plumbers',
  'electricians',
  'cleaning',
  'handymen',
  'heating_engineers',
  'painters_decorators',
]

export const CategoryPicker: React.FC<Props> = ({ categories, onSelect }) => {
  const [query, setQuery] = useState('')

  // Find top categories based on hardcoded popular codes
  const popularCategories = useMemo(() => {
    return categories.filter((c) => POPULAR_CATEGORY_CODES.includes(c.code))
  }, [categories])

  // Filtered search matches (limit 5)
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return []
    return categories
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      )
      .slice(0, 5)
  }, [categories, query])

  return (
    <div className="space-y-4">
      {/* Search input always shown */}
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search services…"
        className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Show either popular or filtered */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(query ? filtered : popularCategories).map((c) => {
          const Icon = CategoryIcons[c.code] ?? DefaultCategoryIcon
          return (
            <button
              key={c.id.value}
              onClick={() => onSelect(c)}
              className="flex flex-col items-center gap-1 rounded border p-3 text-sm hover:bg-primary hover:text-white"
            >
              <Icon className="size-6 text-primary" />
              {c.name}
            </button>
          )
        })}

        {query && filtered.length === 0 && (
          <p className="col-span-full text-center text-sm text-gray-500">
            No services match “{query}”
          </p>
        )}
      </div>
    </div>
  )
}
