import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:3000";

export interface DashboardStats {
  totalEleves: number;
  totalProfesseurs: number;
  totalClasses: number;
  tauxAbsenteisme: number;
}

export interface RecentActivity {
  id: string;
  type: "inscription" | "absence" | "note" | "evenement";
  message: string;
  date: string;
  icon: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "cours" | "reunion" | "examen" | "evenement";
}

interface UseDashboardReturn {
  stats: DashboardStats;
  activities: RecentActivity[];
  events: CalendarEvent[];
  loading: boolean;
  error: string;
}

export function useDashboard(token: string): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats>({
    totalEleves: 0,
    totalProfesseurs: 0,
    totalClasses: 0,
    tauxAbsenteisme: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/stats`, { headers });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // endpoint may not exist yet
    }
  }, [token]);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/activities`, { headers });
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch {
      // endpoint may not exist yet
    }
  }, [token]);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/events`, { headers });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch {
      // endpoint may not exist yet
    }
  }, [token]);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.allSettled([fetchStats(), fetchActivities(), fetchEvents()]);
      } catch {
        setError("Erreur lors du chargement du tableau de bord");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [fetchStats, fetchActivities, fetchEvents]);

  return { stats, activities, events, loading, error };
}
