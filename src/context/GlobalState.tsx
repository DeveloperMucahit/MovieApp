import { User } from "@firebase/auth";
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
  useEffect,
} from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { auth } from "../Firebase/FirebaseConfig";


export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null | string; // Adjust based on your needs
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  credits: {
    cast: {
      id: number;
      name: string;
      profile_path: string | null;
    }[];
  };
}

export interface GlobalState {
  movies: Movie[];
  selectedMovieId: number | null;
  favorites: Movie[];
  genres: Genre[];
  user: User;
}

const initialState: GlobalState = {
  movies: [
    {
      adult: false,
      backdrop_path: null,
      belongs_to_collection: null,
      budget: 0,
      genres: [],
      homepage: "",
      id: 1229244,
      imdb_id: "tt28331533",
      origin_country: ["US"],
      original_language: "en",
      original_title: "The Seductress From Hell",
      overview:
        "A Hollywood actress undergoes a horrific transformation after being pushed to the edge by her psychopathic husband.",
      popularity: 0.2196,
      poster_path: "/Aqs6AACm4gM7jpur7LYO3oXRDQe.jpg",
      production_companies: [
        {
          id: 237453,
          logo_path: null,
          name: "Garaj Pictures",
          origin_country: "",
        },
        {
          id: 237454,
          logo_path: null,
          name: "Sacred Ember Films",
          origin_country: "",
        },
      ],
      production_countries: [
        { iso_3166_1: "US", name: "United States of America" },
      ],
      release_date: "2025-05-23",
      revenue: 0,
      runtime: 0,
      spoken_languages: [
        { english_name: "English", iso_639_1: "en", name: "English" },
      ],
      status: "Released",
      tagline: "",
      title: "The Seductress From Hell",
      video: false,
      vote_average: 0.0,
      vote_count: 0,
      credits: {
        cast: [
          {
            id: 123456,
            name: "Jane Doe",
            profile_path: "/path/to/profile.jpg",
          },
        ],
      },
    },
  ],
  selectedMovieId: null,
  favorites: [],
  genres: [],
  user: {} as User, 
};

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}
export type Action =
  | { type: "SELECT_MOVIE"; payload: number } 
  | { type: "DESELECT_MOVIE" }
  | { type: "ADD_FAVORITE"; payload: Movie }
  | { type: "REMOVE_FAVORITE"; payload: number }
  | { type: "SET_GENRES"; payload: Genre[] }
  | { type: "SET_USER"; payload: User | null }; 

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);
const GlobalDispatchContext = createContext<Dispatch<Action> | undefined>(
  undefined
);

function reducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case "SELECT_MOVIE":
      return { ...state, selectedMovieId: action.payload };

    case "SET_USER":
      return { ...state, user: action.payload || {} as User };

    case "DESELECT_MOVIE":
      return { ...state, selectedMovieId: null };
      
    case "ADD_FAVORITE":
      if (state.favorites.some((m) => m.id === action.payload.id)) {
        return state;
      }
      return { ...state, favorites: [...state.favorites, action.payload] };

    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((m) => m.id !== action.payload),
      };

    case "SET_GENRES":
      return { ...state, genres: action.payload };

    default:
      return state;
  }
}

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [initializing, setInitializing] = React.useState(true);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch({ type: "SET_USER", payload: user });
      } else {
        dispatch({ type: "SET_USER", payload: null });
      }
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);
  
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ff8c00" />
      </View>
    );
  }

  console.log("GlobalProvider state:", state);
  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export function useGlobalState(): GlobalState {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalProvider");
  }
  return context;
}

export function useGlobalDispatch(): Dispatch<Action> {
  const context = useContext(GlobalDispatchContext);
  if (context === undefined) {
    throw new Error("useGlobalDispatch must be used within a GlobalProvider");
  }
  return context;
}
