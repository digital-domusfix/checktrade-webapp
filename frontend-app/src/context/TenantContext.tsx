import { createContext, useContext } from 'react';

export const TenantContext = createContext<{ tenantId: string }>({
  tenantId: '00000000-0000-0000-0000-000000000001',
});
export const useTenant = () => useContext(TenantContext);
