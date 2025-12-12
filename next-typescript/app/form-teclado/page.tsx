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

const TOTAL_FIELDS = 21 // 0..20
const PAGE_SIZE = 8

export default function FormTecladoPage() {
  // --------- refs (0..20) ---------
  const nomeRef = useRef<HTMLInputElement | null>(null) // 0
  const cpfRef = useRef<HTMLInputElement | null>(null) // 1
  const emailRef = useRef<HTMLInputElement | null>(null) // 2
  const telefoneRef = useRef<HTMLInputElement | null>(null) // 3

  const logradouroRef = useRef<HTMLInputElement | null>(null) // 4

  // rádio tipo endereço (grupo index 5)
  const tipoEndComRef = useRef<HTMLInputElement | null>(null)
  const tipoEndEmpRef = useRef<HTMLInputElement | null>(null)

  const numeroRef = useRef<HTMLInputElement | null>(null) // 6
  const bairroRef = useRef<HTMLInputElement | null>(null) // 7

  // cidade / UF serão "combos" (div focável)
  const cidadeRef = useRef<HTMLDivElement | null>(null) // 8
  const ufRef = useRef<HTMLDivElement | null>(null) // 9

  const cepRef = useRef<HTMLInputElement | null>(null) // 10
  const complementoRef = useRef<HTMLInputElement | null>(null) // 11

  const empresaRef = useRef<HTMLInputElement | null>(null) // 12
  const cargoRef = useRef<HTMLInputElement | null>(null) // 13
  const departamentoRef = useRef<HTMLInputElement | null>(null) // 14

  const celularRef = useRef<HTMLInputElement | null>(null) // 15
  const whatsapp2Ref = useRef<HTMLInputElement | null>(null) // 16
  const email2Ref = useRef<HTMLInputElement | null>(null) // 17

  const obs1Ref = useRef<HTMLInputElement | null>(null) // 18
  const obs2Ref = useRef<HTMLInputElement | null>(null) // 19
  const obs3Ref = useRef<HTMLInputElement | null>(null) // 20

  const fieldRefs: React.RefObject<HTMLElement | null>[] = [
    nomeRef,
    cpfRef,
    emailRef,
    telefoneRef,
    logradouroRef,
    tipoEndComRef,
    numeroRef,
    bairroRef,
    cidadeRef,
    ufRef,
    cepRef,
    complementoRef,
    empresaRef,
    cargoRef,
    departamentoRef,
    celularRef,
    whatsapp2Ref,
    email2Ref,
    obs1Ref,
    obs2Ref,
    obs3Ref,
  ]

  // --------- valores dos campos ---------
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  const [logradouro, setLogradouro] = useState('')
  const [tipoEndereco, setTipoEndereco] = useState('') // Comercial / Empresarial
  const [numero, setNumero] = useState('')
  const [bairro, setBairro] = useState('')

  const [cidade, setCidade] = useState('')
  const [uf, setUf] = useState('')
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
  const [globalError, setGlobalError] = useState<string | null>(null)

  // --------- dropdowns: UF e Cidade ---------
  const [ufDropdownOpen, setUfDropdownOpen] = useState(false)
  const [ufFocusedIndex, setUfFocusedIndex] = useState<number | null>(null)

  const [cidadeDropdownOpen, setCidadeDropdownOpen] = useState(false)
  const [cidadeFocusedIndex, setCidadeFocusedIndex] = useState<number | null>(
    null
  )

  const cidadesDisponiveis = useMemo(
    () => (uf ? obterMunicipiosPorUf(uf) : []),
    [uf]
  )

  // foca automaticamente no campo 0
  useEffect(() => {
    fieldRefs[0]?.current?.focus()
  }, [])

  // --------- helpers de navegação geral ---------
  const focusField = (index: number) => {
    if (index < 0 || index >= TOTAL_FIELDS) return
    const ref = fieldRefs[index]
    ref?.current?.focus()
  }

  const getFirstInvalidRequiredIndex = (): number | null => {
    if (!nome.trim()) return 0
    if (!cpf.trim()) return 1
    if (!email.trim()) return 2
    if (!empresa.trim()) return 12
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
      case 12:
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

  // --------- seleção UF / Cidade ---------
  const selectUf = (idx: number) => {
    if (idx < 0 || idx >= UFS.length) return
    const value = UFS[idx]
    setUf(value)
    setUfDropdownOpen(false)
    setUfFocusedIndex(null)

    // ao trocar UF, limpa cidade e suas seleções
    setCidade('')
    setCidadeDropdownOpen(false)
    setCidadeFocusedIndex(null)
  }

  const selectCidade = (idx: number) => {
    if (idx < 0 || idx >= cidadesDisponiveis.length) return
    const value = cidadesDisponiveis[idx]
    setCidade(value)
    setCidadeDropdownOpen(false)
    setCidadeFocusedIndex(null)
  }

  // --------- tratamento de teclado ---------
  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLElement>) => {
    const key = e.key

    // ---------- rádio (index 5) ----------
    if (index === 5) {
      // ↑ / ↓: navegação geral (não interceptamos aqui, deixamos cair no bloco geral)
      // ← / →: alternam foco entre Comercial / Empresarial
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        e.preventDefault()
        const nextFocus = tipoEnderecoFocusIndex === 0 ? 1 : 0
        setTipoEnderecoFocusIndex(nextFocus)

        const ref =
          nextFocus === 0 ? tipoEndComRef.current : tipoEndEmpRef.current
        ref?.focus()
        return
      }

      // Espaço: seleciona a opção focada (sem sair do campo)
      if (key === ' ' || key === 'Spacebar') {
        e.preventDefault()
        setTipoEndereco(
          tipoEnderecoFocusIndex === 0 ? 'Comercial' : 'Empresarial'
        )
        return
      }
      // Enter: não seleciona nada, apenas cai na navegação geral (próximo campo)
      // portanto não damos return aqui.
    }

    // ---------- dropdowns (Cidade: 8, UF: 9) ----------
    const isDropdown = index === 8 || index === 9
    if (isDropdown) {
      const isUf = index === 9
      const open = isUf ? ufDropdownOpen : cidadeDropdownOpen
      const focusedIndex = isUf ? ufFocusedIndex : cidadeFocusedIndex
      const options = isUf ? UFS : cidadesDisponiveis
      const optionsCount = options.length

      const setOpen = isUf ? setUfDropdownOpen : setCidadeDropdownOpen
      const setFocused = isUf ? setUfFocusedIndex : setCidadeFocusedIndex

      // Abrir com F4 ou Espaço quando fechado
      if (!open && (key === 'F4' || key === ' ' || key === 'Spacebar')) {
        e.preventDefault()
        setOpen(true)
        setFocused(null)
        return
      }

      if (open) {
        // Se não há opções: só tratamos Esc, demais teclas caem na navegação geral
        if (optionsCount === 0) {
          if (key === 'Escape') {
            e.preventDefault()
            setOpen(false)
            setFocused(null)
            return
          }
          // não damos return → ArrowUp/Down/Enter vão para a lógica geral de campos
        } else {
          // Há opções: interceptamos navegação interna
          if (
            key === 'ArrowDown' ||
            key === 'ArrowUp' ||
            key === 'ArrowLeft' ||
            key === 'ArrowRight'
          ) {
            e.preventDefault()
            const forward = key === 'ArrowDown' || key === 'ArrowRight'
            const current = focusedIndex ?? -1
            const next =
              (current + (forward ? 1 : -1) + optionsCount) % optionsCount
            setFocused(next)
            return
          }

          // Espaço → seleciona e mantém foco no dropdown
          if (key === ' ' || key === 'Spacebar') {
            e.preventDefault()
            if (focusedIndex != null) {
              if (isUf) {
                selectUf(focusedIndex)
              } else {
                selectCidade(focusedIndex)
              }
              // mantém foco no campo (combo)
              const ref = isUf ? ufRef.current : cidadeRef.current
              ref?.focus()
            }
            return
          }

          // Enter → seleciona e pula pro próximo
          if (key === 'Enter') {
            e.preventDefault()
            if (focusedIndex != null) {
              if (isUf) {
                selectUf(focusedIndex)
              } else {
                selectCidade(focusedIndex)
              }
            }

            if (!canLeaveField(index)) return
            const nextIndex = Math.min(TOTAL_FIELDS - 1, index + 1)
            focusField(nextIndex)
            return
          }

          // Esc → fecha sem alterar
          if (key === 'Escape') {
            e.preventDefault()
            setOpen(false)
            setFocused(null)
            return
          }
        }
      } else {
        // Dropdown fechado:
        // ← / → não têm efeito especial
        if (key === 'ArrowLeft' || key === 'ArrowRight') {
          // não faz nada; não damos preventDefault
          return
        }
        // ↑ / ↓ / Enter caem na navegação de campos abaixo
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

          <div className='px-4 pt-3 pb-3 space-y-3 max-h-[60vh] overflow-auto'>
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

            {/* 6 - Número */}
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
                onFocus={() => handleFocus(6)}
                onKeyDown={handleKeyDown(6)}
                placeholder='Número'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 7 - Bairro */}
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
                onFocus={() => handleFocus(7)}
                onKeyDown={handleKeyDown(7)}
                placeholder='Bairro'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 8 - Cidade (dropdown custom) */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700'>Cidade</label>
              <div className='relative'>
                <div
                  ref={cidadeRef}
                  tabIndex={0}
                  onFocus={() => handleFocus(8)}
                  onKeyDown={handleKeyDown(8)}
                  onClick={() => {
                    if (!uf) return
                    setCidadeDropdownOpen((open) => !open)
                    setCidadeFocusedIndex(null)
                  }}
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white'
                >
                  <span
                    className={
                      cidade
                        ? 'text-sm text-slate-800'
                        : 'text-sm text-slate-400'
                    }
                  >
                    {uf
                      ? cidade || 'Selecione a cidade'
                      : 'Selecione primeiro o UF'}
                  </span>
                  <span className='text-[9px] text-slate-400 ml-2'>▾</span>
                </div>

                {cidadeDropdownOpen && (
                  <div className='absolute z-20 mt-1 w-full max-h-52 overflow-auto rounded-md border border-border-soft bg-white shadow-sm text-xs'>
                    {cidadesDisponiveis.length === 0 ? (
                      <div className='px-3 py-2 text-slate-400'>
                        Nenhuma cidade disponível
                      </div>
                    ) : (
                      cidadesDisponiveis.map((c, idx) => {
                        const focused = cidadeFocusedIndex === idx
                        const selected = cidade === c
                        return (
                          <div
                            key={c}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              selectCidade(idx)
                            }}
                            className={`px-3 py-1.5 cursor-pointer ${
                              focused
                                ? 'bg-primary/10 text-primary'
                                : selected
                                ? 'bg-slate-100 text-slate-900'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {c}
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 9 - UF (dropdown custom) */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700'>UF</label>
              <div className='relative'>
                <div
                  ref={ufRef}
                  tabIndex={0}
                  onFocus={() => handleFocus(9)}
                  onKeyDown={handleKeyDown(9)}
                  onClick={() => {
                    setUfDropdownOpen((open) => !open)
                    setUfFocusedIndex(null)
                  }}
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white'
                >
                  <span
                    className={
                      uf ? 'text-sm text-slate-800' : 'text-sm text-slate-400'
                    }
                  >
                    {uf || 'Selecione o UF'}
                  </span>
                  <span className='text-[9px] text-slate-400 ml-2'>▾</span>
                </div>

                {ufDropdownOpen && (
                  <div className='absolute z-20 mt-1 w-full max-h-52 overflow-auto rounded-md border border-border-soft bg-white shadow-sm text-xs'>
                    {UFS.map((sigla, idx) => {
                      const focused = ufFocusedIndex === idx
                      const selected = uf === sigla
                      return (
                        <div
                          key={sigla}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            selectUf(idx)
                          }}
                          className={`px-3 py-1.5 cursor-pointer ${
                            focused
                              ? 'bg-primary/10 text-primary'
                              : selected
                              ? 'bg-slate-100 text-slate-900'
                              : 'text-slate-700 hover:bg-slate-50'
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

            {/* 10 - CEP */}
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
                onFocus={() => handleFocus(10)}
                onKeyDown={handleKeyDown(10)}
                placeholder='00000-000'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 11 - Complemento */}
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
                onFocus={() => handleFocus(11)}
                onKeyDown={handleKeyDown(11)}
                placeholder='Apartamento, bloco...'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* BLOCO 3 - Dados profissionais */}
            <div className='text-[11px] font-semibold text-slate-600 mt-3'>
              Dados profissionais
            </div>

            {/* 12 - Empresa */}
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
                onFocus={() => handleFocus(12)}
                onKeyDown={handleKeyDown(12)}
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

            {/* 13 - Cargo */}
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
                onFocus={() => handleFocus(13)}
                onKeyDown={handleKeyDown(13)}
                placeholder='Cargo'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 14 - Departamento */}
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
                onFocus={() => handleFocus(14)}
                onKeyDown={handleKeyDown(14)}
                placeholder='Departamento'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* BLOCO 4 - Contatos adicionais */}
            <div className='text-[11px] font-semibold text-slate-600 mt-3'>
              Contatos adicionais
            </div>

            {/* 15 - Celular */}
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
                onFocus={() => handleFocus(15)}
                onKeyDown={handleKeyDown(15)}
                placeholder='(00) 00000-0000'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 16 - WhatsApp comercial */}
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
                onFocus={() => handleFocus(16)}
                onKeyDown={handleKeyDown(16)}
                placeholder='(00) 00000-0000'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 17 - E-mail alternativo */}
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
                onFocus={() => handleFocus(17)}
                onKeyDown={handleKeyDown(17)}
                placeholder='email@alternativo.com'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* BLOCO 5 - Observações */}
            <div className='text-[11px] font-semibold text-slate-600 mt-3'>
              Observações
            </div>

            {/* 18 - Obs1 */}
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
                onFocus={() => handleFocus(18)}
                onKeyDown={handleKeyDown(18)}
                placeholder='Observação 1'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 19 - Obs2 */}
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
                onFocus={() => handleFocus(19)}
                onKeyDown={handleKeyDown(19)}
                placeholder='Observação 2'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 20 - Obs3 */}
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
                onFocus={() => handleFocus(20)}
                onKeyDown={handleKeyDown(20)}
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
              Nos dropdowns de UF e Cidade: use{' '}
              <span className='font-medium'>F4</span> ou{' '}
              <span className='font-medium'>Espaço</span> para abrir, setas para
              navegar, <span className='font-medium'>Espaço</span> para
              selecionar e <span className='font-medium'>Enter</span> para
              selecionar e avançar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
