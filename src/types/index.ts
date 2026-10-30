export interface UserProfile {
  name: string;
  greeting: string;
}

export interface EndpointTool {
  id: string;
  name: string;
  description: string;
  category: string;
  endpointUrl?: string;
  status?: 'active' | 'maintenance' | 'ready';
}
