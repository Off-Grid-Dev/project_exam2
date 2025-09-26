// Test framework
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Module under test
import { loginUser } from '../../profiles/loginUser';

// Test helpers / mocks
import {
  createMockResponse,
  createMockErrorResponse,
  mockLoginResponse,
  mockApiError,
} from '../testUtils';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('loginUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should login user successfully', async () => {
    const payload = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Mock console.log to avoid output during tests
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    mockFetch.mockReturnValueOnce(createMockResponse(mockLoginResponse));

    const result = await loginUser(payload);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/login\?_holidaze=true/),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    expect(result).toEqual(mockLoginResponse);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Sending login payload to API:',
      payload,
    );

    consoleSpy.mockRestore();
  });

  it('should handle login errors correctly', async () => {
    const payload = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    mockFetch.mockReturnValueOnce(createMockErrorResponse(401, mockApiError));

    await expect(loginUser(payload)).rejects.toThrow(
      'Could not log you in: 401 - Test error message',
    );
  });

  it('should handle network errors', async () => {
    const payload = {
      email: 'test@example.com',
      password: 'password123',
    };

    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(loginUser(payload)).rejects.toThrow('Network error');
  });

  it('should handle API errors without error details', async () => {
    const payload = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    const errorResponse = {
      errors: [],
      status: 'error',
      statusCode: 401,
    };

    mockFetch.mockReturnValueOnce(createMockErrorResponse(401, errorResponse));

    await expect(loginUser(payload)).rejects.toThrow(
      'Could not log you in: 401 - Error',
    );
  });
});
