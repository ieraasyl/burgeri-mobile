# Burgeri Write-Off

Mobile app for Burgeri staff to submit product write-off requests. Employees photograph items, fill in product details, and track request status.

## Stack

- [Expo SDK 56](https://docs.expo.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/)
- React Native 0.85, TypeScript
- [Better Auth](https://www.better-auth.com/) (`@better-auth/expo`) for username/password login
- [TanStack Query](https://tanstack.com/query) for server state
- `expo-camera` for photo capture

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/)
- [Expo Go](https://expo.dev/go) or a dev client on a physical device / simulator

## Setup

```bash
pnpm install
cp .env.example .env
```

Set `EXPO_PUBLIC_API_URL` in `.env` to your Burgeri API base URL.

## Run

```bash
pnpm start        # Expo dev server
pnpm ios          # iOS simulator
pnpm android      # Android emulator
pnpm typecheck    # TypeScript check
```

## App flow

1. **Login** — employee ID and password
2. **History** — list of past write-off requests
3. **New request** — camera → product → quantity → details → optional employee deduction → review → submit

## Project layout

```
app/           # Expo Router screens (login, history, request wizard, camera)
components/    # Shared UI
providers/     # Auth and draft state
lib/           # API client, auth, storage, validation
data/          # API functions
types/         # Domain types
```
