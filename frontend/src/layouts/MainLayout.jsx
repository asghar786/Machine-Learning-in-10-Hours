import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import SeoHead from '@/components/common/SeoHead'
import { usePageTracker } from '@/hooks/usePageTracker'

export default function MainLayout() {
  const { pathname } = useLocation()
  usePageTracker()

  // Re-initialize Edumel jQuery plugins after route change
  useEffect(() => {
    if (typeof window.$ === 'undefined') return

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Re-init Owl Carousel
    if (window.$.fn.owlCarousel) {
      window.$('.owl-carousel').each(function () {
        if (window.$(this).data('owl.carousel')) return
        window.$(this).owlCarousel()
      })
    }

    // Re-init Counter
    if (window.$.fn.counterUp) {
      window.$('.counter').counterUp({ delay: 10, time: 1000 })
    }

    // Re-init WOW animations
    if (window.WOW) {
      new window.WOW({ live: false }).init()
    }

    // Sticky navbar
    const handleScroll = () => {
      const navbar = window.$('.navbar-sticky')
      if (navbar.length) {
        if (window.$(window).scrollTop() > 100) {
          navbar.addClass('sticky-menu')
        } else {
          navbar.removeClass('sticky-menu')
        }
      }
    }
    window.$(window).on('scroll.mainlayout', handleScroll)

    return () => {
      window.$(window).off('scroll.mainlayout')
    }
  }, [pathname])

  return (
    <>
      <SeoHead />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
