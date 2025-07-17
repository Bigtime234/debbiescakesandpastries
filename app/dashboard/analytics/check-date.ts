export default function checkDate(dateToCheck: Date | string | undefined, daysAgo: number): boolean {
  // Log the input for debugging
  console.log("dateToCheck:", dateToCheck);
  
  // Handle undefined or null values
  if (!dateToCheck) {
    console.warn("dateToCheck is undefined or null");
    return false;
  }
  
  // Convert string input to Date if necessary
  if (typeof dateToCheck === "string") {
    dateToCheck = new Date(dateToCheck);
  }
  
  // Check if dateToCheck is a valid Date object
  if (!(dateToCheck instanceof Date) || isNaN(dateToCheck.getTime())) {
    console.warn("Invalid date provided to checkDate function:", dateToCheck);
    return false; // Return false instead of throwing error
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(today);
  targetDate.setDate(targetDate.getDate() - daysAgo);
  
  // Normalize the dateToCheck to remove time component
  const normalizedDateToCheck = new Date(dateToCheck);
  normalizedDateToCheck.setHours(0, 0, 0, 0);
  
  return (
    normalizedDateToCheck.getDate() === targetDate.getDate() &&
    normalizedDateToCheck.getMonth() === targetDate.getMonth() &&
    normalizedDateToCheck.getFullYear() === targetDate.getFullYear()
  );
}