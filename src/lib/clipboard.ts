export async function copyToClipboard(text: string): Promise<boolean> {
  // Ensure we're in a browser environment
  if (
    typeof window === "undefined" ||
    typeof navigator === "undefined" ||
    typeof document === "undefined"
  ) {
    return false;
  }

  try {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for browsers that don't support navigator.clipboard
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    textarea.setAttribute("readonly", "");

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);

    return successful;
  } catch (error) {
    // Swallow errors to avoid breaking React event handlers
    console.error("Failed to copy to clipboard", error);
    return false;
  }
}
