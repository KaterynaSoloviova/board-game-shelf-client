export interface Session {
  id: string;
  date: Date;
  notes?: string;
  gameId: string;
  createdAt: Date;
}

export interface Game {
  id: string;
  title: string;
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
  updatedAt: Date;
  tags: Tag[];
}

export interface Tag {
  id: string;
  title: string;
  games: Game[];
}
