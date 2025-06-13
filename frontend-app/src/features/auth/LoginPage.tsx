import AuthTabs from "../../components/auth/AuthTabs"

function LoginPage() {
  const handleLoggedIn = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-2xl font-bold">Log In</h1>
        <AuthTabs onLoggedIn={handleLoggedIn} />
      </div>
    </div>
  )
}

export default LoginPage
