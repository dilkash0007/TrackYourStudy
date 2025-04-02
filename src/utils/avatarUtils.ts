// Function to get a random avatar URL
export const getRandomAvatar = (): string => {
  // Manually defined list of available avatars
  const availableAvatars = [
    "/src/avtars/avatar_1.jpeg",
    "/src/avtars/avatar_2.jpeg",
    "/src/avtars/avatar_3.jpeg",
    "/src/avtars/avatar_4.jpeg",
    "/src/avtars/avatar_5.jpeg",
    "/src/avtars/avatar_6.jpeg",
    "/src/avtars/avatar_7.jpeg",
    "/src/avtars/1ee776d6-1474-481e-9e79-bcd77ffdb67a.jpeg",
    "/src/avtars/28dce2189e892da28c6aa149f19dc1a60d9a3450.jpg",
    "/src/avtars/465297cc-2474-4e35-885f-62f381bdd14f.jpeg",
    "/src/avtars/7a1d1e66-7474-4b2b-9fe1-a579519dec1f.jpeg",
    "/src/avtars/7bf976c3-c56c-4e2e-9d00-8f0b6945f434.jpeg",
    "/src/avtars/a9534eba-67d4-4a6a-ac06-bbf40e0ba598.jpeg",
    "/src/avtars/aba4a3bc-5ffd-4cae-aa7f-2b8b43e857ab.jpeg",
    "/src/avtars/craiyon_065947_anime_boy_with_pink_and_blue_hair.png",
    "/src/avtars/ea6b161f-4985-440c-af31-ef4c0cb0214f.jpeg",
    "/src/avtars/f8f2c1ef-d1b9-4889-b408-64491b0e2c34.png",
  ];

  const randomIndex = Math.floor(Math.random() * availableAvatars.length);
  return availableAvatars[randomIndex];
};

// Function to get a specific avatar by number
export const getAvatarByNumber = (number: number): string => {
  if (number <= 7) {
    return `/src/avtars/avatar_${number}.jpeg`;
  } else if (number === 20 || number === 27) {
    return `/src/avtars/avatar_${number}.png`;
  } else {
    return `/src/avtars/avatar_${number}.jpeg`;
  }
};

// Function to get all available avatars
export const getAllAvatars = (): string[] => {
  // Return the same manually defined list
  return [
    "/src/avtars/avatar_1.jpeg",
    "/src/avtars/avatar_2.jpeg",
    "/src/avtars/avatar_3.jpeg",
    "/src/avtars/avatar_4.jpeg",
    "/src/avtars/avatar_5.jpeg",
    "/src/avtars/avatar_6.jpeg",
    "/src/avtars/avatar_7.jpeg",
    "/src/avtars/1ee776d6-1474-481e-9e79-bcd77ffdb67a.jpeg",
    "/src/avtars/28dce2189e892da28c6aa149f19dc1a60d9a3450.jpg",
    "/src/avtars/465297cc-2474-4e35-885f-62f381bdd14f.jpeg",
    "/src/avtars/7a1d1e66-7474-4b2b-9fe1-a579519dec1f.jpeg",
    "/src/avtars/7bf976c3-c56c-4e2e-9d00-8f0b6945f434.jpeg",
    "/src/avtars/a9534eba-67d4-4a6a-ac06-bbf40e0ba598.jpeg",
    "/src/avtars/aba4a3bc-5ffd-4cae-aa7f-2b8b43e857ab.jpeg",
    "/src/avtars/craiyon_065947_anime_boy_with_pink_and_blue_hair.png",
    "/src/avtars/ea6b161f-4985-440c-af31-ef4c0cb0214f.jpeg",
    "/src/avtars/f8f2c1ef-d1b9-4889-b408-64491b0e2c34.png",
  ];
};
