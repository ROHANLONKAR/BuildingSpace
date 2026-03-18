require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("./db/prisma");
const authenticateToken = require("./middleware/auth");
const app = express();
app.use(cors());
app.use(express.json());

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || "secret");
}

// ================= LISTINGS =================

// Create listing
app.post("/listings", authenticateToken, async (req, res) => {
  try {
    const { title, quantity, description, address, suburb, phone, price, imageUrl } = req.body;

    const listing = await prisma.listing.create({
      data: {
        title,
        quantity,
        description,
        address,
        suburb,
        phone,
        price,
        imageUrl,
        userId: req.user.id, // temp user
      },
    });

    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating listing" });
  }
});

// Get all listings
app.get("/listings", async (req, res) => {
  const { search, suburb } = req.query;

  const listings = await prisma.listing.findMany({
    where: {
      AND: [
        search
          ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
          : {},
        suburb
          ? {
            suburb: {
              contains: suburb,
              mode: "insensitive",
            },
          }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(listings);
});

// Delete listing
app.delete("/listings/:id",authenticateToken, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.listing.delete({ where: { id } });
  res.json({ message: "Deleted" });
});

// ================= AUTH =================

// Signup
app.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 8);

  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName || "User",
      lastName: req.body.lastName || "",
      phone: req.body.phone || "",
    },
  });

  const token = generateAccessToken(user);
  res.json({ token });
});

// Login
app.post("/login", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!user) return res.status(400).send("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(401).send("Invalid password");

  const token = generateAccessToken(user);
  res.json({ token, user });
});

app.get("/my-listings", authenticateToken, async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching listings" });
  }
});

app.put("/listings/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const updated = await prisma.listing.update({
      where: { id },
      data: req.body,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

app.get("/listings/:id", async (req, res) => {
  const id = Number(req.params.id);

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  res.json(listing);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));