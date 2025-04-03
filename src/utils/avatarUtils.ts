// Avatar utility functions
export const getAvatarPath = (avatarId: number): string => {
  // Use the correct path for the avatars in the public directory
  return `/TrackYourStudy/avatar_${avatarId}.jpeg`;
};

export const getRandomAvatarId = (): number => {
  // Now we have two placeholder avatars
  return Math.floor(Math.random() * 2) + 1; // returns 1 or 2
};

// Function to get a random avatar URL
export const getRandomAvatar = (): string => {
  // Get a random avatar ID and convert to path
  return getAvatarPath(getRandomAvatarId());
};

// Function to get all available avatars
export const getAllAvatars = (): string[] => {
  // Return both placeholder avatars
  return [getAvatarPath(1), getAvatarPath(2)];
};

// Function to get a specific avatar by number
export const getAvatarByNumber = (number: number): string => {
  // Currently we only support numbers 1 and 2
  if (number < 1 || number > 2) {
    return getAvatarPath(1); // fallback to first avatar
  }
  return getAvatarPath(number);
};
