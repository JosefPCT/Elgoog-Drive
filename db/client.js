require('dotenv').config();
const { PrismaClient } = require('../src/generated/prisma')

// Driver Adapter for Postgres
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({adapter})

module.exports =  prisma;