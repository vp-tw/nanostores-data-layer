# @vp-tw/nanostores-data-layer

A [nanostores](https://github.com/nanostores/nanostores) adapter for Google Tag Manager dataLayer. Reactively sync GTM dataLayer changes to a nanostores store.

## Installation

```bash
npm install @vp-tw/nanostores-data-layer nanostores
# or
pnpm add @vp-tw/nanostores-data-layer nanostores
# or
yarn add @vp-tw/nanostores-data-layer nanostores
```

## Usage

### Processing All Events (Including Past)

Use `subscribe()` to get the complete dataLayer immediately and on every change:

```typescript
import { $dataLayer } from "@vp-tw/nanostores-data-layer";

// Called immediately with current value, then on every change
const unsubscribe = $dataLayer.subscribe((events, oldEvents) => {
  // Get newly added events
  const newEvents = events.slice(oldEvents?.length ?? 0);

  console.log("All events:", events);
  console.log("New events:", newEvents);
});

window.dataLayer.push({ event: "page_view" });
// Console: All events: [{ event: 'page_view' }]
// Console: New events: [{ event: 'page_view' }]

window.dataLayer.push({ event: "click" });
// Console: All events: [{ event: 'page_view' }, { event: 'click' }]
// Console: New events: [{ event: 'click' }]

unsubscribe();
```

### Processing Only New Events

Use `listen()` to react only when new events are pushed:

```typescript
import { $dataLayer } from "@vp-tw/nanostores-data-layer";

// Only called on changes, not immediately
const unlisten = $dataLayer.listen((events, oldEvents) => {
  // Find newly added events
  const newEvents = events.slice(oldEvents?.length ?? 0);
  newEvents.forEach((event) => {
    console.log("New event:", event);
    // Process each new event (e.g., send to analytics)
  });
});

window.dataLayer.push({ event: "page_view" });
// Console: New event: { event: 'page_view' }

window.dataLayer.push({ event: "click" }, { event: "scroll" });
// Console: New event: { event: 'click' }
// Console: New event: { event: 'scroll' }

unlisten();
```

### Getting Current Value

```typescript
import { $dataLayer } from "@vp-tw/nanostores-data-layer";

console.log($dataLayer.get()); // Current dataLayer contents
```

### With React

```tsx
import { useStore } from "@nanostores/react";
import { $dataLayer } from "@vp-tw/nanostores-data-layer";

function Analytics() {
  const dataLayer = useStore($dataLayer);

  return <pre>{JSON.stringify(dataLayer, null, 2)}</pre>;
}
```

### With Vue

```vue
<script setup>
import { useStore } from "@nanostores/vue";
import { $dataLayer } from "@vp-tw/nanostores-data-layer";

const dataLayer = useStore($dataLayer);
</script>

<template>
  <pre>{{ dataLayer }}</pre>
</template>
```

## How It Works

The library:

1. Initializes `window.dataLayer` if not present
2. Wraps the native `push` method to intercept all additions
3. Syncs changes to a readonly nanostores atom

The store is readonly (`ReadableAtom`) - you should push to `window.dataLayer` directly, and the store will automatically update.

## SSR Support

The library safely handles server-side rendering. When `window` is undefined, the store returns an empty array and no errors are thrown.

## TypeScript

Full TypeScript support is included. The `DataLayer` type is `Array<unknown>` by design, since GTM dataLayer can contain arbitrary data from various sources (GTM tags, third-party scripts, etc.).

```typescript
import type { DataLayer } from "@vp-tw/nanostores-data-layer";
```

### Type Safety with Runtime Validation

Since dataLayer contents are inherently dynamic, we recommend using runtime validation libraries like [Zod](https://zod.dev/) or [ArkType](https://arktype.io/) for type-safe event handling:

```typescript
import type { DataLayer } from "@vp-tw/nanostores-data-layer";
import { $dataLayer } from "@vp-tw/nanostores-data-layer";
import { z } from "zod";

// Define your event schemas
const PageViewEvent = z.object({
  event: z.literal("page_view"),
  page_path: z.string(),
});

const PurchaseEvent = z.object({
  event: z.literal("purchase"),
  transaction_id: z.string(),
  value: z.number(),
});

const MyEvent = z.discriminatedUnion("event", [PageViewEvent, PurchaseEvent]);
type MyEvent = z.infer<typeof MyEvent>;

// Type-safe event processing
$dataLayer.subscribe((events, oldEvents) => {
  const newEvents = events.slice(oldEvents?.length ?? 0);

  for (const item of newEvents) {
    const result = MyEvent.safeParse(item);
    if (result.success) {
      // result.data is fully typed as MyEvent
      switch (result.data.event) {
        case "page_view":
          console.log("Page view:", result.data.page_path);
          break;
        case "purchase":
          console.log("Purchase:", result.data.transaction_id, result.data.value);
          break;
      }
    }
  }
});
```

### Generic Type Parameter

For simpler cases where you control all dataLayer inputs, you can use the generic type parameter for type assertions:

```typescript
import type { DataLayer } from "@vp-tw/nanostores-data-layer";

interface MyEvent {
  event: string;
  [key: string]: unknown;
}

// Type assertion (use with caution - no runtime validation)
const events = $dataLayer.get() as DataLayer<MyEvent>;
```

## License

[MIT](https://github.com/vp-tw/nanostores-data-layer/blob/main/LICENSE)

Copyright (c) 2026 ViPro <vdustr@gmail.com> (<https://vdustr.dev>)
