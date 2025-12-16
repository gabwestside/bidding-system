using System.Text.Json.Serialization;

namespace AspecSLE.Models
{
    public sealed class EstadosRoot
    {
        [JsonPropertyName("estados")]
        public required List<Estado> Estados { get; init; }
    }

    public sealed class Estado
    {
        [JsonPropertyName("id")]
        public long Id { get; init; }

        [JsonPropertyName("nomeEstado")]
        public required string NomeEstado { get; init; }

        [JsonPropertyName("sigla")]
        public required string Sigla { get; init; }

        [JsonPropertyName("cidades")]
        public required List<Cidade> Cidades { get; init; }
    }

    public sealed class Cidade
    {
        [JsonPropertyName("id_cidade")]
        public long IdCidade { get; init; }

        [JsonPropertyName("nomeCidade")]
        public required string NomeCidade { get; init; }
    }
}
