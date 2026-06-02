# Data Mutations

## Overview

Two mutation surfaces exist:

| Surface | Mechanism | File |
|---|---|---|
| Community enquiry form | Server Action + Resend | `app/actions/join.ts` |
| Council enquiry form | Server Action + Resend | `app/actions/councils.ts` |
| Device speed ingest | API Route (`POST /api/ingest`) | `app/api/ingest/route.ts` |

Forms use React 19 Server Actions with `useActionState`. The device ingest uses a plain API route because devices are not browsers.

---

## Server Action Pattern

### 1. Define the state union type

Every action has a discriminated union for its possible states:

```ts
// app/actions/join.ts
'use server'

export type JoinFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }
  | { status: 'validation'; errors: Partial<Record<string, string>> }
```

Always export the state type — the client component imports it.

### 2. Write a `validate` function

Return `null` if valid, or a `Partial<Record<string, string>>` of field errors:

```ts
function validate(data: Record<string, string>): Partial<Record<string, string>> | null {
  const errors: Partial<Record<string, string>> = {}

  if (!data.name?.trim() || data.name.trim().length < 2)
    errors.name = 'Please enter your full name.'
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Please enter a valid email address.'
  // ... more fields

  return Object.keys(errors).length ? errors : null
}
```

Validate every user-supplied field at the server boundary — never trust client-side validation alone.

### 3. Write the action

The signature is always `(prevState: State, formData: FormData) => Promise<State>`:

```ts
export async function submitJoinEnquiry(
  _prev: JoinFormState,
  formData: FormData,
): Promise<JoinFormState> {
  // 1. Honeypot check (bot detection)
  if (formData.get('_gotcha')) return { status: 'idle' }

  // 2. Extract and normalise fields
  const data = {
    name:  String(formData.get('name')  ?? ''),
    email: String(formData.get('email') ?? ''),
    // ...
  }

  // 3. Validate
  const errors = validate(data)
  if (errors) return { status: 'validation', errors }

  // 4. Side effect (email, DB write, etc.)
  try {
    await resend.emails.send({ ... })
    return { status: 'success' }
  } catch (err) {
    console.error('Resend error:', err)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}
```

### 4. Wire up the client component

```ts
'use client'

import { useActionState } from 'react'
import { submitJoinEnquiry, type JoinFormState } from '@/app/actions/join'

const initial: JoinFormState = { status: 'idle' }

export default function JoinForm() {
  const [state, action, pending] = useActionState(submitJoinEnquiry, initial)

  if (state.status === 'success') return <SuccessMessage />

  const errors = state.status === 'validation' ? state.errors : {}

  return (
    <form action={action} noValidate>
      {/* Honeypot — hidden, never autofilled */}
      <input name="_gotcha" type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      {/* ... fields ... */}
      <button type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Send Enquiry'}
      </button>
    </form>
  )
}
```

**Rules:**
- Always add `noValidate` to the `<form>` — server-side validation owns this; browser validation duplicates and confuses.
- Disable the submit button while `pending` to prevent double-submission.
- Always include the `_gotcha` honeypot input. The action checks `formData.get('_gotcha')` and returns `{ status: 'idle' }` if it has a value.
- Pass error state down to individual `<Field>` wrappers, not shown inline next to the button.

---

## Email via Resend

Resend is used for all outbound email. The API key is `RESEND_API_KEY` in environment variables.

```ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
```

### Address rules

| From address | When to use |
|---|---|
| `admin@stredar.uk` | All outbound — the canonical reply-to address |
| `join@stredar.uk` | `to:` address for community enquiries |
| `councils@stredar.uk` | `to:` address for council enquiries |

Never use `noreply@` — all replies should reach a human.

### Two-email pattern

Every form submission sends two emails:
1. **Notification** → internal address (`join@stredar.uk` or `councils@stredar.uk`) with full form data, `replyTo` set to the enquirer's address so staff can reply directly.
2. **Confirmation** → enquirer with a summary and next-steps, `replyTo: 'admin@stredar.uk'`.

Send them sequentially (not `Promise.all`) so that a Resend failure on the second doesn't silently swallow the first.

---

## Device Ingest API (`POST /api/ingest`)

API routes are used instead of Server Actions for device ingest because devices communicate over HTTP, not via browser form submissions.

### Expected payload

```json
{
  "site_id": "<uuid>",
  "speed_mph": 34,
  "direction": 1,
  "recorded_at": "2026-06-02T10:30:00Z"
}
```

| Field | Type | Validation |
|---|---|---|
| `site_id` | string (UUID) | Required; references `sites.id` |
| `speed_mph` | number | Required; 0–200 |
| `direction` | `1 \| -1` | Optional; anything else becomes `null` |
| `recorded_at` | string (ISO 8601) | Required; device-local timestamp |

### Auth

`x-api-key` header must match `INGEST_SECRET` env var. Returns `401` otherwise.

### Response

`{ ok: true }` on success. No payload echoed back.

---

## Adding a New Mutation

1. Create `app/actions/<name>.ts` — `'use server'` directive, state union type, validate function, action function.
2. Create the client form component in the same directory as the page that uses it.
3. Wire with `useActionState` — never call the action directly from an event handler.
4. If the mutation writes to the database, use `sql` from `@/lib/db` with tagged template literals.
5. If confirmation email is needed, follow the two-email pattern above.
