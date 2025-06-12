import React from 'react';

interface Props {
  id?: string;
  title?: string;
  children: React.ReactNode;
  className?: string; // ✅ allow section-level styling
}

export const SectionWrapper: React.FC<Props> = ({
  id,
  title,
  children,
  className,
}) => (
  <section id={id} className={`px-4 py-12 sm:px-6 lg:px-8 ${className || ''}`}>
    {title && (
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        {title}
      </h2>
    )}
    <div className="mx-auto max-w-6xl">{children}</div>
  </section>
);
