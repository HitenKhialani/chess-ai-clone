const fs = require('fs');
const path = require('path');
const axios = require('axios');

const PGN_DIR = __dirname;
const UPLOAD_URL = 'http://localhost:5000/api/pgns/upload-pgn';

async function uploadPgnFiles() {
  try {
    const files = fs.readdirSync(PGN_DIR);
    const pgnFiles = files.filter(file => file.endsWith('.pgn'));

    if (pgnFiles.length === 0) {
      console.log('No PGN files found in the current directory.');
      return;
    }

    for (const file of pgnFiles) {
      const filePath = path.join(PGN_DIR, file);
      const pgnContent = fs.readFileSync(filePath, 'utf8');

      const playerWhiteMatch = pgnContent.match(/\[White "([^"]+)"\]/);
      const playerBlackMatch = pgnContent.match(/\[Black "([^"]+)"\]/);
      const eventMatch = pgnContent.match(/\[Event "([^"]+)"\]/);
      const dateMatch = pgnContent.match(/\[Date "([^"]+)"\]/);

      const pgnData = {
        player_white: playerWhiteMatch ? playerWhiteMatch[1] : 'Unknown',
        player_black: playerBlackMatch ? playerBlackMatch[1] : 'Unknown',
        event: eventMatch ? eventMatch[1] : 'Unknown',
        date: dateMatch ? dateMatch[1] : 'Unknown',
        pgn: pgnContent,
      };

      try {
        const response = await axios.post(UPLOAD_URL, pgnData);
        console.log(`Successfully uploaded ${file}:`, response.data);

        // After successful upload, attempt to verify it in the database
        const gmLastName = pgnData.player_white.split(',')[0].trim() || pgnData.player_black.split(',')[0].trim();
        if (gmLastName && gmLastName !== 'Unknown') {
          const verificationResponse = await axios.get(`http://localhost:5000/api/pgns/all-pgns?gm=${encodeURIComponent(gmLastName)}`);
          console.log(`Verification for ${file} (${gmLastName}): Found ${verificationResponse.data.length} PGNs.`);
        } else {
          console.log(`Could not verify ${file}: Grandmaster name is unknown or could not be extracted.`);
        }

      } catch (uploadError) {
        console.error(`Failed to upload ${file}:`);
        if (uploadError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('  Status:', uploadError.response.status);
          console.error('  Data:', uploadError.response.data);
        } else if (uploadError.request) {
          // The request was made but no response was received
          console.error('  No response received. Request:', uploadError.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('  Error Message:', uploadError.message);
        }
      }
    }
  } catch (error) {
    console.error('Error reading PGN files:', error);
  }
}

uploadPgnFiles();