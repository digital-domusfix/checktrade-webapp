import { logEvent } from '../../utils/analytics';

interface Props {
  onClick: () => void;
}

const StickyFooterCTA: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white shadow-md sm:hidden">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <div className="text-sm font-medium text-gray-800">
          Get free quotes in 30 seconds
        </div>
        <button
          onClick={() => {
            logEvent('cta_click', { source: 'mobile_sticky' });
            onClick();
          }}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default StickyFooterCTA;
