import bcrypt from "bcryptjs";

/**
 * Generates a salted hash of a password.
 *
 * This function synchronously generates a salt using bcrypt and then hashes the provided password
 * using the salt. It is important for securely storing user passwords in the database.
 *
 * @param password - The plain text password to be hashed.
 * @returns The salted and hashed password as a string.
 */
export function saltAndHashPassword(password: any): string {
  const saltRounds = 10; // Number of salt rounds (cost factor) for hashing. Higher values increase security but slow down processing.
  const salt = bcrypt.genSaltSync(saltRounds); // Generate a salt based on the cost factor.
  const hash = bcrypt.hashSync(password, salt); // Create a hash of the password with the generated salt.
  return hash; // Return the hashed password.
}

/**
 * Formats a number to always display at least two digits by adding a leading zero if necessary.
 *
 * Useful for ensuring that single-digit numbers (e.g., "1") are displayed as two digits (e.g., "01"),
 * commonly needed in date or time formatting.
 *
 * @param num - The number to format.
 * @returns The formatted number as a string with at least two digits.
 */
export function formatNumber(num: number): string {
  return num.toString().padStart(2, "0"); // Converts number to a string and pads it with leading zeros if less than two digits.
}

/**
 * Formats a Date object into a human-readable string.
 *
 * This function uses `Intl.DateTimeFormat` for locale-sensitive formatting.
 * It displays the day, month, and year in an easy-to-read format and supports the 12-hour clock format.
 *
 * Example output: "20 May 2025 14:11 pm
 *
 * @param date - The date to be formatted (e.g., `new Date()`).
 * @returns A formatted date string according to the specified locale and options.
 */
export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric", // Show the numeric day (e.g., 1, 27).
    month: "long", // Show the full name of the month (e.g., "January").
    year: "numeric", // Show the full year (e.g., 2025).
    hour12: true, // Use the 12-hour clock format.
  };
  return new Intl.DateTimeFormat("en-US", options).format(date); // Format date using the U.S. English locale.
};
