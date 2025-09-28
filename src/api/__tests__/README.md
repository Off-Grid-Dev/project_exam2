# API Tests

This directory contains comprehensive tests for all API functions in the
Holidaze application.

## Test Structure

- **`/bookings/`** - Tests for booking-related API functions
- **`/venues/`** - Tests for venue-related API functions
- **`/profiles/`** - Tests for profile-related API functions
- **`testUtils.ts`** - Shared test utilities, mock data, and helpers

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- bookings/createBooking.test.ts

# Run all API tests
npm test -- src/api/__tests__
```

## Test Coverage

The tests cover:

### Bookings API

- ✅ `createBooking` - Creating new bookings
- ✅ `getAllBookings` - Fetching all bookings with query parameters
- ✅ `getBookingByID` - Fetching single booking
- ✅ `deleteBooking` - Deleting bookings
- ⏳ `updateBooking` - Updating bookings
- ⏳ `getBookingsByProfile` - Fetching bookings by profile

### Venues API

- ✅ `getVenues` - Fetching all venues with pagination and filters
- ✅ `getVenueByID` - Fetching single venue
- ✅ `createVenue` - Creating new venues
- ⏳ `updateVenue` - Updating venues
- ⏳ `deleteVenue` - Deleting venues
- ⏳ `getVenueBySearch` - Searching venues

### Profiles API

- ✅ `loginUser` - User authentication
- ⏳ `registerUser` - User registration
- ⏳ `getAllProfiles` - Fetching all profiles
- ⏳ `getProfileByName` - Fetching single profile
- ⏳ `updateProfile` - Updating profiles

## Test Scenarios

Each API function is tested for:

- ✅ **Success cases** - Valid requests with expected responses
- ✅ **Error handling** - API errors, network failures
- ✅ **Authentication** - Token handling, missing tokens
- ✅ **Parameter validation** - Query parameters, request payloads
- ✅ **Response structure** - Correct typing and data format

## Mock Data

All tests use consistent mock data defined in `testUtils.ts`:

- Mock API responses matching the Noroff API structure
- Mock error responses for testing error handling
- Mock authentication tokens
- Helper functions for creating mock fetch responses

## Adding New Tests

1. Create a new test file in the appropriate directory
2. Import test utilities from `../testUtils`
3. Mock fetch using `vi.stubGlobal('fetch', mockFetch)`
4. Test success cases, error cases, and edge cases
5. Ensure proper cleanup with `beforeEach` and `afterEach`

Example test structure:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { yourApiFunction } from '../../path/to/function';
import { createMockResponse, mockAccessToken } from '../testUtils';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('yourApiFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should handle success case', async () => {
    // Test implementation
  });

  it('should handle error case', async () => {
    // Test implementation
  });
});
```
