#!/usr/bin/env bash

# Caminhos base
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_folder="${project_root}/allure-report"
results_folder="${project_root}/allure-results"
custom_styles_path="${project_root}/allure-custom/styles.css"
logo_source_path="${project_root}/allure-custom/neuro-logo.svg"
favicon_source_path="${project_root}/allure-custom/favicon.ico"

logo_target_folder="$output_folder/plugin/custom-logo"
favicon_target_path="$output_folder/favicon.ico"

# Gera o relatório com idioma em português
allure generate "$results_folder" --clean --lang br -o "$output_folder"

# Verifica se o relatório foi gerado
if [ ! -f "$output_folder/index.html" ]; then
  exit 1
fi

# Aplica CSS customizado
if [ -f "$custom_styles_path" ]; then
  cp "$custom_styles_path" "$output_folder/custom.css"
  sed -i '' '/<link rel="stylesheet" type="text\/css" href="styles.css">/a\
<link rel="stylesheet" type="text/css" href="custom.css">' "$output_folder/index.html"
fi

# Altera o título da aba do navegador
sed -i '' 's|<title>Allure Report</title>|<title>Neuro Report</title>|' "$output_folder/index.html"

# Atualiza texto do sumário
summary_file="$output_folder/widgets/summary.json"
if [ -f "$summary_file" ]; then
  sed -i '' 's/Allure Report/Neuro Report/g' "$summary_file"
fi

# Copia logo customizada
if [ -f "$logo_source_path" ]; then
  mkdir -p "$logo_target_folder"
  cp "$logo_source_path" "$logo_target_folder/neuro-logo.svg"
fi

# Substitui ou insere o favicon
if [ -f "$favicon_source_path" ]; then
  cp "$favicon_source_path" "$favicon_target_path"
  if grep -q '<link rel="icon"' "$output_folder/index.html"; then
    sed -i '' 's|<link rel="icon[^>]*>|<link rel="icon" type="image/x-icon" href="favicon.ico">|' "$output_folder/index.html"
  else
    sed -i '' '/<head>/a\
    <link rel="icon" type="image/x-icon" href="favicon.ico">' "$output_folder/index.html"
  fi
fi