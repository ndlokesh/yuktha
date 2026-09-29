import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from './analytics'

const routeTitles = {
  '/': 'Yuktha — Unified Academia–Industry Collaboration & Skill Intelligence Platform',
  '/login': 'Sign In | Yuktha Academia–Industry Portal',
  '/register': 'Create Account | Yuktha Academia–Industry Portal',
  '/privacy': 'Privacy Policy & DPDP Notice | Yuktha',
  '/terms': 'Terms & Conditions of Service | Yuktha',
  '/student/dashboard': 'Student Dashboard | Yuktha Skill Intelligence',
  '/student/assessment': 'Diagnostic Skill Assessment | Yuktha',
  '/student/portfolio': 'Verified Digital Portfolio | Yuktha',
  '/student/jobs': 'Ayush Internships & Opportunities | Yuktha',
  '/student/learning': 'Certified Industry Masterclasses | Yuktha',
  '/student/applications': 'My Opportunity Applications | Yuktha',
  '/student/profile': 'Student Academic Profile | Yuktha',
  '/faculty/dashboard': 'Faculty & Academician Dashboard | Yuktha',
  '/faculty/opportunities': 'Corporate Sabbaticals & Industry RFPs | Yuktha',
  '/faculty/proposals': 'Research Collaboration Proposals | Yuktha',
  '/faculty/profile': 'Academician Profile | Yuktha',
  '/company/dashboard': 'Enterprise & Industry Dashboard | Yuktha',
  '/company/post-job': 'Publish Industry Opportunity | Yuktha',
  '/company/post-program': 'Publish Certified Masterclass | Yuktha',
  '/company/post-collaboration': 'Publish R&D Collaboration RFP | Yuktha',
  '/college/dashboard': 'Institution & University Dashboard | Yuktha',
  '/college/students': 'Institutional Student Verification | Yuktha',
  '/admin/analytics': 'National Ayush Skill Intelligence & Analytics | Yuktha',
}

export function usePageMeta() {
  const location = useLocation()

  useEffect(() => {
    const title = routeTitles[location.pathname] || 'Yuktha — Unified Academia–Industry Portal'
    document.title = title

    // Update canonical or meta tag if present
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      if (location.pathname === '/privacy') {
        metaDesc.setAttribute('content', 'Privacy policy and data protection safeguards for the Yuktha Ayush collaboration portal under India DPDP Act 2023.')
      } else if (location.pathname === '/terms') {
        metaDesc.setAttribute('content', 'Terms and conditions governing students, academicians, enterprises, and institutions on the Yuktha platform.')
      } else {
        metaDesc.setAttribute('content', 'Yuktha is the centralized intelligence and collaboration portal connecting Ayush students, academicians, and healthcare enterprises for skill evaluation and industrial immersion.')
      }
    }

    // Scroll to top on route change unless hash is present
    if (!location.hash) {
      window.scrollTo(0, 0)
    } else {
      const id = location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }

    // Track analytics page view
    trackPageView(location.pathname, title)
  }, [location.pathname, location.hash])
}
