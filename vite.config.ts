import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, searchForWorkspaceRoot } from 'vite'
import { agentivityKeyServer } from './agentivity-key-server.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // The API key stays on this server: it asks the visitors of the demo (agentivity-key-server.ts).
  plugins: [react(), agentivityKeyServer(loadEnv(mode, process.cwd(), ''))],
  server: {
    fs: {
      // The SDK is linked from a sibling folder (`file:../agentivity_sdk_react`), outside this project's root: the dev
      // server must be allowed to serve its files (the icon font its stylesheet points at), or the icons render as boxes.
      allow: [searchForWorkspaceRoot(process.cwd()), '../agentivity_sdk_react'],
    },
  },
}))
