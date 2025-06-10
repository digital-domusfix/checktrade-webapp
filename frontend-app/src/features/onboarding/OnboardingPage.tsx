import React from 'react';

function OnboardingPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 p-4" data-testid="role-select">
      <h1 className="mb-4 text-center text-xl font-semibold">
        Select your role
      </h1>
      <button className="w-full rounded bg-teal-600 py-3 text-white">
        Homeowner
      </button>
      <button className="w-full rounded bg-indigo-600 py-3 text-white">
        Contractor
      </button>
    </div>
  );
}

export default OnboardingPage;
