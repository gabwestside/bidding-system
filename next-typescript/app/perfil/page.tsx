'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { emailRegex, formatCpfReadonlyMask } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PerfilPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  const [fullName, setFullName] = useState('')
  const [cpfMasked, setCpfMasked] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')

  const [fullNameError, setFullNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [confirmEmailError, setConfirmEmailError] = useState<string | null>(
    null
  )
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // redireciona se não estiver logado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirect = encodeURIComponent('/perfil')
      router.replace(`/entrar?redirect=${redirect}`)
    }
  }, [isAuthenticated, isLoading, router])

  // carrega dados do usuário logado
  useEffect(() => {
    if (!user) return

    setFullName(user.fullName ?? '')
    setEmail(user.email ?? '')
    setConfirmEmail(user.email ?? '')

    const cpfDigits = (user.cpf ?? '').replace(/\D/g, '')
    setCpfMasked(formatCpfReadonlyMask(cpfDigits))
  }, [user])

  const resetErrors = () => {
    setFullNameError(null)
    setEmailError(null)
    setConfirmEmailError(null)
    setGlobalError(null)
    setSuccessMessage(null)
  }

  const validate = () => {
    resetErrors()
    let ok = true

    const nameTrim = fullName.trim()
    if (!nameTrim) {
      setFullNameError('Campo obrigatório')
      ok = false
    } else if (nameTrim.length < 5 || nameTrim.length > 60) {
      setFullNameError('O nome deve ter entre 5 e 60 caracteres.')
      ok = false
    } else if (!/^[\p{L} ]+$/u.test(nameTrim)) {
      setFullNameError('Use apenas letras e espaços.')
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

    return ok
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    if (!validate()) return

    setIsSubmitting(true)
    setGlobalError(null)
    setSuccessMessage(null)

    try {
      // separa primeiro nome e sobrenome como no cadastro
      const parts = fullName.trim().split(/\s+/)
      const firstName = parts[0] ?? ''
      const lastName = parts.length > 1 ? parts.slice(1).join(' ') : ''

      // TODO: ajuste este endpoint/payload conforme a API real
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/update-profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            fullName: fullName.trim(),
            email: email.trim(),
            confirmEmail: confirmEmail.trim(),
            // cpf NÃO vai no payload se não puder ser alterado
          }),
        }
      )

      if (!res.ok) {
        let message = 'Falha ao atualizar cadastro.'
        try {
          const data = await res.json()
          message = data?.message || data?.error || message
        } catch {
          // ignora parse
        }
        setGlobalError(message)
        return
      }

      // se a API retornar o usuário atualizado, poderia atualizar o contexto aqui
      // const updated = await res.json()
      // ...

      setSuccessMessage('Dados atualizados com sucesso.')
    } catch (err) {
      console.error(err)
      setGlobalError(
        err instanceof Error ? err.message : 'Erro ao atualizar cadastro.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated && !isLoading) {
    // evitando flicker enquanto o redirect acontece
    return null
  }

  return (
    <div className='min-h-[calc(100vh-72px)] flex items-center justify-center px-3 py-6 md:py-8'>
      <div className='w-full max-w-2xl'>
        <div className='text-[11px] text-slate-500 mb-1.5'>
          <span className='text-primary font-medium'>Perfil</span>
        </div>

        <div className='border border-border-soft shadow-sm bg-header/95 backdrop-blur rounded-xl'>
          {/* Cabeçalho */}
          <div className='px-4 pt-4 pb-2 border-b border-border-soft'>
            <h1 className='text-base font-semibold tracking-tight text-slate-900 text-center'>
              Edição de cadastro
            </h1>
            <p className='text-[11px] text-slate-500 text-center mt-1'>
              Atualize seus dados de acesso à plataforma. O CPF não pode ser
              alterado.
            </p>
          </div>

          {/* Conteúdo */}
          <div className='px-4 pt-2 pb-3 space-y-4'>
            {/* Dados pessoais */}
            <div className='space-y-3'>
              <div className='space-y-1'>
                <label className='text-xs text-slate-700' htmlFor='nome'>
                  Nome completo do usuário
                </label>
                <input
                  id='nome'
                  className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  placeholder='Informe o nome do usuário'
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    setFullNameError(null)
                    setGlobalError(null)
                  }}
                />
                {fullNameError && (
                  <p className='text-[10px] text-red-500 mt-0.5'>
                    {fullNameError}
                  </p>
                )}
              </div>

              <div className='grid md:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <label className='text-xs text-slate-700' htmlFor='cpf'>
                    CPF do usuário
                  </label>
                  <input
                    id='cpf'
                    className='h-9 w-full rounded-md border border-border-soft px-3 text-sm bg-slate-50 text-slate-600 cursor-not-allowed'
                    value={cpfMasked}
                    disabled
                  />
                  <p className='text-[10px] text-slate-400 mt-0.5'>
                    O CPF é utilizado como identificador único e não pode ser
                    alterado.
                  </p>
                </div>

                <div className='space-y-1'>
                  <label className='text-xs text-slate-700' htmlFor='perfil'>
                    Perfil
                  </label>
                  <select
                    id='perfil'
                    className='h-9 w-full rounded-md border border-border-soft bg-slate-50 px-3 text-xs text-slate-600 focus:outline-none cursor-not-allowed'
                    disabled
                    value='Administrador'
                  >
                    <option>Administrador</option>
                    <option>Operador</option>
                  </select>
                  <p className='text-[10px] text-slate-400 mt-0.5'>
                    Neste momento o perfil permanece sempre{' '}
                    <span className='font-medium'>Administrador</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Dados de acesso */}
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
            </div>

            {globalError && (
              <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700'>
                <div className='font-semibold mb-0.5'>Erro</div>
                <div>{globalError}</div>
              </div>
            )}

            {successMessage && (
              <div className='rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-800'>
                <div className='font-semibold mb-0.5'>Dados atualizados</div>
                <div>{successMessage}</div>
              </div>
            )}
          </div>

          {/* Rodapé */}
          <div className='px-4 pt-1 pb-3 flex flex-col gap-2.5'>
            <Button
              type='button'
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='h-9 w-full rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-strong disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center'
            >
              {isSubmitting ? (
                <>
                  <span className='mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                  <span>Salvando alterações...</span>
                </>
              ) : (
                <span>Salvar alterações</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
