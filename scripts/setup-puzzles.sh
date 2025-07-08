#!/bin/bash

# Install required npm packages
cd backend
npm install csv-parse better-sqlite3

# Create puzzle table and import data
node scripts/import-puzzles.js

echo "Puzzle setup complete!" 