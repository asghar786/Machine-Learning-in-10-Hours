import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axiosInstance from '@/api/axiosInstance'

/**
 * Fires a POST /track on every route change.
 * Silent — never throws or disrupts the UI.
 */
export function usePageTracker() {
  const location = useLocation()

  useEffect(() => {
    const url = location.pathname + location.search
    const title = document.title || ''
    const referer = document.referrer || ''

    axiosInstance.post('/track', { url, title, referer }).catch(() => {})
  }, [location.pathname, location.search])
}
