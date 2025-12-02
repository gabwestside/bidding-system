'use client'

import { useAuth } from '@/context/auth-context'
import {
  formatCreatedAt,
  formatPhone,
  getInitials,
  Profile,
  ProfileResponse,
} from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function PerfilPage() {
  const router = useRouter()
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/entrar')
    }
  }, [authLoading, isAuthenticated, router])

  const loadProfile = useCallback(async () => {
    if (!token) {
      setError('Usuário não autenticado.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

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
          // ignore parse
        }
        setError(message)
        setProfile(null)
        return
      }

      const data = (await res.json()) as ProfileResponse

      if (!data.success || !data.user) {
        setError(data.message || 'Falha ao obter perfil.')
        setProfile(null)
        return
      }

      setProfile(data.user)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro desconhecido ao carregar perfil.'
      )
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!token) return
    loadProfile()
  }, [token, loadProfile])

  // Enquanto decide auth, evita flicker
  if (authLoading) {
    return (
      <div className='min-h-[calc(80vh-72px)] flex items-center justify-center'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-primary' />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Já redirecionando, não precisa renderizar nada
    return null
  }

  return (
    <div className='min-h-[calc(80vh-72px)] flex items-center justify-center px-3'>
      <div className='w-full max-w-2xl'>
        <div className='text-[11px] text-slate-500 mb-1.5'>
          <span className='text-primary font-medium'>Meu Perfil</span>
        </div>

        <div className='border border-border-soft shadow-sm bg-header/95 backdrop-blur rounded-xl'>
          {/* Título */}
          <div className='px-4 pt-4 pb-2 border-b border-border-soft'>
            <h1 className='text-base font-semibold tracking-tight text-slate-900 text-center'>
              Informações do perfil
            </h1>
            <p className='text-[11px] text-slate-500 text-center mt-1'>
              Visualize e gerencie as informações da sua conta.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className='px-4 py-12 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-primary' />
            </div>
          )}

          {/* Erro */}
          {!loading && error && (
            <div className='px-4 py-4'>
              <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700'>
                <div className='font-semibold mb-0.5'>
                  Erro ao carregar perfil
                </div>
                <div className='mb-2'>{error}</div>
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

          {/* Conteúdo */}
          {!loading && !error && profile && (
            <>
              {/* Header do perfil */}
              <div className='px-4 py-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-border-soft'>
                <div className='flex items-center gap-3'>
                  <div className='w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold'>
                    {getInitials(profile.fullName)}
                  </div>
                  <div>
                    <h2 className='text-base font-semibold text-slate-900'>
                      {profile.fullName}
                    </h2>
                    <p className='text-[11px] text-slate-600'>
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detalhes */}
              <div className='px-4 pt-2 pb-3 space-y-4'>
                <div className='space-y-3'>
                  {/* Nome completo */}
                  <div className='space-y-1'>
                    <label className='text-xs text-slate-700'>
                      Nome completo
                    </label>
                    <div className='h-9 w-full rounded-md border border-border-soft bg-slate-50 px-3 flex items-center'>
                      <span className='text-sm text-slate-900'>
                        {profile.fullName}
                      </span>
                    </div>
                  </div>

                  {/* Nome e sobrenome */}
                  <div className='grid md:grid-cols-2 gap-3'>
                    <div className='space-y-1'>
                      <label className='text-xs text-slate-700'>Nome</label>
                      <div className='h-9 w-full rounded-md border border-border-soft bg-slate-50 px-3 flex items-center'>
                        <span className='text-sm text-slate-900'>
                          {profile.firstName}
                        </span>
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <label className='text-xs text-slate-700'>
                        Sobrenome
                      </label>
                      <div className='h-9 w-full rounded-md border border-border-soft bg-slate-50 px-3 flex items-center'>
                        <span className='text-sm text-slate-900'>
                          {profile.lastName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* E-mail e telefone */}
                  <div className='grid md:grid-cols-2 gap-3'>
                    <div className='space-y-1'>
                      <label className='text-xs text-slate-700'>E-mail</label>
                      <div className='h-9 w-full rounded-md border border-border-soft bg-slate-50 px-3 flex items-center'>
                        <span className='text-sm text-slate-900'>
                          {profile.email}
                        </span>
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <label className='text-xs text-slate-700'>Telefone</label>
                      <div className='h-9 w-full rounded-md border border-border-soft bg-slate-50 px-3 flex items-center'>
                        <span className='text-sm text-slate-900'>
                          {formatPhone(profile.phone)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Membro desde */}
                  <div className='space-y-1'>
                    <label className='text-xs text-slate-700'>
                      Membro desde
                    </label>
                    <div className='h-9 w-full rounded-md border border-border-soft bg-slate-50 px-3 flex items-center'>
                      <span className='text-sm text-slate-900'>
                        {formatCreatedAt(profile.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rodapé */}
              <div className='px-4 pt-1 pb-3 border-t border-border-soft'>
                <div className='w-full text-center text-[11px] text-slate-600'>
                  Precisa atualizar suas informações?
                  <button
                    type='button'
                    onClick={() => router.push('/perfil/editar')}
                    className='ml-1 text-primary font-medium hover:text-primary-strong'
                  >
                    Editar perfil
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
