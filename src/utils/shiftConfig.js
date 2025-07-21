// Defines the start hour for each shift type (24-hour format, UTC)
const SHIFT_START_HOURS = {
  A: 6,  // 6:00 AM
  B: 14, // 2:00 PM
  N: 22, // 10:00 PM
};

// The time limit in hours before a shift starts that a swap can be proposed or accepted
const SWAP_TIME_LIMIT_HOURS = 8;

/**
 * Checks if an action is allowed based on the shift time and the time limit.
 * @param {Date} shiftDate - The date of the shift.
 * @param {string} shiftType - The type of shift ('A', 'B', or 'N').
 * @returns {boolean} - True if the action is allowed, false otherwise.
 */
const isActionAllowed = (shiftDate, shiftType) => {
  const shiftStartHour = SHIFT_START_HOURS[shiftType];
  if (shiftStartHour === undefined) return false; // Invalid shift type

  const shiftStartTime = new Date(shiftDate);
  // Use setUTCHours on the server to ensure timezone consistency
  shiftStartTime.setUTCHours(shiftStartHour, 0, 0, 0);

  const timeLimitMilliseconds = SWAP_TIME_LIMIT_HOURS * 60 * 60 * 1000;
  const deadline = shiftStartTime.getTime() - timeLimitMilliseconds;

  // Check if the current time is before the deadline
  return Date.now() < deadline;
};

module.exports = {
  SHIFT_START_HOURS,
  SWAP_TIME_LIMIT_HOURS,
  isActionAllowed,
};
