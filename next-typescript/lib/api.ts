import {
  API_BASE_URL,
  ApiResult,
  ConfirmEmailErrorResponse,
  ConfirmEmailSuccessResponse,
  ForgotPasswordErrorResponse,
  ForgotPasswordSuccessResponse,
  LoginResponse,
  ProblemDetails,
  RegisterPayload,
  RegisterResponse,
} from './utils'

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

export async function registerRequest(
  payload: RegisterPayload
): Promise<ApiResult<RegisterResponse>> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    if (!res.ok) {
      let msg = 'Falha ao realizar o cadastro.'
      try {
        const prob = await res.json()
        msg = prob?.detail || prob?.title || prob?.message || msg
      } catch {
        // resposta não é JSON, mantém msg padrão
      }
      return { ok: false, error: msg }
    }

    let data: RegisterResponse = { success: true }
    try {
      data = (await res.json()) as RegisterResponse
    } catch {
      // 200 sem body: mantém success true com message padrão
    }

    return { ok: true, data }
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : 'Erro ao chamar serviço de cadastro.',
    }
  }
}

export async function confirmEmailRequest(
  email: string,
  token: string
): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/confirm-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      }
    )

    if (!res.ok) {
      let errorMsg = 'Erro ao confirmar email.'
      try {
        const data = (await res.json()) as ConfirmEmailErrorResponse
        errorMsg = data?.error ?? errorMsg
      } catch {
        // resposta não é JSON, mantém mensagem padrão
      }
      return { ok: false, message: errorMsg }
    }

    let successMsg = 'Email confirmado com sucesso!'
    try {
      const data = (await res.json()) as ConfirmEmailSuccessResponse
      successMsg = data?.message ?? successMsg
    } catch {
      // 200 sem body, mantém mensagem padrão
    }

    return { ok: true, message: successMsg }
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'Erro ao confirmar email.',
    }
  }
}

export async function forgotPasswordRequest(
  email: string,
  cpfDigits: string,
  recaptchaToken: string
): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/forgot-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          cpf: cpfDigits,
          recaptchaToken,
        }),
      }
    )

    if (!res.ok) {
      let msg = 'Ocorreu um erro interno.'
      try {
        const data = (await res.json()) as ForgotPasswordErrorResponse
        msg = data?.error ?? msg
      } catch {
        // resposta não é JSON, mantém msg padrão
      }
      return { ok: false, message: msg }
    }

    let successMsg =
      'Se o email existir, você receberá instruções para redefinir sua senha.'
    try {
      const data = (await res.json()) as ForgotPasswordSuccessResponse
      successMsg = data?.message ?? successMsg
    } catch {
      // 200 sem body, mantém mensagem padrão
    }

    return { ok: true, message: successMsg }
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error
          ? err.message
          : 'Erro ao solicitar redefinição de senha.',
    }
  }
}
