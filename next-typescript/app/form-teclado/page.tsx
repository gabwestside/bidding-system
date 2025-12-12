'use client'

import { obterMunicipiosPorUf } from '@/lib/service'
import React, {
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

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

// agora 0..22 (23 campos)
const TOTAL_FIELDS = 23
const PAGE_SIZE = 8

export default function FormTecladoPage() {
  // --------- refs (0..22) ---------
  const nomeRef = useRef<HTMLInputElement | null>(null) // 0
  const cpfRef = useRef<HTMLInputElement | null>(null) // 1
  const emailRef = useRef<HTMLInputElement | null>(null) // 2
  const telefoneRef = useRef<HTMLInputElement | null>(null) // 3

  const logradouroRef = useRef<HTMLInputElement | null>(null) // 4

  // rádio tipo endereço (grupo index 5)
  const tipoEndComRef = useRef<HTMLInputElement | null>(null)
  const tipoEndEmpRef = useRef<HTMLInputElement | null>(null)

  // UF / Cidade
  const ufRef = useRef<HTMLInputElement | null>(null) // 6
  const cidadeRef = useRef<HTMLInputElement | null>(null) // 7

  // grupo checkboxes tipo de via (index 8)
  const tipoViaRuaRef = useRef<HTMLInputElement | null>(null)
  const tipoViaAvenidaRef = useRef<HTMLInputElement | null>(null)
  const tipoViaLogradouroRef = useRef<HTMLInputElement | null>(null)

  const descricaoViaRef = useRef<HTMLInputElement | null>(null) // 9

  const bairroRef = useRef<HTMLInputElement | null>(null) // 10
  const numeroRef = useRef<HTMLInputElement | null>(null) // 11

  const cepRef = useRef<HTMLInputElement | null>(null) // 12
  const complementoRef = useRef<HTMLInputElement | null>(null) // 13

  const empresaRef = useRef<HTMLInputElement | null>(null) // 14
  const cargoRef = useRef<HTMLInputElement | null>(null) // 15
  const departamentoRef = useRef<HTMLInputElement | null>(null) // 16

  const celularRef = useRef<HTMLInputElement | null>(null) // 17
  const whatsapp2Ref = useRef<HTMLInputElement | null>(null) // 18
  const email2Ref = useRef<HTMLInputElement | null>(null) // 19

  const obs1Ref = useRef<HTMLInputElement | null>(null) // 20
  const obs2Ref = useRef<HTMLInputElement | null>(null) // 21
  const obs3Ref = useRef<HTMLInputElement | null>(null) // 22

  const fieldRefs: React.RefObject<HTMLElement | null>[] = [
    nomeRef, // 0
    cpfRef, // 1
    emailRef, // 2
    telefoneRef, // 3
    logradouroRef, // 4
    tipoEndComRef, // 5 (grupo rádio)
    ufRef, // 6
    cidadeRef, // 7
    tipoViaRuaRef, // 8 (grupo – entra pelo primeiro checkbox)
    descricaoViaRef, // 9
    bairroRef, // 10
    numeroRef, // 11
    cepRef, // 12
    complementoRef, // 13
    empresaRef, // 14
    cargoRef, // 15
    departamentoRef, // 16
    celularRef, // 17
    whatsapp2Ref, // 18
    email2Ref, // 19
    obs1Ref, // 20
    obs2Ref, // 21
    obs3Ref, // 22
  ]

  // container rolável do formulário
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  // --------- valores dos campos ---------
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  const [logradouro, setLogradouro] = useState('')
  const [tipoEndereco, setTipoEndereco] = useState('') // Comercial / Empresarial

  const [uf, setUf] = useState('')
  const [cidade, setCidade] = useState('')

  // tipo de via (checkboxes + descrição)
  const [tipoViaRua, setTipoViaRua] = useState(false)
  const [tipoViaAvenida, setTipoViaAvenida] = useState(false)
  const [tipoViaLogradouro, setTipoViaLogradouro] = useState(false)
  const [tipoViaFocusIndex, setTipoViaFocusIndex] = useState(0) // 0=Rua,1=Avenida,2=Logradouro
  const [descricaoVia, setDescricaoVia] = useState('')

  const [bairro, setBairro] = useState('')
  const [numero, setNumero] = useState('')

  const [cep, setCep] = useState('')
  const [complemento, setComplemento] = useState('')

  const [empresa, setEmpresa] = useState('')
  const [cargo, setCargo] = useState('')
  const [departamento, setDepartamento] = useState('')

  const [celular, setCelular] = useState('')
  const [whatsappComercial, setWhatsappComercial] = useState('')
  const [emailAlternativo, setEmailAlternativo] = useState('')

  const [obs1, setObs1] = useState('')
  const [obs2, setObs2] = useState('')
  const [obs3, setObs3] = useState('')

  // rádio: qual está focado (0 = Comercial, 1 = Empresarial)
  const [tipoEnderecoFocusIndex, setTipoEnderecoFocusIndex] = useState(0)

  // --------- estados de erro ---------
  const [nomeError, setNomeError] = useState<string | null>(null)
  const [cpfError, setCpfError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [empresaError, setEmpresaError] = useState<string | null>(null)
  const [tipoViaError, setTipoViaError] = useState<string | null>(null)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const hasTipoViaSelecionado =
    tipoViaRua || tipoViaAvenida || tipoViaLogradouro

  // --------- dropdowns: UF e Cidade ---------
  const [ufDropdownOpen, setUfDropdownOpen] = useState(false)
  const [ufFocusedIndex, setUfFocusedIndex] = useState<number | null>(null)

  const [cidadeDropdownOpen, setCidadeDropdownOpen] = useState(false)
  const [cidadeFocusedIndex, setCidadeFocusedIndex] = useState<number | null>(
    null
  )

  // texto de UF normalizado para consulta de municípios
  const ufFiltro = useMemo(() => uf.trim().toUpperCase(), [uf])

  // base de cidades para o UF atual
  const cidadesBase = useMemo(
    () => (ufFiltro ? obterMunicipiosPorUf(ufFiltro) : []),
    [ufFiltro]
  )

  // listas filtradas pela digitação
  const ufsFiltradas = useMemo(() => {
    const texto = uf.trim()
    if (!texto) return UFS
    return UFS.filter((sigla) =>
      sigla.toLowerCase().includes(texto.toLowerCase())
    )
  }, [uf])

  const cidadesFiltradas = useMemo(() => {
    const texto = cidade.trim()
    if (!texto) return cidadesBase
    return cidadesBase.filter((c) =>
      c.toLowerCase().includes(texto.toLowerCase())
    )
  }, [cidade, cidadesBase])

  // --------- helpers de navegação geral ---------
  const focusField = (index: number) => {
    if (index < 0 || index >= TOTAL_FIELDS) return

    const ref = fieldRefs[index]
    const element = ref?.current as HTMLElement | null
    if (!element) return

    element.focus()

    const container = scrollContainerRef.current
    if (!container) return

    const padding = 16 // px

    const containerRect = container.getBoundingClientRect()
    const elRect = element.getBoundingClientRect()

    if (elRect.top < containerRect.top + padding) {
      container.scrollTop += elRect.top - (containerRect.top + padding)
    } else if (elRect.bottom > containerRect.bottom - padding) {
      container.scrollTop += elRect.bottom - (containerRect.bottom - padding)
    }
  }

  const getFirstInvalidRequiredIndex = (): number | null => {
    if (!nome.trim()) return 0
    if (!cpf.trim()) return 1
    if (!email.trim()) return 2
    if (!hasTipoViaSelecionado) return 8
    if (!empresa.trim()) return 14
    return null
  }

  const canLeaveField = (index: number): boolean => {
    setGlobalError(null)

    switch (index) {
      case 0:
        if (!nome.trim()) {
          setNomeError('Campo obrigatório.')
          setGlobalError('Preencha o nome antes de continuar.')
          return false
        }
        break
      case 1:
        if (!cpf.trim()) {
          setCpfError('Campo obrigatório.')
          setGlobalError('Preencha o CPF antes de continuar.')
          return false
        }
        break
      case 2:
        if (!email.trim()) {
          setEmailError('Campo obrigatório.')
          setGlobalError('Preencha o e-mail antes de continuar.')
          return false
        }
        break
      case 8:
        if (!hasTipoViaSelecionado) {
          setTipoViaError('Selecione pelo menos um tipo de via.')
          setGlobalError(
            'Selecione Rua, Avenida ou Logradouro antes de continuar.'
          )
          return false
        }
        break
      case 14:
        if (!empresa.trim()) {
          setEmpresaError('Campo obrigatório.')
          setGlobalError('Preencha a empresa antes de continuar.')
          return false
        }
        break
    }

    return true
  }

  const handleFocus = (index: number) => {
    const firstInvalid = getFirstInvalidRequiredIndex()
    if (firstInvalid != null && firstInvalid < index) {
      setGlobalError(
        'Preencha os campos obrigatórios na ordem antes de avançar.'
      )
      focusField(firstInvalid)
    } else {
      setGlobalError(null)
    }
  }

  // foca automaticamente no campo 0
  useEffect(() => {
    focusField(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --------- seleção UF / Cidade por valor ---------
  const selectUfValue = (value: string) => {
    const normalized = value.trim().toUpperCase()
    if (!normalized) return

    setUf(normalized)
    setUfDropdownOpen(false)
    setUfFocusedIndex(null)

    // limpamos cidade associada
    setCidade('')
    setCidadeDropdownOpen(false)
    setCidadeFocusedIndex(null)
  }

  const selectCidadeValue = (value: string) => {
    const nomeCidade = value.trim()
    if (!nomeCidade) return

    setCidade(nomeCidade)
    setCidadeDropdownOpen(false)
    setCidadeFocusedIndex(null)
  }

  const toggleTipoVia = (idx: number) => {
    setTipoViaError(null)
    setGlobalError(null)

    if (idx === 0) setTipoViaRua((v) => !v)
    if (idx === 1) setTipoViaAvenida((v) => !v)
    if (idx === 2) setTipoViaLogradouro((v) => !v)
  }

  // --------- tratamento de teclado ---------
  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLElement>) => {
    const key = e.key

    // ---------- rádio (index 5) ----------
    if (index === 5) {
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        e.preventDefault()
        const nextFocus = tipoEnderecoFocusIndex === 0 ? 1 : 0
        setTipoEnderecoFocusIndex(nextFocus)

        const ref =
          nextFocus === 0 ? tipoEndComRef.current : tipoEndEmpRef.current
        ref?.focus()
        return
      }

      if (key === ' ' || key === 'Spacebar') {
        e.preventDefault()
        setTipoEndereco(
          tipoEnderecoFocusIndex === 0 ? 'Comercial' : 'Empresarial'
        )
        return
      }
    }

    // ---------- grupo checkboxes tipo de via (index 8) ----------
    if (index === 8) {
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        e.preventDefault()
        const total = 3
        const forward = key === 'ArrowRight'
        const current = tipoViaFocusIndex
        const next = (current + (forward ? 1 : -1) + total) % total
        setTipoViaFocusIndex(next)

        const ref =
          next === 0
            ? tipoViaRuaRef.current
            : next === 1
            ? tipoViaAvenidaRef.current
            : tipoViaLogradouroRef.current
        ref?.focus()
        return
      }

      if (key === ' ' || key === 'Spacebar') {
        e.preventDefault()
        toggleTipoVia(tipoViaFocusIndex)
        return
      }
    }

    // ---------- dropdowns (UF: 6, Cidade: 7) ----------
    const isDropdown = index === 6 || index === 7
    if (isDropdown) {
      const isUf = index === 6
      const open = isUf ? ufDropdownOpen : cidadeDropdownOpen
      const focusedIndex = isUf ? ufFocusedIndex : cidadeFocusedIndex
      const options = isUf ? ufsFiltradas : cidadesFiltradas
      const optionsCount = options.length

      const setOpen = isUf ? setUfDropdownOpen : setCidadeDropdownOpen
      const setFocused = isUf ? setUfFocusedIndex : setCidadeFocusedIndex

      // Abrir com F4 ou Espaço quando fechado (só se houver opções)
      if (!open && (key === 'F4' || key === ' ' || key === 'Spacebar')) {
        e.preventDefault()
        if (optionsCount === 0) return
        setOpen(true)
        setFocused(null)
        return
      }

      if (open) {
        if (
          key === 'ArrowDown' ||
          key === 'ArrowUp' ||
          key === 'ArrowLeft' ||
          key === 'ArrowRight'
        ) {
          if (optionsCount === 0) {
            return
          }

          e.preventDefault()
          const forward = key === 'ArrowDown' || key === 'ArrowRight'
          const current = focusedIndex ?? -1
          const next =
            (current + (forward ? 1 : -1) + optionsCount) % optionsCount
          setFocused(next)
          return
        }

        if (key === ' ' || key === 'Spacebar') {
          e.preventDefault()
          if (focusedIndex != null && optionsCount > 0) {
            const value = options[focusedIndex]
            if (isUf) {
              selectUfValue(value)
            } else {
              selectCidadeValue(value)
            }
            const ref = isUf ? ufRef.current : cidadeRef.current
            ref?.focus()
          }
          return
        }

        if (key === 'Enter') {
          e.preventDefault()
          if (focusedIndex != null && optionsCount > 0) {
            const value = options[focusedIndex]
            if (isUf) {
              selectUfValue(value)
            } else {
              selectCidadeValue(value)
            }
          }

          if (!canLeaveField(index)) return
          const nextIndex = Math.min(TOTAL_FIELDS - 1, index + 1)
          focusField(nextIndex)
          return
        }

        if (key === 'Escape') {
          e.preventDefault()
          setOpen(false)
          setFocused(null)
          return
        }
      } else {
        if (key === 'ArrowLeft' || key === 'ArrowRight') {
          return
        }
      }
    }

    // ---------- Ctrl+Home / Ctrl+End ----------
    if (key === 'Home' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      setGlobalError(null)
      focusField(0)
      return
    }

    if (key === 'End' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      setGlobalError(null)
      focusField(TOTAL_FIELDS - 1)
      return
    }

    // ---------- PageUp / PageDown ----------
    if (key === 'PageDown') {
      e.preventDefault()
      const target = Math.min(TOTAL_FIELDS - 1, index + PAGE_SIZE)
      const firstInvalid = getFirstInvalidRequiredIndex()
      if (firstInvalid != null && firstInvalid < target) {
        setGlobalError(
          'Preencha os campos obrigatórios na ordem antes de avançar.'
        )
        focusField(firstInvalid)
      } else {
        setGlobalError(null)
        focusField(target)
      }
      return
    }

    if (key === 'PageUp') {
      e.preventDefault()
      const target = Math.max(0, index - PAGE_SIZE)
      setGlobalError(null)
      focusField(target)
      return
    }

    // ---------- navegação geral entre campos ----------
    if (key === 'ArrowDown' || key === 'Enter') {
      e.preventDefault()
      if (!canLeaveField(index)) return
      const nextIndex = Math.min(TOTAL_FIELDS - 1, index + 1)
      focusField(nextIndex)
      return
    }

    if (key === 'ArrowUp') {
      e.preventDefault()
      const prevIndex = Math.max(0, index - 1)
      focusField(prevIndex)
      return
    }
  }

  // --------- render ---------
  return (
    <div className='min-h-[calc(80vh-96px)] flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-xl'>
        <div className='text-[11px] text-slate-500 mb-1.5'>
          <span className='text-primary font-medium'>
            Formulário Navegável (Harbour-style)
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

          <div
            ref={scrollContainerRef}
            className='px-4 pt-3 pb-3 space-y-3 max-h-[60vh] overflow-auto'
          >
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
                ref={nomeRef}
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value)
                  setNomeError(null)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(0)}
                onKeyDown={handleKeyDown(0)}
                placeholder='Informe o nome'
                className={`h-9 w-full rounded-md border ${
                  nomeError ? 'border-red-400' : 'border-border-soft'
                } px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
              />
              {nomeError && (
                <p className='text-[10px] text-red-500 mt-0.5'>{nomeError}</p>
              )}
            </div>

            {/* 1 - CPF */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-cpf'>
                CPF <span className='text-red-500'>*</span>
              </label>
              <input
                id='campo-cpf'
                ref={cpfRef}
                value={cpf}
                onChange={(e) => {
                  setCpf(e.target.value)
                  setCpfError(null)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(1)}
                onKeyDown={handleKeyDown(1)}
                placeholder='999.999.999-99'
                className={`h-9 w-full rounded-md border ${
                  cpfError ? 'border-red-400' : 'border-border-soft'
                } px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
              />
              {cpfError && (
                <p className='text-[10px] text-red-500 mt-0.5'>{cpfError}</p>
              )}
            </div>

            {/* 2 - E-mail */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-email'>
                E-mail <span className='text-red-500'>*</span>
              </label>
              <input
                id='campo-email'
                ref={emailRef}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError(null)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(2)}
                onKeyDown={handleKeyDown(2)}
                placeholder='email@dominio.com'
                className={`h-9 w-full rounded-md border ${
                  emailError ? 'border-red-400' : 'border-border-soft'
                } px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
              />
              {emailError && (
                <p className='text-[10px] text-red-500 mt-0.5'>{emailError}</p>
              )}
            </div>

            {/* 3 - Telefone */}
            <div className='space-y-1'>
              <label
                className='text-xs text-slate-700'
                htmlFor='campo-telefone'
              >
                Telefone (opcional)
              </label>
              <input
                id='campo-telefone'
                ref={telefoneRef}
                value={telefone}
                onChange={(e) => {
                  setTelefone(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(3)}
                onKeyDown={handleKeyDown(3)}
                placeholder='(00) 00000-0000'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
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
                ref={logradouroRef}
                value={logradouro}
                onChange={(e) => {
                  setLogradouro(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(4)}
                onKeyDown={handleKeyDown(4)}
                placeholder='Rua, avenida...'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 5 - Tipo de endereço (rádio) */}
            <div className='space-y-1'>
              <span className='text-xs text-slate-700'>Tipo de endereço</span>
              <div className='flex items-center gap-4'>
                <label className='inline-flex items-center text-xs text-slate-700'>
                  <input
                    type='radio'
                    name='tipo-endereco'
                    value='Comercial'
                    ref={tipoEndComRef}
                    checked={tipoEndereco === 'Comercial'}
                    onChange={() => {
                      setTipoEndereco('Comercial')
                      setGlobalError(null)
                    }}
                    onFocus={() => handleFocus(5)}
                    onKeyDown={handleKeyDown(5)}
                    className='h-3.5 w-3.5 border-border-soft text-primary'
                  />
                  <span className='ml-1'>Comercial</span>
                </label>

                <label className='inline-flex items-center text-xs text-slate-700'>
                  <input
                    type='radio'
                    name='tipo-endereco'
                    value='Empresarial'
                    ref={tipoEndEmpRef}
                    checked={tipoEndereco === 'Empresarial'}
                    onChange={() => {
                      setTipoEndereco('Empresarial')
                      setGlobalError(null)
                    }}
                    onFocus={() => handleFocus(5)}
                    onKeyDown={handleKeyDown(5)}
                    className='h-3.5 w-3.5 border-border-soft text-primary'
                  />
                  <span className='ml-1'>Empresarial</span>
                </label>
              </div>
            </div>

            {/* 6 - UF (input + dropdown) */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-uf'>
                UF
              </label>
              <div className='relative'>
                <input
                  id='campo-uf'
                  ref={ufRef}
                  value={uf}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase()
                    setUf(value)

                    // ao trocar UF, zera cidade
                    setCidade('')
                    setCidadeDropdownOpen(false)
                    setCidadeFocusedIndex(null)
                    setGlobalError(null)

                    const texto = value.trim()
                    const matches = texto
                      ? UFS.filter((sigla) =>
                          sigla.toLowerCase().includes(texto.toLowerCase())
                        )
                      : UFS

                    if (matches.length > 0) {
                      setUfDropdownOpen(true)
                      setUfFocusedIndex(0)
                    } else {
                      setUfDropdownOpen(false)
                      setUfFocusedIndex(null)
                    }
                  }}
                  onFocus={() => handleFocus(6)}
                  onKeyDown={handleKeyDown(6)}
                  placeholder='UF'
                  className='h-9 w-full rounded-md border border-border-soft px-3 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-1 px-1 text-[10px] text-slate-400'
                  onClick={() => {
                    const options = ufsFiltradas
                    if (!options.length) return
                    setUfDropdownOpen((open) => !open)
                    setUfFocusedIndex(null)
                  }}
                >
                  ▼
                </button>

                {ufDropdownOpen && ufsFiltradas.length > 0 && (
                  <div className='absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border-soft bg-white shadow-md text-xs'>
                    {ufsFiltradas.map((sigla, idx) => {
                      const focused = ufFocusedIndex === idx
                      const selected = uf === sigla
                      return (
                        <div
                          key={sigla}
                          onMouseDown={(ev) => {
                            ev.preventDefault()
                            selectUfValue(sigla)
                            ufRef.current?.focus()
                          }}
                          className={`px-2 py-1 cursor-pointer ${
                            focused
                              ? 'bg-primary text-white'
                              : selected
                              ? 'bg-slate-100 text-slate-900'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {sigla}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 7 - Cidade (input + dropdown) */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-cidade'>
                Cidade
              </label>
              <div className='relative'>
                <input
                  id='campo-cidade'
                  ref={cidadeRef}
                  value={cidade}
                  onChange={(e) => {
                    const value = e.target.value
                    setCidade(value)
                    setGlobalError(null)

                    const texto = value.trim().toLowerCase()
                    const base = cidadesBase
                    const matches = texto
                      ? base.filter((c) => c.toLowerCase().includes(texto))
                      : base

                    if (matches.length > 0) {
                      setCidadeDropdownOpen(true)
                      setCidadeFocusedIndex(0)
                    } else {
                      setCidadeDropdownOpen(false)
                      setCidadeFocusedIndex(null)
                    }
                  }}
                  onFocus={() => handleFocus(7)}
                  onKeyDown={handleKeyDown(7)}
                  placeholder='Cidade'
                  className='h-9 w-full rounded-md border border-border-soft px-3 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-1 px-1 text-[10px] text-slate-400'
                  onClick={() => {
                    const options = cidadesFiltradas
                    if (!options.length) return
                    setCidadeDropdownOpen((open) => !open)
                    setCidadeFocusedIndex(null)
                  }}
                >
                  ▼
                </button>

                {cidadeDropdownOpen && cidadesFiltradas.length > 0 && (
                  <div className='absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border-soft bg-white shadow-md text-xs'>
                    {cidadesFiltradas.map((c, idx) => {
                      const focused = cidadeFocusedIndex === idx
                      const selected = cidade === c
                      return (
                        <div
                          key={c}
                          onMouseDown={(ev) => {
                            ev.preventDefault()
                            selectCidadeValue(c)
                            cidadeRef.current?.focus()
                          }}
                          className={`px-2 py-1 cursor-pointer ${
                            focused
                              ? 'bg-primary text-white'
                              : selected
                              ? 'bg-slate-100 text-slate-900'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {c}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 8 - Tipo de via (checkboxes) */}
            <div className='space-y-1'>
              <span className='text-xs text-slate-700'>
                Tipo de via <span className='text-red-500'>*</span>
              </span>
              <div className='flex items-center gap-4'>
                <label className='inline-flex items-center text-xs text-slate-700'>
                  <input
                    type='checkbox'
                    ref={tipoViaRuaRef}
                    checked={tipoViaRua}
                    onChange={() => toggleTipoVia(0)}
                    onFocus={() => handleFocus(8)}
                    onKeyDown={handleKeyDown(8)}
                    className='h-3.5 w-3.5 border-border-soft text-primary'
                  />
                  <span className='ml-1'>Rua</span>
                </label>

                <label className='inline-flex items-center text-xs text-slate-700'>
                  <input
                    type='checkbox'
                    ref={tipoViaAvenidaRef}
                    checked={tipoViaAvenida}
                    onChange={() => toggleTipoVia(1)}
                    onFocus={() => handleFocus(8)}
                    onKeyDown={handleKeyDown(8)}
                    className='h-3.5 w-3.5 border-border-soft text-primary'
                  />
                  <span className='ml-1'>Avenida</span>
                </label>

                <label className='inline-flex items-center text-xs text-slate-700'>
                  <input
                    type='checkbox'
                    ref={tipoViaLogradouroRef}
                    checked={tipoViaLogradouro}
                    onChange={() => toggleTipoVia(2)}
                    onFocus={() => handleFocus(8)}
                    onKeyDown={handleKeyDown(8)}
                    className='h-3.5 w-3.5 border-border-soft text-primary'
                  />
                  <span className='ml-1'>Logradouro</span>
                </label>
              </div>
              {tipoViaError && (
                <p className='text-[10px] text-red-500 mt-0.5'>
                  {tipoViaError}
                </p>
              )}
            </div>

            {/* 9 - Descrição da via (dependente dos checkboxes) */}
            <div className='space-y-1'>
              <label
                className='text-xs text-slate-700'
                htmlFor='campo-desc-via'
              >
                Nome da rua/avenida/logradouro
              </label>
              <input
                id='campo-desc-via'
                ref={descricaoViaRef}
                value={descricaoVia}
                onChange={(e) => {
                  setDescricaoVia(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(9)}
                onKeyDown={handleKeyDown(9)}
                placeholder='Ex.: Rua das Flores, Av. Paulista...'
                disabled={!hasTipoViaSelecionado}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-slate-100 disabled:text-slate-400'
              />
            </div>

            {/* 10 - Bairro */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-bairro'>
                Bairro
              </label>
              <input
                id='campo-bairro'
                ref={bairroRef}
                value={bairro}
                onChange={(e) => {
                  setBairro(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(10)}
                onKeyDown={handleKeyDown(10)}
                placeholder='Bairro'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 11 - Número */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-numero'>
                Número
              </label>
              <input
                id='campo-numero'
                ref={numeroRef}
                value={numero}
                onChange={(e) => {
                  setNumero(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(11)}
                onKeyDown={handleKeyDown(11)}
                placeholder='Número'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 12 - CEP */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-cep'>
                CEP
              </label>
              <input
                id='campo-cep'
                ref={cepRef}
                value={cep}
                onChange={(e) => {
                  setCep(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(12)}
                onKeyDown={handleKeyDown(12)}
                placeholder='00000-000'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 13 - Complemento */}
            <div className='space-y-1'>
              <label
                className='text-xs text-slate-700'
                htmlFor='campo-complemento'
              >
                Complemento
              </label>
              <input
                id='campo-complemento'
                ref={complementoRef}
                value={complemento}
                onChange={(e) => {
                  setComplemento(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(13)}
                onKeyDown={handleKeyDown(13)}
                placeholder='Apartamento, bloco...'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* BLOCO 3 - Dados profissionais */}
            <div className='text-[11px] font-semibold text-slate-600 mt-3'>
              Dados profissionais
            </div>

            {/* 14 - Empresa */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-empresa'>
                Empresa <span className='text-red-500'>*</span>
              </label>
              <input
                id='campo-empresa'
                ref={empresaRef}
                value={empresa}
                onChange={(e) => {
                  setEmpresa(e.target.value)
                  setEmpresaError(null)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(14)}
                onKeyDown={handleKeyDown(14)}
                placeholder='Nome da empresa'
                className={`h-9 w-full rounded-md border ${
                  empresaError ? 'border-red-400' : 'border-border-soft'
                } px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
              />
              {empresaError && (
                <p className='text-[10px] text-red-500 mt-0.5'>
                  {empresaError}
                </p>
              )}
            </div>

            {/* 15 - Cargo */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-cargo'>
                Cargo
              </label>
              <input
                id='campo-cargo'
                ref={cargoRef}
                value={cargo}
                onChange={(e) => {
                  setCargo(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(15)}
                onKeyDown={handleKeyDown(15)}
                placeholder='Cargo'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 16 - Departamento */}
            <div className='space-y-1'>
              <label
                className='text-xs text-slate-700'
                htmlFor='campo-departamento'
              >
                Departamento
              </label>
              <input
                id='campo-departamento'
                ref={departamentoRef}
                value={departamento}
                onChange={(e) => {
                  setDepartamento(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(16)}
                onKeyDown={handleKeyDown(16)}
                placeholder='Departamento'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* BLOCO 4 - Contatos adicionais */}
            <div className='text-[11px] font-semibold text-slate-600 mt-3'>
              Contatos adicionais
            </div>

            {/* 17 - Celular */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-celular'>
                Celular
              </label>
              <input
                id='campo-celular'
                ref={celularRef}
                value={celular}
                onChange={(e) => {
                  setCelular(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(17)}
                onKeyDown={handleKeyDown(17)}
                placeholder='(00) 00000-0000'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 18 - WhatsApp comercial */}
            <div className='space-y-1'>
              <label
                className='text-xs text-slate-700'
                htmlFor='campo-whatsapp2'
              >
                WhatsApp comercial
              </label>
              <input
                id='campo-whatsapp2'
                ref={whatsapp2Ref}
                value={whatsappComercial}
                onChange={(e) => {
                  setWhatsappComercial(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(18)}
                onKeyDown={handleKeyDown(18)}
                placeholder='(00) 00000-0000'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 19 - E-mail alternativo */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-email2'>
                E-mail alternativo
              </label>
              <input
                id='campo-email2'
                ref={email2Ref}
                value={emailAlternativo}
                onChange={(e) => {
                  setEmailAlternativo(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(19)}
                onKeyDown={handleKeyDown(19)}
                placeholder='email@alternativo.com'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* BLOCO 5 - Observações */}
            <div className='text-[11px] font-semibold text-slate-600 mt-3'>
              Observações
            </div>

            {/* 20 - Obs1 */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-obs1'>
                Observação 1
              </label>
              <input
                id='campo-obs1'
                ref={obs1Ref}
                value={obs1}
                onChange={(e) => {
                  setObs1(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(20)}
                onKeyDown={handleKeyDown(20)}
                placeholder='Observação 1'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 21 - Obs2 */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-obs2'>
                Observação 2
              </label>
              <input
                id='campo-obs2'
                ref={obs2Ref}
                value={obs2}
                onChange={(e) => {
                  setObs2(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(21)}
                onKeyDown={handleKeyDown(21)}
                placeholder='Observação 2'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 22 - Obs3 */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-obs3'>
                Observação 3
              </label>
              <input
                id='campo-obs3'
                ref={obs3Ref}
                value={obs3}
                onChange={(e) => {
                  setObs3(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFocus(22)}
                onKeyDown={handleKeyDown(22)}
                placeholder='Observação 3'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>
          </div>

          <div className='px-4 pt-1 pb-3 border-t border-border-soft text-[11px] text-slate-500 space-y-0.5'>
            <p>
              Navegação entre campos:{' '}
              <span className='font-medium'>↑ / ↓ / Enter</span> muda de campo.
            </p>
            <p>
              <span className='font-medium'>Ctrl + Home</span> vai para o
              primeiro campo, <span className='font-medium'>Ctrl + End</span>{' '}
              vai para o último campo.
            </p>
            <p>
              <span className='font-medium'>PageUp / PageDown</span> pulam um
              &quot;bloco&quot; de campos (sem permitir pular obrigatórios não
              preenchidos).
            </p>
            <p>
              Nos combos de UF/Cidade: digite para filtrar, use{' '}
              <span className='font-medium'>F4</span> ou{' '}
              <span className='font-medium'>Espaço</span> para abrir, setas para
              navegar, <span className='font-medium'>Espaço</span> para
              selecionar e <span className='font-medium'>Enter</span> para
              selecionar e avançar.
            </p>
            <p>
              No grupo de tipo de via: use{' '}
              <span className='font-medium'>← / →</span> para trocar entre Rua /
              Avenida / Logradouro e <span className='font-medium'>Espaço</span>{' '}
              para marcar/desmarcar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
