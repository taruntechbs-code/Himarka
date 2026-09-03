import { describe, it, expect } from 'vitest';
import { APIClientError } from './client';

describe('APIClientError', () => {
  it('instantiates with proper error code, message and status', () => {
    const error = new APIClientError('DEVICE_NOT_FOUND', 'Device was not found', 'req-123', undefined, 404);
    expect(error.code).toBe('DEVICE_NOT_FOUND');
    expect(error.message).toBe('Device was not found');
    expect(error.requestId).toBe('req-123');
    expect(error.status).toBe(404);
  });
});
