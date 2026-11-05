# StudioSpace

**Live site:** <https://your-client.vercel.app>
**Server repository:** <https://github.com/your-username/studiospace-server>
**API:** <https://your-api.onrender.com>

StudioSpace is a peer-to-peer marketplace where creators book photo studios, sound stages, podcast rooms, music suites and art workshops by the hour, and hosts list their spaces and manage requests.

## Features

- Hero slider (Swiper), featured studios loaded from MongoDB with `.limit(6)`, category browsing and two extra home sections.
- Explore page with search, category, price and rating filters, sorting, pagination, skeleton loaders and empty states. Filters live in the URL.
- Studio details with gallery carousel, amenities, host info, reviews and a booking modal with live pricing.
- Full studio CRUD (add, my listings, update, delete with a confirmation modal) and imgbb image upload.
- Booking system with Pending, Confirmed, Completed and Cancelled statuses, guest cancellation and host confirm/decline.
- **Challenge 1:** Better Auth sessions in HTTPOnly cookies, short-lived JWTs minted server-side and verified by Express through JWKS. Unauthorized requests get `401`.
- **Challenge 2:** Double-booking prevention. Overlap with a Confirmed booking is rejected with `409` and a clear message.
- **Challenge 3:** Light and dark theme toggle that restyles the whole app and remembers the choice.
- **Optional:** PDF booking invoices and a saved-studios wishlist.
- Toast notifications (react-hot-toast) and custom modals everywhere, no browser alerts.

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, DaisyUI 5, Better Auth (MongoDB adapter, JWT plugin), Swiper, react-hot-toast, jsPDF. Server: Express, TypeScript, MongoDB, jose, zod.

## Local setup

1. Clone the repo and run `npm install`.
2. Create `.env.local`: