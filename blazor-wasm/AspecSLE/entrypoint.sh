#!/bin/sh
set -e

# Caminho para o appsettings.json no container Nginx
TARGET_FILE="/usr/share/nginx/html/appsettings.json"

# Funcao para atualizar valores usando jq se a variavel de ambiente estiver definida
update_json() {
    key=$1
    env_var=$2
    
    # Se a variavel de ambiente existe
    if [ ! -z "$(eval echo \$$env_var)" ]; then
        val="$(eval echo \$$env_var)"
        echo "Atualizando $key para: $val"
        
        # Cria arquivo temporario
        tmp=$(mktemp)
        # Atualiza o JSON
        jq --arg v "$val" "$key = \$v" "$TARGET_FILE" > "$tmp" && mv "$tmp" "$TARGET_FILE"
        # Garante permissao de leitura para o Nginx
        chmod 644 "$TARGET_FILE"
    fi
}

# Mapeamento de Variaveis de Ambiente para Chaves do JSON
# Sintaxe jq: .ChavePrincipal.SubChave
update_json '.ApiSettings.BaseUrl' 'API_BASE_URL'
update_json '.RecaptchaSettings.SiteKey' 'RECAPTCHA_SITE_KEY'

# Executa o comando passado para o docker (nginx)
exec "$@"
