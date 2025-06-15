import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-xl space-y-6 rounded bg-white p-6 shadow-md">
      <h1 className="text-xl font-semibold">Your Profile</h1>
      <p className="text-sm text-gray-600">This section will allow you to edit your profile info like name, email, and communication preferences.</p>

      {/* Add form fields here later */}
      <div className="text-sm text-gray-400">Profile editing coming soon…</div>
    </div>
  );
};

export default ProfilePage;
