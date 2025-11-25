'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { CheckCircle2, Info, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/

export default function CadastroPage() {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [perfil] = useState<'Administrador' | 'Operador'>('Administrador')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // regras de senha
  const hasMinLength = password.length >= 8 && password.length <= 16
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%&*]/.test(password)

  const allPasswordRulesOk =
    hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial

  function validate(): boolean {
    const newErrors: Record<string, string | null> = {}

    // Nome completo
    if (!nome.trim()) {
      newErrors.nome = 'Campo obrigatório'
    } else if (nome.trim().length < 5 || nome.trim().length > 60) {
      newErrors.nome = 'O nome deve ter entre 5 e 60 caracteres.'
    } else if (!nameRegex.test(nome.trim())) {
      newErrors.nome = 'Use apenas letras e espaços.'
    }

    // CPF
    const cpfDigits = cpf.replace(/\D/g, '')
    if (!cpfDigits) {
      newErrors.cpf = 'Campo obrigatório'
    } else if (cpfDigits.length !== 11 || !isValidCpf(cpfDigits)) {
      newErrors.cpf = 'CPF inválido'
    }

    // Perfil (estático)
    if (!perfil) {
      newErrors.perfil = 'Perfil é obrigatório.'
    }

    // E-mail
    if (!email.trim()) {
      newErrors.email = 'Campo obrigatório'
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'E-mail inválido.'
    }

    // Confirmação de e-mail
    if (!confirmEmail.trim()) {
      newErrors.confirmEmail = 'Campo obrigatório'
    } else if (confirmEmail.trim() !== email.trim()) {
      newErrors.confirmEmail =
        'O e-mail de confirmação deve ser igual ao informado.'
    }

    // Senha
    if (!password) {
      newErrors.password = 'Campo obrigatório'
    } else if (password.length < 8 || password.length > 16) {
      newErrors.password = 'A senha deve ter entre 8 e 16 caracteres.'
    } else if (!allPasswordRulesOk) {
      newErrors.password = 'A senha não atende a todos os requisitos.'
    }

    // Confirmação de senha
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Campo obrigatório'
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'A confirmação deve ser idêntica à senha.'
    }

    setErrors(newErrors)
    return Object.values(newErrors).every((v) => !v)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting) return

    setSuccessMessage(null)

    const ok = validate()
    if (!ok) return

    setIsSubmitting(true)

    try {
      // Aqui entraria a chamada real para o backend
      await new Promise((resolve) => setTimeout(resolve, 900)) // simulação rápida

      setSuccessMessage(
        'Um link de confirmação foi enviado ao seu e-mail. Para concluir o cadastro, acesse o link de confirmação enviado e insira a senha informada no momento do cadastro.'
      )
    } catch (err) {
      console.error('Erro no cadastro:', err)
      setErrors((prev) => ({
        ...prev,
        global: 'Ocorreu um erro ao realizar o cadastro. Tente novamente.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRuleIcon = (ok: boolean) =>
    ok ? (
      <CheckCircle2 className='h-3 w-3 mr-1.5 text-emerald-600' />
    ) : (
      <XCircle className='h-3 w-3 mr-1.5 text-slate-300' />
    )

  const getRuleClass = (ok: boolean) =>
    ok
      ? 'text-[10px] text-emerald-700 flex items-center'
      : 'text-[10px] text-slate-500 flex items-center'

  return (
    <div className='min-h-[calc(100vh-72px)] flex items-center justify-center px-3 py-6 md:py-8'>
      <div className='w-full max-w-2xl'>
        <div className='text-[11px] text-slate-500 mb-1.5'>
          <span className='text-primary font-medium'>Cadastro</span>
        </div>

        <Card className='border border-border-soft shadow-sm bg-header/95 backdrop-blur'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base font-semibold tracking-tight text-slate-900 text-center'>
              Cadastro de usuário
            </CardTitle>
            <CardDescription className='text-[11px] text-slate-500 text-center mt-1'>
              Crie seu acesso para acompanhar e participar dos processos de
              licitação.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>
            <CardContent className='space-y-4 pt-2 pb-3'>
              {/* Dados pessoais */}
              <div className='space-y-3'>
                <div className='space-y-1'>
                  <Label htmlFor='nome' className='text-xs text-slate-700'>
                    Nome completo do usuário
                  </Label>
                  <Input
                    id='nome'
                    type='text'
                    placeholder='Informe o nome do usuário'
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className='h-9 text-sm'
                  />
                  {errors.nome && (
                    <p className='text-[10px] text-red-500 mt-0.5'>
                      {errors.nome}
                    </p>
                  )}
                </div>

                <div className='grid md:grid-cols-2 gap-3'>
                  {/* CPF */}
                  <div className='space-y-1'>
                    <Label htmlFor='cpf' className='text-xs text-slate-700'>
                      CPF do usuário
                    </Label>
                    <Input
                      id='cpf'
                      type='text'
                      inputMode='numeric'
                      placeholder='Informe o seu CPF'
                      value={cpf}
                      onChange={(e) => setCpf(formatCpfMask(e.target.value))}
                      className='h-9 text-sm'
                    />
                    {errors.cpf && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {errors.cpf}
                      </p>
                    )}
                  </div>

                  {/* Perfil */}
                  <div className='space-y-1'>
                    <Label htmlFor='perfil' className='text-xs text-slate-700'>
                      Perfil
                    </Label>
                    <select
                      id='perfil'
                      className='h-9 w-full rounded-md border border-border-soft bg-slate-50 px-3 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-not-allowed'
                      value={perfil}
                      disabled
                    >
                      <option value='Administrador'>Administrador</option>
                      <option value='Operador'>Operador</option>
                    </select>
                    <p className='text-[10px] text-slate-400 mt-0.5'>
                      Neste momento o cadastro é sempre{' '}
                      <span className='font-medium'>Administrador</span>.
                    </p>
                    {errors.perfil && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {errors.perfil}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dados de acesso */}
              <div className='space-y-3'>
                <div className='grid md:grid-cols-2 gap-3'>
                  {/* E-mail */}
                  <div className='space-y-1'>
                    <Label htmlFor='email' className='text-xs text-slate-700'>
                      E-mail
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      autoComplete='email'
                      placeholder='Informe o seu e-mail'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='h-9 text-sm'
                    />
                    {errors.email && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Confirmar e-mail */}
                  <div className='space-y-1'>
                    <Label
                      htmlFor='confirmEmail'
                      className='text-xs text-slate-700'
                    >
                      Confirmação de e-mail
                    </Label>
                    <Input
                      id='confirmEmail'
                      type='email'
                      placeholder='Confirme o e-mail informado'
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      className='h-9 text-sm'
                    />
                    {errors.confirmEmail && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {errors.confirmEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div className='grid md:grid-cols-[1.1fr,0.9fr] gap-3'>
                  {/* Senhas */}
                  <div className='space-y-3'>
                    <div className='space-y-1'>
                      <Label
                        htmlFor='password'
                        className='text-xs text-slate-700'
                      >
                        Senha
                      </Label>
                      <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        placeholder='Informe uma senha'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='h-9 text-sm'
                      />
                      <div className='flex items-center gap-2 mt-1'>
                        <input
                          id='showPassword'
                          type='checkbox'
                          className='h-3 w-3 rounded border border-border-soft'
                          checked={showPassword}
                          onChange={(e) => setShowPassword(e.target.checked)}
                        />
                        <Label
                          htmlFor='showPassword'
                          className='text-[10px] text-slate-600 cursor-pointer'
                        >
                          Mostrar senha
                        </Label>
                      </div>
                      {errors.password && (
                        <p className='text-[10px] text-red-500 mt-0.5'>
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className='space-y-1'>
                      <Label
                        htmlFor='confirmPassword'
                        className='text-xs text-slate-700'
                      >
                        Confirmação de senha
                      </Label>
                      <Input
                        id='confirmPassword'
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        placeholder='Confirme a senha informada'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='h-9 text-sm'
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
                        <Label
                          htmlFor='showConfirmPassword'
                          className='text-[10px] text-slate-600 cursor-pointer'
                        >
                          Mostrar confirmação
                        </Label>
                      </div>
                      {errors.confirmPassword && (
                        <p className='text-[10px] text-red-500 mt-0.5'>
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Regras da senha (mais compacto) */}
                  <div className='rounded-md border border-border-soft bg-card-muted px-2.5 py-2.5'>
                    <div className='flex items-center text-[10px] text-slate-700 mb-1 font-medium'>
                      <Info className='h-3 w-3 mr-1.5' />
                      Regras para criação de senha
                    </div>
                    <ul className='space-y-0.5 mt-1'>
                      <li className={getRuleClass(hasMinLength)}>
                        {getRuleIcon(hasMinLength)}8 a 16 caracteres
                      </li>
                      <li className={getRuleClass(hasNumber)}>
                        {getRuleIcon(hasNumber)}
                        Ao menos 1 número
                      </li>
                      <li className={getRuleClass(hasLower)}>
                        {getRuleIcon(hasLower)}
                        Ao menos 1 letra minúscula
                      </li>
                      <li className={getRuleClass(hasUpper)}>
                        {getRuleIcon(hasUpper)}
                        Ao menos 1 letra maiúscula
                      </li>
                      <li className={getRuleClass(hasSpecial)}>
                        {getRuleIcon(hasSpecial)}
                        Ao menos 1 caractere especial (! @ # $ % & *)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {errors.global && (
                <Alert variant='destructive' className='text-xs'>
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{errors.global}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className='border-emerald-300 bg-emerald-50 text-xs'>
                  <AlertTitle className='flex items-center text-emerald-800'>
                    <CheckCircle2 className='h-4 w-4 mr-2' />
                    Cadastro realizado com sucesso
                  </AlertTitle>
                  <AlertDescription className='text-emerald-800/90 mt-1'>
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className='flex flex-col gap-2.5 pt-1 pb-3'>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-primary text-white hover:bg-primary-strong h-9 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center'
              >
                {isSubmitting && (
                  <span className='mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                )}
                {isSubmitting
                  ? 'Confirmando cadastro...'
                  : 'Confirmar cadastro'}
              </Button>

              <div className='w-full text-center text-[11px] text-slate-600'>
                Já possui cadastro?
                <Link
                  href='/entrar'
                  className='ml-1 text-primary font-medium hover:text-primary-strong'
                >
                  Acesse sua conta
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
