const { test, expect } = require('../../src/fixtures/api.fixture');

test.describe('Users API @api', () => {
  test('deve retornar lista de usuários com status 200 @sanity', async ({ usersApi }) => {
    const response = await usersApi.getUsers();

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('deve retornar usuário por ID com dados corretos @sanity', async ({ usersApi }) => {
    const response = await usersApi.getUserById(2);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('id', 2);
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('name');
  });

  test('deve retornar 404 para usuário inexistente @regression', async ({ usersApi }) => {
    const response = await usersApi.getUserById(9999);
    expect(response.status()).toBe(404);
  });
});
