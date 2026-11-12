# Open Questions and Architecture Notes - BookLocal

## Architecture Decisions

1. Slot Logic and Double-Booking Constraints:
   - Evaluated in both unit test suites and in-app booking actions.
   - Computes time collisions via `slotStart < existingEnd && slotEnd > existingStart` for any confirmed record.

2. Static Hosting and Dual-Perspective Demo:
   - Implemented an in-app 1-click role switcher in the top navigation bar so reviewers and prospective Fiverr clients can test both sides (Customer booking experience and Owner studio operations) without needing separate logins.
