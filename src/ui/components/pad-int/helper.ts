export default function padInt([number, digits]: [any, Number]): String {
  let numberString = Number(number).toString();
  let fillAmount = digits - numberString.length;
  let pad = ( fillAmount > 0 ? Array(fillAmount).fill('0') : [] ).join('');

  return pad + numberString;
}
