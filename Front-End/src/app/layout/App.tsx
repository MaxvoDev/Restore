import { useEffect, useState } from "react"
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../util/util";

function App() {
  const { setBasket } = useStoreContext();
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if(buyerId){
      setLoading(true);
      agent.Basket.get()
      .then(basket => setBasket(basket))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
    }
  }, [setBasket]);

  const theme = createTheme({
    palette: {
      mode: paletteType
    }
  })

  function handleThemeChange(){
    setDarkMode(!darkMode);
  }

  if(loading) return <LoadingComponent />

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App
