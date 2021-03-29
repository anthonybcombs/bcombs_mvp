import { maxBy } from 'lodash'

export const getGradeTestAttempt = (tests = [], grade_taken = 1, test_name, child_id = '') => {
  return ((maxBy(tests.filter(e => (e.grade_taken == grade_taken && e.test_name === test_name && e.child_id === child_id)), 'attempt'))?.attempt || 0) + 1
}