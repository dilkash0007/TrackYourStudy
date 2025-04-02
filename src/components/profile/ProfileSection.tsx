import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { motion } from "framer-motion";
import {
  PencilIcon,
  CheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export const ProfileSection = () => {
  // Use new simplified user store structure
  const { name, email, avatar, setUserProfile } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: name || "",
    email: email || "",
    // Default values for fields not in simplified store
    bio: "I am using TrackYouStudy to improve my academic performance.",
    academicLevel: "University",
    fieldOfStudy: "Computer Science",
  });

  // Academic levels and fields of study options
  const academicLevels = [
    "High School",
    "University",
    "Graduate",
    "Postgraduate",
    "Professional",
    "Other",
  ];

  const fieldsOfStudy = [
    "General",
    "Computer Science",
    "Engineering",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Medicine",
    "Law",
    "Business",
    "Arts",
    "Humanities",
    "Social Sciences",
    "Languages",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update just name and email in the store
    setUserProfile(formData.name, formData.email);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: name || "",
      email: email || "",
      bio: "I am using TrackYouStudy to improve my academic performance.",
      academicLevel: "University",
      fieldOfStudy: "Computer Science",
    });
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Profile Information
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-sm px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <PencilIcon className="h-4 w-4 mr-1.5" />
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="text-sm px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>

      {isEditing ? (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Profile picture display */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-32 h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center relative">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name || "User"}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";
                    }}
                  />
                ) : (
                  <UserCircleIcon className="w-16 h-16 text-indigo-500 dark:text-indigo-400" />
                )}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Change avatar in profile page
              </span>
            </div>

            {/* Form fields */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="academicLevel"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Academic Level
                  </label>
                  <select
                    id="academicLevel"
                    name="academicLevel"
                    value={formData.academicLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    {academicLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="fieldOfStudy"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Field of Study
                  </label>
                  <select
                    id="fieldOfStudy"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    {fieldsOfStudy.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <CheckIcon className="w-4 h-4 mr-1.5 inline-block" />
              Save Changes
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {name || "Not set"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white break-all">
                {email || "Not set"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Bio
              </h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {formData.bio}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Academic Level
              </h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {formData.academicLevel}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Field of Study
              </h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {formData.fieldOfStudy}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
