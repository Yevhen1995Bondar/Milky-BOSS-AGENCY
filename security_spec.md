# Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. **Default Deny**: All paths not explicitly matched are denied by `match /{document=**} { allow read, write: if false; }`.
2. **PII Isolation**: User email addresses are stored exclusively in `/users/{userId}/private/info`, never in `/users/{userId}`. Private info requires parent `/users/{userId}` existence (`existsAfter`/`exists`).
3. **Privilege Escalation Prevention**: Users creating `/users/{userId}` can only assign `role: "client"`. Only the bootstrapped admin (`teams@milkyboss.de` with `email_verified == true`) or a document in `/admins/{uid}` has admin privileges.
4. **Lead & Inquiry Integrity**: New leads in `/leads/{leadId}` must pass strict key (`hasAll` + `hasOnly`), type, boundary, regex, and server timestamp checks, must start with `status: "Новая"` and `adminNote: ""`, and if authenticated must bind `userId` to `request.auth.uid` (or `""` if unauthenticated). Legacy `/inquiries/{inquiryId}` preserves identical integrity with `status: "new"`.
5. **Query Isolation**: Non-admin authenticated users may only `get` or `list` `/leads` or `/inquiries` where `resource.data.userId == request.auth.uid && resource.data.userId != ''`. Unauthenticated reads/lists on `/leads` and `/inquiries` are always denied.
6. **Terminal State & Update Lockdown**: Only verified admins may update or delete leads/inquiries, preserving immutable fields (`createdAt`, `userId`, `email`, `name`), and restricting updates to `['status', 'adminNote', 'updatedAt']` with `updatedAt == request.time`.
7. **Visual CMS Lockdown**: `/site_content/main` holds only public marketing copy, pricing display labels, and image URLs (zero PII). Any visitor may `get` `/site_content/main` to render published edits, while `list`, `create`, `update`, and `delete` require `isAdmin()`, bounded `fields` map size (`<= 500`), `updatedBy == request.auth.uid`, and `updatedAt == request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Shadow Field Injection on Lead Create**: Including `"isAdminApproved": true` in `/leads/{id}` create payload.
2. **Self-Assigned Admin Role on User Create**: Creating `/users/{uid}` with `"role": "admin"`.
3. **Status Shortcutting on Lead Create**: Creating `/leads/{id}` with `"status": "Закрыта"` instead of `"Новая"`.
4. **Spoofed UserId on Lead Create**: Signed-in user A creating `/leads/{id}` with `"userId": "userB"`.
5. **Blanket Lead List by Non-Admin**: Non-admin running `getDocs(collection(db, 'leads'))` without `where('userId', '==', auth.uid)`.
6. **Cross-User PII Read**: Authenticated user A reading `/users/{userB}/private/info`.
7. **Unauthorized CMS Publish**: Non-admin authenticated user attempting `setDoc` or `updateDoc` on `/site_content/main`.
8. **Forged Server Timestamp**: Creating `/leads/{id}` or updating `/site_content/main` with a client-forged `createdAt`/`updatedAt` string instead of `request.time`.
9. **Resource Poisoning via Oversized Message or CMS Map**: Creating `/leads/{id}` with a 10,000-char `message` (> 4000 limit), oversized doc ID (`> 128` chars / invalid chars), or `site_content/main` with > 500 keys.
10. **Non-Admin Lead Status Update**: Client attempting `updateDoc` on their own lead to set `status: "Закрыта"` or `adminNote`.
11. **Unverified Admin Email Spoof**: Request where `request.auth.token.email == "teams@milkyboss.de"` but `request.auth.token.email_verified == false`.
12. **Immutable Field Tampering by Admin**: Updating `userId` or `createdAt` on an existing `/leads/{id}` document or writing to `/site_content/other`.
