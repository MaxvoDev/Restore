import { useEffect, useState } from "react"
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { getCookie } from "../util/util";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/basket/BasketSlice";
import { fetchCurrentUserAsync } from "../../features/basket/AccountSlice";

function App() {
  const dispatch = useAppDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    dispatch(fetchCurrentUserAsync());
    if(buyerId){
      setLoading(true);
      agent.Basket.get()
      .then(basket => dispatch(setBasket(basket)))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
    }
  }, [dispatch]);

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
