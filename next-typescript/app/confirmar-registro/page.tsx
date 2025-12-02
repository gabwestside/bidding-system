'use client'

import { confirmEmailRequest } from '@/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ConfirmarRegistroPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isProcessing, setIsProcessing] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [message, setMessage] = useState('')

  const email = searchParams.get('Email') || searchParams.get('email') || ''
  const token = searchParams.get('Token') || searchParams.get('token') || ''

  const doConfirm = async () => {
    setIsProcessing(true)
    setIsSuccess(false)
    setHasError(false)
    setMessage('')

    if (!email.trim() || !token.trim()) {
      setIsProcessing(false)
      setHasError(true)
      setMessage(
        'Link de confirmação inválido. Verifique se você copiou o link completo do email.'
      )
      return
    }

    const { ok, message } = await confirmEmailRequest(email, token)

    setIsProcessing(false)

    if (ok) {
      setIsSuccess(true)
      setMessage(
        message || 'Email confirmado com sucesso! Você já pode fazer login.'
      )
    } else {
      setHasError(true)
      setMessage(message || 'Token inválido ou expirado.')
    }
  }

  useEffect(() => {
    void doConfirm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, token])

  const handleRetry = () => {
    void doConfirm()
  }

  const goToLogin = () => {
    router.push('/entrar')
  }

  const goToHome = () => {
    router.push('/')
  }

  return (
    <div className='min-h-[calc(100vh-96px)] flex items-center justify-center px-4 py-8 md:py-12'>
      <div className='w-full max-w-md'>
        <div className='border border-border-soft shadow-sm bg-header/95 backdrop-blur rounded-xl'>
          {/* Cabeçalho */}
          <div className='px-5 pt-4 pb-3 text-center'>
            <h1 className='text-lg font-semibold tracking-tight text-slate-900'>
              Confirmação de Email
            </h1>
          </div>

          <div className='px-5 pb-4'>
            {isProcessing && (
              // Estado de carregamento
              <div className='flex flex-col items-center justify-center py-8 space-y-4'>
                <svg
                  className='animate-spin h-12 w-12 text-primary'
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
                <p className='text-sm text-slate-600'>
                  Confirmando seu email, aguarde...
                </p>
              </div>
            )}

            {!isProcessing && isSuccess && (
              <>
                {/* Estado de sucesso */}
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
                      Email Confirmado!
                    </h2>
                    <p className='text-sm text-slate-600'>{message}</p>
                  </div>
                </div>

                <div className='pt-4 border-t border-border-soft'>
                  <button
                    type='button'
                    onClick={goToLogin}
                    className='h-9 w-full rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-strong'
                  >
                    Ir para Login
                  </button>
                </div>
              </>
            )}

            {!isProcessing && hasError && (
              <>
                {/* Estado de erro */}
                <div className='flex flex-col items-center justify-center py-8 space-y-4'>
                  <div className='w-16 h-16 rounded-full bg-red-100 flex items-center justify-center'>
                    <svg
                      className='w-8 h-8 text-red-600'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </div>
                  <div className='text-center space-y-2'>
                    <h2 className='text-base font-semibold text-slate-900'>
                      Erro na Confirmação
                    </h2>
                    <p className='text-sm text-slate-600'>{message}</p>
                  </div>
                </div>

                <div className='pt-4 border-t border-border-soft space-y-2'>
                  <button
                    type='button'
                    onClick={handleRetry}
                    className='h-9 w-full rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-strong'
                  >
                    Tentar Novamente
                  </button>
                  <button
                    type='button'
                    onClick={goToHome}
                    className='h-9 w-full rounded-md border border-border-soft text-slate-700 text-sm font-medium hover:bg-slate-50'
                  >
                    Voltar para Início
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
