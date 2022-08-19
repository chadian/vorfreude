<script lang="ts">
  import { hasDatePast } from "../helpers/has-date-past";
  import type { CountdownDateObject } from "src/types";

  export let endDate: CountdownDateObject;
  export let countdownMessage;
  export let allDoneMessage;

  const timeUp = hasDatePast(endDate);
</script>

{#if timeUp && allDoneMessage}
  <div class="Vorfreude__all-done-message">
    {allDoneMessage}
  </div>
{:else if countdownMessage}
  <div class="Vorfreude__countdown-message">
    {countdownMessage}
  </div>
{/if}

<style>
  @keyframes show {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes hide {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @keyframes small-slide-up {
    from {
      transform: translateY(2rem);
    }

    to {
      transform: translateY(0);
    }
  }

  .Vorfreude__countdown-message,
  .Vorfreude__all-done-message {
    user-select: none;
    -webkit-user-select: none;
    color: #fff;
    text-align: center;
    text-shadow: rgba(0, 0, 0, 0.5) 0px 3px 10px, rgba(0, 0, 0, 0.25) 0px 6px 20px;
    padding-left: 2vw;
    padding-right: 2vw;

    opacity: 0;
    animation-name: show, small-slide-up;
    animation-delay: 100ms;
    animation-duration: 350ms;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(0.175, 0,4, 0.885);
  }

  .Vorfreude__countdown-message, .Vorfreude__all-done-message {
    font-size: var(--base-screen-proportional-font-size-desktop);
    margin-top: 0.1em;
  }

  @media only screen and (max-width: 425px) {
    .Vorfreude__countdown-message, .Vorfreude__all-done-message {
      font-size: var(--base-screen-proportional-font-size-mobile);
      margin-bottom: 0.75rem;
    }
  }
</style>
