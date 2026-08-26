import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { PageLoading } from './components/AsyncStates'
import { Layout } from './components/Layout'
import './App.css'

const HomePage = lazy(() => import('./pages/HomePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const RepositoryPage = lazy(() => import('./pages/RepositoryPage'))
const UserPage = lazy(() => import('./pages/UserPage'))

export default function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="users/:username" element={<UserPage />} />
          <Route
            path="users/:username/repositories/:repository"
            element={<RepositoryPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
