# Product Summary

## One-line summary

`harness_framework` is a local-first web MVP for education program operations, where organization admins set up programs and sessions, and teachers submit attendance, lesson journals, and attachments for their assigned sessions.

## Core users

- Organization admin
  - creates the organization
  - configures villages, programs, classes, participants
  - invites and approves teachers
  - assigns teachers to classes
  - creates sessions
  - reviews records in the dashboard and records browser
- Teacher
  - sees only assigned sessions
  - records attendance
  - writes a lesson journal
  - uploads attachments
  - submits and later edits the same session record

## Important product rules

- This is not a generic SaaS dashboard. It should feel like a warm, messenger-like operations tool.
- Admin and teacher flows are separated by role after the same authentication flow.
- The key record unit is one class session on one date.
- Sessions are created by admins first, then filled by teachers.
- Session participant snapshots are frozen at session creation time.
- `submitted_at` is preserved as the first submission time, and `updated_at` reflects later edits.
