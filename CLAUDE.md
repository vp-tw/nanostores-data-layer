# nanostores-data-layer

## Project Structure

- `packages/nanostores-data-layer/` - Main library package

## Development

- `pnpm install` - Install dependencies
- `pnpm test` - Run tests (browser + node)
- `pnpm checkTypes` - Type check
- `pnpm lint` - Lint
- `pnpm build` - Build

## Code Style

- Use `Array<T>` not `T[]`
- Avoid `!` non-null assertions
- Early return pattern

## Release

Uses changesets for versioning. Create changeset with `pnpm changeset`.
