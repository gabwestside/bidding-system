/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/auth-context'
import { formatCpfMask, isValidCpf } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { useRef, useState } from 'react'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [cpfError, setCpfError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [attempts, setAttempts] = useState(0)
  const [blocked, setBlocked] = useState(false)
  const maxAttempts = 3

  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null)
  const recaptchaWidgetId = useRef<number | null>(null)

  const handleRecaptchaLoad = () => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey) {
      console.error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY não definido')
      return
    }

    const grecaptcha = (window as any).grecaptcha
    if (!grecaptcha) {
      console.error('grecaptcha ainda não está disponível')
      return
    }

    if (!recaptchaContainerRef.current) return

    grecaptcha.ready(() => {
      if (recaptchaWidgetId.current !== null) return

      recaptchaWidgetId.current = grecaptcha.render(
        recaptchaContainerRef.current!,
        {
          sitekey: siteKey,
        }
      )
    })
  }

  const getRecaptchaToken = (): string => {
    const grecaptcha = (window as any).grecaptcha
    if (!grecaptcha || recaptchaWidgetId.current === null) return ''
    return grecaptcha.getResponse(recaptchaWidgetId.current)
  }

  const resetRecaptcha = () => {
    const grecaptcha = (window as any).grecaptcha
    if (!grecaptcha || recaptchaWidgetId.current === null) return
    grecaptcha.reset(recaptchaWidgetId.current)
  }

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = formatCpfMask(e.target.value)
    setCpf(masked)
    if (cpfError) setCpfError(null)
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
    if (passwordError) setPasswordError(null)
  }

  function validateFormWithoutCaptcha(): { ok: boolean; cpfDigits?: string } {
    let valid = true
    const cpfDigits = cpf.replace(/\D/g, '')

    if (!cpfDigits) {
      setCpfError('Campo obrigatório')
      valid = false
    } else if (!isValidCpf(cpfDigits)) {
      setCpfError('CPF inválido')
      valid = false
    }

    if (!password) {
      setPasswordError('Campo obrigatório')
      valid = false
    } else if (password.length < 8 || password.length > 16) {
      setPasswordError('Senha inválida')
      valid = false
    }

    return { ok: valid, cpfDigits }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (blocked || isSubmitting) return

    setCaptchaError(null)

    const { ok, cpfDigits } = validateFormWithoutCaptcha()
    if (!ok || !cpfDigits) return

    const token = getRecaptchaToken()
    if (!token) {
      setCaptchaError('Confirme que você não é um robô!')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await login(cpfDigits, password)

      if (!result.ok) {
        setPasswordError(result.error ?? 'Erro ao autenticar.')

        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        if (newAttempts >= maxAttempts) {
          setBlocked(true)
          setPasswordError(
            'Você excedeu o limite de tentativas. Sua conta está bloqueada!.'
          )
        }

        resetRecaptcha()
        return
      }

      router.push('/')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Script
        src='https://www.google.com/recaptcha/api.js?render=explicit'
        strategy='afterInteractive'
        onLoad={handleRecaptchaLoad}
      />

      <div className='min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-8 md:py-12'>
        <div className='w-full max-w-md'>
          <div className='text-[11px] text-slate-500 mb-2'>
            <span className='text-primary font-medium'>Entrar</span>
          </div>

          <Card className='border border-border-soft shadow-sm bg-header/95 backdrop-blur'>
            <CardHeader className='pb-3 text-center'>
              <CardTitle className='text-lg font-semibold tracking-tight text-slate-900'>
                Entrar na plataforma
              </CardTitle>
              <CardDescription className='text-[11px] text-slate-500'>
                Acesse sua área de fornecedor com CPF e senha cadastrados.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} noValidate>
              <CardContent className='space-y-4'>
                {/* CPF */}
                <div className='space-y-1.5'>
                  <Label htmlFor='cpf' className='text-xs text-slate-700'>
                    Login CPF{' '}
                    <span className='font-normal'>(somente números)</span>
                  </Label>
                  <Input
                    id='cpf'
                    type='text'
                    inputMode='numeric'
                    autoComplete='username'
                    placeholder='CPF do usuário'
                    value={cpf}
                    onChange={handleCpfChange}
                    className='h-9 text-sm'
                  />
                  {cpfError && (
                    <p className='text-[11px] text-red-500 mt-0.5'>
                      {cpfError}
                    </p>
                  )}
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='password' className='text-xs text-slate-700'>
                    Senha
                  </Label>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    placeholder='Senha do usuário'
                    value={password}
                    onChange={handlePasswordChange}
                    className='h-9 text-sm'
                  />

                  <div className='flex items-center justify-between mt-1'>
                    <label className='inline-flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer'>
                      <input
                        type='checkbox'
                        className='h-3.5 w-3.5 rounded border border-border-soft'
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                      />
                      <span>Mostrar senha</span>
                    </label>

                    <Link
                      href='/recuperar-senha'
                      className='text-[11px] text-primary hover:text-primary-strong'
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>

                  {passwordError && (
                    <p className='text-[11px] text-red-500 mt-0.5'>
                      {passwordError}
                    </p>
                  )}

                  {attempts > 0 && !blocked && (
                    <p className='text-[11px] text-slate-500 mt-0.5'>
                      Tentativa {attempts} de {maxAttempts}.
                    </p>
                  )}
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-[11px] text-slate-700'>
                    Não sou um robô
                  </Label>
                  <div
                    id='recaptcha-container'
                    ref={recaptchaContainerRef}
                    className='mt-1'
                  />
                  {captchaError && (
                    <p className='text-[11px] text-red-500 mt-0.5'>
                      {captchaError}
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className='flex flex-col gap-3 pt-2'>
                <Button
                  type='submit'
                  disabled={blocked || isSubmitting}
                  className='w-full bg-primary text-white hover:bg-primary-strong h-9 text-sm disabled:opacity-60 disabled:cursor-not-allowed'
                >
                  {isSubmitting && (
                    <Loader2
                      className='mr-2 h-4 w-4 animate-spin'
                      aria-hidden='true'
                    />
                  )}
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>

                <div className='h-px w-full bg-border-soft/70' />

                <div className='w-full text-center text-[11px] text-slate-600'>
                  Ainda não tem cadastro?
                  <Link
                    href='/cadastro'
                    className='ml-1 text-primary font-medium hover:text-primary-strong'
                  >
                    Crie sua conta
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}
