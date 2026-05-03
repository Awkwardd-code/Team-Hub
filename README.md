# Phase 1 — TeamHub Collaborative Platform

TeamHub is a collaborative workspace platform for teams to manage goals, milestones, action items, announcements, and member operations with real-time updates.

## 1) Project Overview

TeamHub provides:
- Multi-workspace collaboration with role-based access.
- Goal and milestone tracking.
- Action item/task planning with assignees and priorities.
- Announcement posts with comments, reactions, and mentions.
- Real-time notifications and online presence.
- Admin operations (members, settings, audit logs, analytics).
- Light/dark theme system with persistence.

## 2) Tech Stack

Frontend (`apps/web`):
- Next.js 15 App Router
- JavaScript
- Tailwind CSS
- Zustand
- Socket.io client

Backend (`apps/api`):
- Express.js
- Prisma ORM
- PostgreSQL
- Socket.io server
- Nodemailer (email flows)
- Cloudinary (avatar/media uploads)

## 3) Monorepo Architecture

- Monorepo managed with npm workspaces.
- Frontend and backend developed/deployed independently.

## 4) Folder Structure

```text
apps/
  api/
    prisma/
    src/
      modules/
      socket/
      middleware/
      utils/
  web/
    app/
    components/
    features/
    store/
    hooks/
    lib/
```

## 5) Features Completed

- Auth (credentials + Google OAuth).
- Workspaces CRUD with role membership and invitations.
- Goals, milestones, updates/activity stream.
- Action items CRUD, status/priority/due-date management.
- Announcements CRUD, comments, reactions, mentions.
- Notification center + real-time toast previews.
- Admin dashboard, members, workspace settings, audit logs.
- Analytics overview.
- Theme toggle + persisted user preference.
- Global search from dashboard navbar.
- Reusable custom confirmation modal.
- Skeleton loading states across major pages.

## 6) Authentication Flow

- Register with email/password.
- Verify email via code.
- Login creates authenticated session/cookie.
- Protected routes use auth guard.
- Logout invalidates session and clears client state.

## 7) Google Auth Flow

- User starts OAuth from frontend button.
- Backend handles Google callback.
- Existing user is signed in or new user is created.
- Session is established and user is redirected to dashboard.

## 8) Workspaces Workflow

- Create workspace (name, description, accent color).
- Workspace creator becomes admin.
- Open workspace navigates to `/workspaces/:workspaceId`.
- Detail page loads overview (stats, members, goals, tasks, announcements).

## 9) Invitation Workflow

- Admin invites existing user by email and role.
- Invitation is stored as pending.
- Invitee can accept/decline from notifications.
- Member is added only after acceptance.

## 10) Roles and Permissions

- Roles: `ADMIN`, `MEMBER`.
- Admin privileges include:
  - Workspace updates/deletion.
  - Invite/member management.
  - Role changes.
  - Workspace settings changes.
- Member permissions are restricted by module rules.

## 11) Goals and Milestones Workflow

- Create goals per workspace.
- Attach milestones to goals.
- Update progress/status over time.
- Add goal updates/activity entries.
- Real-time events sync new updates across connected clients.

## 12) Action Items Workflow

- Action item fields include:
  - `workspaceId` (required)
  - `goalId` (optional)
  - `assigneeId` (optional)
  - `status`, `priority`, `dueDate`
- Supports kanban/list view with filters.

## 13) Announcements Workflow

- Workspace admins create/edit/delete announcements.
- Members can comment and react.
- Reactions toggle per emoji per user.
- Comments support mentions.

## 14) Mentions and Notifications Workflow

- `@mention` UI in textareas with workspace-member dropdown.
- Backend mention parsing resolves workspace-scoped users.
- Mention notifications are persisted and emitted in real time.

## 15) Reactions Workflow

- Per announcement, same user can react once per emoji.
- Clicking same emoji again removes reaction.
- Different users can use same emoji (count increases).
- Unique DB constraint prevents duplicate rows for same user+emoji.

## 16) Real-time Socket.io Workflow

