import { request } from 'http'

const login = async (page, username, password) => {
  await page.goto('/')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const testUser = {
  username: 'test_fanatic123',
  name: 'Mr. Test',
  password: 'hunter1',
}

const resetDbToTestUser = async (request) => {
  await request.post('/api/test/reset')
  await request.post('/api/users', {
    data: {
      username: testUser.username,
      name: testUser.name,
      password: testUser.password,
    },
  })
}

export { login, resetDbToTestUser, testUser }