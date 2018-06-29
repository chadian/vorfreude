export default function() {
  return Boolean(window.chrome && chrome.runtime && chrome.runtime.id);
}
