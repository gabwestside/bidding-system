// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AspecNet - Licitações e Contratos",
  description: "Protótipo de sistema de licitações em Next + Tailwind v4",
};

const menuItems = [
  "Início",
  "Processos",
  "Produtos",
  "Planos",
  "Contato",
  "Entrar",
  "Cadastro",
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-surface font-sans flex flex-col">
        {/* HEADER */}
        <header className="bg-primary text-white shadow">
          {/* Linha 1: logo + título */}
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Menu hamburger */}
              <button className="w-8 h-8 flex flex-col justify-center gap-1">
                <span className="h-0.5 bg-white" />
                <span className="h-0.5 bg-white" />
                <span className="h-0.5 bg-white" />
              </button>

              <div className="flex items-center gap-2">
                {/* Logo simples */}
                <div className="w-10 h-10 border border-white/50 flex items-center justify-center text-[10px] font-bold leading-none">
                  ASPEC
                </div>
                <span className="text-lg font-semibold">
                  AspecNet - Licitações e Contratos
                </span>
              </div>
            </div>
          </div>

          {/* Linha 2: barra de endereço */}
          <div className="bg-primary-light/90 border-y border-primary-light/40">
            <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center gap-3 text-sm">
              <span className="border border-white/60 px-2 py-0.5">&lt;</span>
              <span className="border border-white/60 px-2 py-0.5">&gt;</span>

              <div className="flex-1 bg-white text-slate-800 px-3 py-1 rounded-sm text-xs">
                http://www.aspecnet.com.br/
              </div>
            </div>
          </div>

          {/* Linha 3: menu + usuário */}
          <nav className="bg-white">
            <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between border-b border-primary-light">
              {/* Menu */}
              <div className="flex flex-wrap gap-2 text-sm">
                {menuItems.map((item) => (
                  <button
                    key={item}
                    className="px-4 py-1.5 border border-primary-light rounded-sm text-primary-light hover:bg-primary-light hover:text-white transition text-xs"
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Caixa de usuário */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border border-primary-light px-3 py-1.5 rounded-sm text-xs text-primary-light bg-white">
                  <div className="w-7 h-7 border border-primary-light flex items-center justify-center">
                    <span className="text-xs">👤</span>
                  </div>
                  <span>Usuário</span>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* CONTEÚDO */}
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
