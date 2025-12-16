using AspecSLE;
using AspecSLE.Models;
using AspecSLE.Services;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using System.Text.Json;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

var http = new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) };
using var response = await http.GetAsync("appsettings.json");
using var stream = await response.Content.ReadAsStreamAsync();

builder.Configuration.AddJsonStream(stream);

using var responsecities = await http.GetAsync("estados-cidades.json");
responsecities.EnsureSuccessStatusCode();

await using var streamcities = await responsecities.Content.ReadAsStreamAsync();

var options = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true
};

var root = await JsonSerializer.DeserializeAsync<EstadosRoot>(streamcities, options);

MunicipiosPorUfService.Carregar(root!);

var apiBaseUrl = builder.Configuration["ApiSettings:BaseUrl"];
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(apiBaseUrl!) });

builder.Services.AddScoped<AuthService>();

await builder.Build().RunAsync();
