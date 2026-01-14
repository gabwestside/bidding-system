using System.ComponentModel.DataAnnotations;

public class FormSimplificadoModel : IValidatableObject
    {
        [Required(ErrorMessage = "Nome é obrigatório.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "CPF é obrigatório.")]
        public string Cpf { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        public string Email { get; set; } = string.Empty;

        public string Telefone { get; set; } = string.Empty;

        public string Logradouro { get; set; } = string.Empty;

        public string TipoEndereco { get; set; } = string.Empty;

        public string Uf { get; set; } = string.Empty;
        public string Cidade { get; set; } = string.Empty;

        public bool TipoViaRua { get; set; }
        public bool TipoViaAvenida { get; set; }
        public bool TipoViaLogradouro { get; set; }

        // Propriedade "dummy" só para pendurar ValidationMessage
        public bool TipoViaDummy { get; set; }

        public string DescricaoVia { get; set; } = string.Empty;
        
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (!TipoViaRua && !TipoViaAvenida && !TipoViaLogradouro)
            {
                yield return new ValidationResult(
                    "Selecione pelo menos um tipo de via.",
                    [nameof(TipoViaDummy)]
                );
            }
        }
    }
