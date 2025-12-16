using AspecSLE.Models;
using Microsoft.JSInterop;
using System.Net.Http.Json;
using System.Text.Json;

namespace AspecSLE.Services;

public class AuthService
{
    private const string StorageKey = "aspec-auth";

    private readonly HttpClient _http;
    private readonly IJSRuntime _js;

    private DateTime? _expiresAt;

    public AuthUser? CurrentUser { get; private set; }
    public string? Token { get; private set; }

    public bool IsAuthenticated =>
        !string.IsNullOrEmpty(Token) &&
        _expiresAt is { } exp &&
        exp > DateTime.UtcNow;

    public event Action? AuthStateChanged;

    public AuthService(HttpClient http, IJSRuntime js)
    {
        _http = http;
        _js = js;
    }

    public async Task InitializeAsync()
    {
        if (CurrentUser != null || Token != null) return;

        try
        {
            var json = await _js.InvokeAsync<string?>("localStorage.getItem", StorageKey);
            if (!string.IsNullOrWhiteSpace(json))
            {
                var stored = JsonSerializer.Deserialize<StoredAuth>(json);
                if (stored != null)
                {
                    if (stored.ExpiresAt > DateTime.UtcNow)
                    {
                        CurrentUser = stored.User;
                        Token = stored.Token;
                        _expiresAt = stored.ExpiresAt;
                    }
                    else
                    {
                        await _js.InvokeVoidAsync("localStorage.removeItem", StorageKey);
                    }
                }
            }
        }
        catch
        {
            // ignore
        }

        AuthStateChanged?.Invoke();
    }

