# Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. **Default Deny**: All paths not explicitly matched are denied by `match /{document=**} { allow read, write: if false; }`.
2. **PII Isolation**: User email addresses are stored exclusively in `/users/{userId}/private/info`, never in `/users/{userId}`. Private info requires parent `/users/{userId}` existence (`existsAfter`/`exists`).
3. **Privilege Escalation Prevention**: Users creating `/users/{userId}` can only assign `role: "client"`. Only the bootstrapped admin (`teams@milkyboss.de` with `email_verified == true`) or a document in `/admins/{uid}` has admin privileges.
4. **Inquiry Integrity**: New inquiries in `/inquiries/{inquiryId}` must pass strict key (`hasAll` + `hasOnly`), type, boundary, regex, and server timestamp checks, must start with `status: "new"` and `adminNote: ""`, and if authenticated must bind `userId` to `request.auth.uid` (or `""` if unauthenticated).
5. **Query Isolation**: Non-admin authenticated users may only `get` or `list` `/inquiries` where `resource.data.userId == request.auth.uid && resource.data.userId != ''`. Unauthenticated reads/lists are always denied.
6. **Terminal State & Update Lockdown**: Only verified admins may update or delete inquiries, preserving immutable fields (`createdAt`, `userId`, `email`, `name`), and restricting updates to `['status', 'adminNote', 'updatedAt']` with `updatedAt == request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Shadow Field Injection on Inquiry Create**: Including `"isAdminApproved": true` in `/inquiries/{id}` create payload.
2. **Self-Assigned Admin Role on User Create**: Creating `/users/{uid}` with `"role": "admin"`.
3. **Status Shortcutting on Inquiry Create**: Creating `/inquiries/{id}` with `"status": "contacted"` instead of `"new"`.
4. **Spoofed UserId on Inquiry Create**: Signed-in user A creating `/inquiries/{id}` with `"userId": "userB"`.
5. **Blanket Inquiry List by Non-Admin**: Non-admin running `getDocs(collection(db, 'inquiries'))` without `where('userId', '==', auth.uid)`.
6. **Cross-User PII Read**: Authenticated user A reading `/users/{userB}/private/info`.
7. **Orphaned Private Info Write**: Creating `/users/{uid}/private/info` when parent `/users/{uid}` does not exist.
8. **Forged Server Timestamp**: Creating `/inquiries/{id}` with a client-forged `createdAt` string instead of `request.time`.
9. **Resource Poisoning via Oversized Message**: Creating `/inquiries/{id}` with a 10,000-char `message` (> 4000 limit) or oversized doc ID (`> 128` chars / invalid chars).
10. **Non-Admin Inquiry Status Update**: Client attempting `updateDoc` on their own inquiry to set `status: "archived"` or `adminNote`.
11. **Unverified Admin Email Spoof**: Request where `request.auth.token.email == "teams@milkyboss.de"` but `request.auth.token.email_verified == false`.
12. **Immutable Field Tampering by Admin**: Updating `userId` or `createdAt` on an existing `/inquiries/{id}` document.
