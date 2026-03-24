import { Link } from 'react-router-dom';

const REPO_URL = 'https://github.com/jpwilson/Upstream-e-Commerce';
const INITIAL_COMMIT = '6ee509d';
const DEPLOY_COMMIT = '4eb7ee6';
const SPEC_COMMIT = 'cec7501';

const entries = [
  {
    date: '2026-03-23',
    title: 'Deployed to Railway',
    commit: DEPLOY_COMMIT,
    items: [
      'Created multi-stage Dockerfile: Node builds React frontend, Python runs Django with gunicorn',
      'Django serves the React SPA via WhiteNoise with a catch-all URL for client-side routing',
      'Added dj-database-url for PostgreSQL support (Railway addon provides DATABASE_URL)',
      'Configured CSRF/session cookie security for Railway\'s HTTPS proxy',
      'Made seed_products command idempotent (skips if products already exist)',
      'entrypoint.sh runs migrations and seeds demo data on every deploy',
      'Live at https://loving-exploration-production-976f.up.railway.app',
    ],
  },
  {
    date: '2026-03-23',
    title: 'Project Spec & Changelog',
    commit: SPEC_COMMIT,
    items: [
      'Created PROJECT_SPEC.md with original assignment text from the hiring platform',
      'Added /changelog route with this timeline UI',
      'Initialized git repository',
      'Pushed to GitHub at https://github.com/jpwilson/kid-palace-ecommerce',
    ],
  },
  {
    date: '2026-03-21',
    title: 'Full UI Redesign — Material Design 3 Theme',
    commit: INITIAL_COMMIT,
    items: [
      'Replaced all custom CSS with Tailwind CSS v4 using a Material Design 3 color token system',
      'Installed tailwindcss, @tailwindcss/vite, @tailwindcss/postcss, and @tailwindcss/forms',
      'Defined full MD3 theme in App.css via @theme — primary pink (#ac2a5d), secondary teal (#006780), tertiary amber (#785a00), plus full surface/container token palette',
      'Added Google Fonts: Plus Jakarta Sans (headings), Be Vietnam Pro (body), and Material Symbols Outlined (icons)',
      'Rewrote Navbar with frosted glass backdrop-blur effect, mobile hamburger menu, and responsive layout',
      'Created new BottomNav component — mobile-only bottom tab bar with Home, Cart, Orders, and Account tabs',
      'Redesigned ProductList with hero section, search bar, category filter pills, and responsive grid',
      'Redesigned ProductCard with hover-reveal "Add to Cart" button, rounded-2xl cards, and shadow effects',
      'Redesigned ProductDetail with bento layout, image gallery, breadcrumbs, and quantity selector',
      'Restyled Cart, Checkout, Login, Register, Profile, OrderHistory, and OrderConfirmation pages to match the new design system',
      'All components use pill-shaped buttons, rounded containers, and consistent MD3 color tokens throughout',
    ],
  },
  {
    date: '2026-03-21',
    title: 'Children\'s Literacy Product Catalog',
    commit: INITIAL_COMMIT,
    items: [
      'Cleared old sample products and created seed_products management command',
      'Added 15 products across 4 categories, all with Unsplash images:',
      '— Children\'s Books (4): Adventure Storybook Collection, ABC Learning Book, Bedtime Stories Treasury, Kids Encyclopedia of Science',
      '— Apparel (3): Reading Champion Hoodie, Bookworm Baseball Cap, Story Time T-Shirt',
      '— Stationery (4): Adventure Journal Notebook, Character Bookmarks Set, Storyteller Pencil Set, My Reading Log',
      '— Desk & Study (4): LED Reading Lamp, Book Organizer Shelf, Reading Nook Cushion, Alphabet Wall Posters',
    ],
  },
  {
    date: '2026-03-21',
    title: 'Product Image URL Support',
    commit: INITIAL_COMMIT,
    items: [
      'Added image_url (URLField) to the ProductImage model alongside the existing image (ImageField)',
      'Updated serializers to prefer uploaded files but fall back to external URLs',
      'This allows using Unsplash and other external image URLs without needing file uploads',
      'Created and ran database migration for the new field',
    ],
  },
  {
    date: '2026-03-21',
    title: 'Demo Accounts & Quick Login',
    commit: INITIAL_COMMIT,
    items: [
      'Created create_demo_users management command for seeding demo accounts',
      'Added API endpoint GET /api/accounts/demo-accounts/ that returns demo credentials',
      'Built a "Demo ▾" dropdown button in the Navbar for 1-click login',
      'Three demo accounts (all use password demo1234):',
      '— demo_shopper (Jane Shopper) — regular customer',
      '— demo_admin (Alex Admin) — staff/admin access',
      '— demo_vip (Morgan VIP) — regular customer',
    ],
  },
  {
    date: '2026-03-21',
    title: 'Feature Audit — All 7 Requirements Verified',
    commit: INITIAL_COMMIT,
    items: [
      'Product catalog with categories, images, search, and filtering — verified working',
      'Shopping cart with session persistence and merge on login — verified working',
      'Guest and registered checkout — verified working',
      'Payment processing (stubbed, no real charges) — verified working',
      'Order management with status tracking and email signals — verified working',
      'Inventory management with stock validation — verified working',
      'Customer accounts with profiles and order history — verified working',
    ],
  },
  {
    date: '2026-03-21',
    title: 'Initial Project Setup',
    commit: INITIAL_COMMIT,
    items: [
      'Created Python virtual environment and installed Django, DRF, and all dependencies',
      'Ran makemigrations for all apps (products, cart, orders, accounts, payments) — migration files didn\'t exist yet',
      'Ran migrate to create the SQLite database schema',
      'Configured Vite dev server to proxy /api and /media requests to Django backend on port 8001',
      'Set up CORS for frontend on port 5174',
      'Seeded initial sample data for development',
    ],
  },
];

function Changelog() {
  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12">
      {/* Header */}
      <div className="mb-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-primary font-medium mb-4 hover:underline">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to store
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface font-[family-name:var(--font-headline)]">
          Changelog
        </h1>
        <p className="text-on-surface/60 mt-2">
          A record of everything built for the Kid Palace ecommerce platform.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-outline-variant/30 hidden sm:block" />

        <div className="space-y-10">
          {entries.map((entry, idx) => (
            <div key={idx} className="relative sm:pl-10">
              {/* Dot on timeline */}
              <div className="absolute left-[10px] top-[10px] w-[11px] h-[11px] rounded-full bg-primary border-2 border-surface hidden sm:block" />

              {/* Date badge */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-on-surface/50 bg-surface-container px-3 py-1 rounded-full">
                  {entry.date}
                </span>
                <a
                  href={`${REPO_URL}/commit/${entry.commit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-primary/70 hover:text-primary hover:underline transition-colors"
                >
                  {entry.commit}
                </a>
              </div>

              {/* Card */}
              <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl p-5 sm:p-6">
                <h2 className="text-lg font-bold text-on-surface mb-3 font-[family-name:var(--font-headline)]">
                  {entry.title}
                </h2>
                <ul className="space-y-2">
                  {entry.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-on-surface/80 leading-relaxed">
                      <span className="text-primary/60 mt-0.5 shrink-0">
                        {item.startsWith('—') ? '' : '•'}
                      </span>
                      <span className={item.startsWith('—') ? 'pl-4' : ''}>
                        {item.startsWith('—') ? item.slice(2) : item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-12 text-center text-sm text-on-surface/40">
        <p>Built with Django REST Framework + React + Vite + Tailwind CSS v4</p>
      </div>
    </div>
  );
}

export default Changelog;
