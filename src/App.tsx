import '@agentivity-labs/sdk-react/styles.css';
import './theme/chat.css';
import './theme/home.css';
import { useState } from 'react';
import { AgentivityProvider, ArtifactsThemeProvider } from '@agentivity-labs/sdk-react';
import { riviera } from './theme/riviera';
import { Accueil } from './screens/Accueil';
import { TripChat } from './screens/TripChat';

const baseUrl = import.meta.env.VITE_AGENTIVITY_BASE_URL;

type Screen = 'accueil' | 'chat';

export default function App() {
  const [screen, setScreen] = useState<Screen>('accueil');
  const [executionId, setExecutionId] = useState<string>();

  return (
    <AgentivityProvider baseUrl={baseUrl}>
      <ArtifactsThemeProvider theme={riviera}>
        {screen === 'accueil' && <Accueil onStart={() => setScreen('chat')} />}
        {screen === 'chat' && (
          <TripChat onBack={() => setScreen('accueil')} executionId={executionId} onExecutionStarted={setExecutionId} />
        )}
      </ArtifactsThemeProvider>
    </AgentivityProvider>
  );
}
