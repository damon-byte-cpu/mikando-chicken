// src/app/page.tsx
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

// ──────────────────────────────────────────────
// REPLACE THESE WITH YOUR REAL NUMBERS
const PHONE_NUMBER = '0704147415';          // Shown on site
const PHONE_TEL    = 'tel:+256704147415';   // For click-to-call
const WHATSAPP_URL = 'https://wa.me/256704147415?text=Hi%20Mikando%2C%20I%27d%20like%20to%20order'; // WhatsApp link
// ──────────────────────────────────────────────

const CATEGORY_ORDER = ['Main', 'Sides', 'Drinks', 'Specials'];

const CATEGORY_COLORS: Record<string, string> = {
  Main:     'bg-red-100 text-red-700',
  Sides:    'bg-yellow-100 text-yellow-700',
  Drinks:   'bg-blue-100 text-blue-700',
  Specials: 'bg-purple-100 text-purple-700',
};

async function getMenuByCategory() {
  const dishes = await prisma.dish.findMany({
    where: { available: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  const grouped: Record<string, typeof dishes> = {};
  for (const dish of dishes) {
    if (!grouped[dish.category]) grouped[dish.category] = [];
    grouped[dish.category].push(dish);
  }
  return grouped;
}

export default async function HomePage() {
  const menu = await getMenuByCategory();
  const categories = CATEGORY_ORDER.filter((c) => menu[c]?.length);
  // Also show any extra categories not in order
  const extraCats = Object.keys(menu).filter((c) => !CATEGORY_ORDER.includes(c));

  return (
    <div className="min-h-screen bg-white">
      {/* ── NAVBAR ── */}
      <nav className="bg-[#D32F2F] sticky top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
          <span
            className="text-white font-bold text-lg tracking-wide"
            style={{ fontFamily: 'Oswald, serif' }}
          >
            🍗 MIKANDO
          </span>
          <div className="flex items-center gap-3">
            <a
              href={PHONE_TEL}
              className="text-white text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-lg
                         active:bg-white/30 transition-colors"
            >
              📞 Call
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm font-semibold bg-[#25D366] px-3 py-1.5 rounded-lg
                         active:bg-green-700 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#D32F2F] via-[#C62828] to-[#B71C1C] text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <p className="text-[#FFC107] font-semibold tracking-widest text-sm uppercase mb-3">
            Mwani, Masaka — Open 24 Hours
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight mb-3"
            style={{ fontFamily: 'Oswald, serif' }}
          >
            MIKANDO CHICKEN
            <br />
            <span className="text-[#FFC107]">&amp; TAKE AWAY</span>
          </h1>
          <p className="text-white/90 text-lg mb-8 max-w-sm mx-auto">
            Crispy chips. Juicy chicken.
            <br />
            Dine-in &amp; Takeaway in Masaka.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={PHONE_TEL} className="btn-secondary text-gray-900 font-bold">
              📞 Call to Order
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold
                         rounded-xl bg-[#25D366] text-white active:bg-green-700 transition-colors
                         min-h-[56px] min-w-[160px]"
            >
              💬 WhatsApp Us
            </a>
          </div>

          {/* Quick info pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {['🕐 Open 24hrs', '🛵 Takeaway', '🍽️ Dine-In', '📍 Mwani, Masaka'].map((tag) => (
              <span
                key={tag}
                className="bg-white/15 text-white text-sm px-3 py-1.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── MENU ── */}
      <section id="menu" className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'Oswald, serif' }}
          >
            OUR MENU
          </h2>
          <p className="text-gray-500 text-sm">All prices in Uganda Shillings (UGX)</p>
        </div>

        {/* Category tabs (anchor links) */}
        {(categories.length + extraCats.length) > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {[...categories, ...extraCats].map((cat) => (
              <a
                key={cat}
                href={`#cat-${cat}`}
                className="flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full
                           bg-gray-100 text-gray-700 active:bg-[#D32F2F] active:text-white
                           transition-colors"
              >
                {cat}
              </a>
            ))}
          </div>
        )}

        {[...categories, ...extraCats].map((cat) => (
          <div key={cat} id={`cat-${cat}`} className="mb-10">
            <h3
              className="text-xl font-bold text-[#D32F2F] mb-4 pb-2 border-b-2 border-[#FFC107]"
              style={{ fontFamily: 'Oswald, serif' }}
            >
              {cat.toUpperCase()}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menu[cat].map((dish) => (
                <div key={dish.id} className="dish-card">
                  {/* Dish image */}
                  <div className="relative w-full h-44 bg-gray-100">
                    {dish.imageUrl ? (
                      <Image
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl">
                        🍗
                      </div>
                    )}
                    {/* Available badge */}
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold
                                     px-2 py-0.5 rounded-full shadow">
                      Available
                    </span>
                    {/* Category badge */}
                    <span
                      className={`absolute top-2 left-2 badge ${
                        CATEGORY_COLORS[dish.category] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {dish.category}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 text-base leading-tight">
                        {dish.name}
                      </h4>
                      <span className="text-[#D32F2F] font-bold text-base whitespace-nowrap">
                        UGX {dish.price.toLocaleString()}
                      </span>
                    </div>
                    {dish.description && (
                      <p className="text-gray-500 text-sm leading-snug">{dish.description}</p>
                    )}
                    {/* Order CTA */}
                    <a
                      href={`${WHATSAPP_URL}&text=Hi%20Mikando%2C%20I'd%20like%20to%20order%3A%20${encodeURIComponent(dish.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-1.5 w-full py-2.5
                                 bg-[#25D366] text-white text-sm font-semibold rounded-lg
                                 active:bg-green-700 transition-colors"
                    >
                      💬 Order via WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-4">🍗</p>
            <p className="text-lg">Menu coming soon!</p>
          </div>
        )}
      </section>

      {/* ── ABOUT ── */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2
            className="text-2xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: 'Oswald, serif' }}
          >
            ABOUT MIKANDO
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-xl mx-auto">
            Fast, fresh chicken in the heart of Masaka. Whether you're grabbing a
            quick bite or sitting in with family — we serve it hot, crispy, and
            straight from the fryer. Dine in or take away, we've got you covered.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { icon: '🕐', label: 'Open 24 Hours' },
              { icon: '🛵', label: 'Quick Takeaway' },
              { icon: '🍽️', label: 'Dine-In Available' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-3xl mb-1">{item.icon}</div>
                <p className="text-xs font-semibold text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION & CONTACT ── */}
      <section id="location" className="max-w-5xl mx-auto px-4 py-12">
        <h2
          className="text-2xl font-bold text-gray-900 mb-6 text-center"
          style={{ fontFamily: 'Oswald, serif' }}
        >
          FIND US
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map embed */}
          {/* REPLACE: Update the Google Maps embed URL with the exact coordinates of Mikando */}
          {/* To get your embed: Google Maps → Share → Embed a map → Copy iframe src */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-64 bg-gray-100">
            <iframe
              title="Mikando Chicken & Take Away location"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Mwani,+Masaka,+Uganda&output=embed"
            />
          </div>

          {/* Contact cards */}
          <div className="flex flex-col gap-3">
            {/* Address */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">Location</p>
                <p className="text-gray-600 text-sm mt-0.5">
                  Mwani, Masaka, Uganda
                  <br />
                  Near Prayer Palace Church, Masaka Taxi Park
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-yellow-50 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">🕐</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">Hours</p>
                <p className="text-gray-600 text-sm mt-0.5">
                  Open 24 Hours, 7 Days a Week
                </p>
              </div>
            </div>

            {/* Phone */}
            <a
              href={PHONE_TEL}
              className="bg-red-50 rounded-xl p-4 flex items-start gap-3 active:bg-red-100
                         transition-colors"
            >
              <span className="text-2xl">📞</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">Call Us</p>
                {/* REPLACE: Update phone number below */}
                <p className="text-[#D32F2F] font-semibold text-sm mt-0.5">{PHONE_NUMBER}</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-50 rounded-xl p-4 flex items-start gap-3 active:bg-green-100
                         transition-colors"
            >
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">WhatsApp</p>
                {/* REPLACE: Update WhatsApp number below */}
                <p className="text-green-600 font-semibold text-sm mt-0.5">
                  Chat with us on WhatsApp
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Directions CTA */}
        <div className="mt-6 text-center">
          {/* REPLACE: Update Google Maps directions link with actual coordinates */}
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Mwani,+Masaka,+Uganda"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            🗺️ Get Directions
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a1a1a] text-white py-8 mt-4">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p
            className="text-xl font-bold text-[#FFC107] mb-1"
            style={{ fontFamily: 'Oswald, serif' }}
          >
            MIKANDO CHICKEN &amp; TAKE AWAY
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Mwani, Masaka, Uganda · Open 24 Hours
          </p>
          <div className="flex justify-center gap-4 mb-4">
            <a
              href={PHONE_TEL}
              className="text-gray-300 text-sm hover:text-white transition-colors"
            >
              📞 {PHONE_NUMBER}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 text-sm hover:text-white transition-colors"
            >
              💬 WhatsApp
            </a>
          </div>
          <p className="text-gray-600 text-xs">© 2026 Mikando Chicken &amp; Take Away</p>
          <p className="text-gray-700 text-xs mt-1">
            <Link href="/admin" className="hover:text-gray-500 transition-colors">
              Admin
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
