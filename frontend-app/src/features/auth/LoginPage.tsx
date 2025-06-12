import LoginForm from '../../pages/auth/components/LoginForm';

function LoginPage() {
  const handleLoggedIn = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>
        <LoginForm onLoggedIn={handleLoggedIn} />
      </div>
    </div>
  );
}

export default LoginPage;
