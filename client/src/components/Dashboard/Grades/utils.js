import cloneDeep from 'lodash.clonedeep'

export const getGpaCum = (data) => {
  return data.reduce((acc, curr) => acc + curr, 0) / data.length
}