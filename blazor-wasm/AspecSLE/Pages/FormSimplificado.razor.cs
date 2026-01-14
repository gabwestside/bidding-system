using AspecSLE.Services;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace AspecSLE.Pages;

public enum FieldIndex
{
    Nome = 0,
    Cpf = 1,
    Email = 2,
    Telefone = 3,
    Logradouro = 4,
    TipoEndereco = 5,
    Uf = 6,
    Cidade = 7,
    TipoVia = 8,
    DescricaoVia = 9
}

public partial class FormSimplificado : ComponentBase
{
    // ---------- Constantes para strings literais ----------
    protected const string TipoComercial = "Comercial";
    protected const string TipoEmpresarial = "Empresarial";

    // ---------- Constantes de layout / CSS ----------
    protected const string InputCss =
        "h-9 w-full rounded-md border border-border-soft px-3 text-sm " +
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

    protected const string InputCssWithButton =
        "h-9 w-full rounded-md border border-border-soft px-3 pr-6 text-sm " +
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

    protected const string LabelCss = "text-xs text-slate-700";
    protected const string ValidationCss = "text-[10px] text-red-500 mt-0.5";
    protected const string RadioCheckboxCss = "h-3.5 w-3.5 border-border-soft text-primary";

    protected const string ComboButtonCss =
        "absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400";

    protected const string DropdownCss =
        "absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border " +
        "border-border-soft bg-white shadow-md text-xs";

    protected const string DropdownItemCss =
        "px-2 py-1 cursor-pointer hover:bg-slate-100";

    protected const string DropdownItemFocusedCss =
        "px-2 py-1 cursor-pointer bg-primary text-white";

    protected const string TextAreaCss =
        "h-9 w-full rounded-md border border-border-soft px-3 text-sm " +
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary " +
        "disabled:bg-slate-100 disabled:text-slate-400";

    private const int TotalFields = 10;
    private const int PageSize = 8;

    // ---------- Injeções ----------
    [Inject] private IJSRuntime Js { get; set; } = default!;

    // ---------- Modelo / estado de validação ----------
    protected readonly FormSimplificadoModel _model = new();
    protected EditContext _editContext = default!;

    // ---------- Elementos de UI ----------
    protected ElementReference _fieldNomeRef;
    protected ElementReference _fieldCpfRef;
    protected ElementReference _fieldEmailRef;
    protected ElementReference _fieldTelefoneRef;

    protected ElementReference _fieldLogradouroRef;
    protected ElementReference _fieldTipoEndComercialRef;
    protected ElementReference _fieldTipoEndEmpresarialRef;
    protected ElementReference _fieldUfRef;
    protected ElementReference _fieldCidadeRef;

    protected ElementReference _fieldTipoViaRuaRef;
    protected ElementReference _fieldTipoViaAvenidaRef;
    protected ElementReference _fieldTipoViaLogradouroRef;
    protected ElementReference _fieldDescricaoViaRef;

    // ---------- Estado de navegação ----------
    protected int _tipoEnderecoFocusIndex;
    protected int _tipoViaFocusIndex;

    protected bool HasTipoViaSelecionado =>
        _model.TipoViaRua || _model.TipoViaAvenida || _model.TipoViaLogradouro;

    // ---------- UF / Cidade ----------
    private static readonly string[] _ufs =
    {
        "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
        "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
        "RS","RO","RR","SC","SP","SE","TO"
    };

    private IReadOnlyList<string> _cidadesBaseAtual = Array.Empty<string>();
    protected bool _ufDropdownOpen;
    protected int? _ufFocusedIndex;
    protected bool _cidadeDropdownOpen;
    protected int? _cidadeFocusedIndex;

    // ---------- Mensagens ----------
    protected string? _globalError;
    protected string? _mensagemSucesso;

