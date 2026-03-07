import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './sites/Home/Home.tsx'
import Stats from './sites/Stats/Stats.tsx'
import NotFound from './sites/NotFound/NotFound.tsx'

import './index.css'

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/stats", element: <Stats />},
  { path: "*", element: <NotFound />}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
