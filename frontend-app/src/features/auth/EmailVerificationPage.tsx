import { useSearchParams } from 'react-router-dom';
import EmailVerificationScreen from '../../screens/EmailVerificationScreen';

const EmailVerificationPage = () => {
  const [params] = useSearchParams();
  const uid = params.get('uid') || '';
  const email = params.get('email') || '';

  if (!uid || !email) {
    return <div className="p-4 text-center">Missing verification info.</div>;
  }

  return <EmailVerificationScreen userId={uid} email={email} />;
};

export default EmailVerificationPage;
