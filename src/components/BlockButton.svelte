<script lang="ts">
  export let onClick: () => void;
</script>

<button class="Vorfreude__show-settings" on:click={() => onClick()}>
  <span class="Vorfreude__show-settings-symbol">
    <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" viewBox="-144 -144 288 288">
      <path
        d="M -101.116 100.642 C -23.457 178.661 109.538 143.354 138.275 37.09 C 151.673 -12.455 137.492 -65.381 101.116 -101.59 C 23.097 -179.249 -109.733 -143.328 -137.979 -36.932 C -151.027 12.219 -136.991 64.601 -101.116 100.642 M -68.59 -90.277 C 0.537 -143.08 100.904 -101.25 112.069 -14.982 C 115.894 14.57 107.891 44.436 89.803 68.116 L -68.59 -90.277 Z M 68.589 89.329 C -0.54 142.131 -100.905 100.298 -112.068 14.03 C -115.892 -15.52 -107.89 -45.384 -89.803 -69.064 L 68.589 89.329 Z"
        transform="matrix(-1, 0, 0, -1, 0.467163, -0.483193)"
      />
    </svg>
  </span>
</button>

<style>
  svg {
    fill: #fff;
  }

  .Vorfreude__show-settings {
    cursor: pointer;
    width: 25px;
    height: 25px;
    background: none;
    border: none;
    padding: 0;
  }

  @media only screen and (max-width: 425px) {
    .Vorfreude__show-settings {
      width: 28px;
      height: 28px;
    }
  }

  .Vorfreude__show-settings-symbol {
    position: relative;
    bottom: -2px;
  }
</style>
