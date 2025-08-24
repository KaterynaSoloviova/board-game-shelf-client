import Footer from "./components/Footer";
import Header from "./components/Header";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import HomePage from "./pages/HomePage";
import MyGames from "./pages/MyGames";
import GameDetailsPage from "./pages/GameDetailsPage"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <MantineProvider>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<MyGames />} />
            <Route path="/game/:id" element={<GameDetailsPage />} />
          </Routes>
          <Footer />
        </MantineProvider>
      </BrowserRouter>
    </>
  );
}

export default App;