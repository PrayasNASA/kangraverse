import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HeritageFeature {
  id: string;
  name: string;
  type: string;
  long_description: string;
  elevation_m: number;
  image_url: string | null;
  image_source: string;
  video_url: string;
  geometry: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  longitude: number;
  latitude: number;
  religion?: string;
  deity?: string;
  village?: string;
  district?: string;
  vulnerability?: 'High' | 'Moderate' | 'Low';
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  stops: string[]; // Feature IDs
}

export interface Trek {
  id: string;
  name: string;
  description: string;
  color: string;
  coordinates: number[][]; // [longitude, latitude]
  type?: string;
  image_url?: string;
  image_source?: string;
  video_url?: string;
  elevation_m?: number;
  long_description?: string;
}

interface AppState {
  // Map State
  showTerrain: boolean;
  setShowTerrain: (show: boolean) => void;
  showSatellite: boolean;
  setShowSatellite: (show: boolean) => void;
  showTreks: boolean;
  setShowTreks: (show: boolean) => void;
  showMarkers: boolean;
  setShowMarkers: (show: boolean) => void;
  showVulnerability: boolean;
  setShowVulnerability: (show: boolean) => void;
  timeOfDay: number;
  setTimeOfDay: (time: number) => void;
  
  // Selection & Navigation
  selectedFeature: HeritageFeature | Trek | null;
  setSelectedFeature: (feature: HeritageFeature | Trek | null) => void;
  activeLocationId: string | null;
  setActiveLocationId: (id: string | null) => void;
  hoveredFeatureId: string | null;
  setHoveredFeatureId: (id: string | null) => void;
  flyToLocation: { lng: number; lat: number; altitude: number; pitch: number; duration?: number } | null;
  setFlyToLocation: (loc: { lng: number; lat: number; altitude: number; pitch: number; duration?: number } | null) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  filterReligion: string | null;
  setFilterReligion: (religion: string | null) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;

  // Favorites & History
  favorites: string[];
  toggleFavorite: (id: string) => void;
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;

  // Tours
  activeTour: Tour | null;
  setActiveTour: (tour: Tour | null) => void;
  currentTourStep: number;
  setCurrentTourStep: (step: number) => void;
  isPlayingTour: boolean;
  setIsPlayingTour: (isPlaying: boolean) => void;
  toggleIsPlayingTour: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      showTerrain: true,
      setShowTerrain: (show) => set({ showTerrain: show }),
      showSatellite: false,
      setShowSatellite: (show) => set({ showSatellite: show }),
      showTreks: false,
      setShowTreks: (show) => set({ showTreks: show }),
      showMarkers: true,
      setShowMarkers: (show) => set({ showMarkers: show }),
      showVulnerability: false,
      setShowVulnerability: (show) => set({ showVulnerability: show }),
      timeOfDay: 12,
      setTimeOfDay: (time) => set({ timeOfDay: time }),

      selectedFeature: null,
      setSelectedFeature: (feature) => set({ selectedFeature: feature }),
      activeLocationId: null,
      setActiveLocationId: (id) => set({ activeLocationId: id }),
      hoveredFeatureId: null,
      setHoveredFeatureId: (id) => set({ hoveredFeatureId: id }),
      flyToLocation: null,
      setFlyToLocation: (loc) => set({ flyToLocation: loc }),

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      filterReligion: null,
      setFilterReligion: (religion) => set({ filterReligion: religion }),
      showFilters: false,
      setShowFilters: (show) => set({ showFilters: show }),

      favorites: [],
      toggleFavorite: (id) => {
        const { favorites } = get();
        if (favorites.includes(id)) {
          set({ favorites: favorites.filter((f) => f !== id) });
        } else {
          set({ favorites: [...favorites, id] });
        }
      },
      recentlyViewed: [],
      addRecentlyViewed: (id) => {
        const { recentlyViewed } = get();
        set({ 
          recentlyViewed: [id, ...recentlyViewed.filter(v => v !== id)].slice(0, 10) 
        });
      },

      activeTour: null,
      setActiveTour: (tour) => set({ activeTour: tour, currentTourStep: 0, selectedFeature: null, isPlayingTour: false }),
      currentTourStep: 0,
      setCurrentTourStep: (step) => set({ currentTourStep: step }),
      isPlayingTour: false,
      setIsPlayingTour: (isPlaying) => set({ isPlayingTour: isPlaying }),
      toggleIsPlayingTour: () => set((state) => ({ isPlayingTour: !state.isPlayingTour })),
    }),
    {
      name: 'kangraverse-storage',
      partialize: (state) => ({ favorites: state.favorites, recentlyViewed: state.recentlyViewed }),
    }
  )
);
