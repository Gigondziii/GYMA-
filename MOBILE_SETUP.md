# How to Run on Mobile (Like Expo)

We have created an automated script to make this easy.

## Quick Start

1. Open your terminal in this folder.
2. Run the start script:
   ```bash
   ./start_mobile.sh
   ```
3. It will generate a secure HTTPS URL (e.g., `https://gima-app-xyz.loca.lt`).
4. Type that URL into your mobile browser.

## Manual Method (If script fails)

1. Start Python Server: `python3 -m http.server 8000`
2. Start Tunnel: `npx localtunnel --port 8000`
