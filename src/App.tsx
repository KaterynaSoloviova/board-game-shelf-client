import Footer from "./components/Footer";
import Header from "./components/Header";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import HomePage from "./pages/HomePage";
import MyGames from "./pages/MyGames";
import AddGame from "./pages/AddGame";
import GameDetailsPage from "./pages/GameDetailsPage";
import EditGame from "./pages/EditGame";
import Wishlist from "./pages/Wishlist";
import AboutProject from "./pages/AboutProject";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <MantineProvider>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={
                <MyGames />
              } />
              <Route path="/addgame" element={
                <ProtectedRoute>
                  <AddGame />
                </ProtectedRoute>
              } />
              <Route path="/game/:gameId" element={
                <GameDetailsPage />
              } />
              <Route path="/edit/:gameId" element={
                <ProtectedRoute>
                  <EditGame />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <Wishlist />
              } />
              <Route path="/about" element={<AboutProject />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </MantineProvider>
      </BrowserRouter>
    </>
  );
}

export default App;