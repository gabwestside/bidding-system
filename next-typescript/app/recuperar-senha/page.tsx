'use client'

import { forgotPasswordRequest } from '@/lib/api'
import {
  emailRegex,
  formatCpfMask,
  isValidCpf,
  RECAPTCHA_SITE_KEY,
} from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function RecuperarSenhaPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [cpfError, setCpfError] = useState<string | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const validateForm = () => {
    let valid = true
    setEmailError(null)
    setCpfError(null)
    setGeneralError(null)
    setCaptchaError(null)

    if (!email.trim()) {
      setEmailError('Campo obrigatório')
      valid = false
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Email inválido')
      valid = false
    }

    const cpfDigits = cpf.replace(/\D/g, '')
    if (!cpfDigits) {
      setCpfError('Campo obrigatório')
      valid = false
    } else if (!isValidCpf(cpfDigits)) {
      setCpfError('CPF inválido')
      valid = false
    }

    return { valid, cpfDigits }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    const { valid, cpfDigits } = validateForm()
    if (!valid) return

    if (!captchaToken) {
      setCaptchaError('Confirme que você não é um robô!')
      return
    }

    setIsSubmitting(true)
    setGeneralError(null)

    try {
      const { ok, message } = await forgotPasswordRequest(
        email.trim(),
        cpfDigits,
        captchaToken
      )

      if (!ok) {
        setGeneralError(message ?? 'Erro ao solicitar redefinição de senha.')
        // se quiser resetar o captcha:
        setCaptchaToken('')
        return
      }

      setIsSuccess(true)
      setSuccessMessage(
        message ??
          'Se o email existir, você receberá instruções para redefinir sua senha.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const goToLogin = () => {
    router.push('/entrar')
  }

  return (
    <div className='min-h-[calc(90vh-96px)] flex items-center justify-center px-4 py-8 md:py-12'>
      <div className='w-full max-w-md'>
        <div className='text-[11px] text-slate-500 mb-2'>
          <span className='text-primary font-medium'>Recuperar Senha</span>
        </div>

        <div className='border border-border-soft shadow-sm bg-header/95 backdrop-blur rounded-xl'>
          {/* Cabeçalho */}
          <div className='px-5 pt-4 pb-3 text-center'>
            <h1 className='text-lg font-semibold tracking-tight text-slate-900'>
              Recuperar sua senha
            </h1>
            <p className='text-[11px] text-slate-500'>
              Informe seu email e CPF para receber instruções de redefinição.
            </p>
          </div>

          {!isSuccess ? (
            <>
              <div className='px-5 pb-4 space-y-4'>
                {/* Email */}
                <div className='space-y-1.5'>
                  <label htmlFor='email' className='text-xs text-slate-700'>
                    Email
                  </label>
                  <input
                    id='email'
                    type='email'
                    autoComplete='email'
                    placeholder='seu@email.com'
                    className='h-9 w-full rounded-md border border-border-soft bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailError(null)
                      setGeneralError(null)
                    }}
                  />
                  {emailError && (
                    <p className='text-[11px] text-red-500 mt-0.5'>
                      {emailError}
                    </p>
                  )}
                </div>

                {/* CPF */}
                <div className='space-y-1.5'>
                  <label htmlFor='cpf' className='text-xs text-slate-700'>
                    CPF <span className='font-normal'>(somente números)</span>
                  </label>
                  <input
                    id='cpf'
                    type='text'
                    inputMode='numeric'
                    autoComplete='off'
                    placeholder='CPF do usuário'
                    className='h-9 w-full rounded-md border border-border-soft bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    value={cpf}
                    onChange={(e) => {
                      setCpf(formatCpfMask(e.target.value))
                      setCpfError(null)
                      setGeneralError(null)
                    }}
                  />
                  {cpfError && (
                    <p className='text-[11px] text-red-500 mt-0.5'>
                      {cpfError}
                    </p>
                  )}
                </div>

                {generalError && (
                  <div className='rounded-md bg-red-50 border border-red-200 p-3'>
                    <p className='text-[11px] text-red-600'>{generalError}</p>
                  </div>
                )}
              </div>

              <div className='px-5 pb-4 pt-2 flex flex-col gap-3'>
                {/* reCAPTCHA */}
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

                {/* Botão enviar */}
                <button
                  type='button'
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className='h-9 w-full rounded-md cursor-pointer bg-primary text-white text-sm font-medium hover:bg-primary-strong disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center'
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className='animate-spin mr-2 h-4 w-4 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        />
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                        />
                      </svg>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <span>Enviar</span>
                  )}
                </button>

                <div className='h-px w-full bg-border-soft/70' />

                <div className='w-full text-center text-[11px] text-slate-600 pb-1'>
                  Lembrou sua senha?
                  <button
                    type='button'
                    onClick={() => router.push('/entrar')}
                    className='ml-1 text-primary font-medium hover:text-primary-strong'
                  >
                    Voltar para o login
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Estado de sucesso
            <div className='px-5 pb-4'>
              <div className='flex flex-col items-center justify-center py-8 space-y-4'>
                <div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-green-600'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <div className='text-center space-y-2'>
                  <h2 className='text-base font-semibold text-slate-900'>
                    Email Enviado!
                  </h2>
                  <p className='text-sm text-slate-600'>{successMessage}</p>
                </div>
              </div>

              <div className='pt-4 border-t border-border-soft'>
                <button
                  type='button'
                  onClick={goToLogin}
                  className='h-9 w-full rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-strong'
                >
                  Ir para Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
