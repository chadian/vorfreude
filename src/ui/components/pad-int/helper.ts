export default function padInt([num, digits]: [any, number]): string {
  let numberString = Number(num).toString();
  let fillAmount = digits - numberString.length;
  let pad = ( fillAmount > 0 ? Array(fillAmount).fill('0') : [] ).join('');

  return pad + numberString;
}
