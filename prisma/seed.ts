import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Starter menu for Mikando Chicken & Take Away.
// Prices are in Ugandan Shillings (UGX).
const dishes = [
  {
    name: "Chips Chicken",
    price: 12000,
    description: "Crispy golden chips + tender, juicy chicken",
    category: "Main",
    imageUrl: "/uploads/chips-chicken.png",
  },
  {
    name: "Chicken Plain",
    price: 7000,
    description: "Tender, juicy chicken",
    category: "Main",
    imageUrl: "/uploads/chicken-plain.png",
  },
  {
    name: "Chips Liver",
    price: 11000,
    description: "Liver + chips combo",
    category: "Main",
    imageUrl: "/uploads/chips-liver.png",
  },
  {
    name: "Chips Beef",
    price: 11000,
    description: "Beef + chips",
    category: "Main",
    imageUrl: "/uploads/chips-beef.png",
  },
  {
    name: "Soda",
    price: 5000,
    description: "1 Litre bottle",
    category: "Drinks",
    imageUrl: "/uploads/soda.png",
  },
]

async function main() {
  console.log("Seeding Mikando menu...")
  for (const dish of dishes) {
    // Avoid duplicate seeds: only create if a dish with the same name is absent.
    const existing = await prisma.dish.findFirst({ where: { name: dish.name } })
    if (!existing) {
      await prisma.dish.create({ data: dish })
      console.log(`  + ${dish.name}`)
    }
  }
  console.log("Done.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
