import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateAgent from './pages/CreateAgent'
import ChatAgent from './pages/ChatAgent'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agents/new" element={<CreateAgent />} />
      <Route path="/agents/:agentId/chat" element={<ChatAgent />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}