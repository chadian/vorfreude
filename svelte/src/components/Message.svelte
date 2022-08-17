<script>
  export let timeUp = '';
  export let message = '';
</script>

{{#if (is-time-up store.settings.date)}}
<div class="Vorfreude__all-done-message">
 {{store.settings.allDoneMessage}}
</div>
{{else}}
{{#if store.settings.countdownMessage}}
  <div class="Vorfreude__countdown-message">
    {{store.settings.countdownMessage}}
  </div>
{{/if}}
