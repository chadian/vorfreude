export function padInt(num: number | string, digits) {
  const numberString = Number(num).toString();
  const fillAmount = digits - numberString.length;
  const pad = fillAmount > 0 ? Array(fillAmount).fill('0').join('') : '';
  return pad + numberString;
}
