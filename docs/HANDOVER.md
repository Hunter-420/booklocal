# Handover Document - BookLocal

## Deliverable Information

- Project: BookLocal Custom Scheduling Web App
- Package: Standard Package ($450)
- Repository: hunter-420/booklocal
- Live URL: https://hunter-420.github.io/booklocal/
- Demo Brand: Willow & Stone (Ponsonby, Auckland)

## Test Accounts (Pre-configured)

1. Client Account:
   - Name: Samantha Reed
   - Email: sam.reed@example.com
   - Phone: 021 555 7890
   - Role: customer

2. Studio Owner Account:
   - Name: Maya Ellison
   - Email: owner@willowandstone.co.nz
   - Phone: 09 376 4920
   - Role: owner

## Verified Acceptance Criteria

- Double booking prevention: confirmed slot cannot be re-booked by another client.
- Closing boundary rule: services are never offered at a start time that exceeds closing hour.
- Blocked dates: dates in blocked_dates table show zero available slots.
- 24-hour cancellation rule: cancellation requests inside 24 hours are blocked with explanatory notice.
- Calendar export: confirmed bookings export valid standard .ics iCalendar files.
- Persistence: state modifications survive browser refreshes via client-side storage.
- Zero emotes or emojis exist across the codebase and user interface.
