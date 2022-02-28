<script>
  export let time;
  import plural from '../helpers/plural-rules';
</script>

<div class="CountdownTimer">
  {#if time}
    <div class="CountdownTimer__segment">
      {time.days} {plural(time.days, 'days')}
    </div>
  
    <div class="CountdownTimer__segment">
      {time.hours} {plural(time.hours, 'hours')}
    </div>

    <div class="CountdownTimer__segment">
      {time.minutes} {plural(time.minutes, 'minutes')}
    </div>

    <div class="CountdownTimer__segment">
        {time.seconds} {plural(time.seconds, 'seconds')}
    </div>
  {/if}
</div>
