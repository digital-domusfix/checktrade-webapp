import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';

export default function WelcomeScreen() {
  const profile = useAuthStore((s) => s.profile);
  const navigate = useNavigate();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem('onboarding-complete') === 'true' ||
      localStorage.getItem('hasPostedJob') === 'true'
    ) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const id = setTimeout(() => setPulse(true), 3000);
    return () => clearTimeout(id);
  }, []);

  const firstName = profile?.fullName?.split(' ')[0] || 'there';

  const handlePostJob = () => {
    localStorage.setItem('onboarding-complete', 'true');
    navigate('/job/new');
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md space-y-6 text-center"
      >
        <motion.div variants={item}>
          <Handshake className="mx-auto size-20 text-primary" />
        </motion.div>
        <motion.h1 variants={item} className="text-3xl font-bold">
          Welcome, {firstName}!
        </motion.h1>
        <motion.p variants={item} className="text-lg">
          We&apos;re glad you&apos;re here!
        </motion.p>
        <motion.div variants={item}>
          <Button
            onClick={handlePostJob}
            className={pulse ? 'animate-pulse' : ''}
          >
            Post Your First Job
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
