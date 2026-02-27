#!/bin/bash

# Port to use
PORT=8000

echo "🚀 Starting GIMA Mobile Access..."

# Function to kill background processes on exit
cleanup() {
    echo "Stopping server..."
    kill $(jobs -p) 2>/dev/null
}
trap cleanup EXIT

# Start Server
if command -v python3 &> /dev/null; then
    echo "Step 1: Starting Python Server on port $PORT..."
    python3 -m http.server $PORT &
elif command -v python &> /dev/null; then
    echo "Step 1: Starting Python Server on port $PORT..."
    python -m http.server $PORT &
else
    echo "Step 1: Starting Node Server on port $PORT..."
    if command -v npx &> /dev/null; then
        npx serve -p $PORT &
    else
        echo "Error: Neither Python nor Node.js (npx) found."
        exit 1
    fi
fi

# Wait for server to start
sleep 2

# Start Tunnel
echo "Step 2: Creating Secure Tunnel..."
echo "----------------------------------------"
echo "Scan the QR code or open the URL below:"
echo "----------------------------------------"

# Use localtunnel
if command -v npx &> /dev/null; then
    npx localtunnel --port $PORT
else
    echo "Error: npx not found. Cannot start tunnel."
fi
