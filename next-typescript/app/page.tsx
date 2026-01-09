'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type PersonaId = 'fornecedor' | 'comprador' | 'sociedade'

const personas = [
  {
    id: 'fornecedor' as PersonaId,
    title: 'Fornecedor',
    description:
      'Cadastre-se para participar de licitações, acompanhar editais e enviar propostas de forma simplificada.',
    highlight: 'Ideal para empresas que vendem para o poder público.',
    color: 'bg-emerald-50',
    pill: 'Participar de licitações',
    icon: '🏢',
    requiresAuth: true,
    targetPath: '/fornecedor',
  },
  {
    id: 'comprador' as PersonaId,
    title: 'Comprador',
    description:
      'Gerencie processos, organize documentos e tenha uma visão clara das etapas de cada licitação.',
    highlight: 'Transparência e rastreabilidade em cada fase.',
    color: 'bg-sky-50',
    pill: 'Gestão de processos',
    icon: '📈',
    requiresAuth: true,
    targetPath: '/comprador',
  },
  {
    id: 'sociedade' as PersonaId,
    title: 'Sociedade',
    description:
      'Acompanhe licitações públicas, visualize resultados e fortaleça o controle social.',
    highlight: 'Mais transparência nas contratações públicas.',
    color: 'bg-violet-50',
    pill: 'Transparência',
    icon: '📣',
    requiresAuth: false,
    targetPath: '/sociedade',
  },
]

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const isAuthenticated = !!user

  const handlePersonaClick = (p: (typeof personas)[number]) => {
    if (p.requiresAuth && !isAuthenticated) {
      const redirect = encodeURIComponent(p.targetPath)
      router.push(`/entrar?redirect=${redirect}`)
      return
    }

    router.push(p.targetPath)
  }

  return (
    <div className='space-y-10'>
      <section className='grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-center'>
        <div className='space-y-4'>
          <span className='inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-strong'>
            Portal de Licitações Aspec SLE
          </span>

          <h1 className='text-3xl md:text-4xl font-semibold tracking-tight text-slate-900'>
            Conectando fornecedores, órgãos públicos e sociedade em um só lugar.
          </h1>

          <p className='text-sm md:text-base text-slate-600 max-w-xl'>
            Cadastre-se como fornecedor, acompanhe processos de licitação em
            andamento e tenha acesso aos produtos da Aspec Informática em uma
            experiência moderna e intuitiva.
          </p>

          <div className='flex flex-wrap items-center gap-3 pt-1'>
            {/* <Button
              asChild
              className='bg-primary text-white hover:bg-primary-strong text-xs md:text-sm px-4 md:px-5'
            >
              <Link href='/cadastro-fornecedor'>Cadastrar fornecedor</Link>
            </Button>

            <Button
              asChild
              variant='outline'
              className='border-primary-soft text-xs md:text-sm text-primary-strong bg-white hover:bg-primary-soft/70'
            >
              <Link href='/processos'>Ver processos abertos</Link>
            </Button> */}

            <Button
              asChild
              variant='outline'
              className='border-primary-soft text-xs md:text-sm text-primary-strong bg-white hover:bg-primary-soft/70'
            >
              <Link href='/form-teclado'>Formulário de Navegação</Link>
            </Button>

            <Button
              asChild
              variant='outline'
              className='border-primary-soft text-xs md:text-sm text-primary-strong bg-white hover:bg-primary-soft/70'
            >
              <Link href='/form-validacao'>Formulário de Validação</Link>
            </Button>

                        <Button
              asChild
              variant='outline'
              className='border-primary-soft text-xs md:text-sm text-primary-strong bg-white hover:bg-primary-soft/70'
            >
              <Link href='/form-simplificado'>Formulário Simplificado</Link>
            </Button>

            <p className='text-[11px] md:text-xs text-slate-500'>
              Sem custo de cadastro. Acesso imediato à área do fornecedor.
            </p>
          </div>
        </div>

        <div className='rounded-2xl border border-border-soft bg-header shadow-sm p-4 md:p-5 space-y-4'>
          <h2 className='text-sm font-medium text-slate-800'>
            Como a plataforma funciona?
          </h2>
          <ul className='space-y-3 text-xs text-slate-600'>
            <li className='flex gap-2'>
              <span className='mt-0.5 text-primary'>•</span>
              <span>
                <strong>Cadastro rápido</strong> de fornecedores com validação
                de dados cadastrais.
              </span>
            </li>
            <li className='flex gap-2'>
              <span className='mt-0.5 text-primary'>•</span>
              <span>
                <strong>Acesso centralizado</strong> aos produtos da Aspec
                Informática e seus módulos.
              </span>
            </li>
            <li className='flex gap-2'>
              <span className='mt-0.5 text-primary'>•</span>
              <span>
                <strong>Visão unificada</strong> dos processos de licitação em
                andamento.
              </span>
            </li>
          </ul>

          <div className='rounded-xl bg-primary-soft/60 px-3 py-2 text-[11px] text-primary-strong'>
            Em breve: planos específicos e área dedicada para cada tipo de
            usuário da plataforma.
          </div>
        </div>
      </section>

      <section className='space-y-4'>
        <div className='flex items-center justify-between gap-2'>
          <h2 className='text-sm md:text-base font-semibold text-slate-900'>
            Uma experiência pensada para cada perfil
          </h2>
          <span className='text-[11px] md:text-xs text-slate-500'>
            Fornecedores, compradores e sociedade conectados em um mesmo fluxo.
          </span>
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          {personas.map((p) => (
            <button
              key={p.id}
              type='button'
              onClick={() => handlePersonaClick(p)}
              className={`text-left rounded-2xl border border-border-soft bg-card-bg shadow-sm overflow-hidden flex flex-col ${p.color} cursor-pointer transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
            >
              <div className='p-4 flex items-center gap-3'>
                <div className='h-10 w-10 rounded-full bg-white/80 flex items-center justify-center text-lg'>
                  {p.icon}
                </div>
                <div>
                  <h3 className='text-sm font-semibold text-slate-900'>
                    {p.title}
                  </h3>
                  <p className='text-[11px] text-slate-500'>{p.pill}</p>
                </div>
              </div>

              <div className='px-4 pb-4 space-y-2 text-xs text-slate-700 flex-1 flex flex-col'>
                <p>{p.description}</p>
                <p className='text-[11px] font-medium text-slate-600'>
                  {p.highlight}
                </p>

                <span className='mt-2 inline-flex items-center text-[11px] font-medium text-primary'>
                  {p.requiresAuth ? 'Acessar (login necessário)' : 'Acessar'}
                  <span className='ml-1'>→</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className='space-y-4'>
        <div className='flex items-center justify-between gap-2'>
          <h2 className='text-sm md:text-base font-semibold text-slate-900'>
            Atualizações e destaques
          </h2>
          <span className='text-[11px] md:text-xs text-slate-500'>
            Informações recentes sobre processos, produtos e comunicados.
          </span>
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          <article className='rounded-2xl border border-border-soft bg-white shadow-sm flex flex-col'>
            <div className='px-4 pt-4 pb-2 border-b border-slate-100'>
              <p className='text-[11px] font-semibold tracking-wide text-primary'>
                PROCESSOS
              </p>
              <h3 className='text-sm font-semibold text-slate-900'>
                Processos recentemente publicados
              </h3>
            </div>
            <div className='px-4 py-3 space-y-2 text-xs text-slate-700 flex-1'>
              <p className='text-[11px] text-slate-500'>
                Veja rapidamente os últimos editais disponíveis para
                participação.
              </p>
              <ul className='space-y-1'>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 h-1.5 w-1.5 rounded-full bg-primary' />
                  <span>
                    Pregão Eletrônico nº 12/2025 — Aquisição de equipamentos de
                    TI.
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 h-1.5 w-1.5 rounded-full bg-primary' />
                  <span>
                    Concorrência nº 08/2025 — Obras de infraestrutura urbana.
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 h-1.5 w-1.5 rounded-full bg-primary' />
                  <span>
                    Tomada de Preços nº 05/2025 — Serviços de consultoria.
                  </span>
                </li>
              </ul>
            </div>
            <div className='px-4 pb-4 pt-1'>
              <Button
                asChild
                variant='outline'
                className='w-full h-8 text-xs border-primary-soft text-primary-strong bg-primary-soft/10 hover:bg-primary-soft/40'
              >
                <Link href='/processos'>Ver todos os processos</Link>
              </Button>
            </div>
          </article>

          <article className='rounded-2xl border border-border-soft bg-white shadow-sm flex flex-col'>
            <div className='px-4 pt-4 pb-2 border-b border-slate-100'>
              <p className='text-[11px] font-semibold tracking-wide text-sky-600'>
                NOVIDADES
              </p>
              <h3 className='text-sm font-semibold text-slate-900'>
                Atualizações da plataforma
              </h3>
            </div>
            <div className='px-4 py-3 space-y-2 text-xs text-slate-700 flex-1'>
              <p>
                Fique por dentro das melhorias contínuas e novos recursos
                disponíveis na solução de licitações da Aspec.
              </p>
              <ul className='space-y-1 text-[11px]'>
                <li>• Novos filtros na busca de processos.</li>
                <li>• Painel aprimorado para acompanhamento de propostas.</li>
                <li>
                  • Integração com módulos adicionais da Aspec Informática.
                </li>
              </ul>
            </div>
            <div className='px-4 pb-4 pt-1'>
              <Button
                asChild
                variant='ghost'
                className='h-8 px-0 text-[11px] text-primary-strong'
              >
                <Link href='https://www.aspec.com.br' target='_blank'>
                  Ver notícias no site da Aspec
                </Link>
              </Button>
            </div>
          </article>

          <article className='rounded-2xl border border-border-soft bg-white shadow-sm flex flex-col'>
            <div className='px-4 pt-4 pb-2 border-b border-slate-100'>
              <p className='text-[11px] font-semibold tracking-wide text-amber-600'>
                COMUNICADOS
              </p>
              <h3 className='text-sm font-semibold text-slate-900'>
                Informes importantes aos usuários
              </h3>
            </div>
            <div className='px-4 py-3 space-y-2 text-xs text-slate-700 flex-1'>
              <p>
                Informações sobre prazos, manutenção programada e orientações
                para uso da plataforma.
              </p>
              <ul className='space-y-1 text-[11px]'>
                <li>
                  • Janelas de manutenção agendadas e atualizações críticas.
                </li>
                <li>• Boas práticas para envio de propostas eletrônicas.</li>
                <li>• Orientações sobre suporte e canais de atendimento.</li>
              </ul>
            </div>
            <div className='px-4 pb-4 pt-1'>
              <Button
                asChild
                variant='ghost'
                className='h-8 px-0 text-[11px] text-primary-strong'
              >
                <Link
                  href='https://aspec.com.br/contato/fale-conosco/'
                  target='_blank'
                >
                  Fale com a equipe da Aspec
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className='space-y-6'>
        <div className='rounded-2xl bg-slate-900 text-slate-50 px-6 py-6 md:px-8 md:py-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center'>
          <div className='space-y-4'>
            <p className='text-[11px] font-semibold text-amber-300 tracking-wide'>
              TECNOLOGIA PARA GESTÃO PÚBLICA
            </p>
            <h2 className='text-xl md:text-2xl font-semibold tracking-tight'>
              A tecnologia de confiança que o gestor municipal pode contar.
            </h2>
            <p className='text-xs md:text-sm text-slate-200 max-w-xl'>
              A Aspec Informática atua há décadas apoiando prefeituras e câmaras
              municipais com soluções completas para gestão tributária, contábil
              e de licitações.
            </p>

            <div className='flex flex-wrap gap-4 pt-2 text-xs md:text-sm'>
              <div className='rounded-xl bg-slate-800 px-4 py-3'>
                <p className='text-amber-300 text-sm font-semibold'>+30</p>
                <p className='text-[11px] uppercase tracking-wide text-slate-300'>
                  Anos de experiência
                </p>
              </div>
              <div className='rounded-xl bg-slate-800 px-4 py-3'>
                <p className='text-amber-300 text-sm font-semibold'>+325</p>
                <p className='text-[11px] uppercase tracking-wide text-slate-300'>
                  Prefeituras atendidas
                </p>
              </div>
              <div className='rounded-xl bg-slate-800 px-4 py-3'>
                <p className='text-amber-300 text-sm font-semibold'>+320</p>
                <p className='text-[11px] uppercase tracking-wide text-slate-300'>
                  Câmaras municipais
                </p>
              </div>
            </div>

            <Button
              asChild
              className='mt-2 bg-amber-400 text-slate-900 hover:bg-amber-300 text-xs md:text-sm font-semibold'
            >
              <Link
                href='https://aspec.com.br/contato/fale-conosco/'
                target='_blank'
              >
                Solicitar apresentação
              </Link>
            </Button>
          </div>

          <div className='rounded-2xl bg-linear-to-br from-slate-800 via-slate-900 to-slate-800 p-4 md:p-5 shadow-lg'>
            <p className='text-[11px] text-amber-300 font-semibold mb-2'>
              DEPOIMENTOS DE CLIENTES
            </p>
            <p className='text-xs md:text-sm text-slate-50 mb-4'>
              “Com a Aspec, geramos os valores corretos. Em outros municípios,
              já utilizávamos sistemas diferentes que importavam dados errados e
              duplicados, causando retrabalho manual. Com a Aspec, isso não
              acontece.”
            </p>
            <p className='text-xs font-semibold'>Gestor municipal</p>
            <p className='text-[11px] text-slate-300'>
              Cliente da solução Aspec SLE
            </p>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='rounded-2xl border border-border-soft bg-white px-4 py-4 shadow-sm'>
            <p className='text-[11px] font-semibold text-slate-500 mb-1'>
              DEPOIMENTOS
            </p>
            <h3 className='text-sm font-semibold text-slate-900 mb-2'>
              O que clientes dizem sobre a Aspec
            </h3>
            <p className='text-xs text-slate-700'>
              A plataforma de licitações integra-se ao ecossistema de soluções
              da Aspec, garantindo segurança jurídica, rastreabilidade e suporte
              especializado em cada etapa do processo.
            </p>
          </div>

          <div className='rounded-2xl border border-border-soft bg-slate-900 text-slate-50 px-4 py-4 shadow-sm flex flex-col justify-between'>
            <div>
              <p className='text-[11px] font-semibold text-amber-300 mb-1'>
                VÍDEOS
              </p>
              <h3 className='text-sm font-semibold mb-2'>
                Conheça mais sobre a atuação da Aspec
              </h3>
              <p className='text-xs text-slate-200 mb-3'>
                Conteúdos em vídeo explicando como a tecnologia apoia a gestão
                pública eficiente e transparente.
              </p>
            </div>
            <Button
              asChild
              variant='outline'
              className='self-start h-8 border-amber-300 text-[11px] text-amber-200 hover:bg-amber-300/10'
            >
              <Link
                href='https://www.youtube.com/results?search_query=Aspec+Inform%C3%A1tica'
                target='_blank'
              >
                Ver vídeos da Aspec
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
