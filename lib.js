// Pure helpers for the OCR page. No DOM access, so they can be unit tested.

export const MAX_FILE_BYTES = 20 * 1024 * 1024;

export const LANGUAGES = [
  { code: 'eng', label: 'English' },
  { code: 'deu', label: 'German' },
  { code: 'fra', label: 'French' },
  { code: 'spa', label: 'Spanish' },
  { code: 'ita', label: 'Italian' },
  { code: 'por', label: 'Portuguese' },
  { code: 'hin', label: 'Hindi' },
  { code: 'ara', label: 'Arabic' },
];

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Check that a File looks like an image we can hand to Tesseract.
 * @returns {{ok: true} | {ok: false, error: string}}
 */
export function validateImageFile(file, maxBytes = MAX_FILE_BYTES) {
  if (!file) return { ok: false, error: 'No file selected.' };
  if (!file.type || !file.type.startsWith('image/')) {
    return { ok: false, error: `"${file.name}" is not an image file.` };
  }
  if (file.size === 0) return { ok: false, error: `"${file.name}" is empty.` };
  if (file.size > maxBytes) {
    return {
      ok: false,
      error: `"${file.name}" is ${formatBytes(file.size)}; the limit is ${formatBytes(maxBytes)}.`,
    };
  }
  return { ok: true };
}

/** Pick the first image from a FileList/array (e.g. several files dropped at once). */
export function pickImageFile(files) {
  const list = Array.from(files ?? []);
  return list.find((f) => f.type && f.type.startsWith('image/')) ?? list[0] ?? null;
}

/**
 * Convert a Tesseract logger message into a progress percentage and label.
 * `percent` is null when the message carries no meaningful progress.
 */
export function describeProgress(message) {
  const status = message?.status ?? '';
  if (status === 'recognizing text') {
    const percent = Math.min(100, Math.max(0, Math.round((message.progress ?? 0) * 100)));
    return { percent, text: `Recognizing text: ${percent}%` };
  }
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Working';
  return { percent: null, text: label };
}

export function formatConfidence(confidence) {
  return `${Math.round(confidence)}%`;
}
