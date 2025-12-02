'use client'

import { registerRequest } from '@/lib/api'
import {
  emailRegex,
  formatCpfMask,
  formatPhoneMask,
  isValidCpf,
  isValidPhone,
  RECAPTCHA_SITE_KEY,
} from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function CadastroPage() {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [nomeError, setNomeError] = useState<string | null>(null)
  const [cpfError, setCpfError] = useState<string | null>(null)
  const [telefoneError, setTelefoneError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [confirmEmailError, setConfirmEmailError] = useState<string | null>(
    null
  )
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasMinLength = password.length >= 8 && password.length <= 16
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%&*]/.test(password)

  const getRuleClass = (ok: boolean) =>
    ok
      ? 'text-[10px] text-emerald-700 flex items-center'
      : 'text-[10px] text-slate-500 flex items-center'

  const RuleIcon = ({ ok }: { ok: boolean }) => (
    <span
      className={
        ok
          ? 'mr-1.5 text-[11px] text-emerald-600'
          : 'mr-1.5 text-[11px] text-slate-300'
      }
    >
      {ok ? '✓' : '•'}
    </span>
  )

  const resetMessages = () => {
    setNomeError(null)
    setCpfError(null)
    setTelefoneError(null)
    setEmailError(null)
    setConfirmEmailError(null)
    setPasswordError(null)
    setConfirmPasswordError(null)
    setGlobalError(null)
    setSuccessMessage(null)
    setCaptchaError(null)
  }

  const validate = () => {
    resetMessages()
    let ok = true

    const nomeTrim = nome.trim()
    if (!nomeTrim) {
      setNomeError('Campo obrigatório')
      ok = false
    } else if (nomeTrim.length < 5 || nomeTrim.length > 60) {
      setNomeError('O nome deve ter entre 5 e 60 caracteres.')
      ok = false
    } else if (!/^[\p{L} ]+$/u.test(nomeTrim)) {
      setNomeError('Use apenas letras e espaços.')
      ok = false
    }

    const cpfDigits = cpf.replace(/\D/g, '')
    if (!cpfDigits) {
      setCpfError('Campo obrigatório')
      ok = false
    } else if (!isValidCpf(cpfDigits)) {
      setCpfError('CPF inválido')
      ok = false
    }

    const telefoneDigits = telefone.replace(/\D/g, '')
    if (!telefoneDigits) {
      setTelefoneError('Campo obrigatório')
      ok = false
    } else if (!isValidPhone(telefoneDigits)) {
      setTelefoneError(
        'Telefone inválido. Use (00) 0000-0000 ou (00) 00000-0000'
      )
      ok = false
    }

    if (!email.trim()) {
      setEmailError('Campo obrigatório')
      ok = false
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('E-mail inválido.')
      ok = false
    }

    if (!confirmEmail.trim()) {
      setConfirmEmailError('Campo obrigatório')
      ok = false
    } else if (
      email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()
    ) {
      setConfirmEmailError(
        'O e-mail de confirmação deve ser igual ao informado.'
      )
      ok = false
    }

    if (!password) {
      setPasswordError('Campo obrigatório')
      ok = false
    } else if (password.length < 8 || password.length > 16) {
      setPasswordError('A senha deve ter entre 8 e 16 caracteres.')
      ok = false
    } else if (
      !(hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial)
    ) {
      setPasswordError('A senha não atende a todos os requisitos.')
      ok = false
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Campo obrigatório')
      ok = false
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('A confirmação deve ser idêntica à senha.')
      ok = false
    }

    return { ok, cpfDigits, telefoneDigits }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    const { ok, cpfDigits, telefoneDigits } = validate()
    if (!ok) return

    if (!captchaToken) {
      setCaptchaError('Confirme que você não é um robô!')
      return
    }

    setIsSubmitting(true)
    setGlobalError(null)

    try {
      const parts = nome.trim().split(/\s+/)
      const firstName = parts[0] ?? ''
      const lastName = parts.length > 1 ? parts.slice(1).join(' ') : ''

      const result = await registerRequest({
        email: email.trim(),
        password,
        confirmPassword,
        firstName,
        lastName,
        cpf: cpfDigits,
        phone: telefoneDigits,
        role: 'Admin',
        recaptchaToken: captchaToken,
      })

      if (!result.ok) {
        setGlobalError(result.error)
        setCaptchaToken('')
        return
      }

      const messageBase =
        result.data?.message ?? 'Cadastro realizado com sucesso.'

      setNome('')
      setCpf('')
      setTelefone('')
      setEmail('')
      setConfirmEmail('')
      setPassword('')
      setConfirmPassword('')
      setShowPassword(false)
      setShowConfirmPassword(false)

      setSuccessMessage(
        messageBase +
          ' Um link de confirmação foi enviado ao seu e-mail. Para concluir o cadastro, acesse o link de confirmação enviado e insira a senha informada no momento do cadastro.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-[calc(80vh-72px)] flex items-center justify-center px-3'>
      <div className='w-full max-w-2xl'>
        <div className='text-[11px] text-slate-500 mb-1.5'>
          <span className='text-primary font-medium'>Cadastro</span>
        </div>

        <div className='border border-border-soft shadow-sm bg-header/95 backdrop-blur rounded-xl'>
          {/* Cabeçalho */}
          <div className='px-4 pt-4 pb-2 border-b border-border-soft'>
            <h1 className='text-base font-semibold tracking-tight text-slate-900 text-center'>
              Cadastro de usuário
            </h1>
            <p className='text-[11px] text-slate-500 text-center mt-1'>
              Crie seu acesso para acompanhar e participar dos processos de
              licitação.
            </p>
          </div>

          {/* Conteúdo */}
          <div className='px-4 pt-2 pb-3 space-y-4'>
            <div className='space-y-3'>
              {/* Nome */}
              <div className='space-y-1'>
                <label className='text-xs text-slate-700' htmlFor='nome'>
                  Nome completo do usuário
                </label>
                <input
                  id='nome'
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='Informe o nome do usuário'
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value)
                    setNomeError(null)
                    setGlobalError(null)
                  }}
                />
                {nomeError && (
                  <p className='text-[10px] text-red-500 mt-0.5'>{nomeError}</p>
                )}
              </div>

              {/* CPF + Telefone */}
              <div className='grid md:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <label className='text-xs text-slate-700' htmlFor='cpf'>
                    CPF do usuário
                  </label>
                  <input
                    id='cpf'
                    className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    placeholder='Informe o seu CPF'
                    value={cpf}
                    inputMode='numeric'
                    onChange={(e) => {
                      setCpf(formatCpfMask(e.target.value))
                      setCpfError(null)
                      setGlobalError(null)
                    }}
                  />
                  {cpfError && (
                    <p className='text-[10px] text-red-500 mt-0.5'>
                      {cpfError}
                    </p>
                  )}
                </div>

                <div className='space-y-1'>
                  <label className='text-xs text-slate-700' htmlFor='telefone'>
                    Telefone
                  </label>
                  <input
                    id='telefone'
                    className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    placeholder='(00) 00000-0000'
                    value={telefone}
                    inputMode='numeric'
                    maxLength={15}
                    onChange={(e) => {
                      setTelefone(formatPhoneMask(e.target.value))
                      setTelefoneError(null)
                      setGlobalError(null)
                    }}
                  />
                  {telefoneError && (
                    <p className='text-[10px] text-red-500 mt-0.5'>
                      {telefoneError}
                    </p>
                  )}
                </div>
              </div>

              {/* Perfil fixo */}
              <div className='space-y-1'>
                <label className='text-xs text-slate-700' htmlFor='perfil'>
                  Perfil
                </label>
                <select
                  id='perfil'
                  disabled
                  className='h-9 w-full rounded-md border border-border-soft bg-slate-50 px-3 text-xs text-slate-600 focus:outline-none cursor-not-allowed'
                  defaultValue='Administrador'
                >
                  <option>Administrador</option>
                  <option>Operador</option>
                </select>
                <p className='text-[10px] text-slate-400 mt-0.5'>
                  Neste momento o cadastro é sempre
                  <span className='font-medium'> Administrador</span>.
                </p>
              </div>
            </div>

            {/* Emails + senha */}
            <div className='space-y-3'>
              <div className='grid md:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <label className='text-xs text-slate-700' htmlFor='email'>
                    E-mail
                  </label>
                  <input
                    id='email'
                    type='email'
                    className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    placeholder='Informe o seu e-mail'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailError(null)
                      setGlobalError(null)
                    }}
                  />
                  {emailError && (
                    <p className='text-[10px] text-red-500 mt-0.5'>
                      {emailError}
                    </p>
                  )}
                </div>

                <div className='space-y-1'>
                  <label
                    className='text-xs text-slate-700'
                    htmlFor='confirmEmail'
                  >
                    Confirmação de e-mail
                  </label>
                  <input
                    id='confirmEmail'
                    type='email'
                    className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    placeholder='Confirme o e-mail informado'
                    value={confirmEmail}
                    onChange={(e) => {
                      setConfirmEmail(e.target.value)
                      setConfirmEmailError(null)
                      setGlobalError(null)
                    }}
                  />
                  {confirmEmailError && (
                    <p className='text-[10px] text-red-500 mt-0.5'>
                      {confirmEmailError}
                    </p>
                  )}
                </div>
              </div>

              <div className='grid md:grid-cols-[1.1fr,0.9fr] gap-3'>
                <div className='space-y-3'>
                  {/* Senha */}
                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='password'
                    >
                      Senha
                    </label>
                    <input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='Informe uma senha'
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setPasswordError(null)
                        setGlobalError(null)
                      }}
                    />
                    <div className='flex items-center gap-2 mt-1'>
                      <input
                        id='showPassword'
                        type='checkbox'
                        className='h-3 w-3 rounded border border-border-soft'
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                      />
                      <label
                        htmlFor='showPassword'
                        className='text-[10px] text-slate-600 cursor-pointer'
                      >
                        Mostrar senha
                      </label>
                    </div>
                    {passwordError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {passwordError}
                      </p>
                    )}
                  </div>

                  {/* Confirmação senha */}
                  <div className='space-y-1'>
                    <label
                      className='text-xs text-slate-700'
                      htmlFor='confirmPassword'
                    >
                      Confirmação de senha
                    </label>
                    <input
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      placeholder='Confirme a senha informada'
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setConfirmPasswordError(null)
                        setGlobalError(null)
                      }}
                    />
                    <div className='flex items-center gap-2 mt-1'>
                      <input
                        id='showConfirmPassword'
                        type='checkbox'
                        className='h-3 w-3 rounded border border-border-soft'
                        checked={showConfirmPassword}
                        onChange={(e) =>
                          setShowConfirmPassword(e.target.checked)
                        }
                      />
                      <label
                        htmlFor='showConfirmPassword'
                        className='text-[10px] text-slate-600 cursor-pointer'
                      >
                        Mostrar confirmação
                      </label>
                    </div>
                    {confirmPasswordError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {confirmPasswordError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Regras de senha */}
                <div className='rounded-md border border-border-soft bg-card-muted px-2.5 py-2.5'>
                  <div className='text-[10px] text-slate-700 mb-1 font-medium'>
                    Regras para criação de senha
                  </div>
                  <ul className='space-y-0.5 mt-1'>
                    <li className={getRuleClass(hasMinLength)}>
                      <RuleIcon ok={hasMinLength} />8 a 16 caracteres
                    </li>
                    <li className={getRuleClass(hasNumber)}>
                      <RuleIcon ok={hasNumber} />
                      Ao menos 1 número
                    </li>
                    <li className={getRuleClass(hasLower)}>
                      <RuleIcon ok={hasLower} />
                      Ao menos 1 letra minúscula
                    </li>
                    <li className={getRuleClass(hasUpper)}>
                      <RuleIcon ok={hasUpper} />
                      Ao menos 1 letra maiúscula
                    </li>
                    <li className={getRuleClass(hasSpecial)}>
                      <RuleIcon ok={hasSpecial} />
                      Ao menos 1 caractere especial (! @ # $ % & *)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mensagens globais */}
            {globalError && (
              <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700'>
                <div className='font-semibold mb-0.5'>Erro</div>
                <div>{globalError}</div>
              </div>
            )}

            {successMessage && (
              <div className='rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-800'>
                <div className='font-semibold mb-0.5'>
                  Cadastro realizado com sucesso
                </div>
                <div>{successMessage}</div>
              </div>
            )}
          </div>

          {/* reCAPTCHA + ações */}
          <div className='px-4 pt-1 pb-3 flex flex-col gap-2.5'>
            <div className='space-y-1.5'>
              <label className='text-[11px] text-slate-700'>
                Não sou um robô
              </label>

              <div className='mt-1'>
                {RECAPTCHA_SITE_KEY && (
                  <ReCAPTCHA
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={(token) => {
                      setCaptchaToken(token || '')
                      setCaptchaError(null)
                    }}
                  />
                )}
              </div>

              {captchaError && (
                <p className='text-[11px] text-red-500 mt-0.5'>
                  {captchaError}
                </p>
              )}
            </div>

            <button
              type='button'
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='h-9 w-full rounded-md cursor-pointer bg-primary text-white text-sm font-medium hover:bg-primary-strong disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center'
            >
              {isSubmitting ? (
                <>
                  <span className='mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                  <span>Confirmando cadastro...</span>
                </>
              ) : (
                <span>Confirmar cadastro</span>
              )}
            </button>

            <div className='w-full text-center text-[11px] text-slate-600'>
              Já possui cadastro?
              <button
                type='button'
                onClick={() => router.push('/entrar')}
                className='ml-1 text-primary font-medium hover:text-primary-strong'
              >
                Acesse sua conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
