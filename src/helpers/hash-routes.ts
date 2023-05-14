import { get } from 'svelte/store';
import { page } from '$app/stores';
import isExtensionEnv from './isExtensionEnv';
import { goto } from '$app/navigation';

const hashRoutes = {
  '/': 'index',
  '/settings': 'settings'
};

export function handleRouteChange() {
  const { route } = get(page);
  const hashPath = hashRoutes[route.id];
  const rootPath = isExtensionEnv() ? `/index.html` : `/`;
  window.history.replaceState({}, '', `${rootPath}#${hashPath}`);
}

export function handleInitialHashRoute() {
  const hash = window.location.hash.replace('#', '');
  const [route] = Object.entries(hashRoutes).find(([, h]) => h === hash) ?? [];
  return goto(route || '/');
}
