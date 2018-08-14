import { IncomingMessage } from 'http'

declare module 'micro' {
  export function json<T extends {} = {}>(
    req: IncomingMessage,
    info?: { limit?: string; encoding?: string },
  ): Promise<T>
}
