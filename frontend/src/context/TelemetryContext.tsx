import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TelemetryPacket } from '../types/models';

interface TelemetryContextType {
  devices: TelemetryPacket[];
  isConnected: boolean;
}

// ============================================================================
// Module-level WebSocket Manager (singleton, outside React lifecycle)
// ============================================================================
type Listener = (devices: Record<string, TelemetryPacket>, isConnected: boolean) => void;

class WebSocketManager {
  private socket: WebSocket | null = null;
  private devices: Record<string, TelemetryPacket> = {};
  private isConnected = false;
  private retryCount = 0;
  private reconnectTimer: number | null = null;
  private connectionTimeout: number | null = null;
  private listeners: Set<Listener> = new Set();
  private endpoint: string;

  private static readonly CONNECTION_TIMEOUT_MS = 5000;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.connect();
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.devices, this.isConnected));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.devices, this.isConnected);
    return () => this.listeners.delete(listener);
  }

  private clearTimers() {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.connectionTimeout !== null) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  private scheduleReconnect() {
    // Don't schedule if already scheduled
    if (this.reconnectTimer !== null) return;

    this.retryCount += 1;
    const delay = Math.min(this.retryCount * 1000, 30000);
    console.log(`[Telemetry] Scheduling reconnect in ${delay / 1000}s (attempt ${this.retryCount})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private connect() {
    this.clearTimers();
    if (this.socket) {
      if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close();
      }
      this.socket = null;
    }

    console.log(`[Telemetry] Attempting connection to ${this.endpoint}`);

    try {
      this.socket = new WebSocket(this.endpoint);
    } catch (error) {
      console.error('[Telemetry] Failed to create WebSocket:', error);
      this.scheduleReconnect();
      return;
    }

    // Set up connection timeout - if we don't connect in time, force a retry
    this.connectionTimeout = setTimeout(() => {
      console.log('[Telemetry] Connection timeout - no response from server');
      this.connectionTimeout = null;
      if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close();
        this.socket = null;
        this.scheduleReconnect();
      }
    }, WebSocketManager.CONNECTION_TIMEOUT_MS);

    this.socket.onopen = () => {
      console.log('[Telemetry] Connection established');
      this.clearTimers();
      this.isConnected = true;
      this.retryCount = 0;
      this.notify();
    };

    this.socket.onmessage = (event) => {
      try {
        const data: TelemetryPacket = JSON.parse(event.data);
        this.devices = { ...this.devices, [data.device_id]: data };
        this.notify();
      } catch (e) {
        console.error('[Telemetry] Failed to parse incoming message');
      }
    };

    this.socket.onclose = (event) => {
      console.log(`[Telemetry] Connection closed (code: ${event.code})`);
      this.clearTimers();
      this.isConnected = false;
      this.socket = null;
      this.notify();

      // Always reconnect unless it was a clean close (code 1000 - Normal Closure)
      if (event.code !== 1000) {
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = () => { };
  }
}

const wsManager = new WebSocketManager('ws://127.0.0.1:8000/ws/client');

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider = ({ children }: { children: React.ReactNode }) => {
  const [devices, setDevices] = useState<Record<string, TelemetryPacket>>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = wsManager.subscribe((newDevices, newIsConnected) => {
      setDevices(newDevices);
      setIsConnected(newIsConnected);
    });

    return unsubscribe;
  }, []);

  return (
    <TelemetryContext.Provider value={{ devices: Object.values(devices), isConnected }}>
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) throw new Error('useTelemetry must be used within a TelemetryProvider');
  return context;
};