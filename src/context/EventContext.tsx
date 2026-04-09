import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Event, EventFilters, Submission, LeaderboardEntry } from '@/types';
import { api } from '@/lib/api';

interface EventContextType {
  events: Event[];
  currentEvent: Event | null;
  myEvents: Event[];
  submissions: Submission[];
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  fetchEvents: (filters?: Partial<EventFilters>) => Promise<void>;
  fetchEventById: (id: string) => Promise<void>;
  fetchMyEvents: () => Promise<void>;
  joinEvent: (eventId: string) => Promise<void>;
  leaveEvent: (eventId: string) => Promise<void>;
  submitModel: (eventId: string, file: File, description?: string) => Promise<void>;
  fetchSubmissions: (eventId?: string) => Promise<void>;
  fetchLeaderboard: (eventId: string) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async (filters?: Partial<EventFilters>) => {
    setLoading(true);
    try {
      const data = await api.competitions.list(filters);
      if (data && data.competitions) {
        setEvents(data.competitions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await api.competitions.getDetails(id);
      setCurrentEvent(data as any);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.auth.dashboard();
      if (data && data.recent_competitions) {
        setMyEvents(data.recent_competitions);
      }
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const joinEvent = useCallback(async (eventId: string) => {
    try {
      await api.competitions.join(eventId);
      await fetchEventById(eventId);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, [fetchEventById]);

  const leaveEvent = useCallback(async (eventId: string) => {
    try {
      await api.competitions.leave(eventId);
      await fetchEventById(eventId);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, [fetchEventById]);

  // Mock implementation since the backend doesn't have a submission endpoint yet.
  const submitModel = useCallback(async (eventId: string, file: File, _description?: string) => {
    setLoading(true);
    console.log("Mock submission", eventId, file);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  }, []);

  const fetchSubmissions = useCallback(async (eventId?: string) => {
    setLoading(true);
    try {
      // If we are looking for user's submissions, we can use the dashboard.
      const data = await api.auth.dashboard();
      if (data && data.recent_submissions) {
        setSubmissions(data.recent_submissions);
      } else {
        setSubmissions([]);
      }
    } catch (e) {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLeaderboard = useCallback(async (eventId: string) => {
    setLoading(true);
    try {
      const data = await api.competitions.participants(eventId);
      if (data && data.participants) {
        const mapped = data.participants.map((p: any, idx: number) => ({
          rank: idx + 1,
          user_id: p.id,
          user_name: p.username || p.name,
          user_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`,
          best_score: 0,
          submissions_count: 0
        }));
        setLeaderboard(mapped);
      }
    } catch (e) {
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <EventContext.Provider
      value={{
        events,
        currentEvent,
        myEvents,
        submissions,
        leaderboard,
        loading,
        fetchEvents,
        fetchEventById,
        fetchMyEvents,
        joinEvent,
        leaveEvent,
        submitModel,
        fetchSubmissions,
        fetchLeaderboard,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
