import {
  LANGUAGES,
  describeProgress,
  formatConfidence,
  pickImageFile,
  validateImageFile,
} from './lib.js';

const $ = (id) => document.getElementById(id);
const dropZone = $('dropZone');
const dropPrompt = $('dropPrompt');
const fileInput = $('fileInput');
const langSelect = $('langSelect');
const imagePreview = $('imagePreview');
const statusCard = $('statusCard');
const progressTrack = $('progressTrack');
const progressBar = $('progressBar');
const statusText = $('statusText');
const errorText = $('errorText');
const resultCard = $('resultCard');
const outputArea = $('outputArea');
const copyBtn = $('copyBtn');

const COPY_LABEL = 'Copy text';

let worker = null;
let workerLang = null;
let busy = false;
let previewUrl = null;
let activeProgress = () => {};

for (const { code, label } of LANGUAGES) {
  langSelect.append(new Option(label, code));
}

function setProgress(percent) {
  progressBar.style.width = `${percent}%`;
  progressTrack.setAttribute('aria-valuenow', String(percent));
}

function showError(message) {
  errorText.textContent = message;
  errorText.hidden = false;
}

function setBusy(value) {
  busy = value;
  langSelect.disabled = value;
  dropZone.setAttribute('aria-busy', String(value));
  dropZone.classList.toggle('disabled', value);
}

function showPreview(file) {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  imagePreview.src = previewUrl;
  imagePreview.hidden = false;
  dropPrompt.hidden = true;
}

async function getWorker(lang) {
  if (worker && workerLang === lang) return worker;
  if (worker) {
    const old = worker;
    worker = null;
    await old.terminate();
  }
  worker = await Tesseract.createWorker(lang, 1, {
    logger: (m) => activeProgress(m),
  });
  workerLang = lang;
  return worker;
}

async function discardWorker() {
  const old = worker;
  worker = null;
  workerLang = null;
  try {
    await old?.terminate();
  } catch {
    // The worker is already unusable; nothing more to clean up.
  }
}

async function processImage(file) {
  if (busy) return;

  errorText.hidden = true;
  const check = validateImageFile(file);
  if (!check.ok) {
    showError(check.error);
    return;
  }
  if (typeof Tesseract === 'undefined') {
    showError('The OCR engine failed to load. Check your connection and reload the page.');
    return;
  }

  setBusy(true);
  showPreview(file);
  statusCard.hidden = false;
  resultCard.hidden = true;
  progressBar.classList.remove('failed');
  setProgress(0);
  statusText.textContent = 'Loading Tesseract OCR engine...';

  activeProgress = (m) => {
    const { percent, text } = describeProgress(m);
    if (percent !== null) setProgress(percent);
    statusText.textContent = text;
  };

  try {
    const ocr = await getWorker(langSelect.value);
    const { data } = await ocr.recognize(file);
    outputArea.value = data.text.trim();
    resultCard.hidden = false;
    setProgress(100);
    statusText.textContent = data.text.trim()
      ? `Completed (confidence: ${formatConfidence(data.confidence)})`
      : 'Completed, but no text was found in this image.';
  } catch (err) {
    progressBar.classList.add('failed');
    statusText.textContent = 'Recognition failed.';
    showError(`Error: ${err?.message ?? err}`);
    await discardWorker();
  } finally {
    setBusy(false);
    fileInput.value = '';
  }
}

async function copyText() {
  try {
    await navigator.clipboard.writeText(outputArea.value);
  } catch {
    // Clipboard API unavailable (insecure context or denied); fall back to selection copy.
    outputArea.select();
    if (!document.execCommand('copy')) {
      showError('Could not copy automatically. Select the text and copy it manually.');
      return;
    }
  }
  copyBtn.textContent = 'Copied!';
  setTimeout(() => (copyBtn.textContent = COPY_LABEL), 2000);
}

dropZone.addEventListener('click', () => {
  if (!busy) fileInput.click();
});

dropZone.addEventListener('keydown', (e) => {
  if (e.target === dropZone && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    if (!busy) fileInput.click();
  }
});

fileInput.addEventListener('change', (e) => {
  const file = pickImageFile(e.target.files);
  if (file) processImage(file);
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

for (const type of ['dragleave', 'drop']) {
  dropZone.addEventListener(type, () => dropZone.classList.remove('dragover'));
}

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = pickImageFile(e.dataTransfer.files);
  if (file) processImage(file);
});

document.addEventListener('paste', (e) => {
  const file = pickImageFile(e.clipboardData?.files);
  if (file) processImage(file);
});

copyBtn.addEventListener('click', copyText);

window.addEventListener('pagehide', () => worker?.terminate());
