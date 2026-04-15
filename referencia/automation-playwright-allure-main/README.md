# automation-playwright-allure

Projeto básico de automação de testes utilizando **Python**, **Playwright**, **pytest** e **Allure Reports** com integração via **GitHub Actions**.

## 🔧 Funcionalidades

- Teste de UI com Playwright (Google)
- Teste de API com Requests (JSONPlaceholder)
- Geração de relatórios com Allure
- Publicação automática do relatório no GitHub Pages

## 🚀 Como usar

### 1. Instale as dependências

```bash
pip install -r requirements.txt
python -m playwright install
```

### 2. Rode os testes (gerando resultados para o Allure)

```bash
pytest
```

Ou manualmente (caso não use `pytest.ini`):

```bash
pytest --alluredir=allure-results
```

### 3. Gere o relatório HTML com Allure CLI

```bash
allure generate allure-results -o allure-report --clean
```

### 4. Visualize o relatório localmente

```bash
allure open allure-report
```

Ou use o servidor local:

```bash
allure serve allure-results
```

### 5. GitHub Actions

Ao realizar um push para o repositório, os testes serão executados automaticamente e o relatório Allure será publicado no GitHub Pages.

## 📄 Acesso ao relatório online

O relatório estará disponível em:

```
https://SEU_USUARIO.github.io/automation-playwright-allure/
```
# riskpack-credenciais-backend-teste
