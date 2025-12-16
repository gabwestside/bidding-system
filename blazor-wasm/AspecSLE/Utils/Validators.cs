namespace AspecSLE.Utils;

public static class Validators
{
    public static string FormatCpfMask(string value)
    {
        var digits = new string(value.Where(char.IsDigit).Take(11).ToArray());

        if (digits.Length <= 3)
            return digits;
        if (digits.Length <= 6)
            return $"{digits[..3]}.{digits[3..]}";
        if (digits.Length <= 9)
            return $"{digits[..3]}.{digits[3..6]}.{digits[6..]}";

        return $"{digits[..3]}.{digits[3..6]}.{digits[6..9]}-{digits[9..]}";
    }

    public static string FormatCpfReadOnlyMask(string digits)
    {
        if (string.IsNullOrWhiteSpace(digits))
            return string.Empty;

        digits = new string(digits.Where(char.IsDigit).ToArray());
        digits = digits.Length > 11 ? digits[..11] : digits;

        if (digits.Length <= 3) return digits;
        if (digits.Length <= 6) return $"{digits[..3]}.{digits[3..]}";
        if (digits.Length <= 9) return $"{digits[..3]}.{digits[3..6]}.{digits[6..]}";
        return $"{digits[..3]}.{digits[3..6]}.{digits[6..9]}-{digits[9..]}";
    }

    public static bool IsValidCpf(string cpfDigits)
    {
        if (string.IsNullOrWhiteSpace(cpfDigits) || cpfDigits.Length != 11 || !cpfDigits.All(char.IsDigit))
            return false;

        if (cpfDigits.Distinct().Count() == 1)
            return false;

        var nums = cpfDigits.Select(c => c - '0').ToArray();

        var sum1 = 0;
        for (var i = 0; i < 9; i++)
            sum1 += nums[i] * (10 - i);
        var dv1 = (sum1 * 10) % 11;
        if (dv1 == 10) dv1 = 0;
        if (dv1 != nums[9]) return false;

        var sum2 = 0;
        for (var i = 0; i < 10; i++)
            sum2 += nums[i] * (11 - i);
        var dv2 = (sum2 * 10) % 11;
        if (dv2 == 10) dv2 = 0;

        return dv2 == nums[10];
    }

    public static string GetDigitsOnly(string cpf)
    {
        return new string(cpf.Where(char.IsDigit).ToArray());
    }

    public static string FormatPhoneMask(string value)
    {
        var digits = new string(value.Where(char.IsDigit).Take(11).ToArray());

        if (digits.Length == 0)
            return string.Empty;
        if (digits.Length <= 2)
            return $"({digits}";
        if (digits.Length <= 6)
            return $"({digits[..2]}) {digits[2..]}";
        if (digits.Length <= 10)
            return $"({digits[..2]}) {digits[2..6]}-{digits[6..]}";

        return $"({digits[..2]}) {digits[2..7]}-{digits[7..]}";
    }

    public static bool IsValidPhone(string phoneDigits)
    {
        if (string.IsNullOrWhiteSpace(phoneDigits))
            return false;

        if (phoneDigits.Length != 10 && phoneDigits.Length != 11)
            return false;

        if (!phoneDigits.All(char.IsDigit))
            return false;

        return true;
    }

