"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

function formatCpfMask(value: string): string {
  // mantém só dígitos e limita a 11
  const digits = value.replace(/\D/g, "").slice(0, 11);

  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 9);
  const part4 = digits.slice(9, 11);

  let result = part1;
  if (part2) result += "." + part2;
  if (part3) result += "." + part3;
  if (part4) result += "-" + part4;

  return result;
}

function isValidCpf(cpfDigits: string): boolean {
  // precisa de 11 dígitos
  if (!/^\d{11}$/.test(cpfDigits)) return false;

  // rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cpfDigits)) return false;

  const nums = cpfDigits.split("").map(Number);

  // primeiro dígito verificador
  let sum1 = 0;
  for (let i = 0; i < 9; i++) {
    sum1 += nums[i] * (10 - i);
  }
  let dv1 = (sum1 * 10) % 11;
  if (dv1 === 10) dv1 = 0;
  if (dv1 !== nums[9]) return false;

  // segundo dígito verificador
  let sum2 = 0;
  for (let i = 0; i < 10; i++) {
    sum2 += nums[i] * (11 - i);
  }
  let dv2 = (sum2 * 10) % 11;
  if (dv2 === 10) dv2 = 0;
  if (dv2 !== nums[10]) return false;

  return true;
}

export default function LoginPage() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const maxAttempts = 3;

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = formatCpfMask(e.target.value);
    setCpf(masked);
    if (cpfError) setCpfError(null);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(null);
  }

  function validateForm(): boolean {
    let valid = true;

    // CPF
    const cpfDigits = cpf.replace(/\D/g, "");
    if (!cpfDigits) {
      setCpfError("Campo obrigatório");
      valid = false;
    } else if (!isValidCpf(cpfDigits)) {
      setCpfError("CPF inválido");
      valid = false;
    } else if (cpfDigits.length !== 11) {
      setCpfError("CPF inválido");
      valid = false;
    }

    // Senha
    if (!password) {
      setPasswordError("Campo obrigatório");
      valid = false;
    } else if (password.length < 8 || password.length > 16) {
      setPasswordError("Senha inválida");
      valid = false;
    }

    // CAPTCHA
    if (!captchaChecked) {
      setCaptchaError("Confirme que você não é um robô!");
      valid = false;
    } else {
      setCaptchaError(null);
    }

    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (blocked) return;

    const ok = validateForm();
    if (!ok) return;

    // aqui viria a chamada real de autenticação (backend)
    // const result = await api.login(cpfDigits, password);
    // e então trataria "Usuário não encontrado", "Conta aguardando confirmação por email", etc.

    // por enquanto vamos simular uma falha de senha para demonstrar o limite de tentativas
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= maxAttempts) {
      setBlocked(true);
      setPasswordError(
        "Você excedeu o limite de tentativas. Sua conta está bloqueada!."
      );
    } else {
      setPasswordError("Senha inválida");
    }
  }

  const isSubmitDisabled = blocked || !captchaChecked;

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-md">
        {/* trilha simples */}
        <div className="text-[11px] text-slate-500 mb-2">
          <span className="text-primary font-medium">Entrar</span>
        </div>

        <Card className="border border-border-soft shadow-sm bg-header/95 backdrop-blur">
          <CardHeader className="pb-3 text-center">
            <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">
              Entrar na plataforma
            </CardTitle>
            <CardDescription className="text-[11px] text-slate-500">
              Acesse sua área de fornecedor com CPF e senha cadastrados.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="space-y-4">
              {/* CPF */}
              <div className="space-y-1.5">
                <Label htmlFor="cpf" className="text-xs text-slate-700">
                  Login CPF <span className="font-normal">(somente números)</span>
                </Label>
                <Input
                  id="cpf"
                  type="text"
                  inputMode="numeric"
                  autoComplete="username"
                  placeholder="CPF do usuário"
                  value={cpf}
                  onChange={handleCpfChange}
                  className="h-9 text-sm"
                />
                {cpfError && (
                  <p className="text-[11px] text-red-500 mt-0.5">{cpfError}</p>
                )}
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-slate-700">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Senha do usuário"
                    value={password}
                    onChange={handlePasswordChange}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="show-password"
                      className="h-3.5 w-3.5"
                      checked={showPassword}
                      onCheckedChange={(checked) =>
                        setShowPassword(checked === true)
                      }
                    />
                    <Label
                      htmlFor="show-password"
                      className="text-[11px] text-slate-600"
                    >
                      Mostrar senha
                    </Label>
                  </div>

                  <Link
                    href="/recuperar-senha"
                    className="text-[11px] text-primary hover:text-primary-strong"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>

                {passwordError && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {passwordError}
                  </p>
                )}

                {attempts > 0 && !blocked && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tentativa {attempts} de {maxAttempts}.
                  </p>
                )}
              </div>

              {/* Não sou um robô */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="not-robot"
                    className="h-4 w-4"
                    checked={captchaChecked}
                    onCheckedChange={(checked) => {
                      setCaptchaChecked(checked === true);
                      if (captchaError) setCaptchaError(null);
                    }}
                  />
                  <Label
                    htmlFor="not-robot"
                    className="text-[11px] text-slate-700"
                  >
                    Não sou um robô
                  </Label>
                </div>
                {/* Placeholder para o reCAPTCHA real */}
                <div className="rounded-md border border-border-soft bg-card-muted px-3 py-2 text-[10px] text-slate-500">
                  Área reservada para o componente de verificação (reCAPTCHA).
                </div>
                {captchaError && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {captchaError}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full bg-primary text-white hover:bg-primary-strong h-9 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Entrar
              </Button>

              <div className="h-px w-full bg-border-soft/70" />

              <div className="w-full text-center text-[11px] text-slate-600">
                Ainda não tem cadastro?
                <Link
                  href="/cadastro"
                  className="ml-1 text-primary font-medium hover:text-primary-strong"
                >
                  Crie sua conta de fornecedor
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
