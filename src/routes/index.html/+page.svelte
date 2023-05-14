<script lang="ts">
  /*
    This page serves as an ugly hack for when "index.html" loads
    and it tries to load the corresponding route, that ends up
    being this, and redirecting back to the root kicks off
    the whole initial flow right. Without this file, the router
    can't find this route, throws an error, but still ends up
    at the default route.
  */

  import { goto } from '$app/navigation';
  goto('/');
</script>
