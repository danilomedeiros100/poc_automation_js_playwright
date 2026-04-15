#!/usr/bin/env node
/**
 * Pós-processamento do HTML do Allure (multiplataforma): título, custom.css,
 * logo em plugin/custom-logo, favicon e widgets/summary.json.
 *
 * ALLURE_REPORT_DIR — pasta do relatório gerado (default: reports/allure-report)
 * ALLURE_CUSTOM_DIR — pasta com styles.css, neuro-logo.svg, favicon.ico (default: allure-custom)
 * ALLURE_REPORT_TITLE — título da aba e do sumário (default: Relatório QA)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outputFolder = process.env.ALLURE_REPORT_DIR || path.join(root, 'reports', 'allure-report');
const customDir = process.env.ALLURE_CUSTOM_DIR || path.join(root, 'allure-custom');
const reportTitle = process.env.ALLURE_REPORT_TITLE || 'Relatório QA';

const indexPath = path.join(outputFolder, 'index.html');

function escapeXmlTitle(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

  const logoSource = path.join(customDir, 'neuro-logo.svg');
  if (fs.existsSync(logoSource)) {
    const logoTargetDir = path.join(outputFolder, 'plugin', 'custom-logo');
    fs.mkdirSync(logoTargetDir, { recursive: true });
    fs.copyFileSync(logoSource, path.join(logoTargetDir, 'neuro-logo.svg'));
  }

  const faviconSource = path.join(customDir, 'favicon.ico');
  if (fs.existsSync(faviconSource)) {
    fs.copyFileSync(faviconSource, path.join(outputFolder, 'favicon.ico'));
    if (/<link[^>]*rel=["']icon["'][^>]*>/i.test(html)) {
      html = html.replace(
        /<link[^>]*rel=["']icon["'][^>]*>/gi,
        '<link rel="icon" type="image/x-icon" href="favicon.ico">'
      );
    } else {
      html = html.replace(/<head[^>]*>/i, (m) => `${m}\n    <link rel="icon" type="image/x-icon" href="favicon.ico">`);
    }
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
