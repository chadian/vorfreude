type ChromeExtensionWindow = typeof window & {
  runtime: {
    id: string;
  }
};

export default function() {
  return Boolean((globalThis as ChromeExtensionWindow)?.runtime?.id);
}
