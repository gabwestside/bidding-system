/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { KeyboardSelect } from '@/components/keyboard-select'
import { KeyboardEvent, useEffect, useState } from 'react'

const TOTAL_FIELDS = 10
const PAGE_SIZE = 4

const fieldIds = [
  'campo-nome',
  'campo-cpf',
  'campo-email',
  'campo-telefone',
  'campo-logradouro',
  'campo-tipo-end-com',
  'campo-uf',
  'campo-cidade',
  'campo-tipo-via-rua',
  'campo-desc-via',
] as const

const ufs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

type FormValidacaoModel = {
  Nome: string
  Cpf: string
  Email: string
  Telefone: string
  Logradouro: string
  TipoEndereco: string
  Uf: string
  Cidade: string
  TipoViaRua: boolean
  TipoViaAvenida: boolean
  TipoViaLogradouro: boolean
  TipoViaDummy: boolean
  DescricaoVia: string
}

const ufOptions = ufs.map((uf) => ({ value: uf, label: uf }))

function getCidadesPorUf(uf: string): string[] {
  switch (uf) {
    case 'SP':
      return ['São Paulo', 'Campinas', 'Santos']
    case 'RJ':
      return ['Rio de Janeiro', 'Niterói']
    case 'CE':
      return ['Fortaleza', 'Sobral']
    default:
      return []
  }
}

function getFirstInvalidRequiredFieldIndex(
  model: FormValidacaoModel
): number | null {
  if (!model.Nome.trim()) return 0
  if (!model.Cpf.trim()) return 1
  if (!model.Email.trim()) return 2
  if (!model.TipoEndereco.trim()) return 5
  if (!model.TipoViaRua && !model.TipoViaAvenida && !model.TipoViaLogradouro)
    return 8
  return null
}

function canLeaveField(
  model: FormValidacaoModel,
  index: number
): { ok: boolean; message?: string } {
  switch (index) {
    case 0:
      if (!model.Nome.trim())
        return { ok: false, message: 'Preencha o nome antes de continuar.' }
      break
    case 1:
      if (!model.Cpf.trim())
        return { ok: false, message: 'Preencha o CPF antes de continuar.' }
      break
    case 2:
      if (!model.Email.trim())
        return { ok: false, message: 'Preencha o e-mail antes de continuar.' }
      break
    case 5:
      if (!model.TipoEndereco.trim())
        return {
          ok: false,
          message: 'Informe o tipo de endereço antes de continuar.',
        }
      break
    case 8:
      if (
        !model.TipoViaRua &&
        !model.TipoViaAvenida &&
        !model.TipoViaLogradouro
      ) {
        return {
          ok: false,
          message: 'Selecione pelo menos um tipo de via antes de continuar.',
        }
      }
      break
  }
  return { ok: true }
}

function canUseField(model: FormValidacaoModel, index: number): boolean {
  const firstInvalid = getFirstInvalidRequiredFieldIndex(model)
  return !(firstInvalid !== null && firstInvalid < index)
}

function focusField(index: number, center = false) {
  if (index < 0 || index >= TOTAL_FIELDS) return
  const id = fieldIds[index]
  const el = document.getElementById(id) as HTMLElement | null
  if (!el) return

  try {
    ;(el as any).focus({ preventScroll: true })
  } catch {
    el.focus()
  }

  const container = el.closest('.kb-scroll-container') as HTMLElement | null
  if (!container) {
    if (center) el.scrollIntoView({ block: 'center' })
    else el.scrollIntoView({ block: 'nearest' })
    return
  }

  const padding = 16
  const cRect = container.getBoundingClientRect()
  const eRect = el.getBoundingClientRect()

  if (center) {
    const target = eRect.top - cRect.top - (cRect.height / 2 - eRect.height / 2)
    container.scrollTop += target
  } else {
    if (eRect.top < cRect.top + padding) {
      container.scrollTop += eRect.top - (cRect.top + padding)
    } else if (eRect.bottom > cRect.bottom - padding) {
      container.scrollTop += eRect.bottom - (cRect.bottom - padding)
    }
  }
}

