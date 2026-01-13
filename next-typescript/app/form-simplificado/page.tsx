'use client'

import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { MUNICIPIOS_POR_UF } from '@/lib/utils' // ajuste o import conforme seu projeto

// ---------- Modelo e índices de campos ----------

enum FieldIndex {
  Nome = 0,
  Cpf = 1,
  Email = 2,
  Telefone = 3,
  Logradouro = 4,
  TipoEndereco = 5,
  Uf = 6,
  Cidade = 7,
  TipoVia = 8,
  DescricaoVia = 9,
}

interface FormSimplificadoModel {
  Nome: string
  Cpf: string
  Email: string
  Telefone: string
  Logradouro: string
  TipoEndereco: '' | 'Comercial' | 'Empresarial'
  Uf: string
  Cidade: string
  TipoViaRua: boolean
  TipoViaAvenida: boolean
  TipoViaLogradouro: boolean
  TipoViaDummy: boolean // usado para validação
  DescricaoVia: string
}

const INITIAL_MODEL: FormSimplificadoModel = {
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

const TOTAL_FIELDS = 10
const PAGE_SIZE = 8

const UFS = [
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

// ---------- Helpers de foco ----------

type FieldRef = HTMLInputElement | HTMLTextAreaElement | null

function focusAndScrollIntoView(el: FieldRef, center = false) {
  if (!el) return
  el.focus()
  const block: ScrollLogicalPosition = center ? 'center' : 'nearest'
  el.scrollIntoView({ behavior: 'smooth', block })
}

// ---------- Página ----------

export default function FormSimplificadoPage() {
  const [model, setModel] = useState<FormSimplificadoModel>(INITIAL_MODEL)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)

  const [tipoEnderecoFocusIndex, setTipoEnderecoFocusIndex] = useState(0)
  const [tipoViaFocusIndex, setTipoViaFocusIndex] = useState(0)

  const [ufDropdownOpen, setUfDropdownOpen] = useState(false)
  const [ufFocusedIndex, setUfFocusedIndex] = useState<number | null>(null)
  const [cidadeDropdownOpen, setCidadeDropdownOpen] = useState(false)
  const [cidadeFocusedIndex, setCidadeFocusedIndex] = useState<number | null>(
    null
  )
  const [cidadesBaseAtual, setCidadesBaseAtual] = useState<string[]>([])

  // refs dos campos, indexados pelo FieldIndex
  const fieldRefs = useRef<FieldRef[]>([])

  const hasTipoViaSelecionado =
    model.TipoViaRua || model.TipoViaAvenida || model.TipoViaLogradouro

  // ---------- UF / Cidade filtrados ----------

  const ufsFiltradas = useMemo(() => {
    if (!model.Uf.trim()) return UFS
    return UFS.filter((uf) =>
      uf.toLowerCase().includes(model.Uf.toLowerCase())
    )
  }, [model.Uf])

  const cidadesFiltradas = useMemo(() => {
    if (!cidadesBaseAtual.length) return []
    if (!model.Cidade.trim()) return cidadesBaseAtual
    return cidadesBaseAtual.filter((c) =>
      c.toLowerCase().includes(model.Cidade.toLowerCase())
    )
  }, [cidadesBaseAtual, model.Cidade])

  // ---------- Lifecycle ----------

  useEffect(() => {
    const first = fieldRefs.current[FieldIndex.Nome]
    focusAndScrollIntoView(first, true)
  }, [])

  // ---------- Focus / ordem obrigatória ----------

  const getFirstInvalidRequiredField = (): FieldIndex | null => {
    if (!model.Nome.trim()) return FieldIndex.Nome
    if (!model.Cpf.trim()) return FieldIndex.Cpf
    if (!model.Email.trim()) return FieldIndex.Email
    if (!hasTipoViaSelecionado) return FieldIndex.TipoVia
    return null
  }

  const handleFieldFocus = (index: FieldIndex) => {
    const firstInvalid = getFirstInvalidRequiredField()
    if (firstInvalid !== null && firstInvalid < index) {
      setGlobalError(
        'Preencha os campos obrigatórios na ordem antes de avançar.'
      )
      const el = fieldRefs.current[firstInvalid]
      focusAndScrollIntoView(el, true)
    } else {
      if (globalError) setGlobalError(null)
    }
  }

  // ---------- Atualização de campos ----------

  const notifyTipoViaDummy = (next: FormSimplificadoModel) => {
    next.TipoViaDummy =
      next.TipoViaRua || next.TipoViaAvenida || next.TipoViaLogradouro
  }

  const handleFieldChanged = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: FieldIndex
  ) => {
    const value = e.target.value ?? ''

    setModel((prev) => {
      const next: FormSimplificadoModel = { ...prev }

      switch (index) {
        case FieldIndex.Nome:
          next.Nome = value
          break
        case FieldIndex.Cpf:
          next.Cpf = value
          break
        case FieldIndex.Email:
          next.Email = value
          break
        case FieldIndex.Telefone:
          next.Telefone = value
          break
        case FieldIndex.Logradouro:
          next.Logradouro = value
          break
        case FieldIndex.Uf:
          next.Uf = value.toUpperCase()
          // atualizar cidades base
          {
            const lista =
              MUNICIPIOS_POR_UF[next.Uf as keyof typeof MUNICIPIOS_POR_UF] ??
              []
            const arr = Array.isArray(lista) ? (lista as string[]) : []
            setCidadesBaseAtual(arr)
          }
          next.Cidade = ''
          setUfDropdownOpen(ufsFiltradas.length > 0)
          setUfFocusedIndex(ufsFiltradas.length ? 0 : null)
          setCidadeDropdownOpen(false)
          setCidadeFocusedIndex(null)
          break
        case FieldIndex.Cidade:
          next.Cidade = value
          setCidadeDropdownOpen(cidadesFiltradas.length > 0)
          setCidadeFocusedIndex(cidadesFiltradas.length ? 0 : null)
          break
        case FieldIndex.DescricaoVia:
          next.DescricaoVia = value
          break
        default:
          break
      }

      if (index === FieldIndex.TipoVia) {
        notifyTipoViaDummy(next)
      }

      return next
    })

    if (globalError) setGlobalError(null)
  }

  const toggleTipoVia = (checkboxIndex: 0 | 1 | 2) => {
    setModel((prev) => {
      const next = { ...prev }
      if (checkboxIndex === 0) next.TipoViaRua = !next.TipoViaRua
      if (checkboxIndex === 1) next.TipoViaAvenida = !next.TipoViaAvenida
      if (checkboxIndex === 2) next.TipoViaLogradouro = !next.TipoViaLogradouro
      notifyTipoViaDummy(next)
      return next
    })
    setGlobalError(null)
  }

  // ---------- UF / Cidade: seleção / toggle ----------

  const selectUf = (uf: string) => {
    if (!uf.trim()) return
    setModel((prev) => ({
      ...prev,
      Uf: uf.toUpperCase(),
      Cidade: '',
    }))
    const lista =
      MUNICIPIOS_POR_UF[uf as keyof typeof MUNICIPIOS_POR_UF] ?? []
    const arr = Array.isArray(lista) ? (lista as string[]) : []
    setCidadesBaseAtual(arr)
    setUfDropdownOpen(false)
    setUfFocusedIndex(null)
    setCidadeDropdownOpen(false)
    setCidadeFocusedIndex(null)
  }

  const selectCidade = (cidade: string) => {
    if (!cidade.trim()) return
    setModel((prev) => ({ ...prev, Cidade: cidade }))
    setCidadeDropdownOpen(false)
    setCidadeFocusedIndex(null)
  }

  const toggleUfDropdown = () => {
    if (!ufsFiltradas.length) return
    setUfDropdownOpen((open) => {
      const next = !open
      setUfFocusedIndex(next ? 0 : null)
      return next
    })
  }

  const toggleCidadeDropdown = () => {
    if (!cidadesFiltradas.length) return
    setCidadeDropdownOpen((open) => {
      const next = !open
      setCidadeFocusedIndex(next ? 0 : null)
      return next
    })
  }

  // ---------- Validação de saída ----------

  const canLeaveField = (index: FieldIndex): boolean => {
    setGlobalError(null)

    switch (index) {
      case FieldIndex.Nome:
        if (!model.Nome.trim()) {
          setGlobalError('Preencha o nome antes de continuar.')
          return false
        }
        break
      case FieldIndex.Cpf:
        if (!model.Cpf.trim()) {
          setGlobalError('Preencha o CPF antes de continuar.')
          return false
        }
        break
      case FieldIndex.Email:
        if (!model.Email.trim()) {
          setGlobalError('Preencha o e-mail antes de continuar.')
          return false
        }
        break
      case FieldIndex.TipoVia:
        if (!hasTipoViaSelecionado) {
          setGlobalError(
            'Selecione Rua, Avenida ou Logradouro antes de continuar.'
          )
          return false
        }
        break
      default:
        break
    }

    return true
  }

  // ---------- Navegação via teclado ----------

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: FieldIndex
  ) => {
    // Enter nunca deve submeter o form
    if (e.key === 'Enter') {
      e.preventDefault()
    }

    // Tipo de endereço (radios)
    if (index === FieldIndex.TipoEndereco) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const nextIdx = tipoEnderecoFocusIndex === 0 ? 1 : 0
        setTipoEnderecoFocusIndex(nextIdx)
        setModel((prev) => ({
          ...prev,
          TipoEndereco: nextIdx === 1 ? 'Empresarial' : 'Comercial',
        }))
        const el = fieldRefs.current[FieldIndex.TipoEndereco]
        focusAndScrollIntoView(el)
        return
      }

      if (e.key === ' ') {
        e.preventDefault()
        setModel((prev) => ({
          ...prev,
          TipoEndereco:
            tipoEnderecoFocusIndex === 1 ? 'Empresarial' : 'Comercial',
        }))
        return
      }
    }

    // Tipo de via (checkboxes)
    if (index === FieldIndex.TipoVia) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const total = 3
        const forward = e.key === 'ArrowRight'
        const nextIdx = forward
          ? (tipoViaFocusIndex + 1) % total
          : (tipoViaFocusIndex - 1 + total) % total
        setTipoViaFocusIndex(nextIdx)
        const el = fieldRefs.current[FieldIndex.TipoVia]
        focusAndScrollIntoView(el)
        return
      }

      if (e.key === ' ') {
        e.preventDefault()
        toggleTipoVia(tipoViaFocusIndex as 0 | 1 | 2)
        return
      }
    }

    // Dropdowns UF / Cidade
    if (index === FieldIndex.Uf || index === FieldIndex.Cidade) {
      const isUf = index === FieldIndex.Uf
      const isOpen = isUf ? ufDropdownOpen : cidadeDropdownOpen
      const focusedIndex = isUf ? ufFocusedIndex : cidadeFocusedIndex
      const options = isUf ? ufsFiltradas : cidadesFiltradas
      const optionsCount = options.length

      // abrir com F4 ou Space
      if ((e.key === 'F4' || e.key === ' ') && !isOpen) {
        e.preventDefault()
        if (!optionsCount) return
        if (isUf) {
          setUfDropdownOpen(true)
          setUfFocusedIndex(0)
        } else {
          setCidadeDropdownOpen(true)
          setCidadeFocusedIndex(0)
        }
        return
      }

      if (isOpen && optionsCount > 0) {
        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight'
        ) {
          e.preventDefault()
          const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight'
          let idx = focusedIndex ?? -1
          idx = forward
            ? (idx + 1 + optionsCount) % optionsCount
            : (idx - 1 + optionsCount) % optionsCount

          if (isUf) setUfFocusedIndex(idx)
          else setCidadeFocusedIndex(idx)

          return
        }

        // espaço: seleciona mas não sai
        if (e.key === ' ') {
          e.preventDefault()
          if (focusedIndex != null) {
            const valor = options[focusedIndex]
            if (isUf) selectUf(valor)
            else selectCidade(valor)
          }
          return
        }

        // Enter: seleciona e vai para próximo campo
        if (e.key === 'Enter') {
          e.preventDefault()
          if (focusedIndex != null) {
            const valor = options[focusedIndex]
            if (isUf) selectUf(valor)
            else selectCidade(valor)
          }

          if (!canLeaveField(index)) return

          const nextIdx = Math.min(TOTAL_FIELDS - 1, index + 1)
          const el = fieldRefs.current[nextIdx]
          focusAndScrollIntoView(el, nextIdx === FieldIndex.Uf || nextIdx === FieldIndex.Cidade)
          return
        }

        // Esc: fecha
        if (e.key === 'Escape') {
          e.preventDefault()
          if (isUf) {
            setUfDropdownOpen(false)
            setUfFocusedIndex(null)
          } else {
            setCidadeDropdownOpen(false)
            setCidadeFocusedIndex(null)
          }
          return
        }
      } else {
        // dropdown fechado: ignora setas laterais
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault()
          return
        }
      }
    }

    // Atalhos globais
    if (e.ctrlKey && e.key === 'Home') {
      e.preventDefault()
      setGlobalError(null)
      const el = fieldRefs.current[FieldIndex.Nome]
      focusAndScrollIntoView(el, true)
      return
    }

    if (e.ctrlKey && e.key === 'End') {
      e.preventDefault()
      setGlobalError(null)
      const lastIdx = TOTAL_FIELDS - 1
      const el = fieldRefs.current[lastIdx]
      focusAndScrollIntoView(el, true)
      return
    }

    if (e.key === 'PageDown') {
      e.preventDefault()
      const target = Math.min(TOTAL_FIELDS - 1, index + PAGE_SIZE)
      const firstInvalid = getFirstInvalidRequiredField()
      if (firstInvalid !== null && firstInvalid < target) {
        setGlobalError(
          'Preencha os campos obrigatórios na ordem antes de avançar.'
        )
        const el = fieldRefs.current[firstInvalid]
        focusAndScrollIntoView(el, true)
      } else {
        setGlobalError(null)
        const el = fieldRefs.current[target]
        focusAndScrollIntoView(el, true)
      }
      return
    }

    if (e.key === 'PageUp') {
      e.preventDefault()
      const target = Math.max(0, index - PAGE_SIZE)
      setGlobalError(null)
      const el = fieldRefs.current[target]
      focusAndScrollIntoView(el, true)
      return
    }

    // Navegação vertical padrão
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault()
      if (!canLeaveField(index)) return
      const nextIdx = Math.min(TOTAL_FIELDS - 1, index + 1)
      const el = fieldRefs.current[nextIdx]
      const center = nextIdx === FieldIndex.Uf || nextIdx === FieldIndex.Cidade
      focusAndScrollIntoView(el, center)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevIdx = Math.max(0, index - 1)
      const el = fieldRefs.current[prevIdx]
      const center = prevIdx === FieldIndex.Uf || prevIdx === FieldIndex.Cidade
      focusAndScrollIntoView(el, center)
    }
  }

  // ---------- Submit ----------

  const handleClickSubmit = () => {
    setMensagemSucesso(null)
    setGlobalError(null)

    const firstInvalid = getFirstInvalidRequiredField()
    if (firstInvalid !== null) {
      setGlobalError('Preencha os campos obrigatórios antes de enviar.')
      const el = fieldRefs.current[firstInvalid]
      focusAndScrollIntoView(el, true)
      return
    }

    setMensagemSucesso(
      'Formulário válido. Navegação somente com teclado em Next.js.'
    )
  }

  // ---------- Render ----------

  const labelCss = 'text-xs text-slate-700'
  const inputCss =
    'h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
  const inputCssWithButton =
    'h-9 w-full rounded-md border border-border-soft px-3 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
  const validationCss = 'text-[10px] text-red-500 mt-0.5'
  const checkboxRadioCss = 'h-3.5 w-3.5 border-border-soft text-primary'
  const comboButtonCss =
    'absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400'
  const dropdownCss =
    'absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border-soft bg-white shadow-md text-xs'
  const dropdownItemCss = 'px-2 py-1 cursor-pointer hover:bg-slate-100'
  const dropdownItemFocusedCss = 'px-2 py-1 cursor-pointer bg-primary text-white'
  const textAreaCss =
    'h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-slate-100 disabled:text-slate-400'

  const getDropdownItemClass = (focused: boolean) =>
    focused ? dropdownItemFocusedCss : dropdownItemCss

  return (
    <div className='min-h-[calc(80vh-96px)] flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-xl'>
        <div className='text-[11px] text-slate-500 mb-1.5'>
          <span className='text-primary font-medium'>
            Formulário Simplificado
          </span>
        </div>

        <div className='border border-border-soft shadow-sm bg-header/95 backdrop-blur rounded-xl'>
          <div className='px-4 pt-4 pb-2 border-b border-border-soft'>
            <h1 className='text-base font-semibold tracking-tight text-slate-900 text-center'>
              Preenchimento somente no teclado
            </h1>
            <p className='text-[11px] text-slate-500 text-center mt-1'>
              Use as setas, Enter, Ctrl+Home / Ctrl+End, PageUp / PageDown. Não
              é permitido pular campos obrigatórios.
            </p>
          </div>

          <form
            autoComplete='off'
            onSubmit={(e) => {
              e.preventDefault()
              handleClickSubmit()
            }}
          >
            <div className='px-4 pt-3 pb-3 space-y-3'>
              {globalError && (
                <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700'>
                  {globalError}
                </div>
              )}

              {/* BLOCO 1 - Dados básicos */}
              <div className='text-[11px] font-semibold text-slate-600 mt-1'>
                Dados básicos
              </div>

              {/* Nome */}
              <div className='space-y-1'>
                <label className={labelCss} htmlFor='campo-nome'>
                  Nome completo <span className='text-red-500'>*</span>
                </label>
                <input
                  id='campo-nome'
                  ref={(el) => {
                    fieldRefs.current[FieldIndex.Nome] = el
                  }}
                  className={inputCss}
                  placeholder='Informe o nome'
                  value={model.Nome}
                  onChange={(e) => handleFieldChanged(e, FieldIndex.Nome)}
                  onFocus={() => handleFieldFocus(FieldIndex.Nome)}
                  onKeyDown={(e) => handleKeyDown(e, FieldIndex.Nome)}
                />
                {/* Mensagem de validação visual (se quiser manter, pode ligar a uma lib externa) */}
                {!model.Nome.trim() && (
                  <p className={validationCss}>Campo obrigatório.</p>
                )}
              </div>

              {/* CPF */}
              <div className='space-y-1'>
                <label className={labelCss} htmlFor='campo-cpf'>
                  CPF <span className='text-red-500'>*</span>
                </label>
                <input
                  id='campo-cpf'
                  ref={(el) => {
                    fieldRefs.current[FieldIndex.Cpf] = el
                  }}
                  className={inputCss}
                  placeholder='999.999.999-99'
                  value={model.Cpf}
                  onChange={(e) => handleFieldChanged(e, FieldIndex.Cpf)}
                  onFocus={() => handleFieldFocus(FieldIndex.Cpf)}
                  onKeyDown={(e) => handleKeyDown(e, FieldIndex.Cpf)}
                />
                {!model.Cpf.trim() && (
                  <p className={validationCss}>Campo obrigatório.</p>
                )}
              </div>

              {/* Email */}
              <div className='space-y-1'>
                <label className={labelCss} htmlFor='campo-email'>
                  E-mail <span className='text-red-500'>*</span>
                </label>
                <input
                  id='campo-email'
                  ref={(el) => {
                    fieldRefs.current[FieldIndex.Email] = el
                  }}
                  className={inputCss}
                  placeholder='email@dominio.com'
                  value={model.Email}
                  onChange={(e) => handleFieldChanged(e, FieldIndex.Email)}
                  onFocus={() => handleFieldFocus(FieldIndex.Email)}
                  onKeyDown={(e) => handleKeyDown(e, FieldIndex.Email)}
                />
                {!model.Email.trim() && (
                  <p className={validationCss}>Campo obrigatório.</p>
                )}
              </div>

              {/* Telefone */}
              <div className='space-y-1'>
                <label className={labelCss} htmlFor='campo-telefone'>
                  Telefone (opcional)
                </label>
                <input
                  id='campo-telefone'
                  ref={(el) => {
                    fieldRefs.current[FieldIndex.Telefone] = el
                  }}
                  className={inputCss}
                  placeholder='(00) 00000-0000'
                  value={model.Telefone}
                  onChange={(e) => handleFieldChanged(e, FieldIndex.Telefone)}
                  onFocus={() => handleFieldFocus(FieldIndex.Telefone)}
                  onKeyDown={(e) => handleKeyDown(e, FieldIndex.Telefone)}
                />
              </div>

              {/* BLOCO 2 - Endereço */}
              <div className='text-[11px] font-semibold text-slate-600 mt-3'>
                Endereço
              </div>

              {/* Logradouro */}
              <div className='space-y-1'>
                <label className={labelCss} htmlFor='campo-logradouro'>
                  Logradouro
                </label>
                <input
                  id='campo-logradouro'
                  ref={(el) => {
                    fieldRefs.current[FieldIndex.Logradouro] = el
                  }}
                  className={inputCss}
                  placeholder='Rua, avenida...'
                  value={model.Logradouro}
                  onChange={(e) =>
                    handleFieldChanged(e, FieldIndex.Logradouro)
                  }
                  onFocus={() => handleFieldFocus(FieldIndex.Logradouro)}
                  onKeyDown={(e) => handleKeyDown(e, FieldIndex.Logradouro)}
                />
              </div>

              {/* Tipo de endereço */}
              <div className='space-y-1'>
                <span className={labelCss}>Tipo de endereço</span>
                <div className='flex items-center gap-4'>
                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      type='radio'
                      name='tipo-endereco'
                      value='Comercial'
                      ref={(el) => {
                        fieldRefs.current[FieldIndex.TipoEndereco] = el
                      }}
                      checked={model.TipoEndereco === 'Comercial'}
                      onChange={() =>
                        setModel((prev) => ({
                          ...prev,
                          TipoEndereco: 'Comercial',
                        }))
                      }
                      onFocus={() => {
                        setTipoEnderecoFocusIndex(0)
                        handleFieldFocus(FieldIndex.TipoEndereco)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, FieldIndex.TipoEndereco)}
                      className={checkboxRadioCss}
                    />
                    <span className='ml-1'>Comercial</span>
                  </label>

                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      type='radio'
                      name='tipo-endereco'
                      value='Empresarial'
                      checked={model.TipoEndereco === 'Empresarial'}
                      onChange={() =>
                        setModel((prev) => ({
                          ...prev,
                          TipoEndereco: 'Empresarial',
                        }))
                      }
                      onFocus={() => {
                        setTipoEnderecoFocusIndex(1)
                        handleFieldFocus(FieldIndex.TipoEndereco)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, FieldIndex.TipoEndereco)}
                      className={checkboxRadioCss}
                    />
                    <span className='ml-1'>Empresarial</span>
                  </label>
                </div>
              </div>

              {/* UF */}
              <div className='space-y-1'>
                <label className={labelCss} htmlFor='campo-uf'>
                  UF
                </label>
                <div className='relative'>
                  <input
                    id='campo-uf'
                    ref={(el) => {
                      fieldRefs.current[FieldIndex.Uf] = el
                    }}
                    className={inputCssWithButton}
                    placeholder='UF'
                    autoComplete='off'
                    value={model.Uf}
                    onChange={(e) => handleFieldChanged(e, FieldIndex.Uf)}
                    onFocus={() => handleFieldFocus(FieldIndex.Uf)}
                    onKeyDown={(e) => handleKeyDown(e, FieldIndex.Uf)}
                  />

                  <button
                    type='button'
                    tabIndex={-1}
                    className={comboButtonCss}
                    onClick={toggleUfDropdown}
                  >
                    ▼
                  </button>

                  {ufDropdownOpen && (
                    <div className={dropdownCss}>
                      {ufsFiltradas.map((uf, i) => {
                        const focused = ufFocusedIndex === i
                        return (
                          <div
                            key={uf}
                            className={getDropdownItemClass(focused)}
                            onClick={() => selectUf(uf)}
                          >
                            {uf}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Cidade */}
              <div className='space-y-1'>
                <label className={labelCss} htmlFor='campo-cidade'>
                  Cidade
                </label>
                <div className='relative'>
                  <input
                    id='campo-cidade'
                    ref={(el) => {
                      fieldRefs.current[FieldIndex.Cidade] = el
                    }}
                    className={inputCssWithButton}
                    placeholder='Cidade'
                    autoComplete='off'
                    value={model.Cidade}
                    onChange={(e) => handleFieldChanged(e, FieldIndex.Cidade)}
                    onFocus={() => handleFieldFocus(FieldIndex.Cidade)}
                    onKeyDown={(e) => handleKeyDown(e, FieldIndex.Cidade)}
                  />

                  <button
                    type='button'
                    tabIndex={-1}
                    className={comboButtonCss}
                    onClick={toggleCidadeDropdown}
                  >
                    ▼
                  </button>

                  {cidadeDropdownOpen && (
                    <div className={dropdownCss}>
                      {cidadesFiltradas.map((cidade, i) => {
                        const focused = cidadeFocusedIndex === i
                        return (
                          <div
                            key={`${cidade}-${i}`}
                            className={getDropdownItemClass(focused)}
                            onClick={() => selectCidade(cidade)}
                          >
                            {cidade}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Tipo de via */}
              <div className='space-y-1'>
                <span className={labelCss}>
                  Tipo de via <span className='text-red-500'>*</span>
                </span>
                <div className='flex items-center gap-4'>
                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      type='checkbox'
                      ref={(el) => {
                        fieldRefs.current[FieldIndex.TipoVia] = el
                      }}
                      checked={model.TipoViaRua}
                      onChange={() => toggleTipoVia(0)}
                      onFocus={() => {
                        setTipoViaFocusIndex(0)
                        handleFieldFocus(FieldIndex.TipoVia)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, FieldIndex.TipoVia)}
                      className={checkboxRadioCss}
                    />
                    <span className='ml-1'>Rua</span>
                  </label>

                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      type='checkbox'
                      checked={model.TipoViaAvenida}
                      onChange={() => toggleTipoVia(1)}
                      onFocus={() => {
                        setTipoViaFocusIndex(1)
                        handleFieldFocus(FieldIndex.TipoVia)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, FieldIndex.TipoVia)}
                      className={checkboxRadioCss}
                    />
                    <span className='ml-1'>Avenida</span>
                  </label>

                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      type='checkbox'
                      checked={model.TipoViaLogradouro}
                      onChange={() => toggleTipoVia(2)}
                      onFocus={() => {
                        setTipoViaFocusIndex(2)
                        handleFieldFocus(FieldIndex.TipoVia)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, FieldIndex.TipoVia)}
                      className={checkboxRadioCss}
                    />
                    <span className='ml-1'>Logradouro</span>
                  </label>
                </div>
                {!hasTipoViaSelecionado && (
                  <p className={validationCss}>
                    Selecione pelo menos um tipo de via.
                  </p>
                )}
              </div>

              {/* Descrição da via */}
              <div className='space-y-1'>
                <label className={labelCss} htmlFor='campo-desc-via'>
                  Nome da rua/avenida/logradouro
                </label>
                <textarea
                  id='campo-desc-via'
                  ref={(el) => {
                    fieldRefs.current[FieldIndex.DescricaoVia] = el
                  }}
                  className={textAreaCss}
                  placeholder='Ex.: Rua das Flores, Av. Paulista...'
                  value={model.DescricaoVia}
                  disabled={!hasTipoViaSelecionado}
                  onChange={(e) =>
                    handleFieldChanged(e, FieldIndex.DescricaoVia)
                  }
                  onFocus={() => handleFieldFocus(FieldIndex.DescricaoVia)}
                  onKeyDown={(e) => handleKeyDown(e, FieldIndex.DescricaoVia)}
                />
              </div>

              {/* Botão de envio */}
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
