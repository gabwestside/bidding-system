'use client'

import { useAuth } from '@/context/auth-context'
import {
  formatPhoneMask,
  getFullName,
  getInitials,
  isValidPhone,
  ProfileResponse,
} from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function EditarPerfilPage() {
  const router = useRouter()
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()

  const [nome, setNome] = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [_currentEmail, setCurrentEmail] = useState('')

  const [nomeError, setNomeError] = useState<string | null>(null)
  const [sobrenomeError, setSobrenomeError] = useState<string | null>(null)
  const [telefoneError, setTelefoneError] = useState<string | null>(null)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/entrar')
    }
  }, [authLoading, isAuthenticated, router])

  const loadProfile = useCallback(async () => {
    if (!token) {
      setLoadError('Usuário não autenticado.')
      setLoading(false)
      return
    }

    setLoading(true)
    setLoadError(null)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        let message = `Falha ao obter perfil (status ${res.status})`
        try {
          const prob = await res.json()
          message = prob?.detail || prob?.title || prob?.message || message
        } catch {
          // ignore
        }
        setLoadError(message)
        return
      }

      const data = (await res.json()) as ProfileResponse

      if (!data.success || !data.user) {
        setLoadError(data.message || 'Falha ao obter perfil.')
        return
      }

      const user = data.user
      setNome(user.firstName ?? '')
      setSobrenome(user.lastName ?? '')
      setTelefone(formatPhoneMask(user.phone ?? ''))
      setCurrentEmail(user.email ?? '')
    } catch (err) {
      setLoadError(
        err instanceof Error
          ? err.message
          : 'Erro desconhecido ao carregar perfil.'
      )
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!token) return
    loadProfile()
  }, [token, loadProfile])

  const resetMessages = () => {
    setNomeError(null)
    setSobrenomeError(null)
    setTelefoneError(null)
    setGlobalError(null)
    setSuccessMessage(null)
  }

  const validate = () => {
    let ok = true
    resetMessages()

    const nomeTrim = nome.trim()
    if (!nomeTrim) {
      setNomeError('Campo obrigatório')
      ok = false
    } else if (nomeTrim.length < 2 || nomeTrim.length > 30) {
      setNomeError('O nome deve ter entre 2 e 30 caracteres.')
      ok = false
    }

    const sobrenomeTrim = sobrenome.trim()
    if (!sobrenomeTrim) {
      setSobrenomeError('Campo obrigatório')
      ok = false
    } else if (sobrenomeTrim.length < 2 || sobrenomeTrim.length > 30) {
      setSobrenomeError('O sobrenome deve ter entre 2 e 30 caracteres.')
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

    return ok
  }
  const { updateProfile } = useAuth()

  const handleSalvar = async () => {
    if (isSubmitting) return
    if (!validate()) return

    setIsSubmitting(true)
    setGlobalError(null)
    setSuccessMessage(null)

    try {
      const telefoneDigits = telefone.replace(/\D/g, '')

      const { ok, message } = await updateProfile(
        nome.trim(),
        sobrenome.trim(),
        telefoneDigits
      )

      if (!ok) {
        setGlobalError(message ?? 'Falha ao atualizar perfil.')
        return
      }

      setSuccessMessage(message ?? 'Perfil atualizado com sucesso.')

      setTimeout(() => {
        router.push('/perfil')
      }, 2000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelar = () => {
    router.push('/perfil')
  }

  if (authLoading) {
    return (
      <div className='min-h-[calc(80vh-72px)] flex items-center justify-center'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-primary' />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const fullName = getFullName(nome, sobrenome)

  return (
    <div className='min-h-[calc(80vh-72px)] flex items-center justify-center px-3'>
      <div className='w-full max-w-2xl'>
        <div className='text-[11px] text-slate-500 mb-1.5'>
          <span className='text-primary font-medium'>Editar Perfil</span>
        </div>

        <div className='border border-border-soft shadow-sm bg-header/95 backdrop-blur rounded-xl'>
          {/* Cabeçalho */}
          <div className='px-4 pt-4 pb-2 border-b border-border-soft'>
            <h1 className='text-base font-semibold tracking-tight text-slate-900 text-center'>
              Editar informações do perfil
            </h1>
            <p className='text-[11px] text-slate-500 text-center mt-1'>
              Atualize suas informações pessoais.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className='px-4 py-12 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-primary' />
            </div>
          )}

          {/* Erro de carga */}
          {!loading && loadError && (
            <div className='px-4 py-4'>
              <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700'>
                <div className='font-semibold mb-0.5'>
                  Erro ao carregar perfil
                </div>
                <div className='mb-2'>{loadError}</div>
                <button
                  type='button'
                  onClick={loadProfile}
                  className='mt-1 px-3 py-1.5 bg-red-600 text-white text-[11px] rounded-md hover:bg-red-700'
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          {!loading && !loadError && (
            <>
              {/* Header do perfil */}
              <div className='px-4 py-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-border-soft'>
                <div className='flex items-center gap-3'>
                  <div className='size-14 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold'>
                    {getInitials(fullName)}
                  </div>
                  <div>
                    <h2 className='text-base font-semibold text-slate-900'>
                      {fullName || '-'}
                    </h2>
                    <p className='text-[11px] text-slate-600'>
                      {_currentEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Campos */}
              <div className='px-4 pt-2 pb-3 space-y-4'>
                <div className='space-y-3'>
                  {/* Nome e sobrenome */}
                  <div className='grid md:grid-cols-2 gap-3'>
                    <div className='space-y-1'>
                      <label className='text-xs text-slate-700' htmlFor='nome'>
                        Nome
                      </label>
                      <input
                        id='nome'
                        className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                        placeholder='Informe seu nome'
                        value={nome}
                        onChange={(e) => {
                          setNome(e.target.value)
                          setNomeError(null)
                          setGlobalError(null)
                          setSuccessMessage(null)
                        }}
                      />
                      {nomeError && (
                        <p className='text-[10px] text-red-500 mt-0.5'>
                          {nomeError}
                        </p>
                      )}
                    </div>

                    <div className='space-y-1'>
                      <label
                        className='text-xs text-slate-700'
                        htmlFor='sobrenome'
                      >
                        Sobrenome
                      </label>
                      <input
                        id='sobrenome'
                        className='h-9 w-full rounded-md border border-border-soft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                        placeholder='Informe seu sobrenome'
                        value={sobrenome}
                        onChange={(e) => {
                          setSobrenome(e.target.value)
                          setSobrenomeError(null)
                          setGlobalError(null)
                          setSuccessMessage(null)
                        }}
                      />
                      {sobrenomeError && (
                        <p className='text-[10px] text-red-500 mt-0.5'>
                          {sobrenomeError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Telefone */}
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
                      placeholder='(00) 00000-0000'
                      value={telefone}
                      inputMode='numeric'
                      maxLength={15}
                      onChange={(e) => {
                        setTelefone(formatPhoneMask(e.target.value))
                        setTelefoneError(null)
                        setGlobalError(null)
                        setSuccessMessage(null)
                      }}
                    />
                    {telefoneError && (
                      <p className='text-[10px] text-red-500 mt-0.5'>
                        {telefoneError}
                      </p>
                    )}
                  </div>

                  {/* Email somente leitura */}
                  <div className='space-y-1'>
                    <label className='text-xs text-slate-700' htmlFor='email'>
                      E-mail
                    </label>
                    <div className='h-9 w-full rounded-md border border-border-soft bg-slate-50 px-3 flex items-center'>
                      <span className='text-sm text-slate-600'>
                        {_currentEmail}
                      </span>
                    </div>
                    <p className='text-[10px] text-slate-400 mt-0.5'>
                      O e-mail não pode ser alterado.
                    </p>
                  </div>
                </div>

                {/* mensagens */}
                {globalError && (
                  <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700'>
                    <div className='font-semibold mb-0.5'>Erro</div>
                    <div>{globalError}</div>
                  </div>
                )}

                {successMessage && (
                  <div className='rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-800'>
                    <div className='font-semibold mb-0.5'>
                      Perfil atualizado com sucesso
                    </div>
                    <div>{successMessage}</div>
                  </div>
                )}
              </div>

              {/* Rodapé / ações */}
              <div className='px-4 pt-1 pb-3 flex flex-col gap-2.5'>
                <div className='grid md:grid-cols-2 gap-2.5'>
                  <button
                    type='button'
                    onClick={handleCancelar}
                    disabled={isSubmitting}
                    className='h-9 w-full rounded-md border border-border-soft bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed'
                  >
                    Cancelar
                  </button>

                  <button
                    type='button'
                    onClick={handleSalvar}
                    disabled={isSubmitting}
                    className='h-9 w-full rounded-md cursor-pointer bg-primary text-white text-sm font-medium hover:bg-primary-strong disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center'
                  >
                    {isSubmitting ? (
                      <>
                        <span className='mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <span>Salvar alterações</span>
                    )}
                  </button>
                </div>

                <div className='w-full text-center text-[11px] text-slate-600'>
                  Voltar para
                  <button
                    type='button'
                    onClick={() => router.push('/perfil')}
                    className='ml-1 text-primary font-medium hover:text-primary-strong'
                  >
                    Visualizar perfil
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
