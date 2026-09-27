import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import {
  ChatController,
  ChatDiscussion,
  ConnectionStatusBanner,
  TeamGraph,
  TeamRoster,
  buildArtifactsBundle,
  retryWithBackoff,
  teamAvatarResolver,
  teamHubMemberId,
  teamMembersFromStructure,
  useAgentivityClient,
  useRunStream,
  type AgUiConnectionState,
  type ChatHilGate,
  type TeamStructure,
} from '@agentivity-labs/sdk-react';
import { TRIP_TEAM_ID } from '../config';
import { useLayout } from '../useLayout';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';
import { PaymentCard } from '../widgets/PaymentCard';
import { HotelChoice } from '../widgets/HotelChoice';
import { TripCover } from '../widgets/TripCover';

function connectionMessage(state: AgUiConnectionState, secondsLeft: number | undefined) {
  if (state.status === 'connecting') return 'Connecting…';
  return `Connection lost — reconnecting (attempt ${state.attempt})${secondsLeft != null && secondsLeft > 0 ? ` in ${secondsLeft}s…` : '…'}`;
}

const widgetRegistry = buildArtifactsBundle({
  PaymentCard: (props) => <PaymentCard {...props} />,
  HotelChoice: (props) => <HotelChoice {...props} />,
  TripCover: (props) => <TripCover {...props} />,
});

export function TripChat({
  onBack,
  executionId,
  onExecutionStarted,
  activeThemeId,
  onThemeChange,
}: {
  onBack: () => void;
  executionId: string | undefined;
  onExecutionStarted: (executionId: string) => void;
  activeThemeId: string;
  onThemeChange: (id: string) => void;
}) {
  const client = useAgentivityClient();
  const [streamUrl, setStreamUrl] = useState<string>();
  const [error, setError] = useState<string>();
  // Below the desktop breakpoint the card shows either the chat or the team; on desktop the team sits beside it (see chat.css).
  const layout = useLayout();
  // One switch for the team, read by each layout its own way: a screen of its own on a phone, an optional side panel on
  // a tablet or desktop — open by default on desktop (most room to spare), closed by default elsewhere. Resizing across
  // a breakpoint keeps whatever the user last chose.
  const [showTeam, setShowTeam] = useState(() => layout === 'desktop');
  // Tablet and desktop: one surface — the team sits to the right of the chat, split from it by a draggable divider,
  // shown or hidden on demand on both (see the toggle button below).
  const teamAside = (layout === 'desktop' || layout === 'tablet') && showTeam;
  const teamScreen = layout === 'mobile' && showTeam;

  // The team dock's width: the user's own once they have dragged the divider, else a default for the layout.
  const cardRef = useRef<HTMLDivElement>(null);
  const [dockDrag, setDockDrag] = useState<number>();
  const [dragging, setDragging] = useState(false);
  const dockWidth = dockDrag ?? (layout === 'desktop' ? 460 : 340);
  const clampDock = (w: number) => Math.max(260, Math.min(w, (cardRef.current?.clientWidth ?? 900) - 340));
  const startDrag = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const moveDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging || !cardRef.current) return;
    // The dock is anchored to the card's right edge: its width is the distance from the pointer to that edge.
    setDockDrag(clampDock(cardRef.current.getBoundingClientRect().right - e.clientX));
  };
  const keyDrag = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') setDockDrag(clampDock(dockWidth + 24));
    else if (e.key === 'ArrowRight') setDockDrag(clampDock(dockWidth - 24));
  };

  // The team as saved in the team editor: its members, the icon and group each one wears, and its manager. Nothing
  // about the team is written down in this app — change it in Studio and this view follows.
  const [team, setTeam] = useState<TeamStructure>();
  useEffect(() => {
    let alive = true;
    client.entities
      .fetchTeam(TRIP_TEAM_ID)
      .then((t) => alive && setTeam(t))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [client]);
  const members = useMemo(() => (team ? teamMembersFromStructure(team) : []), [team]);
  const hubMemberId = team ? teamHubMemberId(team) : undefined;
  const resolveAvatar = useMemo(() => teamAvatarResolver(members), [members]);

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
    <div
      className="riviera-shell"
      data-layout={layout}
      data-team={teamAside ? 'aside' : teamScreen ? 'screen' : 'closed'}
      data-dragging={dragging || undefined}
      style={{ ['--dock-w' as string]: `${dockWidth}px` }}
    >
      <div ref={cardRef} className={`riviera-card${teamScreen ? ' riviera-card--team' : ''}`}>
        <div className="riviera-card__main">
        <div className="riviera-card__header" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button className="icon-btn-lt" onClick={onBack} aria-label="Back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M15 5L8 12l7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <ThemeSwitcher activeId={activeThemeId} onChange={onThemeChange} />
            </div>
            <button className="pill-outline-sm riviera-team-toggle" onClick={() => setShowTeam((v) => !v)} aria-pressed={showTeam}>
              {showTeam ? (layout === 'mobile' ? 'Back to chat' : 'Hide team') : 'See team'}
            </button>
          </div>
          <div>
            <p className="riviera-eyebrow">New trip</p>
            <h1 className="riviera-title">Tell me what you have in mind</h1>
          </div>
          <TeamRoster controller={controller} members={members} />
        </div>

        <div className="riviera-chat-pane">

        <ChatDiscussion
          controller={controller}
          onSend={(text) => void handleSend(text)}
          onHilResponse={(gate, text, source) => handleHilResponse(gate, text, source)}
          widgetRegistry={widgetRegistry}
          showActiveMemberIndicator
          showSpeakerLabels
          resolveMemberAvatar={resolveAvatar}
          inputHint="Destination, dates, budget, who's coming…"
          hilInputHint="Type your answer…"
          enableVoice={false}
          enableAttachments={false}
          emptyBuilder={() => (
            <p style={{ fontSize: 12.5, color: 'var(--ink-dim)', padding: '8px 4px' }}>
              Tell me everything: destination (or none — I can suggest one), dates, budget, who's coming — I'll handle the rest.
            </p>
          )}
        />
        </div>

        {teamScreen && (
          <div className="riviera-team-inline">
            <TeamGraph controller={controller} members={members} hubMemberId={hubMemberId} />
          </div>
        )}

        {streamUrl && <ConnectionStatusBanner state={connectionState} renderMessage={connectionMessage} />}
        {error && <p style={{ fontSize: 11, color: 'var(--coral)', padding: '0 20px 12px' }}>{error}</p>}
        </div>

        {layout !== 'mobile' && (
          <div
            className="riviera-splitter"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize the team panel"
            tabIndex={teamAside ? 0 : -1}
            hidden={!teamAside}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            onKeyDown={keyDrag}
          />
        )}

        {layout !== 'mobile' && (
          <aside className="riviera-team-dock" data-open={teamAside} aria-label="Your team" aria-hidden={!teamAside} inert={!teamAside}>
            <div className="riviera-team-dock__content">
              <p className="riviera-eyebrow">Your team</p>
              <TeamGraph controller={controller} members={members} hubMemberId={hubMemberId} />
            </div>
          </aside>
        )}
      </div>

    </div>
  );
}
