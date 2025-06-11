import React from 'react';
import { Button } from '../../components/Button';


const HeroSection = () => (
  <section className="bg-cream-muted text-center py-16 px-4">
    <h1 className="text-4xl font-bold text-gray-900 max-w-2xl mx-auto">
      Find Trusted Contractors in Nova Scotia
    </h1>
    <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
      Licensed. Verified. Local. Get quotes, not headaches.
    </p>
    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
      <Button variant="primary">Post a Job</Button>
      <Button variant="outline">Browse Contractors</Button>
      <Button variant="ghost">Join as Pro</Button>
    </div>
  </section>
);
export default HeroSection;
