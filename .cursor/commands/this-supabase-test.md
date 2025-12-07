# /this-supabase-test

Generates tests for currently open Supabase file with appropriate mocks.

## Usage

```
/this-supabase-test
```

Extends `/this-test` with Supabase-specific mocking patterns.

## Mocking Patterns

**Supabase Client**:
```typescript
import { supabase } from '@/features/supabase/client'

jest.mock('@/features/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInWithOtp: jest.fn(),
      verifyOtp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    })),
  },
}))
```

**AsyncStorage**:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))
```

**expo-network**:
```typescript
import * as Network from 'expo-network'

jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(),
  addNetworkStateListener: jest.fn(() => ({ remove: jest.fn() })),
}))
```

## References

See `.cursor/rules/supabase.mdc` and `.cursor/rules/testing.mdc` for patterns

