import ReactDOM from 'react-dom/client'
import './app/layout/style.css'
import { RouterProvider } from "react-router-dom";
import { router } from './app/router/Routes';
import { StoreProvider } from './app/context/StoreContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    <RouterProvider router={router} />
  </StoreProvider>
)
