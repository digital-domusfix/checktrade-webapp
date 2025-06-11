import { Button } from '../../components/Button';
import QuickWizard from '../../features/leadgen/QuickWizard';
import { logEvent } from '../../utils/analytics';

interface Props {
  showWizard: boolean;
  onToggleWizard: () => void;
}


const HeroSection = ({ showWizard, onToggleWizard }: Props) => {
  const handleClick = () => {
    logEvent('cta_click', { source: 'hero' });
    onToggleWizard();
  };

  return (
    <section className="bg-base py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10">
        <div className="text-center md:text-left space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 max-w-2xl">
            Find Trusted Contractors in Nova Scotia
          </h1>
          <p className="text-lg text-gray-600 max-w-xl">
            Licensed. Verified. Local. Get quotes, not headaches.
          </p>
          <p className="text-sm text-gray-600 flex items-center justify-center md:justify-start">
            <span className="mr-1">⭐</span>4.9 average from 1,400+ reviews
          </p>
          <div className="flex justify-center md:justify-start gap-3">
            <img src="/logo-google.png" alt="Google" className="h-6" />
            <img src="/logo-facebook.png" alt="Facebook" className="h-6" />
            <img src="/logo-houzz.png" alt="Houzz" className="h-6" />
          </div>
          <div>
            <Button
              variant="primary"
              onClick={handleClick}
              className="bg-primary hover:bg-primary-hover"
            >
              Get Free Quotes
            </Button>
          </div>
        </div>
        <img
          src="/hero.jpg"
          alt="Renovation"
          className="hidden md:block rounded-lg w-full"
        />
      </div>
      {showWizard && (
        <div className="mt-8 max-w-md mx-auto">
          <QuickWizard onStart={() => logEvent('wizard_start')} onComplete={() => logEvent('wizard_complete')} />
        </div>
      )}
    </section>
  );
};
export default HeroSection;
