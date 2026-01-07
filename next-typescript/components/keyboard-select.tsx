'use client'

import {
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

type Option = { value: string; label: string }

type KeyboardSelectProps = {
  id: string
  label?: string
  value: string
  options: Option[]
  disabled?: boolean
  placeholder?: string
  className?: string
  onMoveField?: (direction: 'prev' | 'next') => void
  onChange: (value: string) => void
}

export function KeyboardSelect({
  id,
  label,
  value,
  options,
  disabled,
  placeholder = 'Selecione...',
  className = '',
  onMoveField,
  onChange,
}: KeyboardSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const [typeBuffer, setTypeBuffer] = useState('')
  const lastTypeTimeRef = useRef<number | null>(null)

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]) as MutableRefObject<
    (HTMLLIElement | null)[]
  >

  const selectedIndex = options.findIndex((o) => o.value === value)
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex].label : ''

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    if (activeIndex < 0) return
    const el = optionRefs.current[activeIndex]
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex, isOpen])

  const openDropdown = () => {
    if (disabled || options.length === 0) return
    const startIndex = selectedIndex >= 0 ? selectedIndex : 0
    setActiveIndex(startIndex)
    setIsOpen(true)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  const commitSelectionByIndex = (index: number) => {
    if (index < 0 || index >= options.length) return
    const opt = options[index]
    onChange(opt.value)
    setIsOpen(false)
  }

  const commitSelectionByValue = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

  const handleTypeAhead = (key: string) => {
    const now = Date.now()
    const timeoutMs = 700
    const shouldReset =
      !lastTypeTimeRef.current || now - lastTypeTimeRef.current > timeoutMs

    const newBuffer = shouldReset ? key : typeBuffer + key
    setTypeBuffer(newBuffer)
    lastTypeTimeRef.current = now

    const lower = newBuffer.toLowerCase()
    const startFrom = isOpen
      ? activeIndex >= 0
        ? activeIndex + 1
        : 0
      : selectedIndex >= 0
      ? selectedIndex + 1
      : 0

    const count = options.length
    if (count === 0) return

    for (let offset = 0; offset < count; offset++) {
      const idx = (startFrom + offset) % count
      if (options[idx].label.toLowerCase().startsWith(lower)) {
        if (isOpen) {
          setActiveIndex(idx)
        } else {
          commitSelectionByIndex(idx)
        }
        break
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return

    if (
      e.key.length === 1 &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      ![' ', 'F4'].includes(e.key)
    ) {
      e.preventDefault()
      handleTypeAhead(e.key)
      return
    }

    if (e.key === 'F4' || e.key === ' ') {
      e.preventDefault()
      if (!isOpen) {
        openDropdown()
      } else if (e.key === ' ') {
        if (activeIndex >= 0) {
          commitSelectionByIndex(activeIndex)
        }
      }
      return
    }

    if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault()
        closeDropdown()
      }
      return
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (isOpen) {
        if (options.length === 0) return
        const delta = e.key === 'ArrowDown' ? 1 : -1
        setActiveIndex((prev) => {
          const base = prev >= 0 ? prev : selectedIndex >= 0 ? selectedIndex : 0
          const count = options.length
          return (base + delta + count) % count
        })
      } else {
        if (!onMoveField) return
        onMoveField(e.key === 'ArrowDown' ? 'next' : 'prev')
      }
      return
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (isOpen) {
        e.preventDefault()
        if (options.length === 0) return
        const delta = e.key === 'ArrowRight' ? 1 : -1
        setActiveIndex((prev) => {
          const base = prev >= 0 ? prev : selectedIndex >= 0 ? selectedIndex : 0
          const count = options.length
          return (base + delta + count) % count
        })
      }
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      if (isOpen) closeDropdown()
      if (onMoveField) onMoveField('next')
      return
    }
  }

  const handleToggleClick = () => {
    if (disabled) return
    if (isOpen) {
      closeDropdown()
    } else {
      openDropdown()
    }
  }

  return (
    <div className='space-y-1'>
      {label && (
        <label className='text-xs text-slate-700' htmlFor={id}>
          {label}
        </label>
      )}

      <div ref={wrapperRef} className='relative'>
        <div
          id={id}
          tabIndex={disabled ? -1 : 0}
          className={
            'h-9 w-full rounded-md border border-border-soft px-3 text-sm flex items-center justify-between cursor-pointer ' +
            (disabled
              ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
              : 'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary') +
            ' ' +
            className
          }
          role='combobox'
          aria-expanded={isOpen}
          aria-disabled={disabled}
          onClick={handleToggleClick}
          onKeyDown={handleKeyDown}
        >
          <span className={value ? 'text-slate-900' : 'text-slate-400'}>
            {selectedLabel || placeholder}
          </span>
          <span className='ml-2 text-[10px] text-slate-500'>▾</span>
        </div>

        {isOpen && !disabled && options.length > 0 && (
          <ul
            className='absolute left-0 right-0 mt-1 max-h-48 overflow-auto rounded-md border border-border-soft bg-white text-sm shadow-md z-20'
            role='listbox'
          >
            {options.map((opt, idx) => {
              const isActive = idx === activeIndex
              const isSelected = opt.value === value
              return (
                <li
                  key={opt.value}
                  ref={(el) => {
                    optionRefs.current[idx] = el
                  }}
                  role='option'
                  aria-selected={isSelected}
                  className={
                    'px-3 py-1.5 cursor-pointer ' +
                    (isActive
                      ? 'bg-primary text-white'
                      : isSelected
                      ? 'bg-slate-100'
                      : 'hover:bg-slate-100')
                  }
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commitSelectionByValue(opt.value)}
                >
                  {opt.label}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
