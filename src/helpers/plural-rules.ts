export default function pluralRules(value, unit) {
  value = Number(value);

  if (unit === 'seconds') {
    if (value === 1) {
      return 'second';
    }
    return 'seconds';
  }

  if (unit === 'minutes') {
    if (value === 1) {
      return 'minute';
    }
    return 'minutes';
  }

  if (unit === 'hours') {
    if (value === 1) {
      return 'hour';
    }
    return 'hours';
  }

  if (unit === 'days') {
    if (value === 1) {
      return 'day';
    }
    return 'days';
  }
}
