'use client'

import React, { KeyboardEvent, useEffect, useRef, useState } from 'react'

const TOTAL_FIELDS = 21
const PAGE_SIZE = 8

export default function FormTecladoPage() {
  // Valores
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  const [logradouro, setLogradouro] = useState('')
  const [tipoEndereco, setTipoEndereco] = useState<
    'Comercial' | 'Empresarial' | ''
  >('')
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

  // Erros obrigatórios
  const [nomeError, setNomeError] = useState<string | null>(null)
  const [cpfError, setCpfError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [empresaError, setEmpresaError] = useState<string | null>(null)

  const [globalError, setGlobalError] = useState<string | null>(null)

  // Refs (0..20)
  const nomeRef = useRef<HTMLInputElement | null>(null) // 0
  const cpfRef = useRef<HTMLInputElement | null>(null) // 1
  const emailRef = useRef<HTMLInputElement | null>(null) // 2
  const telefoneRef = useRef<HTMLInputElement | null>(null) // 3

  const logradouroRef = useRef<HTMLInputElement | null>(null) // 4

  // rádio (grupo índice 5)
  const tipoEndComRef = useRef<HTMLInputElement | null>(null) // 5 - Comercial
  const tipoEndEmpRef = useRef<HTMLInputElement | null>(null) // 5 - Empresarial

  const numeroRef = useRef<HTMLInputElement | null>(null) // 6
  const bairroRef = useRef<HTMLInputElement | null>(null) // 7
  const cidadeRef = useRef<HTMLInputElement | null>(null) // 8
  const ufRef = useRef<HTMLInputElement | null>(null) // 9
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

  const fieldRefs: React.RefObject<HTMLInputElement | null>[] = [
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

  // qual rádio está focado no grupo (0 = Comercial, 1 = Empresarial)
  const [tipoEnderecoFocusIndex, setTipoEnderecoFocusIndex] = useState<0 | 1>(0)

  // foco inicial
  useEffect(() => {
    fieldRefs[0]?.current?.focus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const focusField = (index: number) => {
    if (index < 0 || index >= TOTAL_FIELDS) return
    fieldRefs[index]?.current?.focus()
  }

  const getFirstInvalidRequiredFieldIndex = (): number | null => {
    if (!nome.trim()) return 0
    if (!cpf.trim()) return 1
    if (!email.trim()) return 2
    if (!empresa.trim()) return 12
    return null
  }

  const handleFieldFocus = (index: number) => {
    const firstInvalid = getFirstInvalidRequiredFieldIndex()
    if (firstInvalid != null && firstInvalid < index) {
      setGlobalError(
        'Preencha os campos obrigatórios na ordem antes de avançar.'
      )
      focusField(firstInvalid)
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

  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLElement>) => {
    // --- comportamento especial para o rádio (campo 5) ---
    if (index === 5) {
      // setas horizontais só mudam FOCO entre Comercial / Empresarial
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const nextFocus = tipoEnderecoFocusIndex === 0 ? 1 : 0
        setTipoEnderecoFocusIndex(nextFocus)

        const targetRef = nextFocus === 0 ? tipoEndComRef : tipoEndEmpRef
        targetRef.current?.focus()
        return
      }

      // espaço seleciona o valor atualmente focado
      if (e.key === ' ') {
        e.preventDefault()
        setTipoEndereco(
          tipoEnderecoFocusIndex === 0 ? 'Comercial' : 'Empresarial'
        )
        return
      }
      // Enter NÃO seleciona; será tratado abaixo apenas como “próximo campo”
    }

    // Ctrl + Home => primeiro campo
    if (e.key === 'Home' && e.ctrlKey) {
      e.preventDefault()
      setGlobalError(null)
      focusField(0)
      return
    }

    // Ctrl + End => último campo
    if (e.key === 'End' && e.ctrlKey) {
      e.preventDefault()
      setGlobalError(null)
      focusField(TOTAL_FIELDS - 1)
      return
    }

    // PageDown => pula "bloco" pra frente (respeitando obrigatórios)
    if (e.key === 'PageDown') {
      e.preventDefault()
      const target = Math.min(TOTAL_FIELDS - 1, index + PAGE_SIZE)
      const firstInvalid = getFirstInvalidRequiredFieldIndex()

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

    // PageUp => bloco pra trás
    if (e.key === 'PageUp') {
      e.preventDefault()
      const target = Math.max(0, index - PAGE_SIZE)
      setGlobalError(null)
      focusField(target)
      return
    }

    switch (e.key) {
      case 'ArrowDown':
      case 'Enter': {
        e.preventDefault()
        if (!canLeaveField(index)) return
        const nextIndex = Math.min(TOTAL_FIELDS - 1, index + 1)
        focusField(nextIndex)
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        const prevIndex = Math.max(0, index - 1)
        focusField(prevIndex)
        break
      }
    }
  }

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
                className={`h-9 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  nomeError ? 'border-red-400' : 'border-border-soft'
                }`}
                placeholder='Informe o nome'
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value)
                  setNomeError(null)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(0)}
                onKeyDown={handleKeyDown(0)}
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
                className={`h-9 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  cpfError ? 'border-red-400' : 'border-border-soft'
                }`}
                placeholder='999.999.999-99'
                value={cpf}
                onChange={(e) => {
                  setCpf(e.target.value)
                  setCpfError(null)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(1)}
                onKeyDown={handleKeyDown(1)}
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
                className={`h-9 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  emailError ? 'border-red-400' : 'border-border-soft'
                }`}
                placeholder='email@dominio.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError(null)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(2)}
                onKeyDown={handleKeyDown(2)}
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
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='(00) 00000-0000'
                value={telefone}
                onChange={(e) => {
                  setTelefone(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(3)}
                onKeyDown={handleKeyDown(3)}
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
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Rua, avenida...'
                value={logradouro}
                onChange={(e) => {
                  setLogradouro(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(4)}
                onKeyDown={handleKeyDown(4)}
              />
            </div>

            {/* 5 - Tipo de endereço (RÁDIO) */}
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
                      // seleção via clique/mouse
                      setTipoEndereco('Comercial')
                    }}
                    onFocus={() => {
                      setTipoEnderecoFocusIndex(0)
                      handleFieldFocus(5)
                    }}
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
                    }}
                    onFocus={() => {
                      setTipoEnderecoFocusIndex(1)
                      handleFieldFocus(5)
                    }}
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
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Número'
                value={numero}
                onChange={(e) => {
                  setNumero(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(6)}
                onKeyDown={handleKeyDown(6)}
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
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Bairro'
                value={bairro}
                onChange={(e) => {
                  setBairro(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(7)}
                onKeyDown={handleKeyDown(7)}
              />
            </div>

            {/* 8 - Cidade */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-cidade'>
                Cidade
              </label>
              <input
                id='campo-cidade'
                ref={cidadeRef}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Cidade'
                value={cidade}
                onChange={(e) => {
                  setCidade(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(8)}
                onKeyDown={handleKeyDown(8)}
              />
            </div>

            {/* 9 - UF */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-uf'>
                UF
              </label>
              <input
                id='campo-uf'
                ref={ufRef}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='UF'
                value={uf}
                onChange={(e) => {
                  setUf(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(9)}
                onKeyDown={handleKeyDown(9)}
              />
            </div>

            {/* 10 - CEP */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-cep'>
                CEP
              </label>
              <input
                id='campo-cep'
                ref={cepRef}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='00000-000'
                value={cep}
                onChange={(e) => {
                  setCep(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(10)}
                onKeyDown={handleKeyDown(10)}
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
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Apartamento, bloco...'
                value={complemento}
                onChange={(e) => {
                  setComplemento(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(11)}
                onKeyDown={handleKeyDown(11)}
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
                className={`h-9 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  empresaError ? 'border-red-400' : 'border-border-soft'
                }`}
                placeholder='Nome da empresa'
                value={empresa}
                onChange={(e) => {
                  setEmpresa(e.target.value)
                  setEmpresaError(null)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(12)}
                onKeyDown={handleKeyDown(12)}
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
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Cargo'
                value={cargo}
                onChange={(e) => {
                  setCargo(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(13)}
                onKeyDown={handleKeyDown(13)}
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
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Departamento'
                value={departamento}
                onChange={(e) => {
                  setDepartamento(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(14)}
                onKeyDown={handleKeyDown(14)}
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
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='(00) 00000-0000'
                value={celular}
                onChange={(e) => {
                  setCelular(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(15)}
                onKeyDown={handleKeyDown(15)}
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
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='(00) 00000-0000'
                value={whatsappComercial}
                onChange={(e) => {
                  setWhatsappComercial(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(16)}
                onKeyDown={handleKeyDown(16)}
              />
            </div>

            {/* 17 - Email alternativo */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-email2'>
                E-mail alternativo
              </label>
              <input
                id='campo-email2'
                ref={email2Ref}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='email@alternativo.com'
                value={emailAlternativo}
                onChange={(e) => {
                  setEmailAlternativo(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(17)}
                onKeyDown={handleKeyDown(17)}
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
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Observação 1'
                value={obs1}
                onChange={(e) => {
                  setObs1(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(18)}
                onKeyDown={handleKeyDown(18)}
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
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Observação 2'
                value={obs2}
                onChange={(e) => {
                  setObs2(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(19)}
                onKeyDown={handleKeyDown(19)}
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
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Observação 3'
                value={obs3}
                onChange={(e) => {
                  setObs3(e.target.value)
                  setGlobalError(null)
                }}
                onFocus={() => handleFieldFocus(20)}
                onKeyDown={handleKeyDown(20)}
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
          </div>
        </div>
      </div>
    </div>
  )
}