    public async Task<(bool Ok, string? Error)> LoginAsync(string cpfDigits, string password, string? recaptchaToken = null)
    {
        try
        {
            var validationResult = await ValidateRecaptchaTokenAsync(recaptchaToken);
            if (!validationResult.IsValid)
            {
                return (false, validationResult.ErrorMessage);
            }

            var payload = new
            {
                cpf = cpfDigits,
                password
            };

            var response = await _http.PostAsJsonAsync("api/auth/login", payload);

            if (!response.IsSuccessStatusCode)
            {
                ProblemDetails? problem = null;
                try
                {
                    problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
                }
                catch { }

                var message = problem?.Detail ?? problem?.Title ??
                              $"Falha ao autenticar (status {response.StatusCode})";

                return (false, message);
            }

            var data = await response.Content.ReadFromJsonAsync<LoginResponse>();
            if (data == null || !data.Success)
            {
                return (false, data?.Message ?? "Falha ao autenticar.");
            }

            CurrentUser = data.User;
            Token = data.Token;
            _expiresAt = data.ExpiresAt;

            var toStore = new StoredAuth
            {
                User = data.User,
                Token = data.Token,
                ExpiresAt = data.ExpiresAt
            };

            var json = JsonSerializer.Serialize(toStore);
            await _js.InvokeVoidAsync("localStorage.setItem", StorageKey, json);

            AuthStateChanged?.Invoke();
            return (true, null);
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public async Task<(bool Ok, string? Message)> ConfirmEmailAsync(string email, string token)
    {
        try
        {
            var payload = new
            {
                email,
                token
            };

            var response = await _http.PostAsJsonAsync("api/auth/confirm-email", payload);

            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = await response.Content.ReadFromJsonAsync<ErrorResponse>();
                return (false, errorResponse?.Error ?? "Erro ao confirmar email.");
            }

            var successResponse = await response.Content.ReadFromJsonAsync<SuccessResponse>();
            return (true, successResponse?.Message ?? "Email confirmado com sucesso!");
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public async Task LogoutAsync()
    {
        CurrentUser = null;
        Token = null;
        _expiresAt = null;

        await _js.InvokeVoidAsync("localStorage.removeItem", StorageKey);
        await _js.InvokeVoidAsync("localStorage.removeItem", "_grecaptcha");

        AuthStateChanged?.Invoke();
    }

    public async Task<(bool Ok, AuthUser? User, string? Error)> GetUserProfileAsync()
    {
        try
        {
            if (string.IsNullOrWhiteSpace(Token))
            {
                return (false, null, "Usuário não autenticado.");
            }

            _http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", Token);

            var response = await _http.GetAsync("api/auth/me");

            if (!response.IsSuccessStatusCode)
            {
                ProblemDetails? problem = null;
                try
                {
                    problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
                }
                catch { }

                var message = problem?.Detail ?? problem?.Title ??
                              $"Falha ao obter perfil (status {response.StatusCode})";

                return (false, null, message);
            }

            var data = await response.Content.ReadFromJsonAsync<UserProfileResponse>();
            if (data == null || !data.Success)
            {
                return (false, null, data?.Message ?? "Falha ao obter perfil.");
            }

            // Atualiza o usuário atual com os dados mais recentes
            CurrentUser = data.User;
            AuthStateChanged?.Invoke();

            return (true, data.User, null);
        }
        catch (Exception ex)
        {
            return (false, null, ex.Message);
        }
    }
    
    public async Task<(bool Ok, string? Message)> UpdateProfileAsync(string firstName, string lastName, string phoneDigits)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(Token))
            {
                return (false, "Usuário não autenticado.");
            }

            _http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", Token);

            var payload = new
            {
                firstName,
                lastName,
                phone = phoneDigits
            };

            var response = await _http.PutAsJsonAsync("api/auth/update-profile", payload);

            if (!response.IsSuccessStatusCode)
            {
                ProblemDetails? problem = null;
                try
                {
                    problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
                }
                catch { }

                var message = problem?.Detail ?? problem?.Title ??
                              $"Falha ao atualizar perfil (status {response.StatusCode})";

                return (false, message);
            }

            var data = await response.Content.ReadFromJsonAsync<UpdateProfileResponse>();
            
            // Atualiza os dados do usuário atual
            if (CurrentUser != null)
            {
                CurrentUser.FirstName = firstName;
                CurrentUser.LastName = lastName;
                CurrentUser.FullName = $"{firstName} {lastName}";
                CurrentUser.Phone = phoneDigits;
                AuthStateChanged?.Invoke();
            }

            return (true, data?.Message ?? "Perfil atualizado com sucesso.");
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public async Task<(bool Ok, string? Error, string? SuccessMessage)> RegisterAsync(string fullName, string cpfDigits, string phoneDigits, string email, string password, string confirmPassword, string? recaptchaToken = null)
    {
        try
        {
            var validationResult = await ValidateRecaptchaTokenAsync(recaptchaToken);
            if (!validationResult.IsValid)
            {
                return (false, validationResult.ErrorMessage, null);
            }

            var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var firstName = parts.FirstOrDefault() ?? string.Empty;
            var lastName = parts.Length > 1 ? string.Join(' ', parts.Skip(1)) : string.Empty;

            var payload = new
            {
                email = email.Trim(),
                password,
                confirmPassword,
                firstName,
                lastName,
                cpf = cpfDigits,
                phone = phoneDigits,
                role = "Admin"
            };

            var response = await _http.PostAsJsonAsync("api/auth/register", payload);

            if (!response.IsSuccessStatusCode)
            {
                ProblemDetails? problem = null;
                try
                {
                    problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
                }
                catch { }

                var message = problem?.Detail ?? problem?.Title ??
                              $"Falha ao cadastrar (status {response.StatusCode})";

                return (false, message, null);
            }

            var data = await response.Content.ReadFromJsonAsync<RegisterResponse>();
            if (data == null || !data.Success)
            {
                return (false, data?.Message ?? "Falha ao realizar o cadastro.", null);
            }

            return (true, null, data.Message);
        }
        catch (Exception ex)
        {
            return (false, ex.Message, null);
        }
    }

    public async Task<(bool Ok, string? Message)> ForgotPasswordAsync(string email, string cpf, string? recaptchaToken = null)
    {
        try
        {
            var validationResult = await ValidateRecaptchaTokenAsync(recaptchaToken);
            if (!validationResult.IsValid)
            {
                return (false, validationResult.ErrorMessage);
            }

            var payload = new
            {
                email,
                cpf
            };

            var response = await _http.PostAsJsonAsync("api/auth/forgot-password", payload);

            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = await response.Content.ReadFromJsonAsync<ErrorResponse>();
                return (false, errorResponse?.Error ?? "Ocorreu um erro interno.");
            }

            var successResponse = await response.Content.ReadFromJsonAsync<SuccessResponse>();
            return (true, successResponse?.Message ?? "Se o email existir, você receberá instruções para redefinir sua senha.");
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public async Task<(bool Ok, string? Message)> ResetPasswordAsync(string email, string token, string newPassword, string confirmNewPassword, string? recaptchaToken = null)
    {
        try
        {
            var validationResult = await ValidateRecaptchaTokenAsync(recaptchaToken);
            if (!validationResult.IsValid)
            {
                return (false, validationResult.ErrorMessage);
            }

            var payload = new
            {
                email,
                token,
                newPassword,
                confirmNewPassword
            };

            var response = await _http.PostAsJsonAsync("api/auth/reset-password", payload);

            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = await response.Content.ReadFromJsonAsync<ErrorResponse>();
                return (false, errorResponse?.Error ?? "Ocorreu um erro interno.");
            }

            var successResponse = await response.Content.ReadFromJsonAsync<SuccessResponse>();
            return (true, successResponse?.Message ?? "Senha redefinida com sucesso.");
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    /// <summary>
    /// Valida o token do reCAPTCHA se fornecido.
    /// </summary>
    /// <param name="recaptchaToken">Token do reCAPTCHA a ser validado (opcional)</param>
    /// <returns>Resultado da validação contendo status e mensagem de erro se houver</returns>
    private async Task<RecaptchaValidationResult> ValidateRecaptchaTokenAsync(string? recaptchaToken)
    {
        // Se não há token, considera válido (validação opcional)
        if (string.IsNullOrWhiteSpace(recaptchaToken))
        {
            return RecaptchaValidationResult.Success();
        }

        var (isValid, errorMessage) = await VerifyRecaptchaAsync(recaptchaToken);

        return isValid
            ? RecaptchaValidationResult.Success()
            : RecaptchaValidationResult.Failure(errorMessage ?? "Falha na validação do reCAPTCHA.");
    }

    private async Task<(bool Success, string? Error)> VerifyRecaptchaAsync(string token)
    {
        try
        {
            var payload = new { token };
            var response = await _http.PostAsJsonAsync("api/recaptcha/verify", payload);

            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = await response.Content.ReadFromJsonAsync<RecaptchaErrorResponse>();
                var errorCodes = errorResponse?.ErrorCodes != null && errorResponse.ErrorCodes.Any()
                    ? string.Join(", ", errorResponse.ErrorCodes)
                    : "Erro desconhecido";

                return (false, $"Validação do reCAPTCHA falhou: {errorCodes}");
            }

            var result = await response.Content.ReadFromJsonAsync<RecaptchaVerifyResponse>();

            if (result == null)
            {
                return (false, "Resposta inválida do servidor de validação.");
            }

            if (!result.Success)
            {
                var errorCodes = result.ErrorCodes != null && result.ErrorCodes.Any()
                    ? string.Join(", ", result.ErrorCodes)
                    : "Verificação falhou";

                return (false, $"reCAPTCHA inválido: {errorCodes}");
            }

            // Para reCAPTCHA v3, verifica o score (opcional, mas recomendado)
            if (result.Score.HasValue && result.Score < 0.5)
            {
                return (false, "Validação de segurança falhou. Por favor, tente novamente.");
            }

            return (true, null);
        }
        catch (Exception ex)
        {
            return (false, $"Erro ao validar reCAPTCHA: {ex.Message}");
        }
    }
}
