const express = require('express');
const router = express.Router();
const PGN = require('../models/PGN');

// POST route to upload a new PGN document
router.post('/upload-pgn', async (req, res) => {
  try {
    const { player_white, player_black, event, date, pgn } = req.body;

    if (!player_white || !player_black || !event || !date || !pgn) {
      return res.status(400).json({ msg: 'Please enter all required fields.' });
    }

    const newPGN = new PGN({
      player_white,
      player_black,
      event,
      date,
      pgn,
    });

    console.log('Attempting to save new PGN:', newPGN);
    const savedPGN = await newPGN.save();
    console.log('PGN saved successfully:', savedPGN);
    res.status(201).json(savedPGN);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET route to retrieve all PGN entries, with optional grandmaster filter
router.get('/all-pgns', async (req, res) => {
  try {
    const { gm } = req.query;
    let query = {};

    if (gm) {
      // Support both comma and space separated names
      const [lastName, ...rest] = gm.split(',');
      const firstName = rest.join(',').trim();
      const fullNameSpace = `${firstName} ${lastName}`.trim();
      const fullNameComma = `${lastName},${firstName}`.trim();
      const regexes = [
        new RegExp(lastName.trim(), 'i'),
      ];
      if (firstName) {
        regexes.push(new RegExp(fullNameSpace, 'i'));
        regexes.push(new RegExp(fullNameComma, 'i'));
      }
      query = {
        $or: [
          ...regexes.map(r => ({ player_white: r })),
          ...regexes.map(r => ({ player_black: r })),
        ],
      };
      console.log('Backend: Constructed robust query:', query);
    }

    try {
      const pgns = await PGN.find(query);
      console.log(`Backend: Found ${pgns.length} PGNs for query.`, query);
      res.json(pgns);
    } catch (dbError) {
      console.error("Backend: Error during PGN.find query:", dbError.message);
      res.status(500).send('Server Error during database query');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Temporary GET route to retrieve all PGN entries without filter
router.get('/all-pgns-unfiltered', async (req, res) => {
  try {
    const pgns = await PGN.find({});
    console.log(`Backend: Found ${pgns.length} unfiltered PGNs.`);
    res.json(pgns);
  } catch (err) {
    console.error("Backend: Error fetching unfiltered PGNs:", err.message);
    res.status(500).send('Server Error fetching unfiltered PGNs');
  }
});

module.exports = router; 