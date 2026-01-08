import estadosRoot from '@/data/estados-cidades.json'

type Cidade = { nomeCidade: string }
type Estado = { sigla: string; cidades: Cidade[] }
type EstadosRoot = { estados: Estado[] }

const porUf = new Map<string, string[]>()

function carregar(root: EstadosRoot) {
  porUf.clear()

  for (const estado of root.estados) {
    const sigla = estado.sigla.toUpperCase()

    const cidadesOrdenadas = estado.cidades
      .map((c) => c.nomeCidade)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))

    porUf.set(sigla, cidadesOrdenadas)
  }
}

function ensureLoaded() {
  if (porUf.size > 0) return
  carregar(estadosRoot as EstadosRoot)
}

export function obterMunicipiosPorUf(uf: string): string[] {
  if (!uf) return []

  ensureLoaded()

  const key = uf.trim().toUpperCase()
  return porUf.get(key) ?? []
}

export const TOTAL_FIELDS = 10
export const PAGE_SIZE = 4

const fieldIds = [
  'campo-nome',
  'campo-cpf',
  'campo-email',
  'campo-telefone',
  'campo-logradouro',
  'campo-tipo-end-com',
  'campo-uf',
  'campo-cidade',
  'campo-tipo-via-rua',
  'campo-desc-via',
] as const

export type FormModel = {
  Nome: string
  Cpf: string
  Email: string
  Telefone: string
  Logradouro: string
  TipoEndereco: string
  Uf: string
  Cidade: string
  TipoViaRua: boolean
  TipoViaAvenida: boolean
  TipoViaLogradouro: boolean
  DescricaoVia: string
  TipoViaDummy: boolean
}

export const INITIAL_MODEL: FormModel = {
  Nome: '',
  Cpf: '',
  Email: '',
  Telefone: '',
  Logradouro: '',
  TipoEndereco: '',
  Uf: '',
  Cidade: '',
  TipoViaRua: false,
  TipoViaAvenida: false,
  TipoViaLogradouro: false,
  DescricaoVia: '',
  TipoViaDummy: false,
}

export function getFirstInvalidRequiredFieldIndex(
  model: FormModel
): number | null {
  if (!model.Nome) return 0
  if (!model.Cpf) return 1
  if (!model.Email) return 2
  if (!model.TipoEndereco) return 5
  if (!model.TipoViaRua && !model.TipoViaAvenida && !model.TipoViaLogradouro)
    return 8
  return null
}

export function canUseField(model: FormModel, index: number): boolean {
  const firstInvalid = getFirstInvalidRequiredFieldIndex(model)
  return !(firstInvalid !== null && firstInvalid < index)
}

export const ufs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

export function canLeaveField(
  model: FormModel,
  index: number
): { ok: boolean; message?: string } {
  switch (index) {
    case 0:
      if (!model.Nome.trim())
        return { ok: false, message: 'Preencha o nome antes de continuar.' }
      break
    case 1:
      if (!model.Cpf.trim())
        return { ok: false, message: 'Preencha o CPF antes de continuar.' }
      break
    case 2:
      if (!model.Email.trim())
        return { ok: false, message: 'Preencha o e-mail antes de continuar.' }
      break
    case 5:
      if (!model.TipoEndereco.trim())
        return {
          ok: false,
          message: 'Informe o tipo de endereço antes de continuar.',
        }
      break
    case 8:
      if (
        !model.TipoViaRua &&
        !model.TipoViaAvenida &&
        !model.TipoViaLogradouro
      ) {
        return {
          ok: false,
          message: 'Selecione pelo menos um tipo de via antes de continuar.',
        }
      }
      break
  }
  return { ok: true }
}

export function focusField(index: number, center = false) {
  if (index < 0 || index >= TOTAL_FIELDS) return
  const id = fieldIds[index]
  const el = document.getElementById(id) as HTMLElement | null
  if (!el) return

  try {
    ;(el as HTMLElement).focus({ preventScroll: true })
  } catch {
    el.focus()
  }

  const container = el.closest('.kb-scroll-container') as HTMLElement | null
  if (!container) {
    if (center) el.scrollIntoView({ block: 'center' })
    else el.scrollIntoView({ block: 'nearest' })
    return
  }

  const padding = 16
  const cRect = container.getBoundingClientRect()
  const eRect = el.getBoundingClientRect()

  if (center) {
    const target = eRect.top - cRect.top - (cRect.height / 2 - eRect.height / 2)
    container.scrollTop += target
  } else {
    if (eRect.top < cRect.top + padding) {
      container.scrollTop += eRect.top - (cRect.top + padding)
    } else if (eRect.bottom > cRect.bottom - padding) {
      container.scrollTop += eRect.bottom - (cRect.bottom - padding)
    }
  }
}
