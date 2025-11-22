/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

function formatCpfMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  const part1 = digits.slice(0, 3)
  const part2 = digits.slice(3, 6)
  const part3 = digits.slice(6, 9)
  const part4 = digits.slice(9, 11)

  let result = part1
  if (part2) result += '.' + part2
  if (part3) result += '.' + part3
  if (part4) result += '-' + part4

  return result
}

function isValidCpf(cpfDigits: string): boolean {
  if (!/^\d{11}$/.test(cpfDigits)) return false
  if (/^(\d)\1{10}$/.test(cpfDigits)) return false

  const nums = cpfDigits.split('').map(Number)

  let sum1 = 0
  for (let i = 0; i < 9; i++) sum1 += nums[i] * (10 - i)
  let dv1 = (sum1 * 10) % 11
  if (dv1 === 10) dv1 = 0
  if (dv1 !== nums[9]) return false

  let sum2 = 0
  for (let i = 0; i < 10; i++) sum2 += nums[i] * (11 - i)
  let dv2 = (sum2 * 10) % 11
  if (dv2 === 10) dv2 = 0
  if (dv2 !== nums[10]) return false

  return true
}

export default function LoginPage() {
  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [cpfError, setCpfError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState<string | null>(null)

  const [attempts, setAttempts] = useState(0)
  const [blocked, setBlocked] = useState(false)
  const maxAttempts = 3

  // reCAPTCHA
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null)
  const recaptchaWidgetId = useRef<number | null>(null)

  // script do recaptcha carregou
  const handleRecaptchaLoad = () => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey) {
      console.error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY não definido')
      return
    }

    const grecaptcha = (window as any).grecaptcha
    if (!grecaptcha || !recaptchaContainerRef.current) return
    if (recaptchaWidgetId.current !== null) return // já renderizado

    recaptchaWidgetId.current = grecaptcha.render(
      recaptchaContainerRef.current,
      {
        sitekey: siteKey,
      }
    )
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

    // CPF
    if (!cpfDigits) {
      setCpfError('Campo obrigatório')
      valid = false
    } else if (!isValidCpf(cpfDigits)) {
      setCpfError('CPF inválido')
      valid = false
    }

    // senha
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
    if (blocked) return

    setCaptchaError(null)

    const { ok, cpfDigits } = validateFormWithoutCaptcha()
    if (!ok || !cpfDigits) return

    // pega token do reCAPTCHA
    const token = getRecaptchaToken()
    if (!token) {
      setCaptchaError('Confirme que você não é um robô!')
      return
    }

    // >>> Chamada para a API de login (backend) <<<
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: cpfDigits,
          password,
          recaptchaToken: token,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        // mapeia erro de volta para o campo certo
        if (data.field === 'cpf') {
          setCpfError(data.message)
        } else if (data.field === 'password') {
          setPasswordError(data.message)
        } else if (data.field === 'captcha') {
          setCaptchaError(data.message)
        }

        // controla tentativas (aqui estou contando qualquer falha de login)
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

      // sucesso: aqui você pode redirecionar para a home ou dashboard
      // por exemplo: router.push("/"); (usando useRouter)
      console.log('Login OK', data)
    } catch (err) {
      console.error(err)
      setPasswordError('Erro ao autenticar. Tente novamente.')
      resetRecaptcha()
    }
  }

  return (
    <>
      {/* script do reCAPTCHA v2 */}
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

                {/* Senha */}
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

                {/* reCAPTCHA */}
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
                  disabled={blocked}
                  className='w-full bg-primary text-white hover:bg-primary-strong h-9 text-sm disabled:opacity-60 disabled:cursor-not-allowed'
                >
                  Entrar
                </Button>

                <div className='h-px w-full bg-border-soft/70' />

                <div className='w-full text-center text-[11px] text-slate-600'>
                  Ainda não tem cadastro?
                  <Link
                    href='/cadastro'
                    className='ml-1 text-primary font-medium hover:text-primary-strong'
                  >
                    Crie sua conta de fornecedor
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
