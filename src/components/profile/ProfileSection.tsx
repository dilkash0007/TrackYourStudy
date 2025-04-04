import { useState, useEffect } from "react";
import { useUserStore } from "../../store/userStore";
import { motion } from "framer-motion";
import {
  UserIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { getAllAvatars, getAvatarPath } from "../../utils/avatarUtils";

export const ProfileSection = () => {
  // Get complete user details from the store
  const {
    name,
    email,
    avatar,
    bio,
    educationLevel,
    institution,
    studyField,
    birthday,
    phoneNumber,
    location,
    setUserProfile,
    setDetailedProfile,
    setAvatar,
    randomizeAvatar,
  } = useUserStore();

  // States for form values
  const [formName, setFormName] = useState(name || "");
  const [formEmail, setFormEmail] = useState(email || "");
  const [formBio, setFormBio] = useState(bio || "");
  const [formEducationLevel, setFormEducationLevel] = useState(
    educationLevel || ""
  );
  const [formInstitution, setFormInstitution] = useState(institution || "");
  const [formStudyField, setFormStudyField] = useState(studyField || "");
  const [formBirthday, setFormBirthday] = useState(birthday || "");
  const [formPhoneNumber, setFormPhoneNumber] = useState(phoneNumber || "");
  const [formLocation, setFormLocation] = useState(location || "");

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const avatars = getAllAvatars();

  // Update form data when store values change
  useEffect(() => {
    setFormName(name || "");
    setFormEmail(email || "");
    setFormBio(bio || "");
    setFormEducationLevel(educationLevel || "");
    setFormInstitution(institution || "");
    setFormStudyField(studyField || "");
    setFormBirthday(birthday || "");
    setFormPhoneNumber(phoneNumber || "");
    setFormLocation(location || "");
  }, [
    name,
    email,
    bio,
    educationLevel,
    institution,
    studyField,
    birthday,
    phoneNumber,
    location,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Save basic profile info
      setUserProfile(formName, formEmail);

      // Save detailed profile info
      setDetailedProfile({
        bio: formBio,
        educationLevel: formEducationLevel,
        institution: formInstitution,
        studyField: formStudyField,
        birthday: formBirthday,
        phoneNumber: formPhoneNumber,
        location: formLocation,
      });

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Personal Information
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="py-2 px-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium rounded-md dark:bg-indigo-900/50 dark:hover:bg-indigo-800/70 dark:text-indigo-300"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Education Level
                </label>
                <select
                  value={formEducationLevel}
                  onChange={(e) => setFormEducationLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Education Level</option>
                  <option value="high_school">High School</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">Ph.D.</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={formInstitution}
                  onChange={(e) => setFormInstitution(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your School or University"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={formStudyField}
                  onChange={(e) => setFormStudyField(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Computer Science, Medicine, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formBirthday}
                  onChange={(e) => setFormBirthday(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formPhoneNumber}
                  onChange={(e) => setFormPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className={`py-2 px-4 ${
                  isSaving
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Name
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white font-medium">
                  {name || "Not set"}
                </dd>
              </div>

              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white font-medium">
                  {email || "Not set"}
                </dd>
              </div>

              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bio
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white font-medium">
                  {bio || "No bio added yet."}
                </dd>
              </div>

              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  Education Level
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white font-medium">
                  {educationLevel
                    ? educationLevel === "high_school"
                      ? "High School"
                      : educationLevel === "bachelors"
                      ? "Bachelor's Degree"
                      : educationLevel === "masters"
                      ? "Master's Degree"
                      : educationLevel === "phd"
                      ? "Ph.D."
                      : educationLevel
                    : "Not set"}
                </dd>
              </div>

              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <BuildingLibraryIcon className="h-5 w-5 mr-2" />
                  Institution
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white font-medium">
                  {institution || "Not set"}
                </dd>
              </div>

              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2" />
                  Field of Study
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white font-medium">
                  {studyField || "Not set"}
                </dd>
              </div>

              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Date of Birth
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white font-medium">
                  {birthday
                    ? new Date(birthday).toLocaleDateString()
                    : "Not set"}
                </dd>
              </div>

              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Phone Number
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white font-medium">
                  {phoneNumber || "Not set"}
                </dd>
              </div>

              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Location
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white font-medium">
                  {location || "Not set"}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Avatar
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={randomizeAvatar}
              className="py-2 px-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium rounded-md dark:bg-indigo-900/50 dark:hover:bg-indigo-800/70 dark:text-indigo-300"
            >
              Random
            </button>
            <button
              onClick={() => setShowAvatarSelector(!showAvatarSelector)}
              className="py-2 px-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium rounded-md dark:bg-indigo-900/50 dark:hover:bg-indigo-800/70 dark:text-indigo-300"
            >
              {showAvatarSelector ? "Hide Gallery" : "Browse Gallery"}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full overflow-hidden mb-4">
              <img
                src={avatar}
                alt="Your Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";
                }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
              Your avatar helps personalize your profile across the app.
            </p>
          </div>

          {showAvatarSelector && (
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Choose an avatar:
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {avatars.map((avatarPath, index) => (
                  <button
                    key={index}
                    onClick={() => setAvatar(avatarPath)}
                    className={`relative rounded-full overflow-hidden border-2 ${
                      avatar === avatarPath
                        ? "border-indigo-500 ring-2 ring-indigo-300"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <img
                      src={avatarPath}
                      alt={`Avatar option ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
