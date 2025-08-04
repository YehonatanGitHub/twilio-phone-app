import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maintenance - Twilio Phone',
  description: 'Service temporarily unavailable for maintenance',
}

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}