import { useState } from 'react';
import { ArtifactCard } from '@agentivity-labs/sdk-react';

interface LineItem {
  label: string;
  price: number;
}

/**
 * In-chat payment widget — the app-registered counterpart to the
 * "PaymentCard" custom widget declared on the Payment Agent's
 * `custom_widgets` config. Simulates a checkout against an already-saved
 * fake card (no card-number entry) and reports the outcome back to the
 * agent via `__onSubmit`.
 *
 * Agent props: `{ amount, currency, cardLast4, lineItems: [{label, price}] }`.
 */
export function PaymentCard(props: Record<string, unknown>) {
  const amount = typeof props['amount'] === 'number' ? props['amount'] : 0;
  const currency = typeof props['currency'] === 'string' ? props['currency'] : 'EUR';
  const cardLast4 = typeof props['cardLast4'] === 'string' ? props['cardLast4'] : '4242';
  const lineItems = Array.isArray(props['lineItems']) ? (props['lineItems'] as LineItem[]) : [];
  const onSubmit = typeof props['__onSubmit'] === 'function' ? (props['__onSubmit'] as (response: string) => void) : undefined;

  const [status, setStatus] = useState<'idle' | 'processing' | 'paid'>('idle');

  function pay() {
    if (!onSubmit || status !== 'idle') return;
    setStatus('processing');
    setTimeout(() => {
      setStatus('paid');
      onSubmit(`Paiement confirmé : ${amount} ${currency} sur la carte se terminant par ${cardLast4}.`);
    }, 700);
  }

  return (
    <ArtifactCard title="Paiement" type="Checkout">
      {lineItems.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {lineItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12.5, padding: '4px 0', borderBottom: i < lineItems.length - 1 ? '1px solid var(--ag-outline-variant, #edebe5)' : undefined }}>
              <span style={{ opacity: 0.75 }}>{item.label}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                {item.price} {currency}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '10px 0 14px' }}>
        <span style={{ fontSize: 12, opacity: 0.65 }}>Total</span>
        <span style={{ fontSize: 19, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          {amount} {currency}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 12px',
          borderRadius: 10,
          background: 'var(--ag-surface-container-low, #f8fafc)',
          border: '1px solid var(--ag-outline-variant, #e2e8f0)',
          fontSize: 12,
          marginBottom: 14,
        }}
      >
        <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>VISA</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>•••• {cardLast4}</span>
        <span style={{ opacity: 0.6 }}>Carte enregistrée</span>
      </div>

      {status === 'paid' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: 13, fontWeight: 500 }}>
          <span>✓</span>
          <span>Paiement confirmé</span>
        </div>
      ) : (
        <button
          type="button"
          disabled={status === 'processing'}
          onClick={pay}
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: 8,
            border: 'none',
            background: 'var(--ag-primary, #2563eb)',
            color: 'white',
            fontSize: 13,
            fontWeight: 600,
            cursor: status === 'processing' ? 'default' : 'pointer',
            opacity: status === 'processing' ? 0.6 : 1,
          }}
        >
          {status === 'processing' ? 'Paiement en cours…' : `Payer ${amount} ${currency}`}
        </button>
      )}
    </ArtifactCard>
  );
}
