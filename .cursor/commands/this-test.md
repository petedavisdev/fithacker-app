# /this-test

Generates tests for currently open file.

## Usage

```
/this-test
```

## What it does

- Detects if component or function
- Creates appropriate test structure
- Mocks required dependencies
- Follows test patterns

## References

See `.cursor/rules/testing.mdc` for:

- Jest configuration (jest-expo preset)
- Mock patterns (react-i18next, expo-router)
- Test file naming conventions
- Snapshot test patterns
- Date test patterns (jest.useFakeTimers)

## For Components

Creates snapshot test with mocks:

```typescript
import * as React from "react";
import renderer from "react-test-renderer";
import { MyComponent } from "./MyComponent";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (str: string) => str }),
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({}),
  Link: "Link",
}));

it("renders correctly", () => {
  const tree = renderer.create(<MyComponent />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

## For Pure Functions

Creates unit tests:

```typescript
import { myFunction } from "./myFunction";

describe("myFunction", () => {
  it("should return expected value", () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });

  it("should handle edge cases", () => {
    expect(myFunction(null)).toBe(undefined);
  });
});
```

## For Date Functions

Adds fake timers:

```typescript
jest.useFakeTimers({ now: new Date("2024-02-26T00:00:00") });
```
