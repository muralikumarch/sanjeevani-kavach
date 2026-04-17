'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { visionAgent, VisionAgent } from '@/infrastructure/ai/vision-agent';
import { protocolAgent, ProtocolAgent } from '@/infrastructure/ai/protocol-agent';

interface AgentContextType {
  visionAgent: VisionAgent;
  protocolAgent: ProtocolAgent;
}

const AgentContext = createContext<AgentContextType>({
  visionAgent,
  protocolAgent,
});

export const useAgents = () => useContext(AgentContext);

export const AgentProvider = ({ children }: { children: React.ReactNode }) => {
  const agents = useMemo(() => ({
    visionAgent,
    protocolAgent,
  }), []);

  return (
    <AgentContext.Provider value={agents}>
      {children}
    </AgentContext.Provider>
  );
};
