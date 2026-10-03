// Gera public/og.png (1200×630) a partir de scripts/og-image.html e o
// public/apple-touch-icon.png a partir de scripts/apple-touch-icon.html, usando
// o Chrome ou Edge instalado em modo headless — sem dependências extras.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const template = pathToFileURL(resolve(root, 'scripts/og-image.html')).href
const output = resolve(root, 'public/og.png')

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

const browser = candidates.find((path) => existsSync(path))
if (!browser) {
  console.error('Chrome/Edge não encontrado. Defina CHROME_PATH.')
  process.exit(1)
}

function screenshot(url, width, height, file) {
  execFileSync(browser, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--allow-file-access-from-files',
    '--virtual-time-budget=2000',
    '--default-background-color=00000000',
    `--window-size=${width},${height}`,
    `--screenshot=${file}`,
    url,
  ])
  console.log(`✓ ${file}`)
}

screenshot(template, 1200, 630, output)

// Ícone para "Adicionar à tela inicial" no iOS (exige PNG).
const appleIcon = pathToFileURL(resolve(root, 'scripts/apple-touch-icon.html')).href
screenshot(appleIcon, 180, 180, resolve(root, 'public/apple-touch-icon.png'))
