export const converter = {
  encodeArray,
  decodeArray,
};

function encodeArray(indexArr = [], arr = []) {
  const tmp = [];

  for (let i of indexArr) {
    if (i >= 0) {
      tmp.push(arr[parseInt(i)].name);
    }
  }

  const raw = tmp.toString();

  const str = raw.replace(/,/g, ' · ');

  return tmp.length > 0 ? str : '';
}

function decodeArray(str = '', arr = []) {
  if (str.length < 1) return [];

  const tmp = str.split(' · ');
  const result = [];

  if (tmp.length < 1) return [];

  for (let i of tmp) {
    const index = arr.findIndex((object) => {
      // console.log(object);
      return object.name === i;
    });

    result.push(String(index));
  }

  return result;
}
