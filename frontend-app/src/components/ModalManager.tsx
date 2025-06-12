import { useState, createContext, useContext, ReactNode } from 'react';
import Modal from './Modal';
import QuickWizard from '../features/leadgen/QuickWizard';

type ModalSource = 'hero' | 'howItWorks' | 'footer' | 'contractorHighlight';

interface ModalContextProps {
  openWizard: (source: ModalSource) => void;
  closeWizard: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [source, setSource] = useState<ModalSource | null>(null);

  const openWizard = (s: ModalSource) => setSource(s);
  const closeWizard = () => setSource(null);

  return (
    <ModalContext.Provider value={{ openWizard, closeWizard }}>
      {children}
      {source && (
        <Modal onClose={closeWizard}>
          <QuickWizard
            onStart={() => console.log('Wizard started from', source)}
            onComplete={() => console.log('Wizard complete from', source)}
          />
        </Modal>
      )}
    </ModalContext.Provider>
  );
};
