'use client'

import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

const TOTAL_FIELDS = 20
const PAGE_SIZE = 8

export default function FormTecladoPage() {
  // Refs dos campos
  const fieldRefs = useRef<Array<HTMLInputElement | null>>([])

  const setFieldRef = (index: number) => (el: HTMLInputElement | null) => {
    fieldRefs.current[index] = el
  }

  // Valores dos campos
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  const [logradouro, setLogradouro] = useState('')
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

  // Erros (apenas dos obrigatórios)
  const [nomeError, setNomeError] = useState<string | null>(null)
  const [cpfError, setCpfError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  // Erro global
  const [globalError, setGlobalError] = useState<string | null>(null)

  function focusField(index: number) {
    if (index < 0 || index >= TOTAL_FIELDS) return
    const el = fieldRefs.current[index]
    if (el) {
      el.focus()
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }

  useEffect(() => {
    // Foca automaticamente o primeiro campo ao entrar na tela
    focusField(0)
  }, [])

  function getFirstInvalidRequiredFieldIndex(): number | null {
    if (!nome.trim()) return 0
    if (!cpf.trim()) return 1
    if (!email.trim()) return 2
    return null
  }

  async function handleFieldFocus(index: number) {
    const firstInvalid = getFirstInvalidRequiredFieldIndex()
    if (firstInvalid !== null && firstInvalid < index) {
      setGlobalError(
        'Preencha os campos obrigatórios na ordem antes de avançar.'
      )
      focusField(firstInvalid)
    } else {
      setGlobalError(null)
    }
  }

  function handleFieldChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value ?? ''

    switch (index) {
      case 0:
        setNome(value)
        setNomeError(value.trim() ? null : 'Campo obrigatório')
        break
      case 1:
        setCpf(value)
        setCpfError(value.trim() ? null : 'Campo obrigatório')
        break
      case 2:
        setEmail(value)
        setEmailError(value.trim() ? null : 'Campo obrigatório')
        break
      case 3:
        setTelefone(value)
        break
      case 4:
        setLogradouro(value)
        break
      case 5:
        setNumero(value)
        break
      case 6:
        setBairro(value)
        break
      case 7:
        setCidade(value)
        break
      case 8:
        setUf(value)
        break
      case 9:
        setCep(value)
        break
      case 10:
        setComplemento(value)
        break
      case 11:
        setEmpresa(value)
        break
      case 12:
        setCargo(value)
        break
      case 13:
        setDepartamento(value)
        break
      case 14:
        setCelular(value)
        break
      case 15:
        setWhatsappComercial(value)
        break
      case 16:
        setEmailAlternativo(value)
        break
      case 17:
        setObs1(value)
        break
      case 18:
        setObs2(value)
        break
      case 19:
        setObs3(value)
        break
    }

    setGlobalError(null)
  }

  function canLeaveField(index: number): boolean {
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
    }

    return true
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
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

    // PageDown => pula um bloco para frente
    if (e.key === 'PageDown') {
      e.preventDefault()
      const target = Math.min(TOTAL_FIELDS - 1, index + PAGE_SIZE)
      const firstInvalid = getFirstInvalidRequiredFieldIndex()
      if (firstInvalid !== null && firstInvalid < target) {
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

    // PageUp => pula um bloco para trás
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
                ref={setFieldRef(0)}
                className={`h-9 w-full rounded-md border ${
                  nomeError ? 'border-red-400' : 'border-border-soft'
                } px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder='Informe o nome'
                value={nome}
                onChange={(e) => handleFieldChange(0, e)}
                onFocus={() => handleFieldFocus(0)}
                onKeyDown={(e) => handleKeyDown(0, e)}
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
                ref={setFieldRef(1)}
                className={`h-9 w-full rounded-md border ${
                  cpfError ? 'border-red-400' : 'border-border-soft'
                } px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder='999.999.999-99'
                value={cpf}
                onChange={(e) => handleFieldChange(1, e)}
                onFocus={() => handleFieldFocus(1)}
                onKeyDown={(e) => handleKeyDown(1, e)}
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
                ref={setFieldRef(2)}
                className={`h-9 w-full rounded-md border ${
                  emailError ? 'border-red-400' : 'border-border-soft'
                } px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder='email@dominio.com'
                value={email}
                onChange={(e) => handleFieldChange(2, e)}
                onFocus={() => handleFieldFocus(2)}
                onKeyDown={(e) => handleKeyDown(2, e)}
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
                ref={setFieldRef(3)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='(00) 00000-0000'
                value={telefone}
                onChange={(e) => handleFieldChange(3, e)}
                onFocus={() => handleFieldFocus(3)}
                onKeyDown={(e) => handleKeyDown(3, e)}
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
                ref={setFieldRef(4)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Rua, avenida...'
                value={logradouro}
                onChange={(e) => handleFieldChange(4, e)}
                onFocus={() => handleFieldFocus(4)}
                onKeyDown={(e) => handleKeyDown(4, e)}
              />
            </div>

            {/* 5 - Número */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-numero'>
                Número
              </label>
              <input
                id='campo-numero'
                ref={setFieldRef(5)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Número'
                value={numero}
                onChange={(e) => handleFieldChange(5, e)}
                onFocus={() => handleFieldFocus(5)}
                onKeyDown={(e) => handleKeyDown(5, e)}
              />
            </div>

            {/* 6 - Bairro */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-bairro'>
                Bairro
              </label>
              <input
                id='campo-bairro'
                ref={setFieldRef(6)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Bairro'
                value={bairro}
                onChange={(e) => handleFieldChange(6, e)}
                onFocus={() => handleFieldFocus(6)}
                onKeyDown={(e) => handleKeyDown(6, e)}
              />
            </div>

            {/* 7 - Cidade */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-cidade'>
                Cidade
              </label>
              <input
                id='campo-cidade'
                ref={setFieldRef(7)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Cidade'
                value={cidade}
                onChange={(e) => handleFieldChange(7, e)}
                onFocus={() => handleFieldFocus(7)}
                onKeyDown={(e) => handleKeyDown(7, e)}
              />
            </div>

            {/* 8 - UF */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-uf'>
                UF
              </label>
              <input
                id='campo-uf'
                ref={setFieldRef(8)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='UF'
                value={uf}
                onChange={(e) => handleFieldChange(8, e)}
                onFocus={() => handleFieldFocus(8)}
                onKeyDown={(e) => handleKeyDown(8, e)}
              />
            </div>

            {/* 9 - CEP */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-cep'>
                CEP
              </label>
              <input
                id='campo-cep'
                ref={setFieldRef(9)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='00000-000'
                value={cep}
                onChange={(e) => handleFieldChange(9, e)}
                onFocus={() => handleFieldFocus(9)}
                onKeyDown={(e) => handleKeyDown(9, e)}
              />
            </div>

            {/* 10 - Complemento */}
            <div className='space-y-1'>
              <label
                className='text-xs text-slate-700'
                htmlFor='campo-complemento'
              >
                Complemento
              </label>
              <input
                id='campo-complemento'
                ref={setFieldRef(10)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Apartamento, bloco...'
                value={complemento}
                onChange={(e) => handleFieldChange(10, e)}
                onFocus={() => handleFieldFocus(10)}
                onKeyDown={(e) => handleKeyDown(10, e)}
              />
            </div>

            {/* BLOCO 3 - Dados profissionais */}
            <div className='text-[11px] font-semibold text-slate-600 mt-3'>
              Dados profissionais
            </div>

            {/* 11 - Empresa */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-empresa'>
                Empresa
              </label>
              <input
                id='campo-empresa'
                ref={setFieldRef(11)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Nome da empresa'
                value={empresa}
                onChange={(e) => handleFieldChange(11, e)}
                onFocus={() => handleFieldFocus(11)}
                onKeyDown={(e) => handleKeyDown(11, e)}
              />
            </div>

            {/* 12 - Cargo */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-cargo'>
                Cargo
              </label>
              <input
                id='campo-cargo'
                ref={setFieldRef(12)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Cargo'
                value={cargo}
                onChange={(e) => handleFieldChange(12, e)}
                onFocus={() => handleFieldFocus(12)}
                onKeyDown={(e) => handleKeyDown(12, e)}
              />
            </div>

            {/* 13 - Departamento */}
            <div className='space-y-1'>
              <label
                className='text-xs text-slate-700'
                htmlFor='campo-departamento'
              >
                Departamento
              </label>
              <input
                id='campo-departamento'
                ref={setFieldRef(13)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Departamento'
                value={departamento}
                onChange={(e) => handleFieldChange(13, e)}
                onFocus={() => handleFieldFocus(13)}
                onKeyDown={(e) => handleKeyDown(13, e)}
              />
            </div>

            {/* BLOCO 4 - Contatos adicionais */}
            <div className='text-[11px] font-semibold text-slate-600 mt-3'>
              Contatos adicionais
            </div>

            {/* 14 - Celular */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-celular'>
                Celular
              </label>
              <input
                id='campo-celular'
                ref={setFieldRef(14)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='(00) 00000-0000'
                value={celular}
                onChange={(e) => handleFieldChange(14, e)}
                onFocus={() => handleFieldFocus(14)}
                onKeyDown={(e) => handleKeyDown(14, e)}
              />
            </div>

            {/* 15 - WhatsApp comercial */}
            <div className='space-y-1'>
              <label
                className='text-xs text-slate-700'
                htmlFor='campo-whatsapp2'
              >
                WhatsApp comercial
              </label>
              <input
                id='campo-whatsapp2'
                ref={setFieldRef(15)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='(00) 00000-0000'
                value={whatsappComercial}
                onChange={(e) => handleFieldChange(15, e)}
                onFocus={() => handleFieldFocus(15)}
                onKeyDown={(e) => handleKeyDown(15, e)}
              />
            </div>

            {/* 16 - E-mail alternativo */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-email2'>
                E-mail alternativo
              </label>
              <input
                id='campo-email2'
                ref={setFieldRef(16)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='email@alternativo.com'
                value={emailAlternativo}
                onChange={(e) => handleFieldChange(16, e)}
                onFocus={() => handleFieldFocus(16)}
                onKeyDown={(e) => handleKeyDown(16, e)}
              />
            </div>

            {/* BLOCO 5 - Observações */}
            <div className='text-[11px] font-semibold text-slate-600 mt-3'>
              Observações
            </div>

            {/* 17 - Observação 1 */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-obs1'>
                Observação 1
              </label>
              <input
                id='campo-obs1'
                ref={setFieldRef(17)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Observação 1'
                value={obs1}
                onChange={(e) => handleFieldChange(17, e)}
                onFocus={() => handleFieldFocus(17)}
                onKeyDown={(e) => handleKeyDown(17, e)}
              />
            </div>

            {/* 18 - Observação 2 */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-obs2'>
                Observação 2
              </label>
              <input
                id='campo-obs2'
                ref={setFieldRef(18)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Observação 2'
                value={obs2}
                onChange={(e) => handleFieldChange(18, e)}
                onFocus={() => handleFieldFocus(18)}
                onKeyDown={(e) => handleKeyDown(18, e)}
              />
            </div>

            {/* 19 - Observação 3 */}
            <div className='space-y-1'>
              <label className='text-xs text-slate-700' htmlFor='campo-obs3'>
                Observação 3
              </label>
              <input
                id='campo-obs3'
                ref={setFieldRef(19)}
                className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='Observação 3'
                value={obs3}
                onChange={(e) => handleFieldChange(19, e)}
                onFocus={() => handleFieldFocus(19)}
                onKeyDown={(e) => handleKeyDown(19, e)}
              />
            </div>
          </div>

          <div className='px-4 pt-1 pb-3 border-t border-border-soft text-[11px] text-slate-500 space-y-0.5'>
            <p>
              Navegação entre campos:{' '}
              <span className='font-medium'>↑ / ↓ / Enter</span> mudam de campo.
            </p>
            <p>
              <span className='font-medium'>Ctrl + Home</span> vai para o
              primeiro campo, <span className='font-medium'>Ctrl + End</span>{' '}
              vai para o último campo.
            </p>
            <p>
              <span className='font-medium'>PageUp / PageDown</span> pulam um
              &quot;bloco&quot; de campos, sem permitir pular obrigatórios não
              preenchidos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
