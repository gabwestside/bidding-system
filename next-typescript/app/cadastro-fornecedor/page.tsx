'use client'

import {
  formatCep,
  formatCnpj,
  formatPhone,
  isValidCnpj,
  isValidEmail,
  isValidPhone,
  NATUREZAS_JURIDICAS,
  onlyDigits,
  UFS,
  ViaCepResponse,
} from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Step = 1 | 2 | 3 | 4 | 5

export default function CadastroFornecedorPage() {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [step1Valid, setStep1Valid] = useState(false)
  const [step2Valid] = useState(false)
  const [step3Valid] = useState(false)
  const [step4Valid] = useState(false)

  const [municipios, setMunicipios] = useState<string[]>([])

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

  useEffect(() => {
    async function loadMunicipios() {
      if (!uf) {
        setMunicipios([])
        return
      }

      try {
        const res = await fetch(`/api/municipios?uf=${uf}`)
        if (!res.ok) {
          setMunicipios([])
          return
        }
        const data = (await res.json()) as { nome: string }[]
        setMunicipios(data.map((m) => m.nome))
      } catch {
        setMunicipios([])
      }
    }

    loadMunicipios()
  }, [uf])

  function getStepClass(step: Step) {
    if (currentStep === step) {
      return 'px-3 py-1.5 rounded-md bg-primary text-white shrink-0'
    }
    return 'px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 shrink-0'
  }

  function canGoToStep(step: Step) {
    if (step === 1) return true
    if (step === 2) return step1Valid
    if (step === 3) return step2Valid
    if (step === 4) return step3Valid
    if (step === 5) return step4Valid
    return false
  }

  function handleSetStep(step: Step) {
    if (canGoToStep(step)) setCurrentStep(step)
  }

  async function handleNext() {
    if (currentStep === 1) {
      const ok = validateStep1()
      if (!ok) return
      setStep1Valid(true)
    }
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as Step)
    }
  }

  function handlePrevious() {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step)
    }
  }

  function handleTipoPessoaChange(value: string) {
    const val = (value as 'PJ' | 'PF' | '') || ''
    setTipoPessoa(val || 'PJ')
    setTipoPessoaError(null)
  }

  function handleNaturezaJuridicaChange(value: string) {
    setNaturezaJuridica(value.trim())
    setNaturezaJuridicaError(null)
  }

  function handleRazaoSocialChange(value: string) {
    setRazaoSocial(value)
    setRazaoSocialError(null)
  }

  function handleNomeFantasiaChange(value: string) {
    setNomeFantasia(value)
    setNomeFantasiaError(null)
  }

  function handleCnpjChange(value: string) {
    const formatted = formatCnpj(value)
    setCnpj(formatted)
    setCnpjError(null)
  }

  async function handleCepChange(value: string) {
    const formatted = formatCep(value)
    setCep(formatted)
    setCepError(null)

    const digits = onlyDigits(formatted)
    if (digits.length === 8) {
      await buscarEnderecoPorCep(digits)
    }
  }

  function handleEnderecoChange(value: string) {
    setEndereco(value)
    setEnderecoError(null)
  }

  function handleBairroChange(value: string) {
    setBairro(value)
    setBairroError(null)
  }

  function handleUfChange(value: string) {
    setUf(value)
    setUfError(null)
    setMunicipio('')
  }

  function handleMunicipioChange(value: string) {
    setMunicipio(value)
    setMunicipioError(null)
  }

  function handleComplementoChange(value: string) {
    setComplemento(value)
  }

  function handleTelefoneChange(value: string) {
    const formatted = formatPhone(value)
    setTelefone(formatted)
    setTelefoneError(null)
  }

  function handleWhatsappChange(value: string) {
    const formatted = formatPhone(value)
    setWhatsapp(formatted)
    setWhatsappError(null)
  }

  function handleEmailChange(value: string) {
    setEmail(value)
    setEmailError(null)
  }

  function handleSiteChange(value: string) {
    setSite(value)
    setSiteError(null)
  }

  function handleInscricaoEstadualChange(value: string) {
    setInscricaoEstadual(value)
    setInscricaoEstadualError(null)
  }

  function handleInscricaoMunicipalChange(value: string) {
    setInscricaoMunicipal(value)
    setInscricaoMunicipalError(null)
  }
  
  async function buscarEnderecoPorCep(cepDigits: string) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`)
      if (!res.ok) return
      const data: ViaCepResponse = await res.json()
      if (data.erro) return

      if (data.logradouro && !endereco) setEndereco(data.logradouro)
      if (data.bairro && !bairro) setBairro(data.bairro)
      if (data.uf && !uf) setUf(data.uf)
      if (data.localidade && !municipio) setMunicipio(data.localidade)
    } catch {
      // ignore
    }
  }
  
  function validateStep1() {
    let ok = true
    setGlobalError(null)

    setNaturezaJuridicaError(null)
    setRazaoSocialError(null)
    setNomeFantasiaError(null)
    setCnpjError(null)
    setCepError(null)
    setEnderecoError(null)
    setBairroError(null)
    setUfError(null)
    setMunicipioError(null)
    setTelefoneError(null)
    setWhatsappError(null)
    setEmailError(null)
    setSiteError(null)
    setInscricaoEstadualError(null)
    setInscricaoMunicipalError(null)
    
    if (tipoPessoa === 'PJ' && !naturezaJuridica.trim()) {
      setNaturezaJuridicaError('Selecione a natureza jurídica.')
      ok = false
    }
    
    const razao = razaoSocial.trim()
    if (!razao) {
      setRazaoSocialError('A razão social é obrigatória.')
      ok = false
    } else if (razao.length > 60) {
      setRazaoSocialError('A razão social deve ter no máximo 60 caracteres.')
      ok = false
    }
    
    const fantasia = nomeFantasia.trim()
    if (fantasia && fantasia.length > 25) {
      setNomeFantasiaError('O nome fantasia deve ter no máximo 25 caracteres.')
      ok = false
    }
    
    if (tipoPessoa === 'PJ') {
      const digits = onlyDigits(cnpj)
      if (!digits) {
        setCnpjError('O CNPJ é obrigatório.')
        ok = false
      } else if (!isValidCnpj(cnpj)) {
        setCnpjError('CNPJ inválido.')
        ok = false
      }
    }
    
    if (!cep.trim()) {
      setCepError('O CEP é obrigatório.')
      ok = false
    }

    if (!endereco.trim()) {
      setEnderecoError('O endereço é obrigatório.')
      ok = false
    }

    if (!bairro.trim()) {
      setBairroError('O bairro é obrigatório.')
      ok = false
    }

    if (!uf.trim()) {
      setUfError('Selecione o UF.')
      ok = false
    }

    if (!municipio.trim()) {
      setMunicipioError('Selecione o município.')
      ok = false
    }
    
    const telDigits = onlyDigits(telefone)
    if (!telDigits) {
      setTelefoneError('O telefone é obrigatório.')
      ok = false
    } else if (!isValidPhone(telDigits)) {
      setTelefoneError(
        'Telefone inválido. Use (00) 0000-0000 ou (00) 00000-0000.'
      )
      ok = false
    }
    
    const waDigits = onlyDigits(whatsapp)
    if (waDigits && !isValidPhone(waDigits)) {
      setWhatsappError(
        'WhatsApp inválido. Use (00) 0000-0000 ou (00) 00000-0000.'
      )
      ok = false
    }
    
    const emailTrim = email.trim()
    if (!emailTrim) {
      setEmailError('O e-mail é obrigatório.')
      ok = false
    } else if (!isValidEmail(emailTrim)) {
      setEmailError('E-mail inválido.')
      ok = false
    }
    
    const siteTrim = site.trim()
    if (siteTrim) {
      const normalized = siteTrim.startsWith('http')
        ? siteTrim
        : `https://${siteTrim}`
      try {
        new URL(normalized)
      } catch {
        setSiteError('Informe uma URL válida (ex: www.seusite.com.br).')
        ok = false
      }
    }

    if (inscricaoEstadual && inscricaoEstadual.length > 20) {
      setInscricaoEstadualError('Máximo de 20 caracteres.')
      ok = false
    }

    if (inscricaoMunicipal && inscricaoMunicipal.length > 20) {
      setInscricaoMunicipalError('Máximo de 20 caracteres.')
      ok = false
    }

    return ok
  }
  
  async function handleSalvar() {
    const ok = validateStep1()
    if (!ok) {
      setCurrentStep(1)
      return
    }

    setIsSubmitting(true)
    setGlobalError(null)

    try {
      // TODO: aqui vai a chamada real para a API de cadastro de fornecedor
      await new Promise((resolve) => setTimeout(resolve, 1500))

      router.push('/fornecedores')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setGlobalError(err?.message ?? 'Erro ao salvar fornecedor.')
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
          {/* Cabeçalho */}
          <div className='px-4 pt-4 pb-2 border-b border-border-soft'>
            <h1 className='text-base font-semibold tracking-tight text-slate-900 text-center'>
              Cadastro de Fornecedor - Pessoa Jurídica
            </h1>
            <p className='text-[11px] text-slate-500 text-center mt-1'>
              Preencha os dados da empresa para realizar o cadastro no sistema.
            </p>
          </div>

          {/* Navegação de passos */}
          <div className='px-4 pt-3 pb-2 border-b border-border-soft'>
            <div className='flex items-center gap-2 overflow-x-auto'>
              <button
                type='button'
                onClick={() => handleSetStep(1)}
                className={getStepClass(1)}
              >
                <span className='text-xs font-medium'>Fornecedor</span>
              </button>
              <div className='text-slate-300'>/</div>
              <button
                type='button'
                onClick={() => handleSetStep(2)}
                className={getStepClass(2)}
                disabled={!step1Valid}
              >
                <span className='text-xs font-medium'>
                  Representantes legais
                </span>
              </button>
              <div className='text-slate-300'>/</div>
              <button
                type='button'
                onClick={() => handleSetStep(3)}
                className={getStepClass(3)}
                disabled={!step2Valid}
              >
                <span className='text-xs font-medium'>Usuários</span>
              </button>
              <div className='text-slate-300'>/</div>
              <button
                type='button'
                onClick={() => handleSetStep(4)}
                className={getStepClass(4)}
                disabled={!step3Valid}
              >
                <span className='text-xs font-medium'>Bens/Serviços</span>
              </button>
              <div className='text-slate-300'>/</div>
              <button
                type='button'
                onClick={() => handleSetStep(5)}
                className={getStepClass(5)}
                disabled={!step4Valid}
              >
                <span className='text-xs font-medium'>Documentos</span>
              </button>
            </div>
          </div>

          {/* STEP 1 – FORNECEDOR PJ */}
          {currentStep === 1 && (
            <div className='px-4 pt-2 pb-3 space-y-4'>
              <div className='space-y-3'>
                {/* Tipo de pessoa / Natureza / Razão social */}
                <div className='grid md:grid-cols-3 gap-3'>
                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='tipoPessoa'
                    >
                      Tipo de pessoa
                    </label>
                    <select
                      id='tipoPessoa'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      value={tipoPessoa}
                      onChange={(e) => handleTipoPessoaChange(e.target.value)}
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

                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='naturezaJuridica'
                    >
                      Natureza jurídica
                    </label>
                    <select
                      id='naturezaJuridica'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      value={naturezaJuridica}
                      onChange={(e) =>
                        handleNaturezaJuridicaChange(e.target.value)
                      }
                    >
                      <option value=''>
                        Informe a natureza jurídica da empresa
                      </option>
                      {NATUREZAS_JURIDICAS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    {naturezaJuridicaError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {naturezaJuridicaError}
                      </p>
                    )}
                  </div>

                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='razaoSocial'
                    >
                      Razão Social
                    </label>
                    <input
                      id='razaoSocial'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='Informe a razão social da empresa'
                      value={razaoSocial}
                      maxLength={60}
                      onChange={(e) => handleRazaoSocialChange(e.target.value)}
                    />
                    {razaoSocialError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {razaoSocialError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Nome fantasia / CNPJ */}
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
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='Informe o nome fantasia'
                      value={nomeFantasia}
                      maxLength={25}
                      onChange={(e) => handleNomeFantasiaChange(e.target.value)}
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
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='00.000.000/0000-00'
                      value={cnpj}
                      inputMode='numeric'
                      maxLength={18}
                      onChange={(e) => handleCnpjChange(e.target.value)}
                    />
                    {cnpjError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {cnpjError}
                      </p>
                    )}
                  </div>
                </div>

                {/* CEP / Endereço / Bairro */}
                <div className='grid md:grid-cols-[0.8fr,2fr,1.2fr] gap-3'>
                  <div className='space-y-1'>
                    <label className='text-xs text-slate-700' htmlFor='cep'>
                      CEP
                    </label>
                    <input
                      id='cep'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='00000-000'
                      value={cep}
                      inputMode='numeric'
                      maxLength={9}
                      onChange={(e) => handleCepChange(e.target.value)}
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
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='Informe o endereço da empresa'
                      value={endereco}
                      onChange={(e) => handleEnderecoChange(e.target.value)}
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
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='Bairro'
                      value={bairro}
                      onChange={(e) => handleBairroChange(e.target.value)}
                    />
                    {bairroError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {bairroError}
                      </p>
                    )}
                  </div>
                </div>

                {/* UF / Município / Complemento */}
                <div className='grid md:grid-cols-[0.6fr,1.5fr,1.9fr] gap-3'>
                  <div className='space-y-1'>
                    <label className='text-xs text-slate-700' htmlFor='uf'>
                      UF
                    </label>
                    <select
                      id='uf'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      value={uf}
                      onChange={(e) => handleUfChange(e.target.value)}
                    >
                      <option value=''>UF</option>
                      {UFS.map((u) => (
                        <option key={u} value={u}>
                          {u}
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
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      value={municipio}
                      disabled={!uf}
                      onChange={(e) => handleMunicipioChange(e.target.value)}
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
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='Complemento (opcional)'
                      maxLength={35}
                      value={complemento}
                      onChange={(e) => handleComplementoChange(e.target.value)}
                    />
                  </div>
                </div>

                {/* Telefone / WhatsApp / Email */}
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
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='(00) 0000-0000'
                      value={telefone}
                      inputMode='numeric'
                      maxLength={15}
                      onChange={(e) => handleTelefoneChange(e.target.value)}
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
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='(00) 00000-0000'
                      value={whatsapp}
                      inputMode='numeric'
                      maxLength={15}
                      onChange={(e) => handleWhatsappChange(e.target.value)}
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
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='Informe um e-mail válido'
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      type='email'
                    />
                    {emailError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {emailError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Site / Inscrição Estadual / Municipal */}
                <div className='grid md:grid-cols-[2fr,1fr,1fr] gap-3'>
                  <div className='space-y-1'>
                    <label className='text-xs text-slate-700' htmlFor='site'>
                      Site
                    </label>
                    <input
                      id='site'
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='www.seusite.com.br'
                      value={site}
                      onChange={(e) => handleSiteChange(e.target.value)}
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
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='000000000'
                      value={inscricaoEstadual}
                      maxLength={20}
                      inputMode='numeric'
                      onChange={(e) =>
                        handleInscricaoEstadualChange(e.target.value)
                      }
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
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='00000000000'
                      value={inscricaoMunicipal}
                      maxLength={20}
                      inputMode='numeric'
                      onChange={(e) =>
                        handleInscricaoMunicipalChange(e.target.value)
                      }
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

          {/* STEP 2–5 – placeholders iguais ao Blazor */}
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

          {currentStep === 3 && (
            <div className='px-4 pt-2 pb-3 space-y-4'>
              <div className='text-center py-8 text-slate-600'>
                <p className='text-sm'>Funcionalidade em desenvolvimento</p>
                <p className='text-xs mt-1'>
                  Em breve você poderá cadastrar usuários
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className='px-4 pt-2 pb-3 space-y-4'>
              <div className='text-center py-8 text-slate-600'>
                <p className='text-sm'>Funcionalidade em desenvolvimento</p>
                <p className='text-xs mt-1'>
                  Em breve você poderá cadastrar bens e serviços ofertados
                </p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className='px-4 pt-2 pb-3 space-y-4'>
              <div className='text-center py-8 text-slate-600'>
                <p className='text-sm'>Funcionalidade em desenvolvimento</p>
                <p className='text-xs mt-1'>
                  Em breve você poderá fazer upload dos documentos
                </p>
              </div>
            </div>
          )}

          {/* Footer – navegação / salvar */}
          <div className='p-4 border-t border-border-soft'>
            <div className='flex items-center justify-between gap-3'>
              {currentStep > 1 ? (
                <button
                  type='button'
                  onClick={handlePrevious}
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
                    onClick={handleNext}
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
