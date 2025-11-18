// src/app/page.tsx
export default function HomePage() {
  return (
    <section className="bg-panel rounded-sm px-8 py-10 shadow-inner border border-primary-light">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card: Fornecedor */}
        <article className="bg-card-blue text-white rounded-md shadow-md overflow-hidden flex flex-col items-center pt-8 pb-6 px-6">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-xl font-semibold mb-4">Fornecedor</h2>

          <div className="bg-white/90 text-slate-800 rounded-md px-4 py-4 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis
            semper dolor. Nunc purus nisi,{" "}
            <span className="font-semibold">elementum</span> id.
          </div>
        </article>

        {/* Card: Comprador */}
        <article className="bg-card-blue-strong text-white rounded-md shadow-md overflow-hidden flex flex-col items-center pt-8 pb-6 px-6">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-xl font-semibold mb-4">Comprador</h2>

          <div className="bg-white/90 text-slate-800 rounded-md px-4 py-4 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis
            semper dolor. Nunc purus nisi,{" "}
            <span className="font-semibold">elementum</span> id.
          </div>
        </article>

        {/* Card: Sociedade */}
        <article className="bg-card-green text-white rounded-md shadow-md overflow-hidden flex flex-col items-center pt-8 pb-6 px-6">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-xl font-semibold mb-4">Sociedade</h2>

          <div className="bg-white/90 text-slate-800 rounded-md px-4 py-4 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis
            semper dolor. Nunc purus nisi,{" "}
            <span className="font-semibold">elementum</span> id.
          </div>
        </article>
      </div>
    </section>
  );
}
