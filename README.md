# 🎲 Board Games Shelf - Frontend (React)

A personal board game collection management application built with React, TypeScript, and Mantine UI. Keep track of your board games, sessions, and wishlist in a beautiful, minimalist interface.

## ✨ Features

### 🏠 **Home Page**
- Welcome message and project introduction
- "Hottest Games" slider showing games with the most sessions
- Clean, minimalist design with soft color palette
- Responsive layout with plenty of whitespace

### 🎮 **Game Management**
- **Add Games**: Upload cover images, set ratings, add tags, and mark ownership status
- **Edit Games**: Modify game details, ratings, and descriptions
- **Game Details**: Comprehensive view with sessions, files, and player management
- **Rich Text Editor**: Enhanced description editing with formatting options

### 📊 **Session Tracking**
- Record game sessions with dates, players, and notes
- Add existing players or create new ones
- Edit and delete session records
- Track which games get played most frequently

### 📁 **File Management**
- Link external files (Google Drive, Dropbox, etc.)
- Organize game-related documents and resources
- Easy access to rulebooks, expansions, and guides

### ❤️ **Wishlist System**
- Add games you want to own
- Toggle wishlist status from game details
- Dedicated wishlist page with game cards
- Persistent wishlist state management

### 🏷️ **Organization & Search**
- Tag-based categorization system
- Filter games by genre, player count, play time
- Search functionality across game titles and descriptions
- Sort by rating, date added, or play frequency

## 🛠️ **Technologies Used**

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development and better IDE support
- **Mantine UI** - Beautiful, accessible component library
- **React Router DOM** - Client-side routing and navigation
- **Tiptap** - Rich text editor for game descriptions
- **Axios** - HTTP client for API communication

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database toolkit and ORM
- **SQL** - Database queries and relationships
- **TypeScript** - Backend type safety

### **Development Tools**
- **Vite** - Fast build tool and development server
- **ESLint** - Code quality and consistency
- **Git** - Version control

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn package manager
- PostgreSQL database
- Backend server running on `http://localhost:5005`

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd board-game-shelf-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5005
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### **Backend Setup**
Ensure your backend server is running with the following endpoints:
- `GET /api/games` - Fetch all games
- `GET /api/games/:id` - Fetch specific game
- `POST /api/games` - Create new game
- `PUT /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game
- `GET /api/games/top` - Fetch top games by sessions
- `GET /api/games/wishlist` - Fetch wishlist games
- `POST /api/games/:id/addWishlist` - Add to wishlist
- `POST /api/games/:id/removeWishlist` - Remove from wishlist
- `GET /api/players` - Fetch all players
- `POST /api/games/:id/sessions` - Create session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

## 🎨 **Design System**

### **Color Palette**
- **Primary**: `#AAC27A` (Soft green)
- **Secondary**: `#B07770` (Warm brown)
- **Accent**: `#99B5A3` (Muted teal)
- **Background**: `#f0f0eb` (Off-white)
- **Text**: `#635841` (Dark brown)

### **Typography**
- **Font Family**: Inter (clean, readable sans-serif)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### **Design Principles**
- **Minimalist**: Clean, uncluttered layouts
- **Consistent**: Unified spacing, colors, and component styles
- **Accessible**: High contrast ratios and clear visual hierarchy
- **Responsive**: Mobile-first design approach

## 📱 **Usage Guide**

### **Adding a New Game**
1. Navigate to "Add Game" from the header
2. Fill in basic information (title, genre, player count, etc.)
3. Upload a cover image
4. Add tags for categorization
5. Set your personal rating
6. Mark if you own the game
7. Add a detailed description using the rich text editor

### **Recording a Game Session**
1. Go to any game's detail page
2. Click "Add Session" button
3. Select the date
4. Add players (existing or new)
5. Add session notes
6. Save the session

### **Managing Your Wishlist**
1. View games you don't own
2. Click "Add to Wishlist" button
3. Access your wishlist from the header navigation
4. Remove items when you acquire them

## 🔧 **Development**

### **Project Structure**
```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   └── GameCard.tsx    # Game display card
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── MyGames.tsx     # Game collection
│   ├── Wishlist.tsx    # Wishlist management
│   ├── GameDetailsPage.tsx # Individual game view
│   ├── AddGame.tsx     # Add new game
│   ├── EditGame.tsx    # Edit existing game
│   └── AboutProject.tsx # Project information
├── interfaces/          # TypeScript type definitions
├── hooks/              # Custom React hooks
├── config/             # Configuration files
└── assets/             # Images and static files
```

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### **Code Style**
- Use TypeScript for all components
- Follow React functional component patterns
- Use Mantine UI components consistently
- Maintain consistent spacing and color usage
- Add proper error handling and loading states

## 🤝 **Contributing**

This is a personal project, but if you'd like to contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure code quality and tests pass
5. Submit a pull request

## 📄 **License**

This project is created as part of the Ironhack bootcamp curriculum.

## 👩‍💻 **About the Developer**

**Kateryna Soloviova** - Web Developer
- **Email**: soloviova.kateryna@gmail.com
- **GitHub**: [@KaterynaSoloviova](https://github.com/KaterynaSoloviova)
- **LinkedIn**: [Kateryna Soloviova](https://www.linkedin.com/in/kateryna-soloviova-webdeveloper/)

## 🎯 **Project Goals**

This project was developed as part of the Ironhack bootcamp to demonstrate:
- **Frontend Development**: React, TypeScript, modern UI libraries
- **Backend Integration**: RESTful APIs, data management
- **Database Design**: PostgreSQL, Prisma ORM, SQL relationships
- **Full-Stack Development**: End-to-end application architecture
- **User Experience**: Clean, intuitive interface design

## 🚧 **Future Enhancements**

- User authentication and accounts
- Multi-user game collections
- Advanced analytics and statistics
- Mobile app version
- Social features (game recommendations, reviews)
- Integration with board game APIs (BGG)
- Export/import functionality

---

**Happy Gaming! 🎲✨**
