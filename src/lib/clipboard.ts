export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export async function readFromClipboard(): Promise<string | null> {
  if (!navigator.clipboard || !window.isSecureContext) {
    return null;
  }

  try {
    return await navigator.clipboard.readText();
  } catch {
    return null;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return fallbackCopy(text);
    }
  }
  return fallbackCopy(text);
}

function fallbackCopy(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch {
    success = false;
  }
  document.body.removeChild(textarea);
  return success;
}
