import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LandingPage } from '@/components/landing/LandingPage'

export default async function Home() {
  const user = await getCurrentUser()
  if (user) {
    const routes: Record<string, string> = { ADMIN: '/admin', FAMILY: '/family', CAREGIVER: '/caregiver', PATIENT: '/patient' }
    redirect(routes[user.role] || '/family')
  }
  return <LandingPage />
}
