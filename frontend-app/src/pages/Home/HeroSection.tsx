import { Button } from "../../components/Button";
import { useModal } from "../../components/ModalManager";
import { logEvent } from "../../utils/analytics";

const HeroSection = () => {
  const { openWizard } = useModal();

  const handleClick = () => {
    logEvent('cta_click', { source: 'hero' });
    openWizard('hero');
  };

  return (
    <section className="bg-[#FCF8F0] py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10">
        <div className="text-center md:text-left space-y-5">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Skip the hassle. <span className="text-primary">Get quotes from trusted tradespeople</span> near you.
          </h1>

          <p className="text-lg text-gray-700">
            Whether it’s plumbing, electrical, or home upgrades — we’ll connect you with licensed, verified professionals in under a minute.
          </p>

          <div className="text-sm text-gray-600">
            ⭐ 4.9 average from 1,400+ Nova Scotia homeowners
          </div>

          <div className="flex justify-center md:justify-start gap-3 items-center">
            <img src="/logo-google.png" alt="Google" className="h-6" />
            <img src="/logo-facebook.png" alt="Facebook" className="h-6" />
            <img src="/logo-houzz.png" alt="Houzz" className="h-6" />
          </div>

          <Button
            variant="primary"
            onClick={handleClick}
            className="mt-4 bg-primary hover:bg-primary-hover"
          >
            Get Free Quotes
          </Button>

          <p className="text-xs text-gray-500">No sign-up needed. Quotes in 30 seconds.</p>
        </div>

        <img
          src="/images/hero-working-pro.jpg"
          alt="Local contractor working"
          className="hidden md:block rounded-lg w-full object-cover shadow-md"
        />
      </div>
    </section>
  );
};

export default HeroSection;