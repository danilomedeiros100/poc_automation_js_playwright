#!/usr/bin/env node
/**
 * Pós-processamento do HTML do Allure (multiplataforma): título, custom.css,
 * logo do menu e ícone da aba via data URIs (evita falhas de path com allure open / Pages),
 * widgets/summary.json.
 *
 * ALLURE_REPORT_DIR — pasta do relatório gerado (default: reports/allure-report)
 * ALLURE_CUSTOM_DIR — styles.css, logo (menu): logo.png | neuro-logo.svg | icone-logo.svg; aba: icone-logo.svg ou favicon.ico
 * ALLURE_REPORT_TITLE — título da aba e do sumário (default: Relatório QA)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outputFolder = process.env.ALLURE_REPORT_DIR || path.join(root, 'reports', 'allure-report');
const customDir = process.env.ALLURE_CUSTOM_DIR || path.join(root, 'allure-custom');
const reportTitle = process.env.ALLURE_REPORT_TITLE || 'Quality Report';

const indexPath = path.join(outputFolder, 'index.html');

function escapeXmlTitle(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** data:image/...;base64,... a partir de ficheiro (buffer binário). */
function toDataUrl(absPath, mime) {
  const buf = fs.readFileSync(absPath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

const IMAGE_MIME = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

/** CSS url("data:...") com MIME conforme a extensão do ficheiro. */
function imageFileToCssUrl(absPath) {
  const ext = path.extname(absPath).toLowerCase();
  const mime = IMAGE_MIME[ext];
  if (!mime) {
    console.warn('[customize-allure-report] Extensão não suportada para logo de menu:', ext, '— use .png ou .svg');
    return `url("${toDataUrl(absPath, 'image/png')}")`;
  }
  return `url("${toDataUrl(absPath, mime)}")`;
}

/** Remove links de ícone existentes e injeta um único <link rel="icon"> após <head>. */
function setTabIconLink(html, linkTag) {
  let out = html.replace(/<link[^>]*rel=["']shortcut icon["'][^>]*>\s*/gi, '');
  out = out.replace(/<link[^>]*rel=["']icon["'][^>]*>\s*/gi, '');
  return out.replace(/<head[^>]*>/i, (m) => `${m}\n    ${linkTag}`);
}

/** Injeta <style> com logo em data URI logo a seguir ao link do custom.css (cascade por cima). */
function injectInlineLogoStyle(html, cssUrlForBackground) {
  const block = `
<style type="text/css" id="allure-poc-inline-logo">
.side-nav__brand {
  background-image: ${cssUrlForBackground} !important;
  background-repeat: no-repeat !important;
  background-position: center center !important;
  background-size: contain !important;
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 8px 12px !important;
  overflow: visible !important;
}
</style>`;
  const stripped = html.replace(
    /<style[^>]*id=["']allure-poc-inline-logo["'][^>]*>[\s\S]*?<\/style>\s*/gi,
    ''
  );
  const marker = /<link[^>]*href=["']custom\.css["'][^>]*>/i;
  if (marker.test(stripped)) {
    return stripped.replace(marker, (m) => `${m}\n${block}`);
  }
  return stripped.replace(/<\/head>/i, `${block}\n</head>`);
}

function main() {
  if (!fs.existsSync(indexPath)) {
    console.error('[customize-allure-report] Falta index.html em', outputFolder);
    process.exit(1);
  }

  let html = fs.readFileSync(indexPath, 'utf8');

  html = html.replace(/<title>Allure Report<\/title>/gi, `<title>${escapeXmlTitle(reportTitle)}</title>`);

  const customStylesPath = path.join(customDir, 'styles.css');
  if (fs.existsSync(customStylesPath)) {
    fs.copyFileSync(customStylesPath, path.join(outputFolder, 'custom.css'));
    if (!html.includes('href="custom.css"') && !html.includes("href='custom.css'")) {
      const injected = '<link rel="stylesheet" type="text/css" href="custom.css">';
      const linked = html.replace(
        /(<link[^>]*href=["']styles\.css["'][^>]*>)/i,
        (_, link) => `${link}\n${injected}`
      );
      if (linked !== html) {
        html = linked;
      } else {
        html = html.replace(/<head[^>]*>/i, (m) => `${m}\n${injected}`);
      }
    }
  }

  const menuCandidates = [
    path.join(customDir, 'logo.png'),
    path.join(customDir, 'neuro-logo.svg'),
    path.join(customDir, 'icone-logo.svg'),
  ];
  const menuLogoPath = menuCandidates.find((p) => fs.existsSync(p));
  if (menuLogoPath) {
    const cssBg = imageFileToCssUrl(menuLogoPath);
    html = injectInlineLogoStyle(html, cssBg);
  }

  const tabIconSvg = path.join(customDir, 'icone-logo.svg');
  const tabIconPng = path.join(customDir, 'logo.png');
  const faviconIco = path.join(customDir, 'favicon.ico');
  if (fs.existsSync(tabIconSvg)) {
    const href = toDataUrl(tabIconSvg, 'image/svg+xml');
    html = setTabIconLink(
      html,
      `<link rel="icon" type="image/svg+xml" href="${href}">`
    );
  } else if (fs.existsSync(tabIconPng)) {
    const href = toDataUrl(tabIconPng, 'image/png');
    html = setTabIconLink(html, `<link rel="icon" type="image/png" href="${href}">`);
  } else if (fs.existsSync(faviconIco)) {
    const href = toDataUrl(faviconIco, 'image/x-icon');
    html = setTabIconLink(
      html,
      `<link rel="icon" type="image/x-icon" href="${href}">`
    );
  }

  fs.writeFileSync(indexPath, html, 'utf8');

  const summaryFile = path.join(outputFolder, 'widgets', 'summary.json');
  if (fs.existsSync(summaryFile)) {
    let raw = fs.readFileSync(summaryFile, 'utf8');
    raw = raw.replace(/Allure Report/g, reportTitle);
    fs.writeFileSync(summaryFile, raw, 'utf8');
  }
}

main();
