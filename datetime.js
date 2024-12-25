// datetime.js
const now = new Date();

const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

let sessionStartYear;
let sessionEndYear;

if (currentMonth >= 4) { 
  sessionStartYear = currentYear;
  sessionEndYear = currentYear + 1;
} else { 
  sessionStartYear = currentYear - 1;
  sessionEndYear = currentYear;
}

const currentSession = `${sessionStartYear}-${sessionEndYear}`;

export { currentSession };