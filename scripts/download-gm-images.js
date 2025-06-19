const https = require('https');
const fs = require('fs');
const path = require('path');

const grandmasters = {
  'carlsen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Magnus_Carlsen_%283%29_%28cropped%29.jpg/800px-Magnus_Carlsen_%283%29_%28cropped%29.jpg',
  'nakamura': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hikaru_Nakamura_at_the_2018_Tata_Steel_Chess_Tournament_%28cropped%29.jpg/800px-Hikaru_Nakamura_at_the_2018_Tata_Steel_Chess_Tournament_%28cropped%29.jpg',
  'caruana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Fabiano_Caruana_%282018%29.jpg/800px-Fabiano_Caruana_%282018%29.jpg',
  'anand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Vishy_2019.jpg/800px-Vishy_2019.jpg'
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filename);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(`Failed to download ${url}`);
      }
    }).on('error', reject);
  });
};

const downloadAllImages = async () => {
  const imageDir = path.join(__dirname, '..', 'public', 'images', 'gms');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  for (const [gm, url] of Object.entries(grandmasters)) {
    const filename = path.join(imageDir, `${gm}.jpg`);
    try {
      await downloadImage(url, filename);
      console.log(`Downloaded ${gm}'s image`);
    } catch (error) {
      console.error(`Error downloading ${gm}'s image:`, error);
    }
  }
};

downloadAllImages().catch(console.error); 