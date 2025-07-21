const Shift = require('../models/Shift');

// This map defines the cyclical shift rotation
const shiftRotation = { A: 'N', N: 'B', B: 'A' };

/**
 * Generates and saves a shift schedule for a new user.
 * @param {string} userId - The ID of the user.
 * @param {Date} startDate - The date to start generating shifts from.
 * @param {number} weeklyOffDay - The user's assigned day off (0-6).
 * @param {string} initialShiftType - The starting shift type ('A', 'N', or 'B').
 * @param {number} durationInDays - How many days of shifts to generate.
 */
exports.generateScheduleForUser = async ({ userId, startDate, weeklyOffDay, initialShiftType, durationInDays = 90 }) => {
  const shiftsToCreate = [];
  let currentShiftType = initialShiftType;
  let currentDate = new Date(startDate);

  for (let i = 0; i < durationInDays; i++) {
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek === weeklyOffDay) {
      // This is the user's day off, so we advance to the next week's shift type.
      currentShiftType = shiftRotation[currentShiftType];
    } else {
      // This is a working day, create a shift.
      shiftsToCreate.push({
        employeeId: userId,
        date: new Date(currentDate),
        shiftType: currentShiftType,
      });
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Bulk insert all the generated shifts for better performance
  if (shiftsToCreate.length > 0) {
    await Shift.insertMany(shiftsToCreate);
  }
};