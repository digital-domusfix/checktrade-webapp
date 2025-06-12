export interface Field {
  id: string;
  label: string;
  type: 'text' | 'select' | 'radio' | 'checkbox' | 'date' | 'number';
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

export const formConfigs: Record<string, Field[]> = {
  faucet: [
    {
      id: 'faucetType',
      label: 'What type of faucet?',
      type: 'select',
      required: true,
      options: ['Kitchen', 'Bathroom', 'Outdoor'],
    },
    {
      id: 'leaking',
      label: 'Is the water currently leaking?',
      type: 'radio',
      required: true,
      options: ['Yes', 'No'],
    },
  ],
  lighting: [
    {
      id: 'fixtureType',
      label: 'What kind of lights?',
      type: 'select',
      required: true,
      options: ['Ceiling', 'Wall-mounted', 'Other'],
    },
  ],
};
