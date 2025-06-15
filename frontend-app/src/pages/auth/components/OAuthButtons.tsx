import { useGoogleLogin } from '@react-oauth/google';
import AppleLogin from 'react-apple-login';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../../../store/useAuthStore';

export const OAuthButtons = ({ onLoggedIn }: { onLoggedIn: () => void }) => {
  const loginWithExternal = useAuthStore((s) => s.externalLogin);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        await loginWithExternal('google', accessToken);
        onLoggedIn();
      } catch (err) {
        console.error('Google login failed:', err);
      }
    },
    onError: () => {
      console.error('Google login error');
    },
    flow: 'implicit',
  });

  const handleAppleLogin = async (response: any) => {
    if (response.code) {
      try {
        await loginWithExternal('apple', response.code);
        onLoggedIn();
      } catch (err) {
        console.error('Apple login failed:', err);
      }
    } else {
      console.error('Apple login error:', response);
    }
  };

  return (
    <div className="space-y-3">
      <Button variant="outline" className="w-full" onClick={() => loginWithGoogle()}>
        Continue with Google
      </Button>

      <AppleLogin
        clientId="com.example.frontend-app"
        redirectURI="http://localhost:5173/"
        responseType="code"
        responseMode="query"
        usePopup={true}
        callback={handleAppleLogin}
        render={(renderProps: any) => (
          <Button variant="outline" className="w-full" onClick={renderProps.onClick}>
            Continue with Apple
          </Button>
        )}
      />
    </div>
  );
};
