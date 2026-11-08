/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGENTIVITY_BASE_URL: string;
  /** The Trip Manager Team of another instance, where it was imported from its Template under a new id. */
  readonly VITE_TRIP_TEAM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Whether this demo's server keeps an API key, and so asks the visitors of the demo (agentivity-key-server.ts). */
declare const __AGENTIVITY_DEMO__: boolean;
