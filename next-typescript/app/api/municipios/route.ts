import { obterMunicipiosPorUf } from '@/lib/service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const uf = searchParams.get('uf') ?? ''

  const municipios = obterMunicipiosPorUf(uf)

  return NextResponse.json(
    municipios.map((nome) => ({ nome })),
    { status: 200 }
  )
}
