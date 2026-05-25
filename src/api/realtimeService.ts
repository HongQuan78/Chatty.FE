import * as signalR from '@microsoft/signalr';
import { authService } from './authService';
import { env } from '../config/env';
import type { Message } from '../models';

let connection: signalR.HubConnection | null = null;

const getConnection = () => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(env.signalRHubUrl, {
        accessTokenFactory: () => authService.getAccessToken(),
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }

  return connection;
};

export const realtimeService = {
  start: async () => {
    const hub = getConnection();
    if (hub.state === signalR.HubConnectionState.Disconnected) {
      await hub.start();
    }
    return hub;
  },

  stop: async () => {
    if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
      await connection.stop();
    }
  },

  onReceiveMessage: (handler: (message: Message) => void) => {
    const hub = getConnection();
    hub.off('ReceiveMessage');
    hub.on('ReceiveMessage', handler);
  },

  joinConversation: async (conversationId: string) => {
    const hub = await realtimeService.start();
    await hub.invoke('JoinConversation', conversationId);
  },

  leaveConversation: async (conversationId: string) => {
    const hub = getConnection();
    if (hub.state === signalR.HubConnectionState.Connected) {
      await hub.invoke('LeaveConversation', conversationId);
    }
  },

  heartbeat: async () => {
    const hub = getConnection();
    if (hub.state === signalR.HubConnectionState.Connected) {
      await hub.invoke('Heartbeat');
    }
  },
};
