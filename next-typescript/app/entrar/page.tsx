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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='flex items-start justify-center'>
      <div className='mt-10 md:mt-16 w-full max-w-md'>
        {/* “breadcrumb” simples */}
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

          <CardContent className='space-y-4'>
            {/* CPF */}
            <div className='space-y-1.5'>
              <Label htmlFor='cpf' className='text-xs text-slate-700'>
                Login CPF <span className='font-normal'>(somente números)</span>
              </Label>
              <Input
                id='cpf'
                type='text'
                inputMode='numeric'
                placeholder='00000000000'
                className='h-9 text-sm'
              />
              <p className='text-[11px] text-slate-400'>
                Use o mesmo CPF utilizado no cadastro de fornecedor.
              </p>
            </div>

            {/* Senha */}
            <div className='space-y-1.5'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password' className='text-xs text-slate-700'>
                  Senha
                </Label>
                <button
                  type='button'
                  onClick={() => setShowPassword((v) => !v)}
                  className='text-[11px] text-primary hover:text-primary-strong'
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Digite sua senha'
                  className='h-9 text-sm pr-16'
                />
              </div>
              <div className='flex justify-between items-center'>
                <Link
                  href='/recuperar-senha'
                  className='text-[11px] text-primary hover:text-primary-strong'
                >
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

            {/* “Não sou um robô” + placeholder reCAPTCHA */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Checkbox id='not-robot' className='h-4 w-4' />
                <Label
                  htmlFor='not-robot'
                  className='text-[11px] text-slate-700'
                >
                  Não sou um robô
                </Label>
              </div>
              <div className='rounded-md border border-border-soft bg-card-muted px-3 py-2 text-[10px] text-slate-500'>
                Área reservada para o componente de verificação (reCAPTCHA).
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-3 pt-2'>
            <Button className='w-full bg-primary text-white hover:bg-primary-strong h-9 text-sm'>
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
        </Card>
      </div>
    </div>
  )
}
