import { Server, ServerFormData, StatusHistory, Group, GroupFormData } from '../types';

// Menggunakan environment variable untuk URL backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

export const api = {
  // Incident APIs
  getAllIncidents: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/incidents`);
    if (!response.ok) {
      throw new Error(`Failed to fetch incidents: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },
  createIncident: async (incidentData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/incidents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incidentData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create incident: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },
  updateIncident: async (id: string, incidentData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incidentData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update incident: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },
  deleteIncident: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete incident: ${response.statusText}`);
    }
  },
  // Get server uptime history (returns array of percentages for last 90 days)
  getServerUptimeHistory: async (serverId: string): Promise<number[]> => {
    // Fetch last 90 days of status history
    const history = await api.getServerHistory(serverId, 90);
    // Calculate uptime percentage per day (dummy: 1 entry per day, status 'operational' = 100, else 0)
    // You can improve this logic if your history granularity is higher
    return history.map(h => h.status === 'operational' ? 100 : 0);
  },
  // Group APIs
  getAllGroups: async (): Promise<Group[]> => {
    const response = await fetch(`${API_BASE_URL}/groups`);
    if (!response.ok) {
      throw new Error(`Failed to fetch groups: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  getGroup: async (id: string): Promise<Group> => {
    const response = await fetch(`${API_BASE_URL}/groups/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch group: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  createGroup: async (groupData: GroupFormData): Promise<Group> => {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create group: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  updateGroup: async (id: string, groupData: Partial<GroupFormData>): Promise<Group> => {
    const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update group: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  deleteGroup: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete group: ${response.statusText}`);
    }
  },

  getServersByGroup: async (groupId: string): Promise<Server[]> => {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/servers`);
    if (!response.ok) {
      throw new Error(`Failed to fetch servers by group: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },
  // Get all servers
  getAllServers: async (): Promise<Server[]> => {
    const response = await fetch(`${API_BASE_URL}/servers`);
    if (!response.ok) {
      throw new Error(`Failed to fetch servers: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  // Get single server
  getServer: async (id: string): Promise<Server> => {
    const response = await fetch(`${API_BASE_URL}/servers/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch server: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  // Create server
  createServer: async (serverData: ServerFormData): Promise<Server> => {
    const response = await fetch(`${API_BASE_URL}/servers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serverData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create server: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  // Update server
  updateServer: async (id: string, serverData: Partial<ServerFormData>): Promise<Server> => {
    const response = await fetch(`${API_BASE_URL}/servers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serverData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update server: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  // Delete server
  deleteServer: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/servers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete server: ${response.statusText}`);
    }
  },

  // Check server status
  checkServerStatus: async (id: string): Promise<Server> => {
    const response = await fetch(`${API_BASE_URL}/servers/${id}/check`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Failed to check server status: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  // Get server history
  getServerHistory: async (id: string, limit: number = 50): Promise<StatusHistory[]> => {
    const response = await fetch(`${API_BASE_URL}/servers/${id}/history?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch server history: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  // Get all history (global)
  getAllHistory: async (limit: number = 100): Promise<StatusHistory[]> => {
    const response = await fetch(`${API_BASE_URL}/history?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },
};