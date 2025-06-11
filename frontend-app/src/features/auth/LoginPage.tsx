import LoginForm from '../../pages/auth/components/LoginForm';

function LoginPage() {
  const handleLoggedIn = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <LoginForm onLoggedIn={handleLoggedIn} />
      </div>
    </div>
  );
}

export default LoginPage;
