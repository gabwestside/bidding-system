import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
