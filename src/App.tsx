import Footer from "./components/Footer";
import Header from "./components/Header";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import MyGames from './pages/MyGames';

function App() {
  return (
    <>
      <MantineProvider>
        <Header />
         <MyGames />
        <Footer />
      </MantineProvider>
    </>
  );
}

export default App;
