export type ServerStatus = 'operational' | 'performaissue' | 'down' | 'maintenance';
export type ServerType = 'website' | 'api' | 'database' | 'other';

export interface Group {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Server {
  _id: string;
  name: string;
  url: string;
  groupId: string | Group;
  type: ServerType;
  status: ServerStatus;
  responseTime: number;
  uptime: number;
  lastChecked: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusHistory {
  _id: string;
  serverId: string;
  status: ServerStatus;
  responseTime: number;
  timestamp: Date;
  errorMessage?: string;
}

export interface GroupFormData {
  name: string;
  description?: string;
}

export interface ServerFormData {
  name: string;
  url: string;
  groupId: string;
  type: ServerType;
  description?: string;
}
