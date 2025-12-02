import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AuthUser } from './api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCpfMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  const part1 = digits.slice(0, 3)
  const part2 = digits.slice(3, 6)
  const part3 = digits.slice(6, 9)
  const part4 = digits.slice(9, 11)

  let result = part1
  if (part2) result += '.' + part2
  if (part3) result += '.' + part3
  if (part4) result += '-' + part4

  return result
}

export function isValidCpf(cpfDigits: string): boolean {
  if (!/^\d{11}$/.test(cpfDigits)) return false
  if (/^(\d)\1{10}$/.test(cpfDigits)) return false

  const nums = cpfDigits.split('').map(Number)

  let sum1 = 0
  for (let i = 0; i < 9; i++) sum1 += nums[i] * (10 - i)
  let dv1 = (sum1 * 10) % 11
  if (dv1 === 10) dv1 = 0
  if (dv1 !== nums[9]) return false

  let sum2 = 0
  for (let i = 0; i < 10; i++) sum2 += nums[i] * (11 - i)
  let dv2 = (sum2 * 10) % 11
  if (dv2 === 10) dv2 = 0
  if (dv2 !== nums[10]) return false

  return true
}

export function formatCpfReadonlyMask(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
    6,
    9
  )}-${digits.slice(9)}`
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type Profile = AuthUser & {
  phone?: string | null
  createdAt?: string | null
}

export type MeResponse = {
  success: boolean
  message?: string
  user?: Profile
}

export function getInitials(name?: string | null): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function formatPhone(raw?: string | null): string {
  if (!raw) return '-'
  const digits = raw.replace(/\D/g, '').slice(0, 11)

  if (!digits) return '-'
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  // 11 dígitos
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function formatCreatedAt(dateString?: string | null): string {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'

  const pad = (n: number) => n.toString().padStart(2, '0')
  const dd = pad(d.getDate())
  const mm = pad(d.getMonth() + 1)
  const yyyy = d.getFullYear()
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())

  return `${dd}/${mm}/${yyyy} às ${hh}:${mi}`
}

export function formatPhoneMask(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (!digits) return ''
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function isValidPhone(digits: string) {
  return digits.length === 10 || digits.length === 11
}

export function getFullName(firstName: string, lastName: string) {
  return `${firstName ?? ''} ${lastName ?? ''}`.trim().replace(/\s+/g, ' ')
}
