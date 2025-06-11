import LoginForm from '../../pages/auth/components/LoginForm';

function LoginPage() {
  const handleLoggedIn = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      <LoginForm onLoggedIn={handleLoggedIn} />
    </div>
  );
}

export default LoginPage;
