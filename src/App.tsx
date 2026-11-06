import '@agentivity-labs/sdk-react/styles.css';
import './theme/chat.css';
import './theme/home.css';
import { useState } from 'react';
import { AgentivityProvider, ArtifactsThemeProvider } from '@agentivity-labs/sdk-react';
import { useTheme } from './theme/useTheme';
import { Home } from './screens/Home';
import { TripChat } from './screens/TripChat';

const baseUrl = import.meta.env.VITE_AGENTIVITY_BASE_URL;
// A demo App of the instance (its id): each browser gets an anonymous visitor of its own, with their own conversations.
const demoAppId = (import.meta.env.VITE_AGENTIVITY_DEMO_APP as string | undefined) || undefined;

type Screen = 'home' | 'chat';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [executionId, setExecutionId] = useState<string>();
  const { theme, setThemeId } = useTheme();

  return (
    // The wait is shown inside the card, in Riviera's words (TripWait), rather than over the page.
    <AgentivityProvider baseUrl={baseUrl} demoAppId={demoAppId} waitNotice={false}>
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
