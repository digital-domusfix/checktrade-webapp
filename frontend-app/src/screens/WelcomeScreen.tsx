import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';
import { useAuthStore } from '../store/useAuthStore';

export default function WelcomeScreen() {
  const profile = useAuthStore((s) => s.profile);
  const navigate = useNavigate();
  const [pulse, setPulse] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const markComplete = () => {
    localStorage.setItem('onboarding-complete', 'true');
  };

  const handlePostJob = () => {
    setLoading(true);
    markComplete();
    navigate('/job/new');
  };

  const handleExplore = () => {
    markComplete();
    navigate('/dashboard', { replace: true });
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
        className="w-full max-w-xl space-y-6 text-center"
      >
        <motion.div variants={item}>
          <Handshake
            className="mx-auto size-20 text-primary"
            aria-hidden="true"
          />
        </motion.div>
        <p className="sr-only" aria-live="polite">
          {`Welcome, ${firstName}! You're ready to post your first job.`}
        </p>
        <motion.h1 variants={item} className="text-3xl font-bold">
          Welcome, {firstName}!
        </motion.h1>
        <motion.p variants={item} className="text-lg">
          We&apos;re glad you&apos;re here!
        </motion.p>
        <motion.div variants={item} className="space-y-4">
          <Button
            onClick={handlePostJob}
            disabled={loading}
            className={
              pulse
                ? 'animate-pulse flex items-center justify-center'
                : 'flex items-center justify-center'
            }
          >
            {loading && <Spinner className="mr-2 text-white" />}
            Post Your First Job
          </Button>
          <div>
            <button
              onClick={handleExplore}
              className="text-primary underline"
              type="button"
            >
              Explore Dashboard
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
