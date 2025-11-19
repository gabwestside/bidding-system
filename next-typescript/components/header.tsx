'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const mainNav = [
  { label: 'Início', href: '/' },
  { label: 'Processos', href: '/processos' },
  { label: 'Produtos', href: '/produtos' },
  { label: 'Planos', href: '/planos' },
  { label: 'Contato', href: '/contato' }, // pode apontar para /contato ou externo depois
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className='sticky top-0 z-40 border-b border-border-soft bg-header/95 backdrop-blur'>
      <div className='max-w-6xl mx-auto flex items-center justify-between px-4 py-3 gap-6'>
        {/* Logo + marca */}
        <div className='flex items-center gap-3'>
          <Link href='/' className='flex items-center gap-2'>
            <div className='h-10 w-auto flex items-center'>
              {/* Aqui você pode trocar pela logo real */}
              <span className='h-9 w-24 border border-primary/40 flex items-center justify-center text-xs font-semibold text-primary tracking-wide'>
                ASPEC
              </span>
            </div>
            <div className='leading-tight hidden sm:block'>
              <p className='text-sm font-semibold text-slate-900'>Aspec SLE</p>
              <p className='text-xs text-slate-500'>Licitações e Contratos</p>
            </div>
          </Link>
        </div>

        {/* Menu principal */}
        <nav className='hidden md:flex items-center gap-1 text-sm'>
          {mainNav.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'px-3 py-1.5 rounded-full border text-xs transition',
                  isActive
                    ? 'border-primary bg-primary-soft text-primary-strong'
                    : 'border-transparent text-slate-600 hover:bg-primary-soft/60 hover:text-primary-strong',
                ].join(' ')}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Ações: Entrar / Cadastro + usuário */}
        <div className='flex items-center gap-3'>
          <div className='hidden sm:flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='text-xs text-slate-700 hover:text-primary-strong'
              asChild
            >
              <Link href='/entrar'>Entrar</Link>
            </Button>

            <Button
              size='sm'
              className='text-xs bg-primary text-white hover:bg-primary-strong'
              asChild
            >
              <Link href='/cadastro'>Cadastro</Link>
            </Button>
          </div>

          {/* “Usuário” – por enquanto mockado, depois integra com auth */}
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-2 rounded-full border border-border-soft px-2 py-1 text-xs text-slate-600 hover:border-primary hover:bg-primary-soft/60'>
              <Avatar className='h-7 w-7'>
                <AvatarImage src='' alt='Usuário' />
                <AvatarFallback className='text-[10px]'>US</AvatarFallback>
              </Avatar>
              <span className='hidden sm:inline'>Usuário</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Usuário</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
