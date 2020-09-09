

export const sort = (array, field) => {
  return array.sort((a, b) => (a[field] > b[field]) ? 1 : -1);
}

export const distinct = (array) => {

}