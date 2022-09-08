type ChromeExtensionWindow = typeof window & {
  chrome: Record<string, any>;
};

export default function () {
  return Boolean((globalThis as ChromeExtensionWindow)?.chrome?.windows);
}