const initialModel: FormValidacaoModel = {
  Nome: '',
  Cpf: '',
  Email: '',
  Telefone: '',
  Logradouro: '',
  TipoEndereco: '',
  Uf: '',
  Cidade: '',
  TipoViaRua: false,
  TipoViaAvenida: false,
  TipoViaLogradouro: false,
  TipoViaDummy: false,
  DescricaoVia: '',
}

export default function FormValidacaoPage() {
  const [model, setModel] = useState<FormValidacaoModel>(initialModel)
  const [cidadesBaseAtual, setCidadesBaseAtual] = useState<string[]>([])
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  const [tipoEnderecoFocusIndex, setTipoEnderecoFocusIndex] = useState(0)
  
  useEffect(() => {
    focusField(0, true)
  }, [])

  const handleFieldFocus = (index: number) => {
    const firstInvalid = getFirstInvalidRequiredFieldIndex(model)
    if (firstInvalid !== null && firstInvalid < index) {
      setGlobalError(
        'Preencha os campos obrigatórios na ordem antes de avançar.'
      )
      focusField(firstInvalid, true)
    } else {
      if (globalError) setGlobalError(null)
    }
  }

  const updateModel = <K extends keyof FormValidacaoModel>(
    field: K,
    value: FormValidacaoModel[K]
  ) => {
    setModel((prev) => {
      const next = { ...prev, [field]: value }
      if (
        field === 'TipoViaRua' ||
        field === 'TipoViaAvenida' ||
        field === 'TipoViaLogradouro'
      ) {
        const anyChecked =
          (field === 'TipoViaRua' ? (value as boolean) : prev.TipoViaRua) ||
          (field === 'TipoViaAvenida'
            ? (value as boolean)
            : prev.TipoViaAvenida) ||
          (field === 'TipoViaLogradouro'
            ? (value as boolean)
            : prev.TipoViaLogradouro)
        next.TipoViaDummy = anyChecked
      }
      return next
    })
  }

  const handleUfChange = (value: string) => {
    setModel((prev) => ({
      ...prev,
      Uf: value,
      Cidade: '',
    }))
    setCidadesBaseAtual(getCidadesPorUf(value))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>, index: number) => {
    // ENTER não deve submeter
    if (e.key === 'Enter') {
      e.preventDefault()
    }

    // bloco especial do rádio de tipo de endereço (index 5)
    if (index === 5) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        setTipoEnderecoFocusIndex((prev) => {
          const nextIndex = prev === 0 ? 1 : 0
          const nextId =
            nextIndex === 0 ? 'campo-tipo-end-com' : 'campo-tipo-end-emp'
          focusById(nextId, false)
          return nextIndex
        })
        return
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        if (!model.TipoEndereco) return

        const targetIndex =
          e.key === 'ArrowDown'
            ? Math.min(TOTAL_FIELDS - 1, index + 1)
            : Math.max(0, index - 1)

        focusField(targetIndex)
        return
      }

      if (e.key === ' ') {
        e.preventDefault()
        const value = tipoEnderecoFocusIndex === 0 ? 'Comercial' : 'Empresarial'
        updateModel('TipoEndereco', value)
        return
      }
    }

    // Ctrl + Home / Ctrl + End
    if (e.key === 'Home' && e.ctrlKey) {
      e.preventDefault()
      setGlobalError(null)
      focusField(0, true)
      return
    }

    if (e.key === 'End' && e.ctrlKey) {
      e.preventDefault()
      setGlobalError(null)
      focusField(TOTAL_FIELDS - 1, true)
      return
    }

    // PageDown / PageUp
    if (e.key === 'PageDown') {
      e.preventDefault()
      const target = Math.min(TOTAL_FIELDS - 1, index + PAGE_SIZE)
      const firstInvalid = getFirstInvalidRequiredFieldIndex(model)
      if (firstInvalid !== null && firstInvalid < target) {
        setGlobalError(
          'Preencha os campos obrigatórios na ordem antes de avançar.'
        )
        focusField(firstInvalid, true)
      } else {
        setGlobalError(null)
        focusField(target, true)
      }
      return
    }

    if (e.key === 'PageUp') {
      e.preventDefault()
      const target = Math.max(0, index - PAGE_SIZE)
      setGlobalError(null)
      focusField(target, true)
      return
    }

    // navegação geral entre campos
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault()
      const { ok, message } = canLeaveField(model, index)
      if (!ok) {
        if (message) setGlobalError(message)
        return
      }
      setGlobalError(null)
      const nextIndex = Math.min(TOTAL_FIELDS - 1, index + 1)
      focusField(nextIndex)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevIndex = Math.max(0, index - 1)
      focusField(prevIndex)
      return
    }
  }

  const handleValidateClick = () => {
    setMensagemSucesso(null)
    setGlobalError(null)

    const firstInvalid = getFirstInvalidRequiredFieldIndex(model)
    if (firstInvalid !== null) {
      setGlobalError('Preencha os campos obrigatórios antes de enviar.')
      focusField(firstInvalid, true)
      return
    }

    // aqui você poderia rodar validações extras (CPF, email etc.)
    setMensagemSucesso(
      'Formulário válido. Junto com a implementação de navegação por teclado em Next.'
    )
  }

  const handleMoveFromField = (
    fromIndex: number,
    direction: 'prev' | 'next'
  ) => {
    const targetIndex =
      direction === 'next'
        ? Math.min(TOTAL_FIELDS - 1, fromIndex + 1)
        : Math.max(0, fromIndex - 1)

    // aqui você pode aplicar as mesmas regras de CanLeaveField/GetFirstInvalid, se quiser
    focusField(targetIndex)
  }

  const cidadeOptions = cidadesBaseAtual.map((c) => ({ value: c, label: c }))

  return (
    <div className='min-h-[calc(80vh-96px)] flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-xl'>
        <div className='text-[11px] text-slate-500 mb-1.5'>
          <span className='text-primary font-medium'>
            Formulário de validação com EditForm (versão Next)
          </span>
        </div>

        <div className='border border-border-soft shadow-sm bg-header/95 backdrop-blur rounded-xl'>
          <div className='px-4 pt-4 pb-2 border-b border-border-soft'>
            <h1 className='text-base font-semibold tracking-tight text-slate-900 text-center'>
              Validações específicas
            </h1>
            <p className='text-[11px] text-slate-500 text-center mt-1'>
              Exemplo de uso do formulário com navegação apenas por teclado
              (Next.js).
            </p>
          </div>

          <form
            autoComplete='off'
            onSubmit={(e) => {
              e.preventDefault()
              handleValidateClick()
            }}
          >
            <div className='px-4 pt-3 pb-3 space-y-3 h-full overflow-auto kb-scroll-container'>
              {globalError && (
                <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700'>
                  {globalError}
                </div>
              )}

              {/* BLOCO 1 - Dados básicos */}
              <div className='text-[11px] font-semibold text-slate-600 mt-1'>
                Dados básicos
              </div>

              {/* 0 - Nome */}
              <div className='space-y-1'>
                <label className='text-xs text-slate-700' htmlFor='campo-nome'>
                  Nome completo <span className='text-red-500'>*</span>
                </label>
                <input
                  id='campo-nome'
                  autoComplete='off'
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='Informe o nome'
                  value={model.Nome}
                  onChange={(e) => updateModel('Nome', e.target.value)}
                  onFocus={() => handleFieldFocus(0)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                />
              </div>

              {/* 1 - CPF */}
              <div className='space-y-1'>
                <label className='text-xs text-slate-700' htmlFor='campo-cpf'>
                  CPF <span className='text-red-500'>*</span>
                </label>
                <input
                  id='campo-cpf'
                  autoComplete='off'
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='999.999.999-99'
                  value={model.Cpf}
                  onChange={(e) => updateModel('Cpf', e.target.value)}
                  onFocus={() => handleFieldFocus(1)}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                />
              </div>

              {/* 2 - E-mail */}
              <div className='space-y-1'>
                <label className='text-xs text-slate-700' htmlFor='campo-email'>
                  E-mail <span className='text-red-500'>*</span>
                </label>
                <input
                  id='campo-email'
                  autoComplete='off'
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='email@dominio.com'
                  value={model.Email}
                  onChange={(e) => updateModel('Email', e.target.value)}
                  onFocus={() => handleFieldFocus(2)}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                />
              </div>

              {/* 3 - Telefone (opcional) */}
              <div className='space-y-1'>
                <label
                  className='text-xs text-slate-700'
                  htmlFor='campo-telefone'
                >
                  Telefone (opcional)
                </label>
                <input
                  id='campo-telefone'
                  autoComplete='off'
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='(00) 00000-0000'
                  value={model.Telefone}
                  onChange={(e) => updateModel('Telefone', e.target.value)}
                  onFocus={() => handleFieldFocus(3)}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                />
              </div>

              {/* BLOCO 2 - Endereço */}
              <div className='text-[11px] font-semibold text-slate-600 mt-3'>
                Endereço
              </div>

              {/* 4 - Logradouro */}
              <div className='space-y-1'>
                <label
                  className='text-xs text-slate-700'
                  htmlFor='campo-logradouro'
                >
                  Logradouro
                </label>
                <input
                  id='campo-logradouro'
                  autoComplete='off'
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='Rua, avenida...'
                  value={model.Logradouro}
                  onChange={(e) => updateModel('Logradouro', e.target.value)}
                  onFocus={() => handleFieldFocus(4)}
                  onKeyDown={(e) => handleKeyDown(e, 4)}
                />
              </div>

              {/* 5 - Tipo de endereço (radio) */}
              <div className='space-y-1 flex flex-col'>
                <span className='text-xs text-slate-700'>
                  Tipo de endereço <span className='text-red-500'>*</span>
                </span>

                <div className='flex items-center gap-4 text-xs text-slate-700'>
                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      type='radio'
                      id='campo-tipo-end-com'
                      name='tipo-endereco'
                      className='h-3.5 w-3.5 border-border-soft text-primary'
                      value='Comercial'
                      checked={model.TipoEndereco === 'Comercial'}
                      onChange={() => {
                        setTipoEnderecoFocusIndex(0)
                        updateModel('TipoEndereco', 'Comercial')
                      }}
                      onFocus={() => {
                        setTipoEnderecoFocusIndex(0)
                        handleFieldFocus(5)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, 5)}
                    />
                    <span className='ml-1'>Comercial</span>
                  </label>

                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      type='radio'
                      id='campo-tipo-end-emp'
                      name='tipo-endereco'
                      className='h-3.5 w-3.5 border-border-soft text-primary'
                      value='Empresarial'
                      checked={model.TipoEndereco === 'Empresarial'}
                      onChange={() => {
                        setTipoEnderecoFocusIndex(1)
                        updateModel('TipoEndereco', 'Empresarial')
                      }}
                      onFocus={() => {
                        setTipoEnderecoFocusIndex(1)
                        handleFieldFocus(5)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, 5)}
                    />
                    <span className='ml-1'>Empresarial</span>
                  </label>
                </div>
              </div>

              {/* 6 - UF */}
              <div className='space-y-1'>
                <KeyboardSelect
                  id='campo-uf'
                  label='UF'
                  value={model.Uf}
                  options={ufOptions}
                  disabled={!canUseField(model, 6)}
                  placeholder='Selecione...'
                  onChange={(v) => handleUfChange(v)}
                  onMoveField={(direction) => handleMoveFromField(6, direction)}
                />
              </div>

              {/* 7 - Cidade */}
              <div className='space-y-1'>
                <KeyboardSelect
                  id='campo-cidade'
                  label='Cidade'
                  value={model.Cidade}
                  options={cidadeOptions}
                  disabled={!canUseField(model, 7) || !model.Uf}
                  placeholder='Selecione...'
                  onChange={(v) => updateModel('Cidade', v)}
                  onMoveField={(direction) => handleMoveFromField(7, direction)}
                />
              </div>

              {/* 8 - Tipo de via */}
              <div className='space-y-1'>
                <span className='text-xs text-slate-700'>
                  Tipo de via <span className='text-red-500'>*</span>
                </span>
                <div className='flex items-center gap-4 text-xs text-slate-700'>
                  <label className='inline-flex items-center'>
                    <input
                      id='campo-tipo-via-rua'
                      type='checkbox'
                      className='h-3.5 w-3.5 border-border-soft text-primary'
                      checked={model.TipoViaRua}
                      onChange={(e) =>
                        updateModel('TipoViaRua', e.target.checked)
                      }
                      onFocus={() => handleFieldFocus(8)}
                      onKeyDown={(e) => handleKeyDown(e, 8)}
                    />
                    <span className='ml-1'>Rua</span>
                  </label>

                  <label className='inline-flex items-center'>
                    <input
                      id='campo-tipo-via-av'
                      type='checkbox'
                      className='h-3.5 w-3.5 border-border-soft text-primary'
                      checked={model.TipoViaAvenida}
                      onChange={(e) =>
                        updateModel('TipoViaAvenida', e.target.checked)
                      }
                      onFocus={() => handleFieldFocus(8)}
                      onKeyDown={(e) => handleKeyDown(e, 8)}
                    />
                    <span className='ml-1'>Avenida</span>
                  </label>

                  <label className='inline-flex items-center'>
                    <input
                      id='campo-tipo-via-log'
                      type='checkbox'
                      className='h-3.5 w-3.5 border-border-soft text-primary'
                      checked={model.TipoViaLogradouro}
                      onChange={(e) =>
                        updateModel('TipoViaLogradouro', e.target.checked)
                      }
                      onFocus={() => handleFieldFocus(8)}
                      onKeyDown={(e) => handleKeyDown(e, 8)}
                    />
                    <span className='ml-1'>Logradouro</span>
                  </label>
                </div>
              </div>

              {/* 9 - Descrição da via */}
              <div className='space-y-1'>
                <label
                  className='text-xs text-slate-700'
                  htmlFor='campo-desc-via'
                >
                  Nome da rua/avenida/logradouro
                </label>
                <input
                  id='campo-desc-via'
                  autoComplete='off'
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='Ex.: Rua das Flores, Av. Paulista...'
                  value={model.DescricaoVia}
                  onChange={(e) => updateModel('DescricaoVia', e.target.value)}
                  onFocus={() => handleFieldFocus(9)}
                  onKeyDown={(e) => handleKeyDown(e, 9)}
                />
              </div>

              <div className='pt-2'>
                <button
                  type='submit'
                  className='inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-md bg-primary text-white hover:opacity-90'
                >
                  Validar / Enviar
                </button>
              </div>

              {mensagemSucesso && (
                <div className='mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2'>
                  {mensagemSucesso}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// helper simples equivalente ao keyboardForm.focusById
function focusById(id: string, center: boolean) {
  const el = document.getElementById(id)
  if (!el) return
  try {
    ;(el as any).focus({ preventScroll: true })
  } catch {
    ;(el as HTMLElement).focus()
  }
  const container = el.closest('.kb-scroll-container') as HTMLElement | null
  if (!container) return

  const padding = 16
  const cRect = container.getBoundingClientRect()
  const eRect = el.getBoundingClientRect()

  if (center) {
    const target = eRect.top - cRect.top - (cRect.height / 2 - eRect.height / 2)
    container.scrollTop += target
  } else {
    if (eRect.top < cRect.top + padding) {
      container.scrollTop += eRect.top - (cRect.top + padding)
    } else if (eRect.bottom > cRect.bottom - padding) {
      container.scrollTop += eRect.bottom - (cRect.bottom - padding)
    }
  }
}
