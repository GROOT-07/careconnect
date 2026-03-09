import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export const SERVICE_LABELS: Record<string, string> = {
  MORNING_CARE: 'Morning Care',
  PERSONAL_CARE: 'Personal Care',
  MEDICATION: 'Medication',
  MEAL_PREP: 'Meal Preparation',
  COMPANIONSHIP: 'Companionship',
  DOCTOR_ESCORT: 'Doctor Escort',
  EVENING_ROUTINE: 'Evening Routine',
  OVERNIGHT: 'Overnight Care',
}

export const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-sage-light text-sage-dark',
  PRIORITY: 'bg-terra-light text-terra',
  MONITORING: 'bg-sky-light text-sky',
  INACTIVE: 'bg-light-gray text-warm-gray',
  CONFIRMED: 'bg-sage-light text-sage-dark',
  PENDING: 'bg-sky-light text-sky',
  COMPLETED: 'bg-light-gray text-warm-gray',
  CANCELLED: 'bg-terra-light text-terra',
}
