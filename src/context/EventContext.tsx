import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Event, EventFilters, Submission, LeaderboardEntry } from '@/types';
import { mockEvents, mockSubmissions, mockLeaderboard } from '@/data/mockData';

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
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    let filtered = [...mockEvents];
    
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter((e) => e.status === filters.status);
      }
      if (filters.difficulty && filters.difficulty !== 'all') {
        filtered = filtered.filter((e) => e.difficulty === filters.difficulty);
      }
      if (filters.theme && filters.theme !== 'all') {
        filtered = filtered.filter((e) => e.theme === filters.theme);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.title.toLowerCase().includes(search) ||
            e.description_short.toLowerCase().includes(search)
        );
      }
    }
    
    setEvents(filtered);
    setLoading(false);
  }, []);

  const fetchEventById = useCallback(async (id: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const event = mockEvents.find((e) => e.id === id);
    setCurrentEvent(event || null);
    setLoading(false);
  }, []);

  const fetchMyEvents = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Filter events where user has joined
    const joined = mockEvents.filter((e) => e.my_participation?.is_joined);
    setMyEvents(joined);
    setLoading(false);
  }, []);

  const joinEvent = useCallback(async (eventId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Update the event's participation status
    const eventIndex = mockEvents.findIndex((e) => e.id === eventId);
    if (eventIndex !== -1) {
      mockEvents[eventIndex] = {
        ...mockEvents[eventIndex],
        my_participation: {
          is_joined: true,
          my_submissions_count: 0,
        },
        stats: {
          ...mockEvents[eventIndex].stats,
          participants_count: mockEvents[eventIndex].stats.participants_count + 1,
        },
      };
      setCurrentEvent(mockEvents[eventIndex]);
    }
  }, []);

  const leaveEvent = useCallback(async (eventId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const eventIndex = mockEvents.findIndex((e) => e.id === eventId);
    if (eventIndex !== -1) {
      mockEvents[eventIndex] = {
        ...mockEvents[eventIndex],
        my_participation: undefined,
        stats: {
          ...mockEvents[eventIndex].stats,
          participants_count: Math.max(0, mockEvents[eventIndex].stats.participants_count - 1),
        },
      };
      setCurrentEvent(mockEvents[eventIndex]);
    }
  }, []);

  const submitModel = useCallback(async (eventId: string, file: File, _description?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const newSubmission: Submission = {
      id: Date.now().toString(),
      event_id: eventId,
      event_title: mockEvents.find((e) => e.id === eventId)?.title || '',
      user_id: '1',
      user_name: 'Jean Participant',
      file_name: file.name,
      file_size: file.size,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };
    
    mockSubmissions.unshift(newSubmission);
    setSubmissions([...mockSubmissions]);
    
    // Simulate evaluation after delay
    setTimeout(() => {
      const subIndex = mockSubmissions.findIndex((s) => s.id === newSubmission.id);
      if (subIndex !== -1) {
        mockSubmissions[subIndex] = {
          ...mockSubmissions[subIndex],
          status: 'evaluated',
          score: Math.random() * 0.3 + 0.7,
          rank: Math.floor(Math.random() * 50) + 1,
          evaluated_at: new Date().toISOString(),
        };
        setSubmissions([...mockSubmissions]);
      }
    }, 3000);
  }, []);

  const fetchSubmissions = useCallback(async (eventId?: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    if (eventId) {
      setSubmissions(mockSubmissions.filter((s) => s.event_id === eventId));
    } else {
      setSubmissions(mockSubmissions);
    }
    setLoading(false);
  }, []);

  const fetchLeaderboard = useCallback(async (eventId: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const eventLeaderboard = mockLeaderboard[eventId] || [];
    setLeaderboard(eventLeaderboard);
    setLoading(false);
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
