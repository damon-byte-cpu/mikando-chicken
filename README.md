# 🍗 Mikando Chicken & Take Away Website

A full-stack restaurant website for **Mikando Chicken & Take Away** in Mwani, Masaka, Uganda.

Built with **Next.js 14** + **Tailwind CSS** + **SQLite/Prisma**.

---

## ✨ Features

**Public Website**
- Hero with call-to-action (Call & WhatsApp buttons)
- Menu by category with dish photos, prices in UGX
- Location with Google Maps embed
- Contact info — phone, WhatsApp, address
- Mobile-first, fast loading

**Admin Dashboard** (`/admin`)
- Password-protected
- Add / Edit / Delete dishes
- Upload dish photos
- Toggle availability (hide/show dishes)
- All changes instantly live on homepage
- Works great on mobile (owner can update from phone)

---

## 🚀 Quick Setup

### 1. Clone & install

```bash
git clone <your-repo-url>
cd mikando-chicken
npm install
```

### 2. Create your .env file

```bash
cp .env.example .env
```

Then open `.env` and set:
```
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="your-strong-password-here"
NEXTAUTH_SECRET="any-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
```

> ⚠️ **Change ADMIN_PASSWORD before going live!**

### 3. Set up the database

```bash
npx prisma db push
node prisma/seed.js
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the website.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

---

## 📱 How to update the menu (owner guide)

1. Go to your website URL `/admin` on your phone
2. Enter your admin password
3. Tap **+ Add New Dish** to add a dish
4. Tap **✏️ Edit** on any dish to change name, price, description
5. Tap **⏸ Hide** to temporarily remove a dish from the menu
6. Tap **▶ Show** to bring it back
7. All changes are **live immediately** — no rebuild needed

---

## 🔧 Customisation

### Change phone number
Open `src/app/page.tsx` and update:
```ts
const PHONE_NUMBER = '0704147415';       // shown on site
const PHONE_TEL    = 'tel:+256704147415'; // click-to-call
const WHATSAPP_URL = 'https://wa.me/256704147415?...';
```

### Update the Google Maps embed
In `src/app/page.tsx`, find the `<iframe>` section and replace with your map embed URL:
1. Go to Google Maps
2. Search for "Mikando Chicken Take Away Mwani Masaka"
3. Click Share → Embed a map
4. Copy the `src` URL from the iframe code
5. Paste it into the iframe `src` attribute

### Change admin password
Edit `.env`:
```
ADMIN_PASSWORD="your-new-password"
```
Then restart the server.

---

## 🌐 Deploy to Vercel

> ⚠️ Note: SQLite is a local file database. On Vercel's free tier, the filesystem resets on each deployment. For production use, consider upgrading to **Turso** (free SQLite-compatible cloud DB) or **PlanetScale**.

### For testing/demo on Vercel:
1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `ADMIN_PASSWORD`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` = your Vercel URL
4. Add build command: `npm run build`
5. (Optional) Add `npx prisma db push && node prisma/seed.js` to post-install script

### For production (persistent data):
Use [Turso](https://turso.tech) — free tier, SQLite-compatible:
1. Create a Turso database
2. Update `prisma/schema.prisma` provider to `turso`
3. Set `DATABASE_URL` and `DATABASE_AUTH_TOKEN` in Vercel

---

## 📁 File Structure

```
mikando-chicken/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Initial menu data
├── public/
│   └── uploads/               # Dish photos (git-ignored)
├── src/
│   ├── app/
│   │   ├── page.tsx            # Homepage (public menu)
│   │   ├── layout.tsx          # Root layout + fonts
│   │   ├── globals.css         # Tailwind + custom styles
│   │   ├── admin/
│   │   │   ├── page.tsx        # Redirect to login or dashboard
│   │   │   ├── login/page.tsx  # Admin login screen
│   │   │   └── dashboard/page.tsx  # Admin dashboard
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   └── logout/route.ts
│   │       └── dishes/
│   │           ├── route.ts           # GET all, POST new
│   │           ├── [id]/route.ts      # GET one, PUT, DELETE
│   │           └── upload/route.ts    # Image upload
│   ├── components/
│   │   └── AdminDashboardClient.tsx   # Full admin UI
│   └── lib/
│       ├── prisma.ts           # Prisma client singleton
│       └── auth.ts             # Session helpers
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 📞 Support

Built for Mikando Chicken & Take Away, Mwani, Masaka, Uganda.
Phone: **0704 147415**
