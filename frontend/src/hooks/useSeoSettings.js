import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

export function useSeoSettings() {
  return useQuery({
    queryKey: ['seo-settings', 'public'],
    queryFn: () => axiosInstance.get('/settings/seo'),
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 60, // 1 hour cache
    retry: false,
  })
}
