import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './styles/globals.css'
import { ChatRoomPage } from './pages/ChatRoom'
import { ChatsPage } from './pages/Chats'
import { HomePage } from './pages/Home'
import { LoginPage } from './pages/Login'
import { RegisterPage } from './pages/Register'
import { ProtectedRoute } from './components/Auth/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'chats',
        element: (
          <ProtectedRoute>
            <ChatsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'chat/:id',
        element: (
          <ProtectedRoute>
            <ChatRoomPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
