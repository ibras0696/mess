import { test, expect } from '@playwright/test'

const randomUser = () => {
  const ts = Date.now()
  return {
    email: `user${ts}@example.com`,
    username: `user${ts}`,
    password: 'Passw0rd!',
  }
}

test('register -> create chat -> send message', async ({ page }) => {
  const user = randomUser()

  // Очистить токены, чтобы не мешала старая сессия
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.removeItem('wm.access')
    localStorage.removeItem('wm.refresh')
  })

  // Регистрация
  await page.goto('/register')
  await page.getByPlaceholder('Username').fill(user.username)
  await page.getByPlaceholder('Email').fill(user.email)
  await page.getByPlaceholder('Пароль').fill(user.password)
  await page.getByRole('button', { name: 'Создать аккаунт' }).click()

  // Переходим на чаты (redirect после регистрации)
  await page.waitForURL('**/chats', { timeout: 10_000 })

  // Создать чат
  await page.getByPlaceholder('Название').fill('Playwright Chat')
  await page.getByPlaceholder('ID участников через запятую (например: 1,2,3)').fill('')
  await page.getByRole('button', { name: 'Создать' }).click()

  // Открыть первый чат в списке
  const firstChat = page.locator('button', { hasText: 'Playwright Chat' }).first()
  await expect(firstChat).toBeVisible({ timeout: 10_000 })
  await firstChat.click()

  // Отправить сообщение
  await page.getByPlaceholder('Текст сообщения').fill('hello from e2e')
  await page.getByRole('button', { name: 'Отправить' }).click()

  // Проверить, что сообщение появилось
  await expect(page.getByText('hello from e2e')).toBeVisible({ timeout: 10_000 })
})