    // ---------- Lifecycle ----------
    protected override void OnInitialized()
    {
        _editContext = new EditContext(_model);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await FocusFieldAsync(FieldIndex.Nome);
        }
    }

    // ---------- Helpers de UI ----------
    protected string GetDropdownItemCss(bool isFocused) =>
        isFocused ? DropdownItemFocusedCss : DropdownItemCss;

    private ElementReference GetFieldRef(FieldIndex index) => index switch
    {
        FieldIndex.Nome => _fieldNomeRef,
        FieldIndex.Cpf => _fieldCpfRef,
        FieldIndex.Email => _fieldEmailRef,
        FieldIndex.Telefone => _fieldTelefoneRef,
        FieldIndex.Logradouro => _fieldLogradouroRef,
        FieldIndex.TipoEndereco => _tipoEnderecoFocusIndex == 0
            ? _fieldTipoEndComercialRef
            : _fieldTipoEndEmpresarialRef,
        FieldIndex.Uf => _fieldUfRef,
        FieldIndex.Cidade => _fieldCidadeRef,
        FieldIndex.TipoVia => _tipoViaFocusIndex switch
        {
            0 => _fieldTipoViaRuaRef,
            1 => _fieldTipoViaAvenidaRef,
            2 => _fieldTipoViaLogradouroRef,
            _ => _fieldTipoViaRuaRef
        },
        FieldIndex.DescricaoVia => _fieldDescricaoViaRef,
        _ => _fieldNomeRef
    };

    private async Task FocusFieldAsync(FieldIndex index, bool center = false)
    {
        var numericIndex = (int)index;
        if (numericIndex < 0 || numericIndex >= TotalFields) return;

        var fieldRef = GetFieldRef(index);
        await Js.InvokeVoidAsync("keyboardForm.focusElement", fieldRef, center);
    }

    // ---------- Focus / ordem obrigatória ----------
    protected async Task OnFieldFocus(FieldIndex index)
    {
        var firstInvalid = GetFirstInvalidRequiredFieldIndex();
        if (firstInvalid.HasValue && firstInvalid.Value < index)
        {
            _globalError = "Preencha os campos obrigatórios na ordem antes de avançar.";
            await FocusFieldAsync(firstInvalid.Value, center: true);
            StateHasChanged();
        }
        else
        {
            _globalError = null;
        }
    }

    protected void OnFieldFocusSync(FieldIndex index)
    {
        _ = OnFieldFocus(index);
    }

    protected void OnTipoEnderecoFocus(int focusIndex)
    {
        _tipoEnderecoFocusIndex = focusIndex;
        OnFieldFocusSync(FieldIndex.TipoEndereco);
    }

    protected void OnTipoViaFocus(int focusIndex)
    {
        _tipoViaFocusIndex = focusIndex;
        OnFieldFocusSync(FieldIndex.TipoVia);
    }

    private void NotifyField(string propertyName)
    {
        var fieldId = new FieldIdentifier(_model, propertyName);
        _editContext.NotifyFieldChanged(fieldId);
    }

    // ---------- Mudança de valor ----------
    protected void OnFieldChanged(ChangeEventArgs e, FieldIndex index)
    {
        var value = e.Value?.ToString() ?? string.Empty;

        switch (index)
        {
            case FieldIndex.Nome:
                _model.Nome = value;
                NotifyField(nameof(FormSimplificadoModel.Nome));
                break;

            case FieldIndex.Cpf:
                _model.Cpf = value;
                NotifyField(nameof(FormSimplificadoModel.Cpf));
                break;

            case FieldIndex.Email:
                _model.Email = value;
                NotifyField(nameof(FormSimplificadoModel.Email));
                break;

            case FieldIndex.Telefone:
                _model.Telefone = value;
                NotifyField(nameof(FormSimplificadoModel.Telefone));
                break;

            case FieldIndex.Logradouro:
                _model.Logradouro = value;
                NotifyField(nameof(FormSimplificadoModel.Logradouro));
                break;

            case FieldIndex.Uf:
                _model.Uf = value.ToUpperInvariant();
                AtualizarCidadesBase();
                AtualizarDropdownUf();
                NotifyField(nameof(FormSimplificadoModel.Uf));
                break;

            case FieldIndex.Cidade:
                _model.Cidade = value;
                AtualizarDropdownCidade();
                NotifyField(nameof(FormSimplificadoModel.Cidade));
                break;

            case FieldIndex.DescricaoVia:
                _model.DescricaoVia = value;
                NotifyField(nameof(FormSimplificadoModel.DescricaoVia));
                break;
        }

        _globalError = null;
    }

    // ---------- Tipo de via ----------
    protected void ToggleTipoVia(int index)
    {
        switch (index)
        {
            case 0: _model.TipoViaRua = !_model.TipoViaRua; break;
            case 1: _model.TipoViaAvenida = !_model.TipoViaAvenida; break;
            case 2: _model.TipoViaLogradouro = !_model.TipoViaLogradouro; break;
        }

        _model.TipoViaDummy = HasTipoViaSelecionado;
        NotifyField(nameof(FormSimplificadoModel.TipoViaDummy));

        _globalError = null;
        StateHasChanged();
    }

    // ---------- UF / Cidade: base e filtros ----------
    private void AtualizarCidadesBase()
    {
        _cidadesBaseAtual = MunicipiosPorUfService.ObterPorUf(_model.Uf);
        _model.Cidade = string.Empty;
        _cidadeFocusedIndex = null;
        _cidadeDropdownOpen = false;
    }

    private void AtualizarDropdownUf()
    {
        var ufsFiltradas = GetUfsFiltradas();
        _ufDropdownOpen = ufsFiltradas.Count > 0;
        _ufFocusedIndex = _ufDropdownOpen ? 0 : null;
    }

    private void AtualizarDropdownCidade()
    {
        var cidadesFiltradas = GetCidadesFiltradas();
        _cidadeDropdownOpen = cidadesFiltradas.Count > 0;
        _cidadeFocusedIndex = _cidadeDropdownOpen ? 0 : null;
    }

    protected IReadOnlyList<string> GetUfsFiltradas()
    {
        if (string.IsNullOrWhiteSpace(_model.Uf))
            return _ufs;

        return _ufs
            .Where(uf => uf.Contains(_model.Uf, StringComparison.OrdinalIgnoreCase))
            .ToArray();
    }

    protected IReadOnlyList<string> GetCidadesFiltradas()
    {
        if (_cidadesBaseAtual is null || _cidadesBaseAtual.Count == 0)
            return Array.Empty<string>();

        if (string.IsNullOrWhiteSpace(_model.Cidade))
            return _cidadesBaseAtual;

        return _cidadesBaseAtual
            .Where(c => c.IndexOf(_model.Cidade, StringComparison.OrdinalIgnoreCase) >= 0)
            .ToArray();
    }

    protected void SelectUf(string uf)
    {
        if (string.IsNullOrWhiteSpace(uf)) return;

        _model.Uf = uf.ToUpperInvariant();
        _ufDropdownOpen = false;
        _ufFocusedIndex = null;
        AtualizarCidadesBase();
        NotifyField(nameof(FormSimplificadoModel.Uf));
    }

    protected void SelectCidade(string cidade)
    {
        if (string.IsNullOrWhiteSpace(cidade)) return;

        _model.Cidade = cidade;
        _cidadeDropdownOpen = false;
        _cidadeFocusedIndex = null;
        NotifyField(nameof(FormSimplificadoModel.Cidade));
    }

    protected void ToggleUfDropdown()
    {
        var lista = GetUfsFiltradas();
        if (lista.Count == 0) return;

        _ufDropdownOpen = !_ufDropdownOpen;
        _ufFocusedIndex = _ufDropdownOpen ? 0 : null;
    }

    protected void ToggleCidadeDropdown()
    {
        var lista = GetCidadesFiltradas();
        if (lista.Count == 0) return;

        _cidadeDropdownOpen = !_cidadeDropdownOpen;
        _cidadeFocusedIndex = _cidadeDropdownOpen ? 0 : null;
    }

    // ---------- Teclado ----------
    protected async Task OnKeyDown(KeyboardEventArgs e, FieldIndex index)
    {
        // 1) Campos especiais (radio/checkbox/dropdown)
        if (await HandleTipoEnderecoKeyDownAsync(e, index)) return;
        if (await HandleTipoViaKeyDownAsync(e, index)) return;
        if (await HandleDropdownKeyDownAsync(e, index)) return;

        // 2) Atalhos globais
        if (await HandleGlobalShortcutsAsync(e, index)) return;

        // 3) Navegação padrão entre campos
        await HandleVerticalNavigationAsync(e, index);
    }

    private async Task<bool> HandleTipoEnderecoKeyDownAsync(KeyboardEventArgs e, FieldIndex index)
    {
        if (index != FieldIndex.TipoEndereco) return false;

        if (e.Key is "ArrowLeft" or "ArrowRight")
        {
            _tipoEnderecoFocusIndex = _tipoEnderecoFocusIndex == 0 ? 1 : 0;
            _model.TipoEndereco = _tipoEnderecoFocusIndex == 0 ? TipoComercial : TipoEmpresarial;

            var radioRef = GetFieldRef(FieldIndex.TipoEndereco);
            await Js.InvokeVoidAsync("keyboardForm.focusElement", radioRef);
            StateHasChanged();
            return true;
        }

        if (e.Key == " ")
        {
            _model.TipoEndereco = _tipoEnderecoFocusIndex == 0 ? TipoComercial : TipoEmpresarial;
            StateHasChanged();
            return true;
        }

        return false;
    }

    private async Task<bool> HandleTipoViaKeyDownAsync(KeyboardEventArgs e, FieldIndex index)
    {
        if (index != FieldIndex.TipoVia) return false;

        if (e.Key is "ArrowLeft" or "ArrowRight")
        {
            const int totalCheckboxes = 3;
            var forward = e.Key == "ArrowRight";

            _tipoViaFocusIndex = forward
                ? (_tipoViaFocusIndex + 1) % totalCheckboxes
                : (_tipoViaFocusIndex - 1 + totalCheckboxes) % totalCheckboxes;

            var targetRef = GetFieldRef(FieldIndex.TipoVia);
            await Js.InvokeVoidAsync("keyboardForm.focusElement", targetRef);
            return true;
        }

        if (e.Key == " ")
        {
            ToggleTipoVia(_tipoViaFocusIndex);
            return true;
        }

        return false;
    }

    private async Task<bool> HandleDropdownKeyDownAsync(KeyboardEventArgs e, FieldIndex index)
    {
        if (index != FieldIndex.Uf && index != FieldIndex.Cidade)
            return false;

        var isUf = index == FieldIndex.Uf;
        var isOpen = isUf ? _ufDropdownOpen : _cidadeDropdownOpen;
        var focusedIndex = isUf ? _ufFocusedIndex : _cidadeFocusedIndex;
        var options = isUf ? GetUfsFiltradas() : GetCidadesFiltradas();
        var optionsCount = options.Count;

        // Abrir dropdown (F4 / Espaço)
        if ((e.Key is "F4" or " ") && !isOpen)
        {
            if (optionsCount == 0) return true;

            if (isUf)
            {
                _ufDropdownOpen = true;
                _ufFocusedIndex = 0;
            }
            else
            {
                _cidadeDropdownOpen = true;
                _cidadeFocusedIndex = 0;
            }

            StateHasChanged();
            return true;
        }

        if (!isOpen || optionsCount == 0)
        {
            if (e.Key is "ArrowLeft" or "ArrowRight")
                return true; // ignora setas laterais
            return false;
        }

        // Navegação com setas dentro da lista
        if (e.Key is "ArrowDown" or "ArrowUp" or "ArrowLeft" or "ArrowRight")
        {
            var idx = focusedIndex ?? -1;
            var forward = e.Key is "ArrowDown" or "ArrowRight";

            idx = forward
                ? (idx + 1 + optionsCount) % optionsCount
                : (idx - 1 + optionsCount) % optionsCount;

            if (isUf) _ufFocusedIndex = idx; else _cidadeFocusedIndex = idx;

            StateHasChanged();
            return true;
        }

        // Espaço: seleciona, mas não sai do campo
        if (e.Key == " ")
        {
            if (focusedIndex.HasValue)
            {
                var valor = options[focusedIndex.Value];
                if (isUf) SelectUf(valor); else SelectCidade(valor);
            }

            StateHasChanged();
            return true;
        }

        // Enter: seleciona e vai para o próximo campo
        if (e.Key == "Enter")
        {
            if (focusedIndex.HasValue)
            {
                var valor = options[focusedIndex.Value];
                if (isUf) SelectUf(valor); else SelectCidade(valor);
            }

            if (!CanLeaveField(index)) return true;

            var nextIndex = (FieldIndex)Math.Min(TotalFields - 1, (int)index + 1);
            await FocusFieldAsync(nextIndex);
            StateHasChanged();
            return true;
        }

        // ESC: fecha dropdown
        if (e.Key == "Escape")
        {
            if (isUf)
            {
                _ufDropdownOpen = false;
                _ufFocusedIndex = null;
            }
            else
            {
                _cidadeDropdownOpen = false;
                _cidadeFocusedIndex = null;
            }

            StateHasChanged();
            return true;
        }

        return false;
    }

    private async Task<bool> HandleGlobalShortcutsAsync(KeyboardEventArgs e, FieldIndex index)
    {
        // Ctrl + Home
        if (e is { Key: "Home", CtrlKey: true })
        {
            _globalError = null;
            await FocusFieldAsync(FieldIndex.Nome, center: true);
            return true;
        }

        // Ctrl + End
        if (e is { Key: "End", CtrlKey: true })
        {
            _globalError = null;
            var last = (FieldIndex)(TotalFields - 1);
            await FocusFieldAsync(last, center: true);
            return true;
        }

        // PageDown
        if (e.Key == "PageDown")
        {
            var targetIndex = Math.Min(TotalFields - 1, (int)index + PageSize);
            var targetField = (FieldIndex)targetIndex;
            var firstInvalid = GetFirstInvalidRequiredFieldIndex();

            if (firstInvalid.HasValue && firstInvalid.Value < targetField)
            {
                _globalError = "Preencha os campos obrigatórios na ordem antes de avançar.";
                await FocusFieldAsync(firstInvalid.Value, center: true);
            }
            else
            {
                _globalError = null;
                await FocusFieldAsync(targetField, center: true);
            }

            return true;
        }

        // PageUp
        if (e.Key == "PageUp")
        {
            var targetIndex = Math.Max(0, (int)index - PageSize);
            _globalError = null;
            await FocusFieldAsync((FieldIndex)targetIndex, center: true);
            return true;
        }

        return false;
    }

    private async Task HandleVerticalNavigationAsync(KeyboardEventArgs e, FieldIndex index)
    {
        // Enter ou seta para baixo -> próximo campo
        if (e.Key is "ArrowDown" or "Enter")
        {
            if (!CanLeaveField(index)) return;

            var nextIndex = (FieldIndex)Math.Min(TotalFields - 1, (int)index + 1);
            var shouldCenter = nextIndex is FieldIndex.Uf or FieldIndex.Cidade;
            await FocusFieldAsync(nextIndex, shouldCenter);
            return;
        }

        // Seta para cima -> campo anterior
        if (e.Key == "ArrowUp")
        {
            var prevIndex = (FieldIndex)Math.Max(0, (int)index - 1);
            var shouldCenter = prevIndex is FieldIndex.Uf or FieldIndex.Cidade;
            await FocusFieldAsync(prevIndex, shouldCenter);
        }
    }

    // ---------- Validação de saída de campo ----------
    private bool CanLeaveField(FieldIndex index)
    {
        _globalError = null;

        switch (index)
        {
            case FieldIndex.Nome:
                if (string.IsNullOrWhiteSpace(_model.Nome))
                {
                    _globalError = "Preencha o nome antes de continuar.";
                    return false;
                }
                break;

            case FieldIndex.Cpf:
                if (string.IsNullOrWhiteSpace(_model.Cpf))
                {
                    _globalError = "Preencha o CPF antes de continuar.";
                    return false;
                }
                break;

            case FieldIndex.Email:
                if (string.IsNullOrWhiteSpace(_model.Email))
                {
                    _globalError = "Preencha o e-mail antes de continuar.";
                    return false;
                }
                break;

            case FieldIndex.TipoVia:
                if (!HasTipoViaSelecionado)
                {
                    _globalError = "Selecione Rua, Avenida ou Logradouro antes de continuar.";
                    return false;
                }
                break;
        }

        return true;
    }

    private FieldIndex? GetFirstInvalidRequiredFieldIndex()
    {
        if (string.IsNullOrWhiteSpace(_model.Nome))
            return FieldIndex.Nome;
        if (string.IsNullOrWhiteSpace(_model.Cpf))
            return FieldIndex.Cpf;
        if (string.IsNullOrWhiteSpace(_model.Email))
            return FieldIndex.Email;
        if (!HasTipoViaSelecionado)
            return FieldIndex.TipoVia;

        return null;
    }

    // ---------- Submit ----------
    protected async Task HandleClickSubmit()
    {
        _mensagemSucesso = null;
        _globalError = null;

        var isValid = _editContext.Validate();

        if (!isValid)
        {
            _globalError = "Preencha os campos obrigatórios antes de enviar.";

            var firstInvalid = GetFirstInvalidRequiredFieldIndex();
            if (firstInvalid.HasValue)
            {
                await FocusFieldAsync(firstInvalid.Value, center: true);
            }

            return;
        }

        _mensagemSucesso =
            "Formulário válido. EditForm + DataAnnotations + navegação só no teclado.";
    }

    // mostra/oculta a caixa de informação do telefone
    protected bool _showTelefoneInfo;

    // Chamado pelo @onfocus do input de telefone.
    // Reaproveita a lógica existente de OnFieldFocus e exibe a info.
    protected async Task OnTelefoneFocus()
    {
        await OnFieldFocus(FieldIndex.Telefone);
        _showTelefoneInfo = true;
        StateHasChanged();
    }

    // Chamado pelo @onblur do input de telefone para esconder a info.
    protected void HideTelefoneInfo()
    {
        _showTelefoneInfo = false;
        StateHasChanged();
    }
}
