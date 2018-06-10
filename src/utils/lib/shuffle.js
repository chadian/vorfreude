export default function shuffle(list) {
  let idx = -1;
  let len = list.length;
  let position;
  let result = [];
  while (++idx < len) {
    position = Math.floor((idx + 1) * Math.random());
    result[idx] = result[position];
    result[position] = list[idx];
  }
  return result;
}
