const login = async (page, username, password) => {
  await page.goto('/')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const testUser1 = {
  username: 'test_fanatic123',
  name: 'Mr. Test',
  password: 'hunter1',
}

const testUser2 = {
  username: 'i_hate_tests',
  name: 'Mr. Hater',
  password: 'hunter2',
}

const resetDbToTestUsers = async (request) => {
  await request.post('/api/test/reset')
  await request.post('/api/users', {
    data: {
      username: testUser1.username,
      name: testUser1.name,
      password: testUser1.password,
    },
  })
  await request.post('/api/users', {
    data: {
      username: testUser2.username,
      name: testUser2.name,
      password: testUser2.password,
    },
  })
}

const createOneBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'add blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

export { login, resetDbToTestUsers, testUser1, testUser2, createOneBlog }
