import '@agentivity-labs/sdk-react/styles.css';
import './theme/chat.css';
import './theme/home.css';
import { useState } from 'react';
import { AgentivityProvider, ArtifactsThemeProvider } from '@agentivity-labs/sdk-react';
import { useTheme } from './theme/useTheme';
import { Home } from './screens/Home';
import { TripChat } from './screens/TripChat';

const baseUrl = import.meta.env.VITE_AGENTIVITY_BASE_URL;

type Screen = 'home' | 'chat';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [executionId, setExecutionId] = useState<string>();
  const { theme, setThemeId } = useTheme();

  return (
    <AgentivityProvider baseUrl={baseUrl}>
      <ArtifactsThemeProvider theme={theme.artifactsTheme}>
        {screen === 'home' && (
          <Home
            activeThemeId={theme.id}
            onThemeChange={setThemeId}
            onStart={() => {
              // A stale executionId here would make the next message continue whatever trip was
              // last open, instead of starting a real new conversation (confirmed in production:
              // the backend correctly resumed the old run/thread, re-asking already-answered
              // questions, while the chat UI looked empty/fresh — appearing to "do nothing").
              setExecutionId(undefined);
              setScreen('chat');
            }}
          />
        )}
        {screen === 'chat' && (
          <TripChat
            onBack={() => setScreen('home')}
            executionId={executionId}
            onExecutionStarted={setExecutionId}
            activeThemeId={theme.id}
            onThemeChange={setThemeId}
          />
        )}
      </ArtifactsThemeProvider>
    </AgentivityProvider>
  );
}
