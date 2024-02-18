import ReactDOM from 'react-dom/client'
import './app/layout/style.css'
import { RouterProvider } from "react-router-dom";
import { router } from './app/router/Routes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
