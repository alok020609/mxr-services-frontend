import type { Plugin } from 'vite'

/**
 * Vite plugin to forward browser console logs to terminal
 * This allows API logs to appear in the terminal where Vite is running
 */
export function terminalLogger(): Plugin {
  return {
    name: 'terminal-logger',
    configureServer(server) {
      // Add middleware to handle log requests from browser
      server.middlewares.use('/__terminal-log', (req, res, next) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk.toString()
          })
          req.on('end', () => {
            try {
              const logData = JSON.parse(body)
              const { level, message, data } = logData
              
              // Format and output to terminal
              const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 23)
              
              // Format the output nicely
              if (data && typeof data === 'object' && !Array.isArray(data)) {
                // Pretty print objects
                const dataStr = JSON.stringify(data, null, 2)
                if (level === 'error') {
                  console.error(`\n[${timestamp}] ${message}`)
                  console.error(dataStr)
                } else if (level === 'warn') {
                  console.warn(`\n[${timestamp}] ${message}`)
                  console.warn(dataStr)
                } else {
                  console.log(`\n[${timestamp}] ${message}`)
                  console.log(dataStr)
                }
              } else {
                // Simple message
                if (level === 'error') {
                  console.error(`[${timestamp}] ${message}`, data || '')
                } else if (level === 'warn') {
                  console.warn(`[${timestamp}] ${message}`, data || '')
                } else {
                  console.log(`[${timestamp}] ${message}`, data || '')
                }
              }
            } catch (e) {
              // Ignore parse errors
            }
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true }))
          })
        } else {
          next()
        }
      })
    },
    transformIndexHtml(html) {
      // Inject script to intercept console.log and send to terminal
      return html.replace(
        '<head>',
        `<head>
          <script>
            (function() {
              const originalLog = console.log;
              const originalError = console.error;
              const originalWarn = console.warn;
              
              function sendToTerminal(level, ...args) {
                try {
                  const message = args.map(arg => {
                    if (typeof arg === 'object') {
                      try {
                        return JSON.stringify(arg, null, 2);
                      } catch {
                        return String(arg);
                      }
                    }
                    return String(arg);
                  }).join(' ');
                  
                  // Send to Vite dev server
                  fetch('/__terminal-log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ level, message, data: args.length > 1 ? args : args[0] })
                  }).catch(() => {
                    // Ignore errors if server is not available
                  });
                } catch (e) {
                  // Ignore errors
                }
              }
              
              // Override console methods for API logs
              console.log = function(...args) {
                originalLog.apply(console, args);
                // Only send API-related logs to terminal
                const message = args[0]?.toString() || '';
                if (message.includes('[API') || message.includes('🚀') || message.includes('✅') || message.includes('❌')) {
                  sendToTerminal('log', ...args);
                }
              };
              
              console.error = function(...args) {
                originalError.apply(console, args);
                const message = args[0]?.toString() || '';
                if (message.includes('[API') || message.includes('❌')) {
                  sendToTerminal('error', ...args);
                }
              };
              
              console.warn = function(...args) {
                originalWarn.apply(console, args);
                const message = args[0]?.toString() || '';
                if (message.includes('[API')) {
                  sendToTerminal('warn', ...args);
                }
              };
            })();
          </script>`
      )
    }
  }
}

