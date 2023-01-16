import { describe, expect, it } from '@jest/globals';
import { server } from '../src';
import supertest from 'supertest';

const apiUrl = "/api/users";

describe('REST API', () => {
  describe('get /api/users should return all users', () => {
    it('should return empty array', () => {
      expect.assertions(2);
      const response = supertest(server).get(apiUrl);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    })
  })
})
