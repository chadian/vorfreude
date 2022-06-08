type ChromeExtensionWindow = typeof window & {
  runtime: {
    id: string;
  }
};

export default function() {
  return Boolean((window as ChromeExtensionWindow)?.runtime?.id);
}
