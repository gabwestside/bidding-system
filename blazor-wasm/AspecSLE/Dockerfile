# Estagio de compilacao
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Instalar Node.js para compilar o Tailwind CSS
RUN apt-get update && \
    apt-get install -y nodejs npm

# Copiar arquivos do projeto
COPY . .

# Restaurar dependencias do .NET
RUN dotnet restore AspecSLE.csproj

# Instalar dependencias do Node e compilar CSS
RUN npm install
RUN npm run buildcss

# Publicar a aplicacao
RUN dotnet publish AspecSLE.csproj -c Release -o /app/publish

# Estagio final (Nginx)
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html

# Instalar jq para manipular JSON
RUN apk add --no-cache jq

# Copiar os arquivos publicados
COPY --from=build /app/publish/wwwroot .

# Copiar configuracao customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Configurar Entrypoint para injecao de variaveis
COPY entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
