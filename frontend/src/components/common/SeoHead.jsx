import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSeoSettings } from '@/hooks/useSeoSettings'

export default function SeoHead() {
  const { data: seo } = useSeoSettings()
  const location = useLocation()

  useEffect(() => {
    if (!seo) return

    // Site title
    if (seo.meta_title) document.title = seo.meta_title

    const setMeta = (name, content, attr = 'name') => {
      if (!content) return
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
      el.setAttribute('content', content)
    }

    setMeta('description', seo.meta_description)
    setMeta('og:title', seo.meta_title, 'property')
    setMeta('og:description', seo.meta_description, 'property')
    setMeta('twitter:title', seo.meta_title)
    setMeta('twitter:description', seo.meta_description)

    // Google Analytics
    if (seo.google_analytics_id && !document.getElementById('ga-script')) {
      const script = document.createElement('script')
      script.id = 'ga-script'
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${seo.google_analytics_id}`
      document.head.appendChild(script)
      const inlineScript = document.createElement('script')
      inlineScript.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${seo.google_analytics_id}');`
      document.head.appendChild(inlineScript)
    }
  }, [seo, location.pathname])

  return null
}
