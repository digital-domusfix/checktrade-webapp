import { logEvent } from '../../utils/analytics';

interface Props {
  onClick: () => void;
}

const StickyFooterCTA: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md sm:hidden z-50">
      <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-sm font-medium text-gray-800">Get free quotes in 30 seconds</div>
        <button
          onClick={() => {
            logEvent('cta_click', { source: 'mobile_sticky' });
            onClick();
          }}
          className="bg-primary text-white font-semibold py-2 px-4 rounded-full text-sm"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default StickyFooterCTA;
