# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

POC de automação QA usando Playwright (JavaScript) com testes de UI e API no mesmo projeto, Page Object Model, sistema de tags, relatórios Allure e GitHub Actions.

- **UI target**: https://www.saucedemo.com (user: `standard_user` / pass: `secret_sauce`)
- **API target**: https://jsonplaceholder.typicode.com (endpoints: `GET /users`, `GET /users/:id`) — reqres.in foi substituído por exigir API key

## Setup

```bash
npm init -y
npm install -D @playwright/test allure-playwright
npx playwright install
```

## Commands

```bash
# Rodar todos os testes
npx playwright test

# Rodar por tag
npx playwright test --grep @sanity
npx playwright test --grep @regression

# Rodar somente UI ou somente API
npx playwright test tests/ui
npx playwright test tests/api

# Relatório Playwright (debug)
npx playwright show-report

# Relatório Allure
npx allure generate reports/allure-results -o reports/allure-report
npx allure open reports/allure-report

# Debug de trace
npx playwright show-trace trace.zip
```

## Architecture

```
src/
  pages/        # Page Object Model — somente testes de UI
    BasePage.js
    LoginPage.js
    HomePage.js
  api/          # Clientes de API — somente testes de API
    apiClient.js
    authApi.js
    usersApi.js
  fixtures/     # Setup/teardown compartilhado
    ui.fixture.js
    api.fixture.js
  utils/        # Helpers (env vars, dados)
    env.js
    data.js
  data/         # Payloads e dados de teste em JSON
    users.json
    payloads.json

tests/
  ui/           # Specs de UI (usam POM de src/pages/)
  api/          # Specs de API (usam clientes de src/api/)

reports/        # Gerado automaticamente (não commitar)
  allure-results/
  allure-report/
  screenshots/
  videos/
  traces/
```

**Regra fundamental**: POM é exclusivo para UI. Testes de API usam os clientes em `src/api/` diretamente, sem POM.

## Tag Strategy

| Tag | Quando usar |
|---|---|
| `@ui` | Todo teste de UI |
| `@api` | Todo teste de API |
| `@sanity` | Testes críticos rápidos (rodam em PRs) |
| `@smoke` | Fluxo principal |
| `@critical` | Caminhos críticos (rodam em merge) |
| `@regression` | Suite completa (rodam no nightly) |
| `@release` | Verificação de release |

**Pipeline CI**:
- PR → `@sanity`
- Merge → `@sanity` + `@critical`
- Nightly → `@regression`

## playwright.config.js

Configurar com:
- `screenshot: 'only-on-failure'`
- `video: 'retain-on-failure'`
- `trace: 'retain-on-failure'`
- reporters: `['html', 'allure-playwright']`

## Development Phases

| Fase | Foco | Entregável |
|---|---|---|
| **1 — Base** | Setup, config, primeiro teste UI | 1 teste de login verde rodando local |
| **2 — API e Fixtures** | Clientes de API, fixtures, dados JSON | UI + API rodando com dados externos |
| **3 — Relatórios** | Allure, evidências, scripts npm | Relatórios gerados em falha automaticamente |
| **4 — CI/CD** | GitHub Actions, Secrets, nightly | Pipeline verde com artefatos publicados |
| **5 — Evolução** | Mais cenários, paralelismo, TypeScript | Suite completa, multi-browser, linting |

## GitHub Configuration

### Secrets necessários (Settings → Secrets and variables → Actions)

| Secret | Valor |
|---|---|
| `BASE_URL` | `https://www.saucedemo.com` |
| `API_URL` | `https://reqres.in` |
| `UI_USER` | `standard_user` |
| `UI_PASS` | `secret_sauce` |

### Branch Protection (Settings → Branches → main)
- Exigir CI verde (`@sanity`) antes de merge

### GitHub Pages (relatório Allure)
- Settings → Pages → Source: GitHub Actions
