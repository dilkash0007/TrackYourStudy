/**
 * Utility to clean all demo data from local storage
 */

export const resetAllStorage = () => {
  // Clear all existing storage
  localStorage.clear();

  console.log("Local storage cleared - all demo data removed");
};

export const hasLocalStorage = () => {
  try {
    const keys = Object.keys(localStorage);
    return keys.some((key) => key.includes("-storage"));
  } catch (e) {
    return false;
  }
};
