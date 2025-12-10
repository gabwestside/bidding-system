'use client'

import React, {
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  ChangeEvent,
} from 'react'
import { obterMunicipiosPorUf } from '@/lib/service'

type FieldElement = HTMLInputElement | HTMLSelectElement

const PAGE_SIZE = 8

export default function FormTecladoPage() {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  const [logradouro, setLogradouro] = useState('')
  const [tipoEndereco, setTipoEndereco] = useState('')
  const [numero, setNumero] = useState('')
  const [bairro, setBairro] = useState('')
  const [uf, setUf] = useState('')
  const [cidade, setCidade] = useState('')
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

  const [nomeError, setNomeError] = useState<string | null>(null)
  const [cpfError, setCpfError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [empresaError, setEmpresaError] = useState<string | null>(null)
  const [globalError, setGlobalError] = useState<string | null>(null)

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

  const municipios = uf ? obterMunicipiosPorUf(uf) : []

  const nomeRef = useRef<HTMLInputElement>(null) // 0
  const cpfRef = useRef<HTMLInputElement>(null) // 1
  const emailRef = useRef<HTMLInputElement>(null) // 2
  const telefoneRef = useRef<HTMLInputElement>(null) // 3

  const logradouroRef = useRef<HTMLInputElement>(null) // 4
  const tipoEnderecoRef = useRef<HTMLInputElement>(null) // 5 (primeiro radio)
  const numeroRef = useRef<HTMLInputElement>(null) // 6
  const bairroRef = useRef<HTMLInputElement>(null) // 7
  const ufRef = useRef<HTMLSelectElement>(null) // 8
  const cidadeRef = useRef<HTMLSelectElement>(null) // 9
  const cepRef = useRef<HTMLInputElement>(null) // 10
  const complementoRef = useRef<HTMLInputElement>(null) // 11

  const empresaRef = useRef<HTMLInputElement>(null) // 12
  const cargoRef = useRef<HTMLInputElement>(null) // 13
  const departamentoRef = useRef<HTMLInputElement>(null) // 14

  const celularRef = useRef<HTMLInputElement>(null) // 15
  const whatsapp2Ref = useRef<HTMLInputElement>(null) // 16
  const email2Ref = useRef<HTMLInputElement>(null) // 17

  const obs1Ref = useRef<HTMLInputElement>(null) // 18
  const obs2Ref = useRef<HTMLInputElement>(null) // 19
  const obs3Ref = useRef<HTMLInputElement>(null) // 20

  const fieldRefs: React.RefObject<FieldElement | null>[] = [
    nomeRef as React.RefObject<FieldElement | null>,
    cpfRef as React.RefObject<FieldElement | null>,
    emailRef as React.RefObject<FieldElement | null>,
    telefoneRef as React.RefObject<FieldElement | null>,
    logradouroRef as React.RefObject<FieldElement | null>,
    tipoEnderecoRef as React.RefObject<FieldElement | null>,
    numeroRef as React.RefObject<FieldElement | null>,
    bairroRef as React.RefObject<FieldElement | null>,
    ufRef as React.RefObject<FieldElement | null>,
    cidadeRef as React.RefObject<FieldElement | null>,
    cepRef as React.RefObject<FieldElement | null>,
    complementoRef as React.RefObject<FieldElement | null>,
    empresaRef as React.RefObject<FieldElement | null>,
    cargoRef as React.RefObject<FieldElement | null>,
    departamentoRef as React.RefObject<FieldElement | null>,
    celularRef as React.RefObject<FieldElement | null>,
    whatsapp2Ref as React.RefObject<FieldElement | null>,
    email2Ref as React.RefObject<FieldElement | null>,
    obs1Ref as React.RefObject<FieldElement | null>,
    obs2Ref as React.RefObject<FieldElement | null>,
    obs3Ref as React.RefObject<FieldElement | null>,
  ]

  // foco inicial
  useEffect(() => {
    fieldRefs[0]?.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ----------------- helpers de navegação / validação -----------------

  const focusAt = (index: number) => {
    if (index < 0 || index >= fieldRefs.length) return
    const el = fieldRefs[index].current
    if (el) el.focus()
  }

  const getFirstInvalidRequiredIndex = (): number | null => {
    if (!nome.trim()) return 0
    if (!cpf.trim()) return 1
    if (!email.trim()) return 2
    if (!empresa.trim()) return 12
    return null
  }

  const handleFieldFocus = (index: number) => {
    const firstInvalid = getFirstInvalidRequiredIndex()
    if (firstInvalid !== null && firstInvalid < index) {
      setGlobalError(
        'Preencha os campos obrigatórios na ordem antes de avançar.'
      )
      focusAt(firstInvalid)
    } else {
      setGlobalError(null)
    }
  }

  const canLeaveField = (index: number): boolean => {
    setGlobalError(null)

    switch (index) {
      case 0: {
        if (!nome.trim()) {
          setNomeError('Campo obrigatório.')
          setGlobalError('Preencha o nome antes de continuar.')
          return false
        }
        break
      }
      case 1: {
        if (!cpf.trim()) {
          setCpfError('Campo obrigatório.')
          setGlobalError('Preencha o CPF antes de continuar.')
          return false
        }
        break
      }
      case 2: {
        if (!email.trim()) {
          setEmailError('Campo obrigatório.')
          setGlobalError('Preencha o e-mail antes de continuar.')
          return false
        }
        break
      }
      case 12: {
        if (!empresa.trim()) {
          setEmpresaError('Campo obrigatório.')
          setGlobalError('Preencha a empresa antes de continuar.')
          return false
        }
        break
      }
    }

    return true
  }

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    // Ctrl + Home => primeiro
    if (e.key === 'Home' && e.ctrlKey) {
      e.preventDefault()
      setGlobalError(null)
      focusAt(0)
      return
    }

    // Ctrl + End => último
    if (e.key === 'End' && e.ctrlKey) {
      e.preventDefault()
      setGlobalError(null)
      focusAt(fieldRefs.length - 1)
      return
    }

    // PageDown => pula "bloco" para frente (respeitando obrigatórios)
    if (e.key === 'PageDown') {
      e.preventDefault()
      const target = Math.min(fieldRefs.length - 1, index + PAGE_SIZE)
      const firstInvalid = getFirstInvalidRequiredIndex()
      if (firstInvalid !== null && firstInvalid < target) {
        setGlobalError(
          'Preencha os campos obrigatórios na ordem antes de avançar.'
        )
        focusAt(firstInvalid)
      } else {
        setGlobalError(null)
        focusAt(target)
      }
      return
    }

    // PageUp => pula "bloco" para trás
    if (e.key === 'PageUp') {
      e.preventDefault()
      const target = Math.max(0, index - PAGE_SIZE)
      setGlobalError(null)
      focusAt(target)
      return
    }

    switch (e.key) {
      case 'ArrowDown':
      case 'Enter': {
        e.preventDefault()
        if (!canLeaveField(index)) return
        const next = Math.min(fieldRefs.length - 1, index + 1)
        focusAt(next)
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        const prev = Math.max(0, index - 1)
        focusAt(prev)
        break
      }
    }
  }

  const handleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value
    setGlobalError(null)

    switch (index) {
      case 0:
        setNome(value)
        setNomeError(value.trim() ? null : 'Campo obrigatório.')
        break
      case 1:
        setCpf(value)
        setCpfError(value.trim() ? null : 'Campo obrigatório.')
        break
      case 2:
        setEmail(value)
        setEmailError(value.trim() ? null : 'Campo obrigatório.')
        break
      case 3:
        setTelefone(value)
        break
      case 4:
        setLogradouro(value)
        break
      case 5:
        setTipoEndereco(value) // Comercial / Empresarial
        break
      case 6:
        setNumero(value)
        break
      case 7:
        setBairro(value)
        break
      case 8:
        setUf(value)
        setCidade('')
        break
      case 9:
        setCidade(value)
        break
      case 10:
        setCep(value)
        break
      case 11:
        setComplemento(value)
        break
      case 12:
        setEmpresa(value)
        setEmpresaError(value.trim() ? null : 'Campo obrigatório.')
        break
      case 13:
        setCargo(value)
        break
      case 14:
        setDepartamento(value)
        break
      case 15:
        setCelular(value)
        break
      case 16:
        setWhatsappComercial(value)
        break
      case 17:
        setEmailAlternativo(value)
        break
      case 18:
        setObs1(value)
        break
      case 19:
        setObs2(value)
        break
      case 20:
        setObs3(value)
        break
    }
  }

  // ----------------- JSX -----------------

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
                onChange={(e) => handleChange(0, e)}
                onFocus={() => handleFieldFocus(0)}
                onKeyDown={(e) => handleKeyDown(0, e)}
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
                onChange={(e) => handleChange(1, e)}
                onFocus={() => handleFieldFocus(1)}
                onKeyDown={(e) => handleKeyDown(1, e)}
                placeholder='999.999.999-99'
                className={`h-9 w-full rounded-md border ${
                  cpfError ? 'border-red-400' : 'border-border-soft'
                } px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
              />
              {cpfError && (
                <p className='text-[10px] text-red-500 mt-0.5'>{cpfError}</p>
              )}
            </div>

            {/* 2 - Email */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-email'>
                E-mail <span className='text-red-500'>*</span>
              </label>
              <input
                id='campo-email'
                ref={emailRef}
                value={email}
                onChange={(e) => handleChange(2, e)}
                onFocus={() => handleFieldFocus(2)}
                onKeyDown={(e) => handleKeyDown(2, e)}
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
                onChange={(e) => handleChange(3, e)}
                onFocus={() => handleFieldFocus(3)}
                onKeyDown={(e) => handleKeyDown(3, e)}
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
                onChange={(e) => handleChange(4, e)}
                onFocus={() => handleFieldFocus(4)}
                onKeyDown={(e) => handleKeyDown(4, e)}
                placeholder='Rua, avenida...'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 5 - Tipo de Endereço (radio) */}
            <div className='space-y-1'>
              <span className='text-xs text-slate-700'>Tipo de endereço</span>
              <div className='flex items-center gap-4 pt-2'>
                <label className='inline-flex items-center text-xs text-slate-700'>
                  <input
                    type='radio'
                    name='tipoEndereco'
                    value='Comercial'
                    ref={tipoEnderecoRef}
                    checked={tipoEndereco === 'Comercial'}
                    onChange={(e) => handleChange(5, e)}
                    onFocus={() => handleFieldFocus(5)}
                    onKeyDown={(e) => handleKeyDown(5, e)}
                    className='h-3.5 w-3.5 border-border-soft text-primary'
                  />
                  <span className='ml-1'>Comercial</span>
                </label>

                <label className='inline-flex items-center text-xs text-slate-700'>
                  <input
                    type='radio'
                    name='tipoEndereco'
                    value='Empresarial'
                    checked={tipoEndereco === 'Empresarial'}
                    onChange={(e) => handleChange(5, e)}
                    onFocus={() => handleFieldFocus(5)}
                    onKeyDown={(e) => handleKeyDown(5, e)}
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
                onChange={(e) => handleChange(6, e)}
                onFocus={() => handleFieldFocus(6)}
                onKeyDown={(e) => handleKeyDown(6, e)}
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
                onChange={(e) => handleChange(7, e)}
                onFocus={() => handleFieldFocus(7)}
                onKeyDown={(e) => handleKeyDown(7, e)}
                placeholder='Bairro'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 8 - UF */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-uf'>
                UF
              </label>
              <select
                id='campo-uf'
                ref={ufRef}
                value={uf}
                onChange={(e) => handleChange(8, e)}
                onFocus={() => handleFieldFocus(8)}
                onKeyDown={(e) => handleKeyDown(8, e)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              >
                <option value=''>UF</option>
                {ufs.map((sigla) => (
                  <option key={sigla} value={sigla}>
                    {sigla}
                  </option>
                ))}
              </select>
            </div>

            {/* 9 - Cidade (dependente de UF) */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-cidade'>
                Cidade
              </label>
              <select
                id='campo-cidade'
                ref={cidadeRef}
                value={cidade}
                onChange={(e) => handleChange(9, e)}
                onFocus={() => handleFieldFocus(9)}
                onKeyDown={(e) => handleKeyDown(9, e)}
                disabled={!uf}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-slate-50'
              >
                <option value=''>Selecione a cidade</option>
                {municipios.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
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
                onChange={(e) => handleChange(10, e)}
                onFocus={() => handleFieldFocus(10)}
                onKeyDown={(e) => handleKeyDown(10, e)}
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
                onChange={(e) => handleChange(11, e)}
                onFocus={() => handleFieldFocus(11)}
                onKeyDown={(e) => handleKeyDown(11, e)}
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
                onChange={(e) => handleChange(12, e)}
                onFocus={() => handleFieldFocus(12)}
                onKeyDown={(e) => handleKeyDown(12, e)}
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
                onChange={(e) => handleChange(13, e)}
                onFocus={() => handleFieldFocus(13)}
                onKeyDown={(e) => handleKeyDown(13, e)}
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
                onChange={(e) => handleChange(14, e)}
                onFocus={() => handleFieldFocus(14)}
                onKeyDown={(e) => handleKeyDown(14, e)}
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
                onChange={(e) => handleChange(15, e)}
                onFocus={() => handleFieldFocus(15)}
                onKeyDown={(e) => handleKeyDown(15, e)}
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
                onChange={(e) => handleChange(16, e)}
                onFocus={() => handleFieldFocus(16)}
                onKeyDown={(e) => handleKeyDown(16, e)}
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
                onChange={(e) => handleChange(17, e)}
                onFocus={() => handleFieldFocus(17)}
                onKeyDown={(e) => handleKeyDown(17, e)}
                placeholder='email@alternativo.com'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* BLOCO 5 - Observações */}
            <div className='text-[11px] font-semibold text-slate-600 mt-3'>
              Observações
            </div>

            {/* 18 - Obs 1 */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-obs1'>
                Observação 1
              </label>
              <input
                id='campo-obs1'
                ref={obs1Ref}
                value={obs1}
                onChange={(e) => handleChange(18, e)}
                onFocus={() => handleFieldFocus(18)}
                onKeyDown={(e) => handleKeyDown(18, e)}
                placeholder='Observação 1'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 19 - Obs 2 */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-obs2'>
                Observação 2
              </label>
              <input
                id='campo-obs2'
                ref={obs2Ref}
                value={obs2}
                onChange={(e) => handleChange(19, e)}
                onFocus={() => handleFieldFocus(19)}
                onKeyDown={(e) => handleKeyDown(19, e)}
                placeholder='Observação 2'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            {/* 20 - Obs 3 */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-obs3'>
                Observação 3
              </label>
              <input
                id='campo-obs3'
                ref={obs3Ref}
                value={obs3}
                onChange={(e) => handleChange(20, e)}
                onFocus={() => handleFieldFocus(20)}
                onKeyDown={(e) => handleKeyDown(20, e)}
                placeholder='Observação 3'
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>
          </div>

          <div className='px-4 pt-1 pb-3 border-t border-border-soft text-[11px] text-slate-500 space-y-0.5'>
            <p>
              Navegação entre campos:
              <span className='font-medium'> ↑ / ↓ / Enter </span> muda de
              campo.
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
          </div>
        </div>
      </div>
    </div>
  )
}
