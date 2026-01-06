'use client'

import { KeyboardEvent, useEffect, useRef, useState } from 'react';

type Option = { value: string; label: string }

type KeyboardSelectProps = {
  id: string
  label?: string
  value: string
  options: Option[]
  disabled?: boolean
  placeholder?: string
  className?: string
  // navegação entre campos (fora do select)
  onMoveField?: (direction: 'prev' | 'next') => void
  // seleção confirmada (Space com dropdown aberto)
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
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const selectedIndex = options.findIndex((o) => o.value === value)
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex].label : ''

  // fecha se clicar fora
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

  const openDropdown = () => {
    if (disabled || options.length === 0) return
    const startIndex = selectedIndex >= 0 ? selectedIndex : 0
    setActiveIndex(startIndex)
    setIsOpen(true)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  const commitSelection = (index: number) => {
    if (index < 0 || index >= options.length) return
    const opt = options[index]
    onChange(opt.value)
    setIsOpen(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return
    }

    // F4 / Space → abre dropdown. Space também confirma se já estiver aberto.
    if (e.key === 'F4' || e.key === ' ') {
      e.preventDefault()
      if (!isOpen) {
        openDropdown()
      } else if (e.key === ' ') {
        // Space com dropdown aberto → seleciona opção ativa
        if (activeIndex >= 0) {
          commitSelection(activeIndex)
        }
      }
      return
    }

    // Esc → fecha dropdown sem selecionar
    if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault()
        closeDropdown()
      }
      return
    }

    // ArrowUp / ArrowDown
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (isOpen) {
        // navegar entre opções
        if (options.length === 0) return
        const delta = e.key === 'ArrowDown' ? 1 : -1
        setActiveIndex((prev) => {
          const base = prev >= 0 ? prev : selectedIndex >= 0 ? selectedIndex : 0
          const count = options.length
          const next = (base + delta + count) % count
          return next
        })
      } else {
        // dropdown fechado → navega entre campos
        if (!onMoveField) return
        onMoveField(e.key === 'ArrowDown' ? 'next' : 'prev')
      }
      return
    }

    // ArrowLeft / ArrowRight só funcionam quando aberto
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (isOpen) {
        e.preventDefault()
        if (options.length === 0) return
        const delta = e.key === 'ArrowRight' ? 1 : -1
        setActiveIndex((prev) => {
          const base = prev >= 0 ? prev : selectedIndex >= 0 ? selectedIndex : 0
          const count = options.length
          const next = (base + delta + count) % count
          return next
        })
      }
      return
    }

    // Enter → sempre vai para o próximo campo (não seleciona)
    if (e.key === 'Enter') {
      e.preventDefault()
      if (isOpen) {
        // fecha sem alterar o valor (seleção é só pelo Space)
        closeDropdown()
      }
      if (onMoveField) {
        onMoveField('next')
      }
      return
    }
  }

  const handleClick = () => {
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

      <div
        id={id}
        ref={wrapperRef}
        tabIndex={disabled ? -1 : 0}
        className={
          'relative h-9 w-full rounded-md border border-border-soft px-3 text-sm flex items-center justify-between cursor-pointer ' +
          (disabled
            ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
            : 'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary') +
          ' ' +
          className
        }
        role='combobox'
        aria-expanded={isOpen}
        aria-disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>
          {selectedLabel || placeholder}
        </span>
        <span className='ml-2 text-[10px] text-slate-500'>▾</span>
      </div>

      {isOpen && !disabled && options.length > 0 && (
        <ul
          className='absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border-soft bg-white text-sm shadow-md'
          role='listbox'
        >
          {options.map((opt, idx) => {
            const isActive = idx === activeIndex
            const isSelected = opt.value === value
            return (
              <li
                key={opt.value}
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
                onMouseDown={(e) => {
                  // para não tirar o foco do "combobox"
                  e.preventDefault()
                }}
                onClick={() => commitSelection(idx)}
              >
                {opt.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
