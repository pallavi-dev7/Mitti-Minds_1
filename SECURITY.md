# Security notes
- No backend, no API keys, no tracking. Photos stay on the device (read with FileReader, never uploaded).
- Strict Content-Security-Policy in `index.html`: scripts only from `'self'`, no inline handlers, no external requests.
- All dynamic text inserted as HTML goes through `esc()`; stored data from `localStorage` is validated and escaped.
- Uploads are limited to image files under 10 MB.
- Report issues by opening a GitHub issue.
Known limits: demo disease detection and sample data; inline `style` attributes still require `style-src 'unsafe-inline'`.
