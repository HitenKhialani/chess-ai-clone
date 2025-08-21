export interface GrandmasterInfo {
  fullName: string;
  birthplace: string;
  country: string;
  fideRating: number;
  worldChampionships: number;
  openingStyle: string;
  playingStyle: string;
  interestingFacts: string;
  imagePath: string;
}

export const grandmasterData: Record<string, GrandmasterInfo> = {
  "Magnus Carlsen": {
    fullName: "Sven Magnus Øen Carlsen",
    birthplace: "Tønsberg, Norway",
    country: "Norway",
    fideRating: 2859,
    worldChampionships: 5,
    openingStyle: "Versatile, known for playing various openings including the Ruy Lopez, Sicilian, and Queen's Gambit",
    playingStyle: "Positional player with exceptional endgame skills and practical approach",
    interestingFacts: "Became a grandmaster at age 13, making him one of the youngest in history. Known for his incredible memory and ability to play blindfold chess. He's also a successful fantasy football player and has modeled for G-Star Raw.",
    imagePath: "/images/gms/magnus.jpg"
  },
  "Hikaru Nakamura": {
    fullName: "Hikaru Nakamura",
    birthplace: "Hirakata, Japan",
    country: "United States",
    fideRating: 2787,
    worldChampionships: 0,
    openingStyle: "Aggressive, often plays the King's Indian Defense and various sharp lines",
    playingStyle: "Dynamic and tactical player, known for his speed and creativity",
    interestingFacts: "Five-time US Chess Champion. Known for his exceptional speed chess abilities and streaming career. He's also a successful Twitch streamer and has popularized chess content creation.",
    imagePath: "/images/gms/hikaru.jpg"
  },
  "Fabiano Caruana": {
    fullName: "Fabiano Luigi Caruana",
    birthplace: "Miami, Florida",
    country: "United States",
    fideRating: 2796,
    worldChampionships: 0,
    openingStyle: "Classical player, strong in the Ruy Lopez and Italian Game",
    playingStyle: "Positional player with deep opening preparation",
    interestingFacts: "Became a grandmaster at age 14. In 2014, he won the Sinquefield Cup with a record-breaking 8.5/10 score. Known for his exceptional opening preparation and deep understanding of chess theory.",
    imagePath: "/images/gms/fabiano.jpg"
  },
  "Viswanathan Anand": {
    fullName: "Viswanathan Anand",
    birthplace: "Chennai, India",
    country: "India",
    fideRating: 2754,
    worldChampionships: 5,
    openingStyle: "Versatile, strong in both classical and modern openings",
    playingStyle: "Universal player with exceptional tactical vision and speed",
    interestingFacts: "Known as the 'Tiger of Madras'. First Indian grandmaster and world champion. Famous for his lightning-fast calculation abilities and friendly personality. He's also known for his contributions to chess education in India.",
    imagePath: "/images/gms/vishy.jpg"
  }
}; 