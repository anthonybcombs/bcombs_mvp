

export const sort = (array, field) => {
  return array.sort((a, b) => (a[field] > b[field]) ? 1 : -1);
}

export const sortByDate = (array) => {
  array.sort((a, b) => new Data(b.created_at) - new Date(a.created_at))
}

export const distinct = (array) => {

}

export const  removeDuplicatesByKey = (arr, key) => {
  const uniqueItems = new Map();

  arr.forEach(item => {
    if (!uniqueItems.has(item[key])) {
      uniqueItems.set(item[key], item);
    }
  });

  return Array.from(uniqueItems.values());
}