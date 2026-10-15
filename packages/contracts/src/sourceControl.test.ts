import { describe, expect, it } from "vite-plus/test";
import * as Schema from "effect/Schema";

import { SourceControlProviderError, SourceControlProviderKind } from "./sourceControl.ts";

const encodeProviderError = Schema.encodeSync(SourceControlProviderError);
const decodeProviderError = Schema.decodeUnknownSync(SourceControlProviderError);

describe("SourceControlProviderError", () => {
  it.each([
    {
      provider: "unknown",
      message: "Source control operation getChangeRequest failed: Provider unavailable.",
    },
    {
      provider: "github",
      message: "Source control provider github failed in getChangeRequest: Provider unavailable.",
    },
  ])("preserves the $provider error message across transport", ({ provider, message }) => {
    const error = new SourceControlProviderError({
      provider: SourceControlProviderKind.make(provider),
      operation: "getChangeRequest",
      cwd: "/repo",
      reference: "#42",
      detail: "Provider unavailable.",
    });
    const decoded = decodeProviderError(encodeProviderError(error));

    expect(error.message).toBe(message);
    expect(decoded.message).toBe(message);
    expect(decoded.provider).toBe(provider);
    expect(decoded.operation).toBe("getChangeRequest");
    expect(decoded.cwd).toBe("/repo");
    expect(decoded.reference).toBe("#42");
  });
});
