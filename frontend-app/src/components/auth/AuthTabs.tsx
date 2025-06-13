// src/pages/auth/components/AuthTabs.tsx
import { useState } from 'react'
import LoginForm from './LoginForm'
import PhoneLoginForm from './PhoneLoginForm'
import { OAuthButtons } from '../../pages/auth/components/OAuthButtons'


interface AuthTabsProps {
  onLoggedIn: () => void
}

const AuthTabs: React.FC<AuthTabsProps> = ({ onLoggedIn }) => {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email')

  return (
    <div className="w-full space-y-4">
      {/* Tabs */}
      <div className="flex justify-center gap-4 text-sm font-medium">
        <button
          onClick={() => setActiveTab('email')}
          className={`px-4 py-2 rounded ${
            activeTab === 'email'
              ? 'bg-primary text-white'
              : 'text-gray-500 hover:text-primary'
          }`}
        >
          Email Login
        </button>
        <button
          onClick={() => setActiveTab('phone')}
          className={`px-4 py-2 rounded ${
            activeTab === 'phone'
              ? 'bg-primary text-white'
              : 'text-gray-500 hover:text-primary'
          }`}
        >
          Phone Login
        </button>
      </div>

      {/* Active Form */}
      {activeTab === 'email' ? (
        <LoginForm onLoggedIn={onLoggedIn} />
      ) : (
        <PhoneLoginForm />
      )}

      {/* Divider */}
      <div className="relative my-6 text-center text-sm text-gray-400 before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-gray-200">
        <span className="relative bg-white px-2">or</span>
      </div>

      {/* Social Login */}
      <OAuthButtons onLoggedIn={onLoggedIn} />
    </div>
  )
}

export default AuthTabs
