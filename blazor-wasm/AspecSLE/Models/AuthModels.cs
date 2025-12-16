using System.Text.Json.Serialization;

namespace AspecSLE.Models;

public class AuthUser
{
    public string Email { get; set; } = default!;
    public string CPF { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}

public class LoginResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public AuthUser User { get; set; } = default!;
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

public class ProblemDetails
{
    public string? Type { get; set; }
    public string? Title { get; set; }
    public int? Status { get; set; }
    public string? Detail { get; set; }
    public string? Instance { get; set; }
}

public class RegisterResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public AuthUser User { get; set; } = default!;
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

public class UserProfileResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public AuthUser User { get; set; } = default!;
}

public class UpdateProfileResponse
{
    public string Message { get; set; } = string.Empty;
}

public class AuthSession
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public AuthUser User { get; set; } = default!;
}

public class StoredAuth
{
    public AuthUser User { get; set; } = default!;
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

public class ErrorResponse
{
    public string? Error { get; set; }
}

public class SuccessResponse
{
    public string? Message { get; set; }
}

public class RecaptchaVerifyResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("score")]
    public double? Score { get; set; }

    [JsonPropertyName("action")]
    public string? Action { get; set; }

    [JsonPropertyName("challenge_ts")]
    public DateTime? ChallengeTs { get; set; }

    [JsonPropertyName("hostname")]
    public string? Hostname { get; set; }

    [JsonPropertyName("error-codes")]
    public List<string>? ErrorCodes { get; set; }
}

public class RecaptchaErrorResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("error-codes")]
    public List<string>? ErrorCodes { get; set; }
}

/// <summary>
/// Representa o resultado da valida��o do reCAPTCHA.
/// Implementa o padr�o Result para encapsular sucesso ou falha da opera��o.
/// </summary>
public class RecaptchaValidationResult
{
    public bool IsValid { get; private set; }
    public string? ErrorMessage { get; private set; }

    private RecaptchaValidationResult(bool isValid, string? errorMessage = null)
    {
        IsValid = isValid;
        ErrorMessage = errorMessage;
    }

    /// <summary>
    /// Cria um resultado de valida��o bem-sucedida.
    /// </summary>
    public static RecaptchaValidationResult Success()
        => new(isValid: true);

    /// <summary>
    /// Cria um resultado de valida��o com falha.
    /// </summary>
    /// <param name="errorMessage">Mensagem de erro descrevendo a falha</param>
    public static RecaptchaValidationResult Failure(string errorMessage)
        => new(isValid: false, errorMessage);
}
