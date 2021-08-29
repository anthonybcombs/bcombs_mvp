import { maxBy } from 'lodash'

export const getGradeTestAttempt = (tests = [], grade_taken = 1, test_name, child_id = '') => {
  return ((maxBy(tests.filter(e => (e.grade_taken == grade_taken && e.test_name === test_name && e.child_id === child_id)), 'attempt'))?.attempt || 0) + 1
}

export const getNameFromCustomForm = (form_contents) => {
  let firstname = '--'
  let lastname = '--'
  const { formData = {} } = typeof form_contents === 'string' ? JSON.parse(form_contents) : form_contents
  const nameField = formData.find(e => e.type === 'name')
  const loginField = formData.find(e => e.type === 'login')
  if (nameField) {
    let [, fName = {}, , lName = {}] = nameField.fields || []
    firstname = fName?.value ? JSON.parse(fName.value) : '--'
    lastname = lName?.value ? JSON.parse(lName.value) : '--'
  } else if (loginField) {
    let [email = {}] = loginField.fields || []
    firstname = email?.value ? JSON.parse(email.value) : ''
    lastname = ''
  }

  return { firstname, lastname }
}