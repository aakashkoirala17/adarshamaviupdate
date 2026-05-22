const NepaliDate = require('nepali-date-converter');

try {
  console.log("From AD date:", new NepaliDate(new Date("2026-05-22")).format("DD MMMM YYYY", "np"));
} catch (e) {
  console.log("Error 1:", e.message);
}

try {
  console.log("From AD date string 2081:", new NepaliDate(new Date("2081-05-22")).format("DD MMMM YYYY", "np"));
} catch (e) {
  console.log("Error 2:", e.message);
}

try {
  console.log("From BS date string 2081:", new NepaliDate("2081-05-22").format("DD MMMM YYYY", "np"));
} catch (e) {
  console.log("Error 3:", e.message);
}

try {
  console.log("From Invalid Date:", new NepaliDate(new Date("")).format("DD MMMM YYYY", "np"));
} catch (e) {
  console.log("Error 4:", e.message);
}
