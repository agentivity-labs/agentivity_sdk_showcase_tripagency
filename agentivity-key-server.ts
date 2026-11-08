import type { Connect, Plugin } from 'vite'

/**
 * The small server of the demo, inside Vite's own (`npm run dev`, `npm run preview`): it keeps the API key of the workspace
 * (`AGENTIVITY_API_KEY`, never `VITE_…`, so that it never reaches the browser) and asks the instance for a new anonymous visitor
 * for each new page (`POST /agentivity/visitor`). The page keeps its visitor between visits; it never sees the key.
 *
 * Without a key (a workspace that does not ask to sign in), there is no such route, and the page talks to the instance as is.
 */
export function agentivityKeyServer(env: Record<string, string>): Plugin {
  const key = env.AGENTIVITY_API_KEY?.trim()
  const instance = (env.VITE_AGENTIVITY_BASE_URL ?? '').replace(/\/+$/, '')

  const visitor: Connect.NextHandleFunction = async (req, res, next) => {
    if (req.url !== '/agentivity/visitor' || req.method !== 'POST' || !key) return next()
    try {
      const given = await fetch(`${instance}/api/v1/keys/visitors`, { method: 'POST', headers: { Authorization: `Bearer ${key}` } })
      res.statusCode = given.status
      res.setHeader('Content-Type', 'application/json')
      res.end(await given.text())
    } catch {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'instance_unreachable', message: 'The workspace could not be reached.' }))
    }
  }

  return {
    name: 'agentivity-key-server',
    // The page asks its visitor of this server only when there is a key to ask with.
    config: () => ({ define: { __AGENTIVITY_DEMO__: JSON.stringify(Boolean(key)) } }),
    configureServer: (server) => void server.middlewares.use(visitor),
    configurePreviewServer: (server) => void server.middlewares.use(visitor),
  }
}
