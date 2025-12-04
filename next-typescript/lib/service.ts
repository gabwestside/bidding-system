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
