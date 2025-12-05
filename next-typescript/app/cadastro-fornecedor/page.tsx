'use client'

import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { obterMunicipiosPorUf } from '@/lib/service'
import {
  formatCep,
  isValidCnpj,
  isValidEmail,
  isValidPhone,
  toDigits,
} from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React, { useMemo, useRef, useState } from 'react'

export default function CadastroFornecedorPage() {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [step1Valid, setStep1Valid] = useState(false)

  const [tipoPessoa, setTipoPessoa] = useState<'PJ' | 'PF' | ''>('PJ')
  const [naturezaJuridica, setNaturezaJuridica] = useState('')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [nomeFantasia, setNomeFantasia] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState('')
  const [bairro, setBairro] = useState('')
  const [uf, setUf] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [complemento, setComplemento] = useState('')
  const [telefone, setTelefone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [site, setSite] = useState('')
  const [inscricaoEstadual, setInscricaoEstadual] = useState('')
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState('')

  // Erros
  const [tipoPessoaError, setTipoPessoaError] = useState<string | null>(null)
  const [naturezaJuridicaError, setNaturezaJuridicaError] = useState<
    string | null
  >(null)
  const [razaoSocialError, setRazaoSocialError] = useState<string | null>(null)
  const [nomeFantasiaError, setNomeFantasiaError] = useState<string | null>(
    null
  )
  const [cnpjError, setCnpjError] = useState<string | null>(null)
  const [cepError, setCepError] = useState<string | null>(null)
  const [enderecoError, setEnderecoError] = useState<string | null>(null)
  const [bairroError, setBairroError] = useState<string | null>(null)
  const [ufError, setUfError] = useState<string | null>(null)
  const [municipioError, setMunicipioError] = useState<string | null>(null)
  const [telefoneError, setTelefoneError] = useState<string | null>(null)
  const [whatsappError, setWhatsappError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [siteError, setSiteError] = useState<string | null>(null)
  const [inscricaoEstadualError, setInscricaoEstadualError] = useState<
    string | null
  >(null)
  const [inscricaoMunicipalError, setInscricaoMunicipalError] = useState<
    string | null
  >(null)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const municipios = useMemo(() => (uf ? obterMunicipiosPorUf(uf) : []), [uf])

  const tipoPessoaRef = useRef<HTMLElement | null>(null)
  const naturezaJuridicaRef = useRef<HTMLElement | null>(null)
  const razaoSocialRef = useRef<HTMLElement | null>(null)
  const nomeFantasiaRef = useRef<HTMLElement | null>(null)
  const cnpjRef = useRef<HTMLElement | null>(null)
  const cepRef = useRef<HTMLElement | null>(null)
  const enderecoRef = useRef<HTMLElement | null>(null)
  const bairroRef = useRef<HTMLElement | null>(null)
  const ufRef = useRef<HTMLElement | null>(null)
  const municipioRef = useRef<HTMLElement | null>(null)
  const complementoRef = useRef<HTMLElement | null>(null)
  const telefoneRef = useRef<HTMLElement | null>(null)
  const whatsappRef = useRef<HTMLElement | null>(null)
  const emailRef = useRef<HTMLElement | null>(null)
  const siteRef = useRef<HTMLElement | null>(null)
  const inscricaoEstadualRef = useRef<HTMLElement | null>(null)
  const inscricaoMunicipalRef = useRef<HTMLElement | null>(null)

  const fieldRefs: React.RefObject<HTMLElement | null>[] = [
    tipoPessoaRef,
    naturezaJuridicaRef,
    razaoSocialRef,
    nomeFantasiaRef,
    cnpjRef,
    cepRef,
    enderecoRef,
    bairroRef,
    ufRef,
    municipioRef,
    complementoRef,
    telefoneRef,
    whatsappRef,
    emailRef,
    siteRef,
    inscricaoEstadualRef,
    inscricaoMunicipalRef,
  ]

  const getFirstInvalidIndex = (): number | null => {
    // 0 - TipoPessoa
    if (!tipoPessoa) return 0

    // 1 - NaturezaJuridica (PJ)
    if (tipoPessoa === 'PJ' && !naturezaJuridica.trim()) return 1

    // 2 - RazaoSocial
    const razao = razaoSocial.trim()
    if (!razao || razao.length > 60) return 2

    // 3 - NomeFantasia (só valida tamanho)
    const fantasia = nomeFantasia.trim()
    if (fantasia.length > 25) return 3

    // 4 - CNPJ (PJ)
    if (tipoPessoa === 'PJ') {
      if (!cnpj.trim() || !isValidCnpj(cnpj)) return 4
    }

    // 5 - CEP
    if (!cep.trim()) return 5

    // 6 - Endereco
    if (!endereco.trim()) return 6

    // 7 - Bairro
    if (!bairro.trim()) return 7

    // 8 - UF
    if (!uf.trim()) return 8

    // 9 - Municipio
    if (!municipio.trim()) return 9

    // 11 - Telefone
    const telDigits = toDigits(telefone)
    if (!telDigits || !isValidPhone(telDigits)) return 11

    // 12 - WhatsApp (se tiver)
    const whatsDigits = toDigits(whatsapp)
    if (whatsDigits && !isValidPhone(whatsDigits)) return 12

    // 13 - Email
    const emailTrim = email.trim()
    if (!emailTrim || !isValidEmail(emailTrim)) return 13

    // 14 - Site
    const siteTrim = site.trim()
    if (
      siteTrim &&
      !URL.canParse(
        siteTrim.startsWith('http') ? siteTrim : `https://${siteTrim}`
      )
    ) {
      return 14
    }

    // 15 - IE
    if (inscricaoEstadual && inscricaoEstadual.length > 20) return 15

    // 16 - IM
    if (inscricaoMunicipal && inscricaoMunicipal.length > 20) return 16

    return null
  }

  const canLeaveField = (index: number): boolean => {
    setGlobalError(null)

    switch (index) {
      case 0: {
        if (!tipoPessoa) {
          setTipoPessoaError('Campo obrigatório.')
          setGlobalError('Selecione o tipo de pessoa antes de continuar.')
          return false
        }
        break
      }
      case 1: {
        if (tipoPessoa === 'PJ' && !naturezaJuridica.trim()) {
          setNaturezaJuridicaError('Selecione a natureza jurídica.')
          setGlobalError('Selecione a natureza jurídica antes de continuar.')
          return false
        }
        break
      }
      case 2: {
        const r = razaoSocial.trim()
        if (!r) {
          setRazaoSocialError('Campo obrigatório.')
          setGlobalError('Informe a razão social antes de continuar.')
          return false
        }
        if (r.length > 60) {
          setRazaoSocialError('Máximo de 60 caracteres.')
          setGlobalError('A razão social excede o tamanho máximo.')
          return false
        }
        break
      }
      case 3: {
        const f = nomeFantasia.trim()
        if (f.length > 25) {
          setNomeFantasiaError('Máximo de 25 caracteres.')
          setGlobalError('O nome fantasia excede o tamanho máximo.')
          return false
        }
        break
      }
      case 4: {
        if (tipoPessoa === 'PJ') {
          if (!cnpj.trim()) {
            setCnpjError('Campo obrigatório.')
            setGlobalError('Informe o CNPJ antes de continuar.')
            return false
          }
          if (!isValidCnpj(cnpj)) {
            setCnpjError('CNPJ inválido.')
            setGlobalError('Corrija o CNPJ antes de continuar.')
            return false
          }
        }
        break
      }
      case 5: {
        if (!cep.trim()) {
          setCepError('Campo obrigatório.')
          setGlobalError('Informe o CEP antes de continuar.')
          return false
        }
        break
      }
      case 6: {
        if (!endereco.trim()) {
          setEnderecoError('Campo obrigatório.')
          setGlobalError('Informe o endereço antes de continuar.')
          return false
        }
        break
      }
      case 7: {
        if (!bairro.trim()) {
          setBairroError('Campo obrigatório.')
          setGlobalError('Informe o bairro antes de continuar.')
          return false
        }
        break
      }
      case 8: {
        if (!uf.trim()) {
          setUfError('Campo obrigatório.')
          setGlobalError('Selecione o UF antes de continuar.')
          return false
        }
        break
      }
      case 9: {
        if (!municipio.trim()) {
          setMunicipioError('Campo obrigatório.')
          setGlobalError('Selecione o município antes de continuar.')
          return false
        }
        break
      }
      case 11: {
        const d = toDigits(telefone)
        if (!d) {
          setTelefoneError('Campo obrigatório.')
          setGlobalError('Informe o telefone antes de continuar.')
          return false
        }
        if (!isValidPhone(d)) {
          setTelefoneError(
            'Telefone inválido. Use (00) 0000-0000 ou (00) 00000-0000.'
          )
          setGlobalError('Corrija o telefone antes de continuar.')
          return false
        }
        break
      }
      case 12: {
        const d = toDigits(whatsapp)
        if (d && !isValidPhone(d)) {
          setWhatsappError(
            'WhatsApp inválido. Use (00) 0000-0000 ou (00) 00000-0000.'
          )
          setGlobalError('Corrija o WhatsApp antes de continuar.')
          return false
        }
        break
      }
      case 13: {
        const e = email.trim()
        if (!e) {
          setEmailError('Campo obrigatório.')
          setGlobalError('Informe o e-mail antes de continuar.')
          return false
        }
        if (!isValidEmail(e)) {
          setEmailError('E-mail inválido.')
          setGlobalError('Corrija o e-mail antes de continuar.')
          return false
        }
        break
      }
      case 14: {
        const s = site.trim()
        if (s && !URL.canParse(s.startsWith('http') ? s : `https://${s}`)) {
          setSiteError('Informe uma URL válida (ex: www.seusite.com.br).')
          setGlobalError('Corrija o site antes de continuar.')
          return false
        }
        break
      }
      case 15: {
        if (inscricaoEstadual && inscricaoEstadual.length > 20) {
          setInscricaoEstadualError('Máximo de 20 caracteres.')
          setGlobalError('Corrija a inscrição estadual antes de continuar.')
          return false
        }
        break
      }
      case 16: {
        if (inscricaoMunicipal && inscricaoMunicipal.length > 20) {
          setInscricaoMunicipalError('Máximo de 20 caracteres.')
          setGlobalError('Corrija a inscrição municipal antes de continuar.')
          return false
        }
        break
      }
    }

    return true
  }

  const { handleFocus, handleKeyDown } = useKeyboardNavigation(
    fieldRefs,
    getFirstInvalidIndex,
    canLeaveField
  )

  const handleCepChange = async (value: string) => {
    const masked = formatCep(value)
    setCep(masked)
    setCepError(null)
    const digits = toDigits(masked)
    if (digits.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setEndereco(data.logradouro || endereco)
          setBairro(data.bairro || bairro)
          setUf(data.uf || uf)
          setMunicipio(data.localidade || municipio)
        }
      } catch {
        // ignore
      }
    }
  }

  const validarStep1 = () => {
    const firstInvalid = getFirstInvalidIndex()
    if (firstInvalid != null) {
      setGlobalError('Revise os campos obrigatórios antes de prosseguir.')
      fieldRefs[firstInvalid]?.current?.focus()
      return false
    }
    setGlobalError(null)
    return true
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (!validarStep1()) return
      setStep1Valid(true)
      setCurrentStep(2)
    } else if (currentStep < 5) {
      setCurrentStep((s) => s + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

  const getStepClass = (step: number) =>
    currentStep === step
      ? 'px-3 py-1.5 rounded-md bg-primary text-white shrink-0'
      : 'px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 shrink-0'

  const handleSalvar = async () => {
    if (!validarStep1()) {
      setCurrentStep(1)
      return
    }

    setIsSubmitting(true)
    setGlobalError(null)

    try {
      // TODO: chamada de API real
      await new Promise((r) => setTimeout(r, 1500))
      router.push('/fornecedores')
    } catch (e: any) {
      setGlobalError(e?.message || 'Erro ao salvar.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-[calc(80vh-72px)] flex items-center justify-center py-6'>
      <div className='w-full max-w-5xl'>
        <div className='text-[11px] text-slate-500 mb-1.5'>
          <span className='text-primary font-medium'>
            Cadastro de Fornecedor
          </span>
        </div>

        <div className='border border-border-soft shadow-sm bg-header/95 backdrop-blur rounded-xl'>
          <div className='px-4 pt-4 pb-2 border-b border-border-soft'>
            <h1 className='text-base font-semibold tracking-tight text-slate-900 text-center'>
              Cadastro de Fornecedor - Pessoa Jurídica
            </h1>
            <p className='text-[11px] text-slate-500 text-center mt-1'>
              Preencha os dados da empresa para realizar o cadastro no sistema.
            </p>
          </div>

          {/* Steps */}
          <div className='px-4 pt-3 pb-2 border-b border-border-soft'>
            <div className='flex items-center gap-2 overflow-x-auto'>
              <button
                type='button'
                className={getStepClass(1)}
                onClick={() => setCurrentStep(1)}
              >
                <span className='text-xs font-medium'>Fornecedor</span>
              </button>
              <div className='text-slate-300'>/</div>
              <button
                type='button'
                className={getStepClass(2)}
                disabled={!step1Valid}
                onClick={() => step1Valid && setCurrentStep(2)}
              >
                <span className='text-xs font-medium'>
                  Representantes legais
                </span>
              </button>
              <div className='text-slate-300'>/</div>
              <button type='button' className={getStepClass(3)} disabled>
                <span className='text-xs font-medium'>Usuários</span>
              </button>
              <div className='text-slate-300'>/</div>
              <button type='button' className={getStepClass(4)} disabled>
                <span className='text-xs font-medium'>Bens/Serviços</span>
              </button>
              <div className='text-slate-300'>/</div>
              <button type='button' className={getStepClass(5)} disabled>
                <span className='text-xs font-medium'>Documentos</span>
              </button>
            </div>
          </div>

          {currentStep === 1 && (
            <div className='px-4 pt-2 pb-3 space-y-4'>
              <div className='space-y-3'>
                {/* Tipo de pessoa / Natureza / Razão social */}
                <div className='grid md:grid-cols-3 gap-3'>
                  {/* Tipo pessoa (0) */}
                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='tipoPessoa'
                    >
                      Tipo de pessoa
                    </label>
                    <select
                      id='tipoPessoa'
                      ref={tipoPessoaRef}
                      value={tipoPessoa}
                      onChange={(e) => {
                        setTipoPessoa(e.target.value as any)
                        setTipoPessoaError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(0)}
                      onKeyDown={handleKeyDown(0)}
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    >
                      <option value=''>Tipo</option>
                      <option value='PJ'>Pessoa Jurídica</option>
                      <option value='PF'>Pessoa Física</option>
                    </select>
                    {tipoPessoaError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {tipoPessoaError}
                      </p>
                    )}
                  </div>

                  {/* Natureza jurídica (1) */}
                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='naturezaJuridica'
                    >
                      Natureza jurídica
                    </label>
                    <select
                      id='naturezaJuridica'
                      ref={naturezaJuridicaRef}
                      value={naturezaJuridica}
                      onChange={(e) => {
                        setNaturezaJuridica(e.target.value)
                        setNaturezaJuridicaError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(1)}
                      onKeyDown={handleKeyDown(1)}
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    >
                      <option value=''>
                        Informe a natureza jurídica da empresa
                      </option>
                      <option>Associação Privada</option>
                      <option>Autarquia</option>
                      <option>Empresa de Pequeno Porte (EPP)</option>
                      <option>Empresa Individual (EI)</option>
                      <option>
                        Empresa Individual de Responsabilidade Limitada (EIRELI)
                      </option>
                      <option>Empresa Pública (EP)</option>
                      <option>Fundação</option>
                      <option>Fundação Privada (FP)</option>
                      <option>Microempreendedor Individual (MEI)</option>
                      <option>Microempresa (ME)</option>
                      <option>Sociedade Anônima (SA)</option>
                      <option>Sociedade Cooperativa (COOP)</option>
                      <option>Sociedade de Economia Mista (SEM)</option>
                      <option>Sociedade em Comandita por Ações (SCA)</option>
                      <option>Sociedade em Comandita Simples (SCS)</option>
                      <option>Sociedade em Conta de Participação (SCP)</option>
                      <option>Sociedade em Nome Coletivo (SNC)</option>
                      <option>Sociedade Empresária (SE)</option>
                      <option>Sociedade Pura (SP)</option>
                      <option>
                        Sociedades Cooperativas de Pequeno Porte (SCPP)
                      </option>
                      <option>Outro</option>
                    </select>
                    {naturezaJuridicaError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {naturezaJuridicaError}
                      </p>
                    )}
                  </div>

                  {/* Razão Social (2) */}
                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='razaoSocial'
                    >
                      Razão Social
                    </label>
                    <input
                      id='razaoSocial'
                      ref={razaoSocialRef}
                      value={razaoSocial}
                      onChange={(e) => {
                        setRazaoSocial(e.target.value)
                        setRazaoSocialError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(2)}
                      onKeyDown={handleKeyDown(2)}
                      placeholder='Informe a razão social'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                    {razaoSocialError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {razaoSocialError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Nome fantasia (3) / CNPJ (4) */}
                <div className='grid md:grid-cols-2 gap-3'>
                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='nomeFantasia'
                    >
                      Nome Fantasia
                    </label>
                    <input
                      id='nomeFantasia'
                      ref={nomeFantasiaRef}
                      maxLength={25}
                      value={nomeFantasia}
                      onChange={(e) => {
                        setNomeFantasia(e.target.value)
                        setNomeFantasiaError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(3)}
                      onKeyDown={handleKeyDown(3)}
                      placeholder='Informe o nome fantasia'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                    {nomeFantasiaError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {nomeFantasiaError}
                      </p>
                    )}
                  </div>

                  <div className='space-y-1'>
                    <label className='text-xs text-slate-700' htmlFor='cnpj'>
                      CNPJ
                    </label>
                    <input
                      id='cnpj'
                      ref={cnpjRef}
                      value={cnpj}
                      onChange={(e) => {
                        setCnpj(formatCnpj(e.target.value))
                        setCnpjError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(4)}
                      onKeyDown={handleKeyDown(4)}
                      inputMode='numeric'
                      maxLength={18}
                      placeholder='00.000.000/0000-00'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                    {cnpjError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {cnpjError}
                      </p>
                    )}
                  </div>
                </div>

                {/* CEP (5), Endereço (6), Bairro (7) */}
                <div className='grid md:grid-cols-[0.8fr,2fr,1.2fr] gap-3'>
                  <div className='space-y-1'>
                    <label className='text-xs text-slate-700' htmlFor='cep'>
                      CEP
                    </label>
                    <input
                      id='cep'
                      ref={cepRef}
                      value={cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      onFocus={() => handleFocus(5)}
                      onKeyDown={handleKeyDown(5)}
                      inputMode='numeric'
                      maxLength={9}
                      placeholder='00000-000'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                    {cepError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {cepError}
                      </p>
                    )}
                  </div>

                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='endereco'
                    >
                      Endereço
                    </label>
                    <input
                      id='endereco'
                      ref={enderecoRef}
                      value={endereco}
                      onChange={(e) => {
                        setEndereco(e.target.value)
                        setEnderecoError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(6)}
                      onKeyDown={handleKeyDown(6)}
                      placeholder='Informe o endereço'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                    {enderecoError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {enderecoError}
                      </p>
                    )}
                  </div>

                  <div className='space-y-1'>
                    <label className='text-xs text-slate-700' htmlFor='bairro'>
                      Bairro
                    </label>
                    <input
                      id='bairro'
                      ref={bairroRef}
                      value={bairro}
                      onChange={(e) => {
                        setBairro(e.target.value)
                        setBairroError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(7)}
                      onKeyDown={handleKeyDown(7)}
                      placeholder='Informe o bairro'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                    {bairroError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {bairroError}
                      </p>
                    )}
                  </div>
                </div>

                {/* UF (8), Município (9), Complemento (10) */}
                <div className='grid md:grid-cols-[0.6fr,1.5fr,1.9fr] gap-3'>
                  <div className='space-y-1'>
                    <label className='text-xs text-slate-700' htmlFor='uf'>
                      UF
                    </label>
                    <select
                      id='uf'
                      ref={ufRef}
                      value={uf}
                      onChange={(e) => {
                        setUf(e.target.value)
                        setMunicipio('')
                        setUfError(null)
                        setMunicipioError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(8)}
                      onKeyDown={handleKeyDown(8)}
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    >
                      <option value=''>UF</option>
                      {[
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
                      ].map((sigla) => (
                        <option key={sigla} value={sigla}>
                          {sigla}
                        </option>
                      ))}
                    </select>
                    {ufError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {ufError}
                      </p>
                    )}
                  </div>

                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='municipio'
                    >
                      Município
                    </label>
                    <select
                      id='municipio'
                      ref={municipioRef}
                      value={municipio}
                      onChange={(e) => {
                        setMunicipio(e.target.value)
                        setMunicipioError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(9)}
                      onKeyDown={handleKeyDown(9)}
                      disabled={!uf}
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-slate-50'
                    >
                      <option value=''>Selecione o município</option>
                      {municipios.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    {municipioError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {municipioError}
                      </p>
                    )}
                  </div>

                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='complemento'
                    >
                      Complemento
                    </label>
                    <input
                      id='complemento'
                      ref={complementoRef}
                      maxLength={35}
                      value={complemento}
                      onChange={(e) => {
                        setComplemento(e.target.value)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(10)}
                      onKeyDown={handleKeyDown(10)}
                      placeholder='Complemento (opcional)'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                  </div>
                </div>

                {/* Telefone (11), WhatsApp (12), Email (13) */}
                <div className='grid md:grid-cols-3 gap-3'>
                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='telefone'
                    >
                      Telefone
                    </label>
                    <input
                      id='telefone'
                      ref={telefoneRef}
                      value={telefone}
                      onChange={(e) => {
                        setTelefone(formatPhone(e.target.value))
                        setTelefoneError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(11)}
                      onKeyDown={handleKeyDown(11)}
                      inputMode='numeric'
                      maxLength={15}
                      placeholder='(00) 0000-0000'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                    {telefoneError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {telefoneError}
                      </p>
                    )}
                  </div>

                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='whatsapp'
                    >
                      WhatsApp
                    </label>
                    <input
                      id='whatsapp'
                      ref={whatsappRef}
                      value={whatsapp}
                      onChange={(e) => {
                        setWhatsapp(formatPhone(e.target.value))
                        setWhatsappError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(12)}
                      onKeyDown={handleKeyDown(12)}
                      inputMode='numeric'
                      maxLength={15}
                      placeholder='(00) 00000-0000'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                    {whatsappError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {whatsappError}
                      </p>
                    )}
                  </div>

                  <div className='space-y-1'>
                    <label className='text-xs text-slate-700' htmlFor='email'>
                      E-mail
                    </label>
                    <input
                      id='email'
                      ref={emailRef}
                      type='email'
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(13)}
                      onKeyDown={handleKeyDown(13)}
                      placeholder='Informe um e-mail válido'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                    {emailError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {emailError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Site (14), IE (15), IM (16) */}
                <div className='grid md:grid-cols-[2fr,1fr,1fr] gap-3'>
                  <div className='space-y-1'>
                    <label className='text-xs text-slate-700' htmlFor='site'>
                      Site
                    </label>
                    <input
                      id='site'
                      ref={siteRef}
                      value={site}
                      onChange={(e) => {
                        setSite(e.target.value)
                        setSiteError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(14)}
                      onKeyDown={handleKeyDown(14)}
                      placeholder='www.seusite.com.br'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                    {siteError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {siteError}
                      </p>
                    )}
                  </div>

                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='inscricaoEstadual'
                    >
                      Inscrição estadual
                    </label>
                    <input
                      id='inscricaoEstadual'
                      ref={inscricaoEstadualRef}
                      maxLength={20}
                      value={inscricaoEstadual}
                      onChange={(e) => {
                        setInscricaoEstadual(e.target.value)
                        setInscricaoEstadualError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(15)}
                      onKeyDown={handleKeyDown(15)}
                      inputMode='numeric'
                      placeholder='000000000'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                    {inscricaoEstadualError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {inscricaoEstadualError}
                      </p>
                    )}
                  </div>

                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='inscricaoMunicipal'
                    >
                      Inscrição municipal
                    </label>
                    <input
                      id='inscricaoMunicipal'
                      ref={inscricaoMunicipalRef}
                      maxLength={20}
                      value={inscricaoMunicipal}
                      onChange={(e) => {
                        setInscricaoMunicipal(e.target.value)
                        setInscricaoMunicipalError(null)
                        setGlobalError(null)
                      }}
                      onFocus={() => handleFocus(16)}
                      onKeyDown={handleKeyDown(16)}
                      inputMode='numeric'
                      placeholder='00000000000'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                    {inscricaoMunicipalError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {inscricaoMunicipalError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {globalError && (
                <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700'>
                  <div className='font-semibold mb-0.5'>Erro</div>
                  <div>{globalError}</div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className='px-4 pt-2 pb-3 space-y-4'>
              <div className='text-center py-8 text-slate-600'>
                <p className='text-sm'>Funcionalidade em desenvolvimento</p>
                <p className='text-xs mt-1'>
                  Em breve você poderá cadastrar os representantes legais
                </p>
              </div>
            </div>
          )}

          {/* Steps 3–5 placeholders igual Blazor */}

          {/* Footer */}
          <div className='p-4 border-t border-border-soft'>
            <div className='flex items-center justify-between gap-3'>
              {currentStep > 1 ? (
                <button
                  type='button'
                  onClick={previousStep}
                  className='h-9 px-6 rounded-md border border-border-soft bg-white text-slate-700 text-sm font-medium hover:bg-slate-50'
                >
                  Voltar
                </button>
              ) : (
                <div />
              )}

              <div className='flex gap-2'>
                {currentStep < 5 ? (
                  <button
                    type='button'
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className='h-9 px-6 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-strong disabled:opacity-60 disabled:cursor-not-allowed'
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={handleSalvar}
                    disabled={isSubmitting}
                    className='h-9 px-6 rounded-md cursor-pointer bg-primary text-white text-sm font-medium hover:bg-primary-strong disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center'
                  >
                    {isSubmitting ? (
                      <>
                        <span className='mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <span>Salvar</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
