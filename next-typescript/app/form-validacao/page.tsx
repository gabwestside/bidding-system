'use client'

import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

type FormValidacaoModel = {
  nome: string
  cpf: string
  email: string
  telefone: string
  logradouro: string
  tipoEndereco: string
  uf: string
  cidade: string
  tipoViaRua: boolean
  tipoViaAvenida: boolean
  tipoViaLogradouro: boolean
  descricaoVia: string
}

type Errors = Partial<{
  nome: string
  cpf: string
  email: string
  tipoEndereco: string
  tipoViaDummy: string
  uf: string
  cidade: string
}>

const TOTAL_FIELDS = 10 // 0..9
const PAGE_SIZE = 4

// mapa simples de UF -> cidades (exemplo; preencha com os dados reais se quiser)
const MUNICIPIOS_POR_UF: Record<string, string[]> = {
  SP: ['São Paulo', 'Campinas', 'Santos'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Campos dos Goytacazes'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem'],
  PR: ['Curitiba', 'Londrina', 'Maringá'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
}

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

export default function FormValidacaoPage() {
  const [model, setModel] = useState<FormValidacaoModel>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    logradouro: '',
    tipoEndereco: '',
    uf: '',
    cidade: '',
    tipoViaRua: false,
    tipoViaAvenida: false,
    tipoViaLogradouro: false,
    descricaoVia: '',
  })

  const [errors, setErrors] = useState<Errors>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // refs para focar os campos por índice
  const fieldRefs = useRef<(HTMLInputElement | null)[]>([])

  // 0 = Comercial, 1 = Empresarial
  const [tipoEnderecoFocusIndex, setTipoEnderecoFocusIndex] = useState(0)

  // UF / Cidade (dropdowns)
  const [cidadesBaseAtual, setCidadesBaseAtual] = useState<string[]>([])

  const [ufDropdownOpen, setUfDropdownOpen] = useState(false)
  const [ufFocusedIndex, setUfFocusedIndex] = useState<number | null>(null)

  const [cidadeDropdownOpen, setCidadeDropdownOpen] = useState(false)
  const [cidadeFocusedIndex, setCidadeFocusedIndex] = useState<number | null>(
    null
  )

  const focusField = (index: number, center = false) => {
    const el = fieldRefs.current[index]
    if (el) {
      el.focus()
      el.scrollIntoView({
        behavior: 'smooth',
        block: center ? 'center' : 'nearest',
      })
    }
  }

  // foca no primeiro campo ao montar
  useEffect(() => {
    focusField(0, true)
  }, [])

  const updateModel = <K extends keyof FormValidacaoModel>(
    key: K,
    value: FormValidacaoModel[K]
  ) => {
    setModel((prev) => ({ ...prev, [key]: value }))
    // limpa erro de campo ao digitar
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setGlobalError(null)
  }

  const getFirstInvalidRequiredFieldIndex = (): number | null => {
    if (!model.nome.trim()) return 0
    if (!model.cpf.trim()) return 1
    if (!model.email.trim()) return 2
    if (!model.tipoEndereco.trim()) return 5
    if (!model.tipoViaRua && !model.tipoViaAvenida && !model.tipoViaLogradouro)
      return 8
    return null
  }

  const canLeaveField = (index: number): boolean => {
    let message: string | null = null

    switch (index) {
      case 0:
        if (!model.nome.trim()) message = 'Preencha o nome antes de continuar.'
        break
      case 1:
        if (!model.cpf.trim()) message = 'Preencha o CPF antes de continuar.'
        break
      case 2:
        if (!model.email.trim())
          message = 'Preencha o e-mail antes de continuar.'
        break
      case 5:
        if (!model.tipoEndereco.trim())
          message = 'Informe o tipo de endereço antes de continuar.'
        break
      case 8:
        if (
          !model.tipoViaRua &&
          !model.tipoViaAvenida &&
          !model.tipoViaLogradouro
        ) {
          message = 'Selecione pelo menos um tipo de via antes de continuar.'
        }
        break
    }

    if (message) {
      setGlobalError(message)
      return false
    }

    setGlobalError(null)
    return true
  }

  const handleFieldFocus = (index: number) => {
    const firstInvalid = getFirstInvalidRequiredFieldIndex()
    if (firstInvalid !== null && firstInvalid < index) {
      setGlobalError(
        'Preencha os campos obrigatórios na ordem antes de avançar.'
      )
      focusField(firstInvalid, true)
    } else {
      setGlobalError(null)
    }
  }

  // UF input change
  const handleUfInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    updateModel('uf', value)

    const cidades =
      MUNICIPIOS_POR_UF[value as keyof typeof MUNICIPIOS_POR_UF] ?? []
    setCidadesBaseAtual(cidades)
    updateModel('cidade', '')

    const filtered = getUfsFiltradas(value)
    if (filtered.length > 0) {
      setUfDropdownOpen(true)
      setUfFocusedIndex(0)
    } else {
      setUfDropdownOpen(false)
      setUfFocusedIndex(null)
    }
  }

  // Cidade input change
  const handleCidadeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateModel('cidade', value)

    const filtered = getCidadesFiltradas(cidadesBaseAtual, value)
    if (filtered.length > 0) {
      setCidadeDropdownOpen(true)
      setCidadeFocusedIndex(0)
    } else {
      setCidadeDropdownOpen(false)
      setCidadeFocusedIndex(null)
    }
  }

  const getUfsFiltradas = (filter: string) => {
    if (!filter.trim()) return UFS
    return UFS.filter((uf) => uf.toLowerCase().includes(filter.toLowerCase()))
  }

  const getCidadesFiltradas = (base: string[], filter: string) => {
    if (!base || base.length === 0) return []
    if (!filter.trim()) return base
    return base.filter((c) => c.toLowerCase().includes(filter.toLowerCase()))
  }

  const selectUf = (uf: string) => {
    const value = uf.toUpperCase()
    updateModel('uf', value)
    setUfDropdownOpen(false)
    setUfFocusedIndex(null)

    const cidades =
      MUNICIPIOS_POR_UF[value as keyof typeof MUNICIPIOS_POR_UF] ?? []
    setCidadesBaseAtual(cidades)
    updateModel('cidade', '')
    setCidadeDropdownOpen(false)
    setCidadeFocusedIndex(null)
  }

  const selectCidade = (cidade: string) => {
    updateModel('cidade', cidade)
    setCidadeDropdownOpen(false)
    setCidadeFocusedIndex(null)
  }

  const toggleUfDropdown = () => {
    const options = getUfsFiltradas(model.uf)
    if (options.length === 0) return

    setUfDropdownOpen((open) => {
      if (open) {
        setUfFocusedIndex(null)
        return false
      }
      setUfFocusedIndex(0)
      return true
    })
  }

  const toggleCidadeDropdown = () => {
    const options = getCidadesFiltradas(cidadesBaseAtual, model.cidade)
    if (options.length === 0) return

    setCidadeDropdownOpen((open) => {
      if (open) {
        setCidadeFocusedIndex(null)
        return false
      }
      setCidadeFocusedIndex(0)
      return true
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    const key = e.key

    // --------- Rádio (index 5) ---------
    if (index === 5) {
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        e.preventDefault()
        setTipoEnderecoFocusIndex((prev) => (prev === 0 ? 1 : 0))
        const nextId = tipoEnderecoFocusIndex === 0 ? 1 : 0
        const elementId =
          nextId === 0 ? 'campo-tipo-end-com' : 'campo-tipo-end-emp'
        document.getElementById(elementId)?.focus()
        return
      }

      if (key === ' ') {
        e.preventDefault()
        const value = tipoEnderecoFocusIndex === 0 ? 'Comercial' : 'Empresarial'
        updateModel('tipoEndereco', value)
        return
      }
      // ↑ / ↓ / Enter seguem para navegação geral
    }

    // --------- Dropdowns UF / Cidade (index 6 e 7) ---------
    if (index === 6 || index === 7) {
      const isUf = index === 6
      const open = isUf ? ufDropdownOpen : cidadeDropdownOpen
      const focusedIndex = isUf ? ufFocusedIndex : cidadeFocusedIndex
      const options = isUf
        ? getUfsFiltradas(model.uf)
        : getCidadesFiltradas(cidadesBaseAtual, model.cidade)
      const optionsCount = options.length

      // abre com F4 ou espaço
      if ((key === 'F4' || key === ' ') && !open) {
        e.preventDefault()
        if (optionsCount === 0) return

        if (isUf) {
          setUfDropdownOpen(true)
          setUfFocusedIndex(0)
        } else {
          setCidadeDropdownOpen(true)
          setCidadeFocusedIndex(0)
        }
        return
      }

      if (open && optionsCount > 0) {
        if (
          key === 'ArrowDown' ||
          key === 'ArrowUp' ||
          key === 'ArrowLeft' ||
          key === 'ArrowRight'
        ) {
          e.preventDefault()
          const forward = key === 'ArrowDown' || key === 'ArrowRight'
          const current = focusedIndex ?? -1
          const next = forward
            ? (current + 1 + optionsCount) % optionsCount
            : (current - 1 + optionsCount) % optionsCount

          if (isUf) setUfFocusedIndex(next)
          else setCidadeFocusedIndex(next)
          return
        }

        if (key === ' ') {
          e.preventDefault()
          if (focusedIndex != null) {
            const value = options[focusedIndex]
            if (isUf) selectUf(value)
            else selectCidade(value)
          }
          return
        }

        if (key === 'Enter') {
          e.preventDefault()
          if (focusedIndex != null) {
            const value = options[focusedIndex]
            if (isUf) selectUf(value)
            else selectCidade(value)
          }

          if (!canLeaveField(index)) return

          const nextIndex = Math.min(TOTAL_FIELDS - 1, index + 1)
          focusField(nextIndex)
          return
        }

        if (key === 'Escape') {
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
        // dropdown fechado: não usa ← / →
        if (key === 'ArrowLeft' || key === 'ArrowRight') {
          e.preventDefault()
          return
        }
      }
    }

    // --------- atalhos gerais (Ctrl+Home/End, PageUp/PageDown) ---------
    if (key === 'Home' && e.ctrlKey) {
      e.preventDefault()
      setGlobalError(null)
      focusField(0, true)
      return
    }

    if (key === 'End' && e.ctrlKey) {
      e.preventDefault()
      setGlobalError(null)
      focusField(TOTAL_FIELDS - 1, true)
      return
    }

    if (key === 'PageDown') {
      e.preventDefault()
      const target = Math.min(TOTAL_FIELDS - 1, index + PAGE_SIZE)
      const firstInvalid = getFirstInvalidRequiredFieldIndex()

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

    if (key === 'PageUp') {
      e.preventDefault()
      const target = Math.max(0, index - PAGE_SIZE)
      setGlobalError(null)
      focusField(target, true)
      return
    }

    // --------- navegação ↑ / ↓ / Enter entre campos ---------
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

  const validateAll = (): {
    errors: Errors
    firstInvalidIndex: number | null
  } => {
    const validation: Errors = {}

    if (!model.nome.trim()) {
      validation.nome = 'Nome é obrigatório.'
    } else if (model.nome.length > 150) {
      validation.nome = 'Nome deve ter no máximo 150 caracteres.'
    }

    if (!model.cpf.trim()) {
      validation.cpf = 'CPF é obrigatório.'
    } else if (!/^\d{11}$/.test(model.cpf)) {
      validation.cpf = 'CPF deve conter 11 dígitos (apenas números).'
    }

    if (!model.email.trim()) {
      validation.email = 'E-mail é obrigatório.'
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(model.email)) {
      validation.email = 'E-mail inválido.'
    }

    if (!model.tipoEndereco.trim()) {
      validation.tipoEndereco = 'Informe o tipo de endereço.'
    }

    if (
      !model.tipoViaRua &&
      !model.tipoViaAvenida &&
      !model.tipoViaLogradouro
    ) {
      validation.tipoViaDummy = 'Selecione pelo menos um tipo de via.'
    }

    // UF / Cidade opcionais para envio? se quiser torná-los obrigatórios, descomente:
    // if (!model.uf.trim()) validation.uf = "UF é obrigatório.";
    // if (!model.cidade.trim()) validation.cidade = "Cidade é obrigatória.";

    const order: { index: number; key: keyof Errors }[] = [
      { index: 0, key: 'nome' },
      { index: 1, key: 'cpf' },
      { index: 2, key: 'email' },
      { index: 5, key: 'tipoEndereco' },
      { index: 8, key: 'tipoViaDummy' },
      { index: 6, key: 'uf' },
      { index: 7, key: 'cidade' },
    ]

    let firstInvalid: number | null = null
    for (const item of order) {
      if (validation[item.key]) {
        firstInvalid = item.index
        break
      }
    }

    return { errors: validation, firstInvalidIndex: firstInvalid }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const { errors: validation, firstInvalidIndex } = validateAll()
    setErrors(validation)

    if (firstInvalidIndex !== null) {
      setGlobalError('Preencha os campos obrigatórios antes de enviar.')
      focusField(firstInvalidIndex, true)
      setSuccessMessage(null)
      return
    }

    setGlobalError(null)
    setSuccessMessage(
      'Formulário válido. Junto com a implementação de navegação por teclado.'
    )
  }

  return (
    <div className='min-h-[calc(80vh-96px)] flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-xl'>
        <div className='text-[11px] text-slate-500 mb-1.5'>
          <span className='text-primary font-medium'>
            Formulário de validação com EditForm (versão Next.js)
          </span>
        </div>

        <div className='border border-slate-200 shadow-sm bg-white rounded-xl'>
          <div className='px-4 pt-4 pb-2 border-b border-slate-200'>
            <h1 className='text-base font-semibold tracking-tight text-slate-900 text-center'>
              Validações específicas
            </h1>
            <p className='text-[11px] text-slate-500 text-center mt-1'>
              Exemplo de formulário com navegação apenas por teclado.
            </p>
          </div>

          <form autoComplete='off' onSubmit={handleSubmit}>
            <div className='px-4 pt-3 pb-3 space-y-3 h-full overflow-auto'>
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
                  ref={(el) => {
                    fieldRefs.current[0] = el
                  }}
                  className='h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='Informe o nome'
                  value={model.nome}
                  onChange={(e) => updateModel('nome', e.target.value)}
                  onFocus={() => handleFieldFocus(0)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                />
                {errors.nome && (
                  <div className='text-[10px] text-red-500 mt-0.5'>
                    {errors.nome}
                  </div>
                )}
              </div>

              {/* 1 - CPF */}
              <div className='space-y-1'>
                <label className='text-xs text-slate-700' htmlFor='campo-cpf'>
                  CPF <span className='text-red-500'>*</span>
                </label>
                <input
                  id='campo-cpf'
                  autoComplete='off'
                  ref={(el) => {
                    fieldRefs.current[1] = el
                  }}
                  className='h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='999.999.999-99'
                  value={model.cpf}
                  onChange={(e) => updateModel('cpf', e.target.value)}
                  onFocus={() => handleFieldFocus(1)}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                />
                {errors.cpf && (
                  <div className='text-[10px] text-red-500 mt-0.5'>
                    {errors.cpf}
                  </div>
                )}
              </div>

              {/* 2 - E-mail */}
              <div className='space-y-1'>
                <label className='text-xs text-slate-700' htmlFor='campo-email'>
                  E-mail <span className='text-red-500'>*</span>
                </label>
                <input
                  id='campo-email'
                  autoComplete='off'
                  ref={(el) => {
                    fieldRefs.current[2] = el
                  }}
                  className='h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='email@dominio.com'
                  value={model.email}
                  onChange={(e) => updateModel('email', e.target.value)}
                  onFocus={() => handleFieldFocus(2)}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                />
                {errors.email && (
                  <div className='text-[10px] text-red-500 mt-0.5'>
                    {errors.email}
                  </div>
                )}
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
                  ref={(el) => {
                    fieldRefs.current[3] = el
                  }}
                  className='h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='(00) 00000-0000'
                  value={model.telefone}
                  onChange={(e) => updateModel('telefone', e.target.value)}
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
                  ref={(el) => {
                    fieldRefs.current[4] = el
                  }}
                  className='h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='Rua, avenida...'
                  value={model.logradouro}
                  onChange={(e) => updateModel('logradouro', e.target.value)}
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
                      id='campo-tipo-end-com'
                      type='radio'
                      name='tipo-endereco'
                      ref={(el) => {
                        fieldRefs.current[5] = el
                      }}
                      className='h-3.5 w-3.5 border-slate-300 text-primary'
                      checked={model.tipoEndereco === 'Comercial'}
                      onChange={() => updateModel('tipoEndereco', 'Comercial')}
                      onClick={() => setTipoEnderecoFocusIndex(0)}
                      onFocus={() => handleFieldFocus(5)}
                      onKeyDown={(e) => handleKeyDown(e, 5)}
                    />
                    <span className='ml-1'>Comercial</span>
                  </label>

                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      id='campo-tipo-end-emp'
                      type='radio'
                      name='tipo-endereco'
                      className='h-3.5 w-3.5 border-slate-300 text-primary'
                      checked={model.tipoEndereco === 'Empresarial'}
                      onChange={() =>
                        updateModel('tipoEndereco', 'Empresarial')
                      }
                      onClick={() => setTipoEnderecoFocusIndex(1)}
                      onFocus={() => handleFieldFocus(5)}
                      onKeyDown={(e) => handleKeyDown(e, 5)}
                    />
                    <span className='ml-1'>Empresarial</span>
                  </label>
                </div>
                {errors.tipoEndereco && (
                  <div className='text-[10px] text-red-500 mt-0.5'>
                    {errors.tipoEndereco}
                  </div>
                )}
              </div>

              {/* 6 - UF (input + dropdown filtrado) */}
              <div className='space-y-1'>
                <label className='text-xs text-slate-700' htmlFor='campo-uf'>
                  UF
                </label>
                <div className='relative'>
                  <input
                    id='campo-uf'
                    autoComplete='off'
                    ref={(el) => {
                      fieldRefs.current[6] = el
                    }}
                    value={model.uf}
                    placeholder='UF'
                    className='h-9 w-full rounded-md border border-slate-200 px-3 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    onChange={handleUfInput}
                    onFocus={() => handleFieldFocus(6)}
                    onKeyDown={(e) => handleKeyDown(e, 6)}
                  />
                  <button
                    type='button'
                    tabIndex={-1}
                    className='absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400'
                    onClick={toggleUfDropdown}
                  >
                    ▼
                  </button>

                  {ufDropdownOpen && (
                    <div className='absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-md text-xs'>
                      {getUfsFiltradas(model.uf).map((uf, index) => {
                        const focused = ufFocusedIndex === index
                        return (
                          <div
                            key={uf}
                            className={
                              'px-2 py-1 cursor-pointer ' +
                              (focused
                                ? 'bg-primary text-white'
                                : 'hover:bg-slate-100')
                            }
                            onMouseDown={(e) => {
                              e.preventDefault()
                              selectUf(uf)
                            }}
                          >
                            {uf}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                {errors.uf && (
                  <div className='text-[10px] text-red-500 mt-0.5'>
                    {errors.uf}
                  </div>
                )}
              </div>

              {/* 7 - Cidade (input + dropdown filtrado) */}
              <div className='space-y-1'>
                <label
                  className='text-xs text-slate-700'
                  htmlFor='campo-cidade'
                >
                  Cidade
                </label>
                <div className='relative'>
                  <input
                    id='campo-cidade'
                    autoComplete='off'
                    ref={(el) => {
                      fieldRefs.current[7] = el
                    }}
                    value={model.cidade}
                    placeholder='Cidade'
                    className='h-9 w-full rounded-md border border-slate-200 px-3 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    onChange={handleCidadeInput}
                    onFocus={() => handleFieldFocus(7)}
                    onKeyDown={(e) => handleKeyDown(e, 7)}
                  />
                  <button
                    type='button'
                    tabIndex={-1}
                    className='absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400'
                    onClick={toggleCidadeDropdown}
                  >
                    ▼
                  </button>

                  {cidadeDropdownOpen && (
                    <div className='absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-md text-xs'>
                      {getCidadesFiltradas(cidadesBaseAtual, model.cidade).map(
                        (cidade, index) => {
                          const focused = cidadeFocusedIndex === index
                          return (
                            <div
                              key={cidade}
                              className={
                                'px-2 py-1 cursor-pointer ' +
                                (focused
                                  ? 'bg-primary text-white'
                                  : 'hover:bg-slate-100')
                              }
                              onMouseDown={(e) => {
                                e.preventDefault()
                                selectCidade(cidade)
                              }}
                            >
                              {cidade}
                            </div>
                          )
                        }
                      )}
                    </div>
                  )}
                </div>
                {errors.cidade && (
                  <div className='text-[10px] text-red-500 mt-0.5'>
                    {errors.cidade}
                  </div>
                )}
              </div>

              {/* 8 - Tipo de via (checkboxes) */}
              <div className='space-y-1'>
                <span className='text-xs text-slate-700'>
                  Tipo de via <span className='text-red-500'>*</span>
                </span>
                <div className='flex items-center gap-4 text-xs text-slate-700'>
                  <label className='inline-flex items-center'>
                    <input
                      id='campo-tipo-via-rua'
                      type='checkbox'
                      ref={(el) => {
                        fieldRefs.current[8] = el
                      }}
                      className='h-3.5 w-3.5 border-slate-300 text-primary'
                      checked={model.tipoViaRua}
                      onChange={(e) =>
                        updateModel('tipoViaRua', e.target.checked)
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
                      className='h-3.5 w-3.5 border-slate-300 text-primary'
                      checked={model.tipoViaAvenida}
                      onChange={(e) =>
                        updateModel('tipoViaAvenida', e.target.checked)
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
                      className='h-3.5 w-3.5 border-slate-300 text-primary'
                      checked={model.tipoViaLogradouro}
                      onChange={(e) =>
                        updateModel('tipoViaLogradouro', e.target.checked)
                      }
                      onFocus={() => handleFieldFocus(8)}
                      onKeyDown={(e) => handleKeyDown(e, 8)}
                    />
                    <span className='ml-1'>Logradouro</span>
                  </label>
                </div>
                {errors.tipoViaDummy && (
                  <div className='text-[10px] text-red-500 mt-0.5'>
                    {errors.tipoViaDummy}
                  </div>
                )}
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
                  ref={(el) => {
                    fieldRefs.current[9] = el
                  }}
                  className='h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='Ex.: Rua das Flores, Av. Paulista...'
                  value={model.descricaoVia}
                  onChange={(e) => updateModel('descricaoVia', e.target.value)}
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

              {successMessage && (
                <div className='mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2'>
                  {successMessage}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
