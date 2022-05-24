<script>
  export let time;
  import plural from '../helpers/plural-rules';
</script>

<div class="CountdownTimer">
  {#if time}
    {#if time.days}
      <div class="CountdownTimer__segment">
        {time.days} {plural(time.days, 'days')}
      </div>
    {/if}
  
    {#if time.hours}
      <div class="CountdownTimer__segment">
        {time.hours} {plural(time.hours, 'hours')}
      </div>
    {/if}

    {#if time.minutes}
      <div class="CountdownTimer__segment">
        {time.minutes} {plural(time.minutes, 'minutes')}
      </div>
    {/if}

    {#if time.seconds}
      <div class="CountdownTimer__segment">
          {time.seconds} {plural(time.seconds, 'seconds')}
      </div>
    {/if}
  {/if}
</div>
