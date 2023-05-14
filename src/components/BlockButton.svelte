<script lang="ts">
  export let onClick: () => void;
</script>

<button class="Vorfreude__show-settings" on:click={() => onClick()}>
  <span class="Vorfreude__show-settings-symbol">
    <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" viewBox="-144 -144 288 288">
      <path
        fill="white"
        d="M-101.116-101.116a143 143 0 1 1 202.232 202.232 143 143 0 0 1-202.232-202.232M-68.59 89.803A113 113 0 0 0 89.803-68.59zM68.589-89.803A113 113 0 0 0-89.803 68.59z"
      />
    </svg>
  </span>
</button>

<style>
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
