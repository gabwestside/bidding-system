using AspecSLE.Models;

namespace AspecSLE.Services;

public static class MunicipiosPorUfService
{
    private static IReadOnlyDictionary<string, IReadOnlyList<string>> _porUf
        = new Dictionary<string, IReadOnlyList<string>>(StringComparer.OrdinalIgnoreCase);

    public static void Carregar(EstadosRoot root)
    {
        _porUf = root.Estados.ToDictionary(
            e => e.Sigla.ToUpperInvariant(),
            e => (IReadOnlyList<string>)e.Cidades
                .Select(c => c.NomeCidade)
                .OrderBy(n => n)
                .ToList(),
            StringComparer.OrdinalIgnoreCase
        );
    }

    public static IReadOnlyList<string> ObterPorUf(string uf)
    {
        if (string.IsNullOrWhiteSpace(uf))
            return [];

        uf = uf.Trim().ToUpperInvariant();

        return _porUf.TryGetValue(uf, out var cidades)
            ? cidades
            : [];
    }
}