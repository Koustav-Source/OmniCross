import { Crossing, Incident } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = {
  // Health
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) throw new Error(`Health status ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[API] Backend health fetch failed:', err);
      return null;
    }
  },

  // Crossings
  async getCrossings(): Promise<Crossing[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/crossings`);
      if (!res.ok) throw new Error('Failed to fetch crossings');
      return await res.json();
    } catch (err) {
      console.warn('[API] Fallback to local state for crossings:', err);
      return null;
    }
  },

  async createCrossing(crossingData: Partial<Crossing>, token?: string): Promise<Crossing | null> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/crossings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(crossingData),
      });
      if (!res.ok) throw new Error('Failed to create crossing');
      return await res.json();
    } catch (err) {
      console.error('[API] Error creating crossing:', err);
      return null;
    }
  },

  async updateCrossing(crossingId: string, updates: Partial<Crossing>, token?: string): Promise<Crossing | null> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/crossings/${crossingId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update crossing');
      return await res.json();
    } catch (err) {
      console.error('[API] Error updating crossing:', err);
      return null;
    }
  },

  // Incidents
  async getIncidents(): Promise<Incident[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/incidents`);
      if (!res.ok) throw new Error('Failed to fetch incidents');
      return await res.json();
    } catch (err) {
      console.warn('[API] Fallback for incidents:', err);
      return null;
    }
  },

  async createIncident(incidentData: Partial<Incident>, token?: string): Promise<Incident | null> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/incidents`, {
        method: 'POST',
        headers,
        body: JSON.stringify(incidentData),
      });
      if (!res.ok) throw new Error('Failed to create incident');
      return await res.json();
    } catch (err) {
      console.error('[API] Error creating incident:', err);
      return null;
    }
  },

  async updateIncident(incidentId: string, updates: Partial<Incident>, token?: string): Promise<Incident | null> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/incidents/${incidentId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update incident');
      return await res.json();
    } catch (err) {
      console.error('[API] Error updating incident:', err);
      return null;
    }
  },

  // Analytics
  async getOverviewAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/overview`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return await res.json();
    } catch (err) {
      console.warn('[API] Analytics fallback:', err);
      return null;
    }
  },

  async getPerformanceAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/performance`);
      if (!res.ok) throw new Error('Failed to fetch performance analytics');
      return await res.json();
    } catch (err) {
      console.warn('[API] Performance analytics fallback:', err);
      return null;
    }
  },

  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }
    return await res.json();
  },
};
