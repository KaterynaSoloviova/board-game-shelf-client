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
