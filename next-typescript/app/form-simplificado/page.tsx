'use client'

import React, {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

// ====== MODELO / TIPOS ======
type FormSimplificadoModel = {
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
  DescricaoVia: '',
}

const TOTAL_FIELDS = 10
const PAGE_SIZE = 8

const IdxNome = 0
const IdxCpf = 1
const IdxEmail = 2
const IdxTelefone = 3
const IdxLogradouro = 4
const IdxTipoEndereco = 5
const IdxUf = 6
const IdxCidade = 7
const IdxTipoVia = 8
const IdxDescricaoVia = 9

// UFs
const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

// Mapa de cidades – preencha com sua base real
const MUNICIPIOS_POR_UF: Record<string, string[]> = {
  AC: ['Rio Branco', 'Cruzeiro do Sul'],
  AL: ['Maceió', 'Arapiraca'],
  SP: ['São Paulo', 'Campinas', 'Santos'],
  RJ: ['Rio de Janeiro', 'Niterói'],
  // ...adicione os demais UFs conforme precisar
}

export default function FormSimplificadoPage() {
  const [model, setModel] = useState<FormSimplificadoModel>(INITIAL_MODEL)

  const [globalError, setGlobalError] = useState<string | null>(null)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)

  // erros por campo (equivalente ao ValidationMessage principal)
  const [nomeError, setNomeError] = useState<string | null>(null)
  const [cpfError, setCpfError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [tipoViaError, setTipoViaError] = useState<string | null>(null)

  // estado de foco interno dos grupos
  const [tipoEnderecoFocusIndex, setTipoEnderecoFocusIndex] = useState(0)
  const [tipoViaFocusIndex, setTipoViaFocusIndex] = useState(0)

  // dropdowns
  const [cidadesBaseAtual, setCidadesBaseAtual] = useState<string[]>([])
  const [ufDropdownOpen, setUfDropdownOpen] = useState(false)
  const [ufFocusedIndex, setUfFocusedIndex] = useState<number | null>(null)
  const [cidadeDropdownOpen, setCidadeDropdownOpen] = useState(false)
  const [cidadeFocusedIndex, setCidadeFocusedIndex] = useState<number | null>(null)

  const hasTipoViaSelecionado =
    model.TipoViaRua || model.TipoViaAvenida || model.TipoViaLogradouro

  // ===== REFs (equivalente aos ElementReference) =====
  const fieldNomeRef = useRef<HTMLInputElement | null>(null)
  const fieldCpfRef = useRef<HTMLInputElement | null>(null)
  const fieldEmailRef = useRef<HTMLInputElement | null>(null)
  const fieldTelefoneRef = useRef<HTMLInputElement | null>(null)

  const fieldLogradouroRef = useRef<HTMLInputElement | null>(null)
  const fieldTipoEndComercialRef = useRef<HTMLInputElement | null>(null)
  const fieldTipoEndEmpresarialRef = useRef<HTMLInputElement | null>(null)
  const fieldUfRef = useRef<HTMLInputElement | null>(null)
  const fieldCidadeRef = useRef<HTMLInputElement | null>(null)

  const fieldTipoViaRuaRef = useRef<HTMLInputElement | null>(null)
  const fieldTipoViaAvenidaRef = useRef<HTMLInputElement | null>(null)
  const fieldTipoViaLogradouroRef = useRef<HTMLInputElement | null>(null)
  const fieldDescricaoViaRef = useRef<HTMLTextAreaElement | null>(null)

  const getFieldRef = (index: number) => {
    switch (index) {
      case IdxNome:
        return fieldNomeRef.current
      case IdxCpf:
        return fieldCpfRef.current
      case IdxEmail:
        return fieldEmailRef.current
      case IdxTelefone:
        return fieldTelefoneRef.current
      case IdxLogradouro:
        return fieldLogradouroRef.current
      case IdxTipoEndereco:
        return tipoEnderecoFocusIndex === 0
          ? fieldTipoEndComercialRef.current
          : fieldTipoEndEmpresarialRef.current
      case IdxUf:
        return fieldUfRef.current
      case IdxCidade:
        return fieldCidadeRef.current
      case IdxTipoVia:
        if (tipoViaFocusIndex === 0) return fieldTipoViaRuaRef.current
        if (tipoViaFocusIndex === 1) return fieldTipoViaAvenidaRef.current
        return fieldTipoViaLogradouroRef.current
      case IdxDescricaoVia:
        return fieldDescricaoViaRef.current
      default:
        return fieldNomeRef.current
    }
  }

  const focusField = (index: number, center = false) => {
    if (index < 0 || index >= TOTAL_FIELDS) return
    const el = getFieldRef(index)
    if (!el) return
    el.focus()
    if (center) {
      el.scrollIntoView({ block: 'center' })
    }
  }

  useEffect(() => {
    // foco inicial
    focusField(IdxNome, true)
  }, [])

  // ===== helpers de validação =====

  const getFirstInvalidRequiredFieldIndex = (): number | null => {
    if (!model.Nome.trim()) return IdxNome
    if (!model.Cpf.trim()) return IdxCpf
    if (!model.Email.trim()) return IdxEmail
    if (!hasTipoViaSelecionado) return IdxTipoVia
    return null
  }

  const canLeaveField = (index: number): boolean => {
    setGlobalError(null)

    switch (index) {
      case IdxNome:
        if (!model.Nome.trim()) {
          setNomeError('Nome é obrigatório.')
          setGlobalError('Preencha o nome antes de continuar.')
          return false
        }
        break

      case IdxCpf:
        if (!model.Cpf.trim()) {
          setCpfError('CPF é obrigatório.')
          setGlobalError('Preencha o CPF antes de continuar.')
          return false
        }
        break

      case IdxEmail:
        if (!model.Email.trim()) {
          setEmailError('E-mail é obrigatório.')
          setGlobalError('Preencha o e-mail antes de continuar.')
          return false
        }
        break

      case IdxTipoVia:
        if (!hasTipoViaSelecionado) {
          setTipoViaError('Selecione pelo menos um tipo de via.')
          setGlobalError(
            'Selecione Rua, Avenida ou Logradouro antes de continuar.',
          )
          return false
        }
        break
    }

    return true
  }

  const handleFieldFocus = (index: number) => {
    const firstInvalid = getFirstInvalidRequiredFieldIndex()
    if (firstInvalid !== null && firstInvalid < index) {
      setGlobalError(
        'Preencha os campos obrigatórios na ordem antes de avançar.',
      )
      focusField(firstInvalid, true)
    } else {
      setGlobalError(null)
    }
  }

  const updateModel = (field: keyof FormSimplificadoModel, value: unknown) => {
    setModel((prev) => ({ ...prev, [field]: value }))

    // limpa erros de campo ao digitar
    if (field === 'Nome') setNomeError(null)
    if (field === 'Cpf') setCpfError(null)
    if (field === 'Email') setEmailError(null)
    if (
      field === 'TipoViaRua' ||
      field === 'TipoViaAvenida' ||
      field === 'TipoViaLogradouro'
    ) {
      setTipoViaError(null)
    }
  }

  const handleFieldChange = (index: number, value: string) => {
    switch (index) {
      case IdxNome:
        updateModel('Nome', value)
        break
      case IdxCpf:
        updateModel('Cpf', value)
        break
      case IdxEmail:
        updateModel('Email', value)
        break
      case IdxTelefone:
        updateModel('Telefone', value)
        break
      case IdxLogradouro:
        updateModel('Logradouro', value)
        break
      case IdxUf: {
        const uf = value.toUpperCase()
        updateModel('Uf', uf)
        const lista = MUNICIPIOS_POR_UF[uf] ?? []
        setCidadesBaseAtual(lista)
        updateModel('Cidade', '')
        setCidadeDropdownOpen(false)
        setCidadeFocusedIndex(null)
        atualizarDropdownUf(uf)
        break
      }
      case IdxCidade:
        updateModel('Cidade', value)
        atualizarDropdownCidade(value)
        break
      case IdxDescricaoVia:
        updateModel('DescricaoVia', value)
        break
    }
    setGlobalError(null)
  }

  // ===== dropdowns =====

  const getUfsFiltradas = (texto: string): string[] => {
    if (!texto.trim()) return UFS
    return UFS.filter((uf) =>
      uf.toLowerCase().includes(texto.trim().toLowerCase()),
    )
  }

  const getCidadesFiltradas = (textoCidade: string): string[] => {
    if (!cidadesBaseAtual || cidadesBaseAtual.length === 0) return []
    if (!textoCidade.trim()) return cidadesBaseAtual
    return cidadesBaseAtual.filter((c) =>
      c.toLowerCase().includes(textoCidade.trim().toLowerCase()),
    )
  }

  const atualizarDropdownUf = (textoUf: string) => {
    const ufs = getUfsFiltradas(textoUf)
    setUfDropdownOpen(ufs.length > 0)
    setUfFocusedIndex(ufs.length > 0 ? 0 : null)
  }

  const atualizarDropdownCidade = (textoCidade: string) => {
    const cidades = getCidadesFiltradas(textoCidade)
    setCidadeDropdownOpen(cidades.length > 0)
    setCidadeFocusedIndex(cidades.length > 0 ? 0 : null)
  }

  const selectUf = (uf: string) => {
    if (!uf) return
    updateModel('Uf', uf.toUpperCase())
    const lista = MUNICIPIOS_POR_UF[uf] ?? []
    setCidadesBaseAtual(lista)
    updateModel('Cidade', '')
    setUfDropdownOpen(false)
    setUfFocusedIndex(null)
  }

  const selectCidade = (cidade: string) => {
    if (!cidade) return
    updateModel('Cidade', cidade)
    setCidadeDropdownOpen(false)
    setCidadeFocusedIndex(null)
  }

  const toggleUfDropdown = () => {
    const lista = getUfsFiltradas(model.Uf)
    if (lista.length === 0) return
    setUfDropdownOpen((prev) => {
      const open = !prev
      setUfFocusedIndex(open ? 0 : null)
      return open
    })
  }

  const toggleCidadeDropdown = () => {
    const lista = getCidadesFiltradas(model.Cidade)
    if (lista.length === 0) return
    setCidadeDropdownOpen((prev) => {
      const open = !prev
      setCidadeFocusedIndex(open ? 0 : null)
      return open
    })
  }

  // ===== tipo de via (checkboxes) =====
  const toggleTipoVia = (index: number) => {
    if (index === 0) updateModel('TipoViaRua', !model.TipoViaRua)
    if (index === 1) updateModel('TipoViaAvenida', !model.TipoViaAvenida)
    if (index === 2)
      updateModel('TipoViaLogradouro', !model.TipoViaLogradouro)
  }

  // ===== teclado =====
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>, index: number) => {
    // Radio: Tipo de endereço
    if (index === IdxTipoEndereco) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        setTipoEnderecoFocusIndex((prev) => {
          const next = prev === 0 ? 1 : 0
          const value = next === 0 ? 'Comercial' : 'Empresarial'
          updateModel('TipoEndereco', value)
          const ref =
            next === 0 ? fieldTipoEndComercialRef.current : fieldTipoEndEmpresarialRef.current
          ref?.focus()
          return next
        })
        return
      }

      if (e.key === ' ') {
        e.preventDefault()
        const value = tipoEnderecoFocusIndex === 0 ? 'Comercial' : 'Empresarial'
        updateModel('TipoEndereco', value)
        return
      }
    }

    // Checkboxes: Tipo de via
    if (index === IdxTipoVia) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const total = 3
        setTipoViaFocusIndex((prev) => {
          const forward = e.key === 'ArrowRight'
          const next = forward
            ? (prev + 1) % total
            : (prev - 1 + total) % total

          const ref: HTMLInputElement | null =
            next === 0
              ? fieldTipoViaRuaRef.current
              : next === 1
              ? fieldTipoViaAvenidaRef.current
              : fieldTipoViaLogradouroRef.current

          ref?.focus()
          return next
        })
        return
      }

      if (e.key === ' ') {
        e.preventDefault()
        toggleTipoVia(tipoViaFocusIndex)
        return
      }
    }

    // Dropdowns: UF / Cidade
    if (index === IdxUf || index === IdxCidade) {
      const isUf = index === IdxUf
      const isOpen = isUf ? ufDropdownOpen : cidadeDropdownOpen
      const focused = isUf ? ufFocusedIndex : cidadeFocusedIndex
      const options = isUf
        ? getUfsFiltradas(model.Uf)
        : getCidadesFiltradas(model.Cidade)
      const count = options.length

      // F4 / Space abre dropdown
      if ((e.key === 'F4' || e.key === ' ') && !isOpen) {
        e.preventDefault()
        if (count === 0) return
        if (isUf) {
          setUfDropdownOpen(true)
          setUfFocusedIndex(0)
        } else {
          setCidadeDropdownOpen(true)
          setCidadeFocusedIndex(0)
        }
        return
      }

      if (isOpen && count > 0) {
        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight'
        ) {
          e.preventDefault()
          let idx = focused ?? -1
          const forward =
            e.key === 'ArrowDown' || e.key === 'ArrowRight'
          idx = forward
            ? (idx + 1 + count) % count
            : (idx - 1 + count) % count

          if (isUf) setUfFocusedIndex(idx)
          else setCidadeFocusedIndex(idx)

          return
        }

        if (e.key === ' ') {
          e.preventDefault()
          if (focused != null) {
            const valor = options[focused]
            if (isUf) selectUf(valor)
            else selectCidade(valor)
          }
          return
        }

        if (e.key === 'Enter') {
          e.preventDefault()
          if (focused != null) {
            const valor = options[focused]
            if (isUf) selectUf(valor)
            else selectCidade(valor)
          }

          if (!canLeaveField(index)) return
          const next = Math.min(TOTAL_FIELDS - 1, index + 1)
          focusField(next)
          return
        }

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
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          // não faz nada quando dropdown fechado
          return
        }
      }
    }

    // Ctrl+Home / Ctrl+End
    if (e.key === 'Home' && e.ctrlKey) {
      e.preventDefault()
      setGlobalError(null)
      focusField(IdxNome, true)
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
      const firstInvalid = getFirstInvalidRequiredFieldIndex()
      if (firstInvalid !== null && firstInvalid < target) {
        setGlobalError(
          'Preencha os campos obrigatórios na ordem antes de avançar.',
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

    // Navegação padrão
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault()
      if (!canLeaveField(index)) return
      setGlobalError(null)
      const next = Math.min(TOTAL_FIELDS - 1, index + 1)
      const center = next === IdxUf || next === IdxCidade
      focusField(next, center)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(0, index - 1)
      const center = prev === IdxUf || prev === IdxCidade
      focusField(prev, center)
      return
    }
  }

  // ===== submit =====
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMensagemSucesso(null)

    const firstInvalid = getFirstInvalidRequiredFieldIndex()
    if (firstInvalid !== null) {
      setGlobalError('Preencha os campos obrigatórios antes de enviar.')

      // seta mensagens por campo principais
      if (!model.Nome.trim()) setNomeError('Nome é obrigatório.')
      if (!model.Cpf.trim()) setCpfError('CPF é obrigatório.')
      if (!model.Email.trim()) setEmailError('E-mail é obrigatório.')
      if (!hasTipoViaSelecionado)
        setTipoViaError('Selecione pelo menos um tipo de via.')

      focusField(firstInvalid, true)
      return
    }

    setGlobalError(null)
    setMensagemSucesso(
      'Formulário válido. Versão Next com navegação apenas por teclado.',
    )
  }

  // ===== RENDER =====
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
              Use as setas, Enter, Ctrl+Home / Ctrl+End, PageUp / PageDown.
              Não é permitido pular campos obrigatórios.
            </p>
          </div>

          <form autoComplete='off' onSubmit={handleSubmit}>
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

              {/* 0 - Nome */}
              <div className='space-y-1'>
                <label className='text-xs text-slate-700' htmlFor='campo-nome'>
                  Nome completo <span className='text-red-500'>*</span>
                </label>
                <input
                  id='campo-nome'
                  ref={fieldNomeRef}
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='Informe o nome'
                  value={model.Nome}
                  onChange={(e) =>
                    handleFieldChange(IdxNome, e.target.value)
                  }
                  onFocus={() => handleFieldFocus(IdxNome)}
                  onKeyDown={(e) => handleKeyDown(e, IdxNome)}
                />
                {nomeError && (
                  <p className='text-[10px] text-red-500 mt-0.5'>
                    {nomeError}
                  </p>
                )}
              </div>

              {/* 1 - CPF */}
              <div className='space-y-1'>
                <label className='text-xs text-slate-700' htmlFor='campo-cpf'>
                  CPF <span className='text-red-500'>*</span>
                </label>
                <input
                  id='campo-cpf'
                  ref={fieldCpfRef}
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='999.999.999-99'
                  value={model.Cpf}
                  onChange={(e) =>
                    handleFieldChange(IdxCpf, e.target.value)
                  }
                  onFocus={() => handleFieldFocus(IdxCpf)}
                  onKeyDown={(e) => handleKeyDown(e, IdxCpf)}
                />
                {cpfError && (
                  <p className='text-[10px] text-red-500 mt-0.5'>
                    {cpfError}
                  </p>
                )}
              </div>

              {/* 2 - E-mail */}
              <div className='space-y-1'>
                <label
                  className='text-xs text-slate-700'
                  htmlFor='campo-email'
                >
                  E-mail <span className='text-red-500'>*</span>
                </label>
                <input
                  id='campo-email'
                  ref={fieldEmailRef}
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='email@dominio.com'
                  value={model.Email}
                  onChange={(e) =>
                    handleFieldChange(IdxEmail, e.target.value)
                  }
                  onFocus={() => handleFieldFocus(IdxEmail)}
                  onKeyDown={(e) => handleKeyDown(e, IdxEmail)}
                />
                {emailError && (
                  <p className='text-[10px] text-red-500 mt-0.5'>
                    {emailError}
                  </p>
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
                  ref={fieldTelefoneRef}
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='(00) 00000-0000'
                  value={model.Telefone}
                  onChange={(e) =>
                    handleFieldChange(IdxTelefone, e.target.value)
                  }
                  onFocus={() => handleFieldFocus(IdxTelefone)}
                  onKeyDown={(e) => handleKeyDown(e, IdxTelefone)}
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
                  ref={fieldLogradouroRef}
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='Rua, avenida...'
                  value={model.Logradouro}
                  onChange={(e) =>
                    handleFieldChange(IdxLogradouro, e.target.value)
                  }
                  onFocus={() => handleFieldFocus(IdxLogradouro)}
                  onKeyDown={(e) => handleKeyDown(e, IdxLogradouro)}
                />
              </div>

              {/* 5 - Tipo de endereço (radio) */}
              <div className='space-y-1'>
                <span className='text-xs text-slate-700'>
                  Tipo de endereço
                </span>
                <div className='flex items-center gap-4'>
                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      type='radio'
                      name='tipo-endereco'
                      value='Comercial'
                      ref={fieldTipoEndComercialRef}
                      checked={model.TipoEndereco === 'Comercial'}
                      onChange={() =>
                        updateModel('TipoEndereco', 'Comercial')
                      }
                      onFocus={() => {
                        setTipoEnderecoFocusIndex(0)
                        handleFieldFocus(IdxTipoEndereco)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, IdxTipoEndereco)}
                      className='h-3.5 w-3.5 border-border-soft text-primary'
                    />
                    <span className='ml-1'>Comercial</span>
                  </label>

                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      type='radio'
                      name='tipo-endereco'
                      value='Empresarial'
                      ref={fieldTipoEndEmpresarialRef}
                      checked={model.TipoEndereco === 'Empresarial'}
                      onChange={() =>
                        updateModel('TipoEndereco', 'Empresarial')
                      }
                      onFocus={() => {
                        setTipoEnderecoFocusIndex(1)
                        handleFieldFocus(IdxTipoEndereco)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, IdxTipoEndereco)}
                      className='h-3.5 w-3.5 border-border-soft text-primary'
                    />
                    <span className='ml-1'>Empresarial</span>
                  </label>
                </div>
              </div>

              {/* 6 - UF */}
              <div className='space-y-1'>
                <label className='text-xs text-slate-700' htmlFor='campo-uf'>
                  UF
                </label>
                <div className='relative'>
                  <input
                    id='campo-uf'
                    ref={fieldUfRef}
                    value={model.Uf}
                    onChange={(e) =>
                      handleFieldChange(IdxUf, e.target.value)
                    }
                    onFocus={() => handleFieldFocus(IdxUf)}
                    onKeyDown={(e) => handleKeyDown(e, IdxUf)}
                    placeholder='UF'
                    autoComplete='off'
                    className='h-9 w-full rounded-md border border-border-soft px-3 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
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
                    <div className='absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border-soft bg-white shadow-md text-xs'>
                      {getUfsFiltradas(model.Uf).map((uf, i) => {
                        const isFocused = ufFocusedIndex === i
                        return (
                          <div
                            key={uf}
                            className={`px-2 py-1 cursor-pointer ${
                              isFocused
                                ? 'bg-primary text-white'
                                : 'hover:bg-slate-100'
                            }`}
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

              {/* 7 - Cidade */}
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
                    ref={fieldCidadeRef}
                    value={model.Cidade}
                    onChange={(e) =>
                      handleFieldChange(IdxCidade, e.target.value)
                    }
                    onFocus={() => handleFieldFocus(IdxCidade)}
                    onKeyDown={(e) => handleKeyDown(e, IdxCidade)}
                    placeholder='Cidade'
                    autoComplete='off'
                    className='h-9 w-full rounded-md border border-border-soft px-3 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
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
                    <div className='absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border-soft bg-white shadow-md text-xs'>
                      {getCidadesFiltradas(model.Cidade).map((cidade, i) => {
                        const isFocused = cidadeFocusedIndex === i
                        return (
                          <div
                            key={`${cidade}-${i}`}
                            className={`px-2 py-1 cursor-pointer ${
                              isFocused
                                ? 'bg-primary text-white'
                                : 'hover:bg-slate-100'
                            }`}
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

              {/* 8 - Tipo de via */}
              <div className='space-y-1'>
                <span className='text-xs text-slate-700'>
                  Tipo de via <span className='text-red-500'>*</span>
                </span>
                <div className='flex items-center gap-4'>
                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      type='checkbox'
                      ref={fieldTipoViaRuaRef}
                      checked={model.TipoViaRua}
                      onChange={() => toggleTipoVia(0)}
                      onFocus={() => {
                        setTipoViaFocusIndex(0)
                        handleFieldFocus(IdxTipoVia)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, IdxTipoVia)}
                      className='h-3.5 w-3.5 border-border-soft text-primary'
                    />
                    <span className='ml-1'>Rua</span>
                  </label>

                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      type='checkbox'
                      ref={fieldTipoViaAvenidaRef}
                      checked={model.TipoViaAvenida}
                      onChange={() => toggleTipoVia(1)}
                      onFocus={() => {
                        setTipoViaFocusIndex(1)
                        handleFieldFocus(IdxTipoVia)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, IdxTipoVia)}
                      className='h-3.5 w-3.5 border-border-soft text-primary'
                    />
                    <span className='ml-1'>Avenida</span>
                  </label>

                  <label className='inline-flex items-center text-xs text-slate-700'>
                    <input
                      type='checkbox'
                      ref={fieldTipoViaLogradouroRef}
                      checked={model.TipoViaLogradouro}
                      onChange={() => toggleTipoVia(2)}
                      onFocus={() => {
                        setTipoViaFocusIndex(2)
                        handleFieldFocus(IdxTipoVia)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, IdxTipoVia)}
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

              {/* 9 - Descrição da via */}
              <div className='space-y-1'>
                <label
                  className='text-xs text-slate-700'
                  htmlFor='campo-desc-via'
                >
                  Nome da rua/avenida/logradouro
                </label>
                <textarea
                  id='campo-desc-via'
                  ref={fieldDescricaoViaRef}
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-slate-100 disabled:text-slate-400'
                  placeholder='Ex.: Rua das Flores, Av. Paulista...'
                  value={model.DescricaoVia}
                  disabled={!hasTipoViaSelecionado}
                  onChange={(e) =>
                    handleFieldChange(IdxDescricaoVia, e.target.value)
                  }
                  onFocus={() => handleFieldFocus(IdxDescricaoVia)}
                  onKeyDown={(e) => handleKeyDown(e, IdxDescricaoVia)}
                />
              </div>

              {/* Botão */}
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
