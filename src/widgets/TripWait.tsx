import { WaitNotice, useAgentivityClient } from '@agentivity-labs/sdk-react';

/**
 * "One moment…" inside the card, under its header, while a call waits for its answer: the first calls to a hosted workspace
 * that wakes up take most of a minute. In the words and the colors of Riviera; never a word about a server.
 */
export function TripWait() {
  const client = useAgentivityClient();
  return (
    <div className="riviera-wait">
      <WaitNotice
        waiting={client.waiting}
        texts={{
          title: 'One moment…',
          detail: 'Getting your travel desk ready.',
          later: 'Almost there…',
          long: 'This is taking a little longer than usual.',
        }}
      />
    </div>
  );
}
