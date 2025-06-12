// src/features/home/CategoriesSection.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '../../components/SectionWrapper'
import { useModal } from '../../components/ModalManager'
import { useJobCategories } from '../../hooks/useJobCategories'
import {
  CategoryIcons,
  DefaultCategoryIcon,
} from '../../icons/CategoryIcons'

export const CategoriesSection: React.FC = () => {
  const { openWizard } = useModal()
  const { categories, loading, error } = useJobCategories()

  if (loading) {
    return (
      <SectionWrapper title="Loading services…" className="bg-white">
        <div>Loading…</div>
      </SectionWrapper>
    )
  }
  if (error) {
    return (
      <SectionWrapper title="What do you need done today?" className="bg-white">
        <div className="text-red-500">Failed to load categories</div>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper
      id="categories"
      title="What do you need done today?"
      className="bg-white"
    >
      <p className="mb-6 text-center text-gray-600">
        Choose a service to get started with fast, free quotes.
      </p>

      <div className="grid grid-cols-2 gap-5 text-center sm:grid-cols-3 md:grid-cols-5">
        {categories.map((cat) => {
          const Icon = CategoryIcons[cat.code] ?? DefaultCategoryIcon
          return (
            <motion.div
              key={cat.id.value}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer rounded-xl bg-base p-5 transition hover:shadow-lg"
              onClick={() => openWizard('hero')}
            >
              <Icon className="mx-auto mb-2 size-8 text-primary" />
              <p className="font-semibold text-gray-800">{cat.name}</p>
            </motion.div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}

export default CategoriesSection
