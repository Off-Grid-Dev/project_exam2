import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { registerUser } from '../../profiles/registerUser';
import {
  createMockResponse,
  createMockErrorResponse,
  mockLoginResponse,
  mockApiError,
} from '../testUtils';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should register user successfully', async () => {
    const payload = {
      name: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      bio: 'Test user bio',
      avatar: {
        url: 'https://example.com/avatar.jpg',
        alt: 'Avatar',
      },
      banner: {
        url: 'https://example.com/banner.jpg',
        alt: 'Banner',
      },
      venueManager: false,
    };

    mockFetch.mockReturnValueOnce(createMockResponse(mockLoginResponse));

    const result = await registerUser(payload);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/register/),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    expect(result).toEqual(mockLoginResponse);
  });

  it('should handle registration errors correctly', async () => {
    const payload = {
      name: 'testuser',
      email: 'invalid-email',
      password: '123',
      bio: '',
      avatar: {
        url: '',
        alt: '',
      },
      banner: {
        url: '',
        alt: '',
      },
      venueManager: false,
    };

    mockFetch.mockReturnValueOnce(createMockErrorResponse(400, mockApiError));

    await expect(registerUser(payload)).rejects.toThrow(
      'Could not create newUser: 400 - Test error message',
    );
  });

  it('should handle network errors', async () => {
    const payload = {
      name: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      bio: '',
      avatar: {
        url: '',
        alt: '',
      },
      banner: {
        url: '',
        alt: '',
      },
      venueManager: false,
    };

    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(registerUser(payload)).rejects.toThrow('Network error');
  });
});
