import { useEffect, useMemo, useState } from 'react';
import {
  ChatController,
  ChatDiscussion,
  ConnectionStatusBanner,
  buildArtifactsBundle,
  retryWithBackoff,
  useAgentivityClient,
  useRunStream,
  type AgUiConnectionState,
  type ChatHilGate,
} from '@agentivity-labs/sdk-react';
import { TRIP_TEAM_ID } from '../config';
import { resolveTripAvatar } from '../agentAvatars';
import { PaymentCard } from '../widgets/PaymentCard';

function frenchConnectionMessage(state: AgUiConnectionState, secondsLeft: number | undefined) {
  if (state.status === 'connecting') return 'Connexion…';
  return `Connexion interrompue — reconnexion (tentative ${state.attempt})${secondsLeft != null && secondsLeft > 0 ? ` dans ${secondsLeft}s…` : '…'}`;
}

const widgetRegistry = buildArtifactsBundle({ PaymentCard: (props) => <PaymentCard {...props} /> });

export function TripChat({
  onBack,
  executionId,
  onExecutionStarted,
}: {
  onBack: () => void;
  executionId: string | undefined;
  onExecutionStarted: (executionId: string) => void;
}) {
  const client = useAgentivityClient();
  const [streamUrl, setStreamUrl] = useState<string>();
  const [error, setError] = useState<string>();

  const controller = useMemo(() => new ChatController({ contextId: TRIP_TEAM_ID }), []);
  const { events, connectionState } = useRunStream(streamUrl);

  useEffect(() => {
    events.forEach(controller.feedEvent);
  }, [events, controller]);

  // Both calls below are wrapped in retryWithBackoff: a real device hits transient blips
  // routinely (a mobile network handoff, Wi-Fi/cellular switch, a momentary backend hiccup)
  // and a single one of those shouldn't surface as a hard failure for something this
  // central to the flow — retry a few times, transparently, before giving up.
  async function handleSend(text: string) {
    setError(undefined);
    try {
      const session = await retryWithBackoff(() => client.runs.startExecution({ entityId: TRIP_TEAM_ID, input: text, executionId, enableHil: true }));
      onExecutionStarted(session.executionId);
      setStreamUrl(session.streamUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleHilResponse(gate: ChatHilGate, text: string, source: string) {
    if (!executionId) return;
    setError(undefined);
    try {
      await retryWithBackoff(() => client.runs.submitHilResponse({ executionId, requestId: gate.requestId, response: text, source }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="riviera-shell">
      <div className="riviera-card">
        <div className="riviera-card__header" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="icon-btn-lt" onClick={onBack} aria-label="Retour">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 5L8 12l7 7" stroke="#171A1D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div>
            <p className="riviera-eyebrow">Nouveau voyage</p>
            <h1 className="riviera-title">Raconte-moi ton envie de voyage</h1>
          </div>
        </div>

        <ChatDiscussion
          controller={controller}
          onSend={(text) => void handleSend(text)}
          onHilResponse={(gate, text, source) => handleHilResponse(gate, text, source)}
          widgetRegistry={widgetRegistry}
          showActiveMemberIndicator
          showSpeakerLabels
          resolveMemberAvatar={resolveTripAvatar}
          inputHint="Destination, dates, budget, avec qui…"
          hilInputHint="Écris ta réponse…"
          enableVoice={false}
          enableAttachments={false}
          emptyBuilder={() => (
            <p style={{ fontSize: 12.5, color: 'var(--ink-dim)', padding: '8px 4px' }}>
              Dis-moi tout : destination (ou pas, je peux proposer), dates, budget, avec qui — je m'occupe du reste.
            </p>
          )}
        />

        {streamUrl && <ConnectionStatusBanner state={connectionState} renderMessage={frenchConnectionMessage} />}
        {error && <p style={{ fontSize: 11, color: 'var(--coral)', padding: '0 20px 12px' }}>{error}</p>}
      </div>
    </div>
  );
}