Main events include:
- `notification:new`
- `presence:updated`
- `announcement:created`
- `announcement:updated`
- `announcement:comment-created`
- `announcement:reaction-updated`
- `goal:update-created`
- `workspace:member-added`
- `workspace:updated`

## 17) Online Presence Workflow

- Client joins `user` and active `workspace` rooms.
- Presence updates are broadcast in workspace room.
- UI shows online members and counts.

## 18) Admin Dashboard

- Aggregated overview for admin workspaces.
- Stats, pending membership context, recent audit activity.

## 19) Admin Members

- Workspace selection.
- Member list with role changes and removal.
- Invite flow integrated with pending invitations.

## 20) Workspace Settings

- Per-workspace policy settings.
- Default statuses/priorities and toggle controls.
- Changes saved via backend settings endpoints.

## 21) Audit Logs

- Admin actions are tracked and listed.
- Supports filtering by workspace/action/entity/date.
- CSV export available where implemented.

## 22) Analytics

- Overview endpoint feeds charts/stats:
  - goals and completion
  - action-item status distribution
  - trend data
  - recent activity

## 23) Profile/Avatar Upload

- User profile page supports avatar updates.
- Upload storage integrated via Cloudinary backend config.

## 24) Theme System

- Supported themes: `light` and `dark` only.
- Default is `light` when no stored preference exists.
- Theme stored in localStorage (`theme`) and synced to `<html>` class.

## 25) Search System

- Dashboard navbar global search across:
  - workspaces
  - goals
  - milestones
  - action items
  - announcements
  - members (when available)

## 26) Loading/Skeleton System

- Skeletons are used for dashboard/workspaces/admin and other data-heavy pages.
- Workspace detail shows skeleton before overview resolves.

## 27) Custom Confirmation Modal

- Browser `confirm/alert` replaced by reusable modal.
- Used for destructive actions (delete/remove flows).

## 28) Notification Toast System

- New real-time notifications also show toast previews.
- Toasts stack, auto-dismiss after 30s, include manual close.
- Notifications remain persisted in notification center.

## 29) CSV Export

- Audit Log CSV export is supported if available in admin audit module.

## 30) Setup Instructions

```bash
npm install
cd apps/api
npx prisma generate
npx prisma migrate dev
cd ../..
npm run dev
```

## 31) Environment Variables

### Backend (`apps/api/.env`)

```env
DATABASE_URL=
CLIENT_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SOCKET_URL=
```

## 32) Database Migration Commands

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev
# optional production deploy migration:
npx prisma migrate deploy
```

## 33) Development Commands

```bash
npm run dev
npm run build
npm run lint
```

## 34) Deployment Notes for Railway

Recommended split services:
- Railway service 1: `apps/api`
- Railway service 2: `apps/web`

Backend notes:
- Set all backend env vars.
- Ensure PostgreSQL connection is reachable.
- Run Prisma migrations during deploy.

Frontend notes:
- Set `NEXT_PUBLIC_API_URL` to backend public URL.
- Set `NEXT_PUBLIC_SOCKET_URL` to backend socket URL.

## 35) Demo Account Placeholder

Use your own seeded records, for example:
- Admin: `admin@example.com` / `password123`
- Member: `member@example.com` / `password123`

(Replace with actual seeded/demo credentials in your environment.)

## 36) Advanced Features Chosen

- Audit Log system with admin visibility.
- Real-time notification workflow with socket + toast + persisted store.

## 37) Known Limitations

- Some analytics cards/charts depend on available seed/activity volume.
- Mobile UX for very dense admin tables can require horizontal scrolling.
- Certain modules may still require additional integration tests for edge-case concurrency.

## 38) Testing Checklist

- Auth: register, verify, login, logout, reset password.
- Workspace: create, open, edit, invite, accept invite, remove member.
- Roles: admin/member access boundaries.
- Goals/milestones/action items CRUD and filters.
- Announcements: comments, mentions, reactions toggle.
- Notifications: real-time receive, mark read, mark all read, toast behavior.
- Admin: members/settings/audit logs/analytics visibility.
- Theme: toggle light/dark, refresh persistence.
- Search: cross-module results and navigation.
- Socket: no duplicate event/listener behavior across page transitions.
