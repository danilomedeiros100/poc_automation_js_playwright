const { test, expect } = require('../../src/fixtures/api.fixture');
const { payloads } = require('../../src/utils/data');

test.describe('Posts API @api', () => {
  test('deve retornar lista de posts com status 200 @sanity', async ({ postsApi }) => {
    const response = await postsApi.getPosts();

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('deve retornar post por ID com dados corretos @sanity', async ({ postsApi }) => {
    const response = await postsApi.getPostById(1);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('body');
    expect(body).toHaveProperty('userId');
  });

  test('deve criar post e retornar status 201 @critical', async ({ postsApi }) => {
    const response = await postsApi.createPost(payloads.post.valid);

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('title', payloads.post.valid.title);
  });

  test('deve retornar comentários de um post com emails válidos @regression', async ({ postsApi }) => {
    const response = await postsApi.getCommentsByPost(1);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    body.forEach(comment => {
      expect(comment).toHaveProperty('postId', 1);
      expect(comment.email).toMatch(/@/);
    });
  });

  test('deve retornar 404 para post inexistente @regression', async ({ postsApi }) => {
    const response = await postsApi.getPostById(99999);
    expect(response.status()).toBe(404);
  });
});
