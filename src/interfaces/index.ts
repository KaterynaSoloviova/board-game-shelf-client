export interface Session {
  id: string;
  date: Date;
  notes?: string;
  gameId: string;
  createdAt: Date;
  players: Player[];
}

export interface Game {
  id: string;
  title: string;
  description?: string;
  genre: string;
  minPlayers: number;
  maxPlayers: number;
  playTime: number;
  publisher: string;
  age: string;
  rating: number;
  coverImage: string;
  isOwned: boolean;
  sessions: Session[];
  myRating?: number;
  createdAt: Date;
  updatedAt?: Date;
  tags: Tag[];
  _count?: {
    sessions: number;
  };
  wishlist?: {
    id: string;
    reason: string;
    createdAt: Date;
  }
}

export interface Tag {
  id: string;
  title: string;
  games: Game[];
}

export interface Player {
  id: string;
  name: string;
}

export interface File {
  id: string;
  title: string;
  link: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