    public static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email.Trim();
        }
        catch
        {
            return false;
        }
    }

    public static (bool isValid, string? cpfError, string? passwordError) ValidateFormWithoutCaptcha(string cpf,
        string password)
    {
        var valid = true;
        string? cpfError = null;
        string? passwordError = null;

        var cpfDigits = string.Concat(cpf.Where(char.IsDigit));

        if (string.IsNullOrWhiteSpace(cpfDigits))
        {
            cpfError = "Campo obrigatório";
            valid = false;
        }
        else if (cpfDigits.Length != 11 || !IsValidCpf(cpfDigits))
        {
            cpfError = "CPF inválido";
            valid = false;
        }

        if (string.IsNullOrWhiteSpace(password))
        {
            passwordError = "Campo obrigatório";
            valid = false;
        }
        else if (password.Length < 8 || password.Length > 16)
        {
            passwordError = "Senha inválida";
            valid = false;
        }

        return (valid, cpfError, passwordError);
    }

    public static string GetInitials(string fullName)
    {
        var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0) return "??";
        if (parts.Length == 1) return parts[0][0].ToString().ToUpper();
        return $"{parts[0][0]}{parts[^1][0]}".ToUpper();
    }

    public static string GetFullName(string nome, string sobrenome)
    {
        if (string.IsNullOrWhiteSpace(nome) && string.IsNullOrWhiteSpace(sobrenome))
            return "Usuário";
        return $"{nome} {sobrenome}".Trim();
    }

    public static string FormatPhone(string? phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
            return "Não informado";

        var digits = new string(phone.Where(char.IsDigit).ToArray());

        if (digits.Length == 0)
            return "Não informado";
        if (digits.Length <= 10)
            return $"({digits[..2]}) {digits[2..6]}-{digits[6..]}";

        return $"({digits[..2]}) {digits[2..7]}-{digits[7..]}";
    }

    public static string FormatarCnpj(string cnpj)
    {
        var numeros = new string(cnpj.Where(char.IsDigit).ToArray());
        if (numeros.Length == 0) return string.Empty;
        if (numeros.Length <= 2) return numeros;
        if (numeros.Length <= 5) return $"{numeros.Substring(0, 2)}.{numeros.Substring(2)}";
        if (numeros.Length <= 8) return $"{numeros.Substring(0, 2)}.{numeros.Substring(2, 3)}.{numeros.Substring(5)}";
        if (numeros.Length <= 12)
            return
                $"{numeros.Substring(0, 2)}.{numeros.Substring(2, 3)}.{numeros.Substring(5, 3)}/{numeros.Substring(8)}";
        return
            $"{numeros.Substring(0, 2)}.{numeros.Substring(2, 3)}.{numeros.Substring(5, 3)}/{numeros.Substring(8, 4)}-{numeros.Substring(12, 2)}";
    }

    public static string FormatarCep(string cep)
    {
        var numeros = new string(cep.Where(char.IsDigit).ToArray());
        if (numeros.Length == 0) return string.Empty;
        if (numeros.Length <= 5) return numeros;
        return $"{numeros.Substring(0, 5)}-{numeros.Substring(5)}";
    }

    public static string FormatarTelefone(string telefone)
    {
        var numeros = new string(telefone.Where(char.IsDigit).ToArray());
        if (numeros.Length == 0) return string.Empty;
        if (numeros.Length <= 2) return $"({numeros}";
        if (numeros.Length <= 6) return $"({numeros.Substring(0, 2)}) {numeros.Substring(2)}";
        if (numeros.Length <= 10)
            return $"({numeros.Substring(0, 2)}) {numeros.Substring(2, 4)}-{numeros.Substring(6)}";
        return $"({numeros.Substring(0, 2)}) {numeros.Substring(2, 5)}-{numeros.Substring(7, 4)}";
    }

    public static bool ValidarCnpj(string cnpj)
    {
        var numeros = new string((cnpj ?? string.Empty).Where(char.IsDigit).ToArray());

        if (numeros.Length != 14)
            return false;

        // elimina sequências tipo 00000000000000, 11111111111111 etc.
        if (new string(numeros[0], numeros.Length) == numeros)
            return false;

        int[] multiplicador1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
        int[] multiplicador2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

        string temp = numeros[..12];
        int soma = 0;

        for (int i = 0; i < 12; i++)
            soma += (temp[i] - '0') * multiplicador1[i];

        int resto = soma % 11;
        resto = resto < 2 ? 0 : 11 - resto;
        string digitos = resto.ToString();

        temp += digitos;
        soma = 0;

        for (int i = 0; i < 13; i++)
            soma += (temp[i] - '0') * multiplicador2[i];

        resto = soma % 11;
        resto = resto < 2 ? 0 : 11 - resto;
        digitos += resto.ToString();

        return numeros.EndsWith(digitos);
    }
}