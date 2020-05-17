export function groupBy(arr, n) {
  var group = [];
  for (var i = 0, end = arr.length / n; i < end; ++i)
    group.push(arr.slice(i * n, (i + 1) * n));
  return group;
}
