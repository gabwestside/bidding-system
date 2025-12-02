const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://localhost:5001'

export type AuthUser = {
  id: string
  cpf: string
  email: string
  firstName: string
  lastName: string
  phone: string
  fullName: string
  tenantIdentifier: string
  createdAt: string
}

export type LoginResponse = {
  success: boolean
  message: string
  user: AuthUser
  token: string
  expiresAt: string
}

export type ProblemDetails = {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
}

export async function loginRequest(
  cpf: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cpf,
      password,
    }),
  })

  if (!res.ok) {
    let problem: ProblemDetails | undefined
    try {
      problem = (await res.json()) as ProblemDetails
    } catch {
      // ignore
    }
    const message =
      problem?.detail ||
      problem?.title ||
      `Falha ao autenticar (status ${res.status})`

    throw new Error(message)
  }

  const data = (await res.json()) as LoginResponse
  return data
}
