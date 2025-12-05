import { KeyboardEventHandler, useEffect } from 'react'

export type KeyboardType = KeyboardEventHandler<
  HTMLElement | HTMLInputElement | HTMLSelectElement | null
>

export function useKeyboardNavigation(
  refs: React.RefObject<HTMLElement>[],
  getFirstInvalidIndex: () => number | null,
  canLeaveField: (index: number) => boolean
) {
  useEffect(() => {
    refs[0]?.current?.focus()
  }, [refs])

  const focusAt = (index: number) => {
    const ref = refs[index]
    ref?.current?.focus()
  }

  const handleFocus = (index: number) => {
    const firstInvalid = getFirstInvalidIndex()
    if (firstInvalid != null && firstInvalid < index) {
      focusAt(firstInvalid)
    }
  }

  const handleKeyDown = (index: number) => (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'Enter':
        e.preventDefault()
        if (!canLeaveField(index)) return
        focusAt(Math.min(refs.length - 1, index + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        focusAt(Math.max(0, index - 1))
        break
      case 'Home':
        e.preventDefault()
        focusAt(0)
        break
      case 'End':
        e.preventDefault()
        focusAt(refs.length - 1)
        break
    }
  }

  return { handleFocus, handleKeyDown }
}
