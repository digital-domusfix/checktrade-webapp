import React from 'react';

interface Props {
  id?: string;
  title?: string;
  children: React.ReactNode;
  className?: string; // ✅ allow section-level styling
}

export const SectionWrapper: React.FC<Props> = ({ id, title, children, className }) => (
  <section id={id} className={`py-12 px-4 sm:px-6 lg:px-8 ${className || ''}`}>
    {title && (
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        {title}
      </h2>
    )}
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

