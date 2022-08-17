<script>
  export let type;
</script>

<button type={type ?? 'button'} on:click>
  <slot />
</button>

<style>
  button {
    border: 1px solid #fff;
    font-size: 0.9rem;
    color: #fff;
    background-color: transparent;
    border-radius: 2rem;
    cursor: pointer;
    padding: 0rem 1rem;
    text-decoration: none;
    padding: 0.4rem 0.75rem;
  }

  button:hover {
    transform: scale(1.1);
    transform-origin: center;
  }

  button:active {
    transform: scale(1.05);
  }
</style>
