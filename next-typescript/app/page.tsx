import { Button } from '@/components/ui/button'
import Link from 'next/link'

const personas = [
  {
    title: 'Fornecedor',
    description:
      'Cadastre-se para participar de licitações, acompanhar editais e enviar propostas de forma simplificada.',
    highlight: 'Ideal para empresas que vendem para o poder público.',
    color: 'bg-emerald-50',
    pill: 'Participar de licitações',
    icon: '🏢',
  },
  {
    title: 'Comprador',
    description:
      'Gerencie processos, organize documentos e tenha uma visão clara das etapas de cada licitação.',
    highlight: 'Transparência e rastreabilidade em cada fase.',
    color: 'bg-sky-50',
    pill: 'Gestão de processos',
    icon: '📈',
  },
  {
    title: 'Sociedade',
    description:
      'Acompanhe licitações públicas, visualize resultados e fortaleça o controle social.',
    highlight: 'Mais transparência nas contratações públicas.',
    color: 'bg-violet-50',
    pill: 'Transparência',
    icon: '📣',
  },
]

export default function HomePage() {
  return (
    <div className='space-y-10'>
      {/* HERO */}
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
            <Button
              asChild
              className='bg-primary text-white hover:bg-primary-strong text-xs md:text-sm px-4 md:px-5'
            >
              <Link href='/cadastro'>Cadastrar fornecedor</Link>
            </Button>

            <Button
              asChild
              variant='outline'
              className='border-primary-soft text-xs md:text-sm text-primary-strong bg-white hover:bg-primary-soft/70'
            >
              <Link href='/processos'>Ver processos abertos</Link>
            </Button>

            <p className='text-[11px] md:text-xs text-slate-500'>
              Sem custo de cadastro. Acesso imediato à área do fornecedor.
            </p>
          </div>
        </div>

        {/* Painel resumo */}
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

      {/* PERSONAS */}
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
            <article
              key={p.title}
              className={`rounded-2xl border border-border-soft bg-card-bg shadow-sm overflow-hidden flex flex-col ${p.color}`}
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

              <div className='px-4 pb-4 space-y-2 text-xs text-slate-700'>
                <p>{p.description}</p>
                <p className='text-[11px] font-medium text-slate-600'>
                  {p.highlight}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
