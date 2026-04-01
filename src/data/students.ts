import type { Student } from "@/lib/types"

export const students: Student[] = [
  // ── Household hh-001: Anderson ──────────────────────────────────────────
  {
    id: "stu-001", householdId: "hh-001", firstName: "Emma", lastName: "Anderson",
    dateOfBirth: "2014-05-12", age: 11, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-006", "cls-019", "cls-067"],
  },
  {
    id: "stu-002", householdId: "hh-001", firstName: "Lily", lastName: "Anderson",
    dateOfBirth: "2017-11-03", age: 8, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-029", "cls-054"],
  },
  // ── Household hh-002: Garcia ────────────────────────────────────────────
  {
    id: "stu-003", householdId: "hh-002", firstName: "Sofia", lastName: "Garcia",
    dateOfBirth: "2011-03-22", age: 15, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-021", "cls-024", "cls-047"],
    measurements: { height: "5'4\"", chest: "32\"", waist: "26\"", hips: "34\"", inseam: "30\"" },
  },
  {
    id: "stu-004", householdId: "hh-002", firstName: "Camila", lastName: "Garcia",
    dateOfBirth: "2013-08-14", age: 12, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-009", "cls-020", "cls-071"],
  },
  {
    id: "stu-005", householdId: "hh-002", firstName: "Diego", lastName: "Garcia",
    dateOfBirth: "2018-01-30", age: 8, gender: "male", enrollmentStatus: "active",
    enrolledClassIds: ["cls-003", "cls-068"],
  },
  // ── Household hh-003: Chen ──────────────────────────────────────────────
  {
    id: "stu-006", householdId: "hh-003", firstName: "Mei", lastName: "Chen",
    dateOfBirth: "2019-07-19", age: 6, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-014", "cls-063"],
  },
  // ── Household hh-004: Thompson ──────────────────────────────────────────
  {
    id: "stu-007", householdId: "hh-004", firstName: "Chloe", lastName: "Thompson",
    dateOfBirth: "2010-12-01", age: 15, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-045", "cls-046", "cls-035"],
    measurements: { height: "5'6\"", chest: "33\"", waist: "27\"", hips: "35\"", inseam: "31\"" },
  },
  {
    id: "stu-008", householdId: "hh-004", firstName: "Zoe", lastName: "Thompson",
    dateOfBirth: "2014-04-15", age: 11, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-006", "cls-008", "cls-031"],
  },
  // ── Household hh-005: Patel ─────────────────────────────────────────────
  {
    id: "stu-009", householdId: "hh-005", firstName: "Ananya", lastName: "Patel",
    dateOfBirth: "2016-09-08", age: 9, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-005", "cls-042", "cls-069"],
  },
  {
    id: "stu-010", householdId: "hh-005", firstName: "Riya", lastName: "Patel",
    dateOfBirth: "2019-02-25", age: 7, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-002", "cls-064"],
  },
  // ── Household hh-006: Williams ──────────────────────────────────────────
  {
    id: "stu-011", householdId: "hh-006", firstName: "Jasmine", lastName: "Williams",
    dateOfBirth: "2013-06-20", age: 12, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-034", "cls-041", "cls-071"],
  },
  // ── Household hh-007: Kim ───────────────────────────────────────────────
  {
    id: "stu-012", householdId: "hh-007", firstName: "Grace", lastName: "Kim",
    dateOfBirth: "2012-01-14", age: 14, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-022", "cls-033", "cls-059"],
    measurements: { height: "5'3\"", chest: "31\"", waist: "25\"", hips: "33\"", inseam: "29\"" },
  },
  {
    id: "stu-013", householdId: "hh-007", firstName: "Hannah", lastName: "Kim",
    dateOfBirth: "2015-10-22", age: 10, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-029", "cls-039", "cls-070"],
  },
  // ── Household hh-008: O'Brien ───────────────────────────────────────────
  {
    id: "stu-014", householdId: "hh-008", firstName: "Sienna", lastName: "O'Brien",
    dateOfBirth: "2022-04-11", age: 3, gender: "female", enrollmentStatus: "trial",
    enrolledClassIds: ["cls-061"],
  },
  // ── Household hh-009: Rossi ─────────────────────────────────────────────
  {
    id: "stu-015", householdId: "hh-009", firstName: "Isabella", lastName: "Rossi",
    dateOfBirth: "2009-11-07", age: 16, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-045", "cls-046", "cls-047", "cls-079"],
    measurements: { height: "5'5\"", chest: "33\"", waist: "26\"", hips: "35\"", inseam: "30\"" },
  },
  {
    id: "stu-016", householdId: "hh-009", firstName: "Valentina", lastName: "Rossi",
    dateOfBirth: "2013-02-19", age: 13, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-009", "cls-020", "cls-032"],
  },
  {
    id: "stu-017", householdId: "hh-009", firstName: "Luca", lastName: "Rossi",
    dateOfBirth: "2016-08-28", age: 9, gender: "male", enrollmentStatus: "active",
    enrolledClassIds: ["cls-050", "cls-055"],
  },
  // ── Household hh-010: Washington ────────────────────────────────────────
  {
    id: "stu-018", householdId: "hh-010", firstName: "Aaliyah", lastName: "Washington",
    dateOfBirth: "2014-07-04", age: 11, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-010", "cls-034", "cls-076"],
  },
  {
    id: "stu-019", householdId: "hh-010", firstName: "Zara", lastName: "Washington",
    dateOfBirth: "2017-03-16", age: 9, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-003", "cls-055"],
  },
  // ── Household hh-011: Martinez ──────────────────────────────────────────
  {
    id: "stu-020", householdId: "hh-011", firstName: "Elena", lastName: "Martinez",
    dateOfBirth: "2019-12-02", age: 6, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-026", "cls-063"],
  },
  // ── Household hh-012: Nguyen ────────────────────────────────────────────
  {
    id: "stu-021", householdId: "hh-012", firstName: "Linh", lastName: "Nguyen",
    dateOfBirth: "2011-06-30", age: 14, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-057", "cls-033", "cls-035"],
    measurements: { height: "5'2\"", chest: "30\"", waist: "24\"", hips: "32\"", inseam: "28\"" },
  },
  {
    id: "stu-022", householdId: "hh-012", firstName: "Thi", lastName: "Nguyen",
    dateOfBirth: "2015-04-18", age: 10, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-006", "cls-042"],
  },
  // ── Household hh-013: Foster ────────────────────────────────────────────
  {
    id: "stu-023", householdId: "hh-013", firstName: "Ava", lastName: "Foster",
    dateOfBirth: "2022-08-09", age: 3, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-001", "cls-061"],
  },
  // ── Household hh-014: Schwartz ──────────────────────────────────────────
  {
    id: "stu-024", householdId: "hh-014", firstName: "Maya", lastName: "Schwartz",
    dateOfBirth: "2010-09-25", age: 15, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-021", "cls-024", "cls-059"],
    measurements: { height: "5'5\"", chest: "32\"", waist: "26\"", hips: "34\"", inseam: "30\"" },
  },
  {
    id: "stu-025", householdId: "hh-014", firstName: "Noah", lastName: "Schwartz",
    dateOfBirth: "2014-12-11", age: 11, gender: "male", enrollmentStatus: "active",
    enrolledClassIds: ["cls-030", "cls-007"],
  },
  // ── Household hh-015: Lee ───────────────────────────────────────────────
  {
    id: "stu-026", householdId: "hh-015", firstName: "Hana", lastName: "Lee",
    dateOfBirth: "2013-03-07", age: 13, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-008", "cls-019", "cls-074"],
  },
  {
    id: "stu-027", householdId: "hh-015", firstName: "Soo-Jin", lastName: "Lee",
    dateOfBirth: "2016-11-14", age: 9, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-053", "cls-056"],
  },
  // ── Household hh-016: Rivera ────────────────────────────────────────────
  {
    id: "stu-028", householdId: "hh-016", firstName: "Mia", lastName: "Rivera",
    dateOfBirth: "2018-05-20", age: 7, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-004", "cls-026", "cls-065"],
  },
  // ── Household hh-017: Murphy ────────────────────────────────────────────
  {
    id: "stu-029", householdId: "hh-017", firstName: "Nora", lastName: "Murphy",
    dateOfBirth: "2012-07-08", age: 13, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-032", "cls-041", "cls-075"],
  },
  {
    id: "stu-030", householdId: "hh-017", firstName: "Fiona", lastName: "Murphy",
    dateOfBirth: "2015-01-29", age: 11, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-006", "cls-052"],
  },
  // ── Household hh-018: Jackson ───────────────────────────────────────────
  {
    id: "stu-031", householdId: "hh-018", firstName: "Destiny", lastName: "Jackson",
    dateOfBirth: "2013-10-17", age: 12, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-010", "cls-034", "cls-079"],
  },
  {
    id: "stu-032", householdId: "hh-018", firstName: "Jordan", lastName: "Jackson",
    dateOfBirth: "2016-06-03", age: 9, gender: "male", enrollmentStatus: "active",
    enrolledClassIds: ["cls-003", "cls-068"],
  },
  // ── Household hh-019: Taylor ────────────────────────────────────────────
  {
    id: "stu-033", householdId: "hh-019", firstName: "Olivia", lastName: "Taylor",
    dateOfBirth: "2020-03-22", age: 6, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-014", "cls-015", "cls-066"],
  },
  // ── Household hh-020: Tanaka ────────────────────────────────────────────
  {
    id: "stu-034", householdId: "hh-020", firstName: "Sakura", lastName: "Tanaka",
    dateOfBirth: "2012-04-05", age: 14, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-022", "cls-047", "cls-081"],
    measurements: { height: "5'1\"", chest: "30\"", waist: "24\"", hips: "32\"", inseam: "27\"" },
  },
  {
    id: "stu-035", householdId: "hh-020", firstName: "Hiro", lastName: "Tanaka",
    dateOfBirth: "2016-10-30", age: 9, gender: "male", enrollmentStatus: "active",
    enrolledClassIds: ["cls-029", "cls-055"],
  },
  // ── Household hh-021: Mitchell ──────────────────────────────────────────
  {
    id: "stu-036", householdId: "hh-021", firstName: "Addison", lastName: "Mitchell",
    dateOfBirth: "2014-08-19", age: 11, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-011", "cls-032", "cls-075"],
  },
  // ── Household hh-022: Park ──────────────────────────────────────────────
  {
    id: "stu-037", householdId: "hh-022", firstName: "Eunji", lastName: "Park",
    dateOfBirth: "2010-02-14", age: 16, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-045", "cls-083", "cls-079"],
    measurements: { height: "5'4\"", chest: "32\"", waist: "25\"", hips: "34\"", inseam: "29\"" },
  },
  {
    id: "stu-038", householdId: "hh-022", firstName: "Minjun", lastName: "Park",
    dateOfBirth: "2014-09-01", age: 11, gender: "male", enrollmentStatus: "active",
    enrolledClassIds: ["cls-007", "cls-030"],
  },
  // ── Household hh-023: Volkov ────────────────────────────────────────────
  {
    id: "stu-039", householdId: "hh-023", firstName: "Natalia", lastName: "Volkov",
    dateOfBirth: "2022-06-15", age: 3, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-025", "cls-061"],
  },
  // ── Household hh-024: Cohen ─────────────────────────────────────────────
  {
    id: "stu-040", householdId: "hh-024", firstName: "Miriam", lastName: "Cohen",
    dateOfBirth: "2013-11-28", age: 12, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-009", "cls-019", "cls-077"],
  },
  {
    id: "stu-041", householdId: "hh-024", firstName: "Eli", lastName: "Cohen",
    dateOfBirth: "2017-07-09", age: 8, gender: "male", enrollmentStatus: "active",
    enrolledClassIds: ["cls-017", "cls-068"],
  },
  // ── Household hh-025: Brooks ────────────────────────────────────────────
  {
    id: "stu-042", householdId: "hh-025", firstName: "Taylor", lastName: "Brooks",
    dateOfBirth: "2011-05-16", age: 14, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-043", "cls-057", "cls-081"],
  },
  {
    id: "stu-043", householdId: "hh-025", firstName: "Morgan", lastName: "Brooks",
    dateOfBirth: "2015-02-08", age: 11, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-008", "cls-052"],
  },
  // ── Household hh-026: Hughes ────────────────────────────────────────────
  {
    id: "stu-044", householdId: "hh-026", firstName: "Maeve", lastName: "Hughes",
    dateOfBirth: "2019-10-05", age: 6, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-002", "cls-027"],
  },
  // ── Household hh-027: Hassan ────────────────────────────────────────────
  {
    id: "stu-045", householdId: "hh-027", firstName: "Layla", lastName: "Hassan",
    dateOfBirth: "2012-12-20", age: 13, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-020", "cls-041", "cls-077"],
  },
  {
    id: "stu-046", householdId: "hh-027", firstName: "Noor", lastName: "Hassan",
    dateOfBirth: "2016-04-02", age: 9, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-053", "cls-070"],
  },
  // ── Household hh-028: Santos ────────────────────────────────────────────
  {
    id: "stu-047", householdId: "hh-028", firstName: "Bianca", lastName: "Santos",
    dateOfBirth: "2015-06-14", age: 10, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-029", "cls-039", "cls-072"],
  },
  // ── Household hh-029: Clarke ────────────────────────────────────────────
  {
    id: "stu-048", householdId: "hh-029", firstName: "Piper", lastName: "Clarke",
    dateOfBirth: "2010-08-31", age: 15, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-033", "cls-035", "cls-057"],
    measurements: { height: "5'6\"", chest: "33\"", waist: "27\"", hips: "35\"", inseam: "31\"" },
  },
  {
    id: "stu-049", householdId: "hh-029", firstName: "Scarlett", lastName: "Clarke",
    dateOfBirth: "2014-02-22", age: 12, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-041", "cls-020"],
  },
  // ── Household hh-030: Moretti ───────────────────────────────────────────
  {
    id: "stu-050", householdId: "hh-030", firstName: "Gianna", lastName: "Moretti",
    dateOfBirth: "2009-10-03", age: 16, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-045", "cls-083", "cls-047", "cls-079"],
    measurements: { height: "5'5\"", chest: "32\"", waist: "26\"", hips: "34\"", inseam: "30\"" },
  },
  {
    id: "stu-051", householdId: "hh-030", firstName: "Aria", lastName: "Moretti",
    dateOfBirth: "2013-05-27", age: 12, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-009", "cls-011", "cls-074"],
  },
  // ── Household hh-031: Bell ──────────────────────────────────────────────
  {
    id: "stu-052", householdId: "hh-031", firstName: "Willow", lastName: "Bell",
    dateOfBirth: "2017-09-13", age: 8, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-005", "cls-017", "cls-067"],
  },
  // ── Household hh-032: Nakamura ──────────────────────────────────────────
  {
    id: "stu-053", householdId: "hh-032", firstName: "Yumi", lastName: "Nakamura",
    dateOfBirth: "2011-01-06", age: 15, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-021", "cls-022", "cls-078"],
    measurements: { height: "5'3\"", chest: "31\"", waist: "25\"", hips: "33\"", inseam: "28\"" },
  },
  {
    id: "stu-054", householdId: "hh-032", firstName: "Aoi", lastName: "Nakamura",
    dateOfBirth: "2015-08-11", age: 10, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-006", "cls-056"],
  },
  // ── Household hh-033: Douglas ───────────────────────────────────────────
  {
    id: "stu-055", householdId: "hh-033", firstName: "Riley", lastName: "Douglas",
    dateOfBirth: "2019-01-17", age: 7, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-026", "cls-004", "cls-065"],
  },
  // ── Household hh-034: Alvarez ───────────────────────────────────────────
  {
    id: "stu-056", householdId: "hh-034", firstName: "Lucia", lastName: "Alvarez",
    dateOfBirth: "2010-04-09", age: 15, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-043", "cls-044", "cls-081"],
  },
  {
    id: "stu-057", householdId: "hh-034", firstName: "Marco", lastName: "Alvarez",
    dateOfBirth: "2015-12-03", age: 10, gender: "male", enrollmentStatus: "active",
    enrolledClassIds: ["cls-055", "cls-072"],
  },
  // ── Household hh-035: Okafor ────────────────────────────────────────────
  {
    id: "stu-058", householdId: "hh-035", firstName: "Adaeze", lastName: "Okafor",
    dateOfBirth: "2013-09-10", age: 12, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-010", "cls-041", "cls-076"],
  },
  {
    id: "stu-059", householdId: "hh-035", firstName: "Chidera", lastName: "Okafor",
    dateOfBirth: "2017-05-26", age: 8, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-017", "cls-016"],
  },
  // ── Household hh-036: Campbell ──────────────────────────────────────────
  {
    id: "stu-060", householdId: "hh-036", firstName: "Mackenzie", lastName: "Campbell",
    dateOfBirth: "2018-10-12", age: 7, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-002", "cls-015", "cls-065"],
  },
  // ── Household hh-037: Petrov ────────────────────────────────────────────
  {
    id: "stu-061", householdId: "hh-037", firstName: "Katya", lastName: "Petrov",
    dateOfBirth: "2011-07-22", age: 14, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-021", "cls-046", "cls-059"],
    measurements: { height: "5'4\"", chest: "31\"", waist: "25\"", hips: "33\"", inseam: "29\"" },
  },
  {
    id: "stu-062", householdId: "hh-037", firstName: "Mila", lastName: "Petrov",
    dateOfBirth: "2015-11-08", age: 10, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-029", "cls-069"],
  },
  // ── Household hh-038: Burns ─────────────────────────────────────────────
  {
    id: "stu-063", householdId: "hh-038", firstName: "Clementine", lastName: "Burns",
    dateOfBirth: "2022-02-01", age: 4, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-037", "cls-062"],
  },
  // ── Household hh-039: Romano ────────────────────────────────────────────
  {
    id: "stu-064", householdId: "hh-039", firstName: "Alessia", lastName: "Romano",
    dateOfBirth: "2012-06-18", age: 13, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-032", "cls-071", "cls-074"],
  },
  {
    id: "stu-065", householdId: "hh-039", firstName: "Francesca", lastName: "Romano",
    dateOfBirth: "2016-01-10", age: 10, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-039", "cls-070"],
  },
  // ── Household hh-040: Cooper ────────────────────────────────────────────
  {
    id: "stu-066", householdId: "hh-040", firstName: "Eloise", lastName: "Cooper",
    dateOfBirth: "2009-03-14", age: 17, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-045", "cls-083", "cls-022", "cls-079"],
    measurements: { height: "5'7\"", chest: "34\"", waist: "27\"", hips: "36\"", inseam: "32\"" },
  },
  {
    id: "stu-067", householdId: "hh-040", firstName: "Hazel", lastName: "Cooper",
    dateOfBirth: "2013-01-05", age: 13, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-020", "cls-034", "cls-075"],
  },
  {
    id: "stu-068", householdId: "hh-040", firstName: "Ivy", lastName: "Cooper",
    dateOfBirth: "2018-06-20", age: 7, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-004", "cls-027"],
  },
  // ── Household hh-041: Reed ──────────────────────────────────────────────
  {
    id: "stu-069", householdId: "hh-041", firstName: "Kennedy", lastName: "Reed",
    dateOfBirth: "2019-04-30", age: 6, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-063", "cls-066"],
  },
  // ── Household hh-042: Fitzgerald ────────────────────────────────────────
  {
    id: "stu-070", householdId: "hh-042", firstName: "Siobhan", lastName: "Fitzgerald",
    dateOfBirth: "2011-10-09", age: 14, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-033", "cls-057", "cls-081"],
  },
  {
    id: "stu-071", householdId: "hh-042", firstName: "Declan", lastName: "Fitzgerald",
    dateOfBirth: "2015-07-21", age: 10, gender: "male", enrollmentStatus: "active",
    enrolledClassIds: ["cls-030", "cls-050"],
  },
  // ── Household hh-043: Sutton ────────────────────────────────────────────
  {
    id: "stu-072", householdId: "hh-043", firstName: "Quinn", lastName: "Sutton",
    dateOfBirth: "2017-12-25", age: 8, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-016", "cls-029"],
  },
  // ── Household hh-044: Svensson ──────────────────────────────────────────
  {
    id: "stu-073", householdId: "hh-044", firstName: "Astrid", lastName: "Svensson",
    dateOfBirth: "2010-05-06", age: 15, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-045", "cls-047", "cls-035"],
    measurements: { height: "5'6\"", chest: "32\"", waist: "26\"", hips: "34\"", inseam: "31\"" },
  },
  {
    id: "stu-074", householdId: "hh-044", firstName: "Freya", lastName: "Svensson",
    dateOfBirth: "2014-11-19", age: 11, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-011", "cls-031", "cls-071"],
  },
  // ── Household hh-045: Crawford (inactive) ──────────────────────────────
  {
    id: "stu-075", householdId: "hh-045", firstName: "Peyton", lastName: "Crawford",
    dateOfBirth: "2015-03-30", age: 11, gender: "female", enrollmentStatus: "withdrawn",
    enrolledClassIds: [],
  },
  // ── Household hh-046: Flynn ─────────────────────────────────────────────
  {
    id: "stu-076", householdId: "hh-046", firstName: "Rowan", lastName: "Flynn",
    dateOfBirth: "2012-08-15", age: 13, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-018", "cls-077", "cls-079"],
  },
  {
    id: "stu-077", householdId: "hh-046", firstName: "Deirdre", lastName: "Flynn",
    dateOfBirth: "2016-02-28", age: 10, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-053", "cls-042"],
  },
  // ── Household hh-047: Gupta ─────────────────────────────────────────────
  {
    id: "stu-078", householdId: "hh-047", firstName: "Anika", lastName: "Gupta",
    dateOfBirth: "2018-09-22", age: 7, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-002", "cls-026"],
  },
  // ── Household hh-048: Grant ─────────────────────────────────────────────
  {
    id: "stu-079", householdId: "hh-048", firstName: "Imani", lastName: "Grant",
    dateOfBirth: "2013-04-14", age: 12, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-034", "cls-043", "cls-076"],
  },
  {
    id: "stu-080", householdId: "hh-048", firstName: "Kaia", lastName: "Grant",
    dateOfBirth: "2017-08-07", age: 8, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-003", "cls-068"],
  },
  // ── Household hh-049: Donovan (inactive) ───────────────────────────────
  {
    id: "stu-081", householdId: "hh-049", firstName: "Brynn", lastName: "Donovan",
    dateOfBirth: "2016-06-12", age: 9, gender: "female", enrollmentStatus: "withdrawn",
    enrolledClassIds: [],
  },
  // ── Household hh-050: Price ─────────────────────────────────────────────
  {
    id: "stu-082", householdId: "hh-050", firstName: "Amara", lastName: "Price",
    dateOfBirth: "2011-12-01", age: 14, gender: "female", enrollmentStatus: "active",
    enrolledClassIds: ["cls-022", "cls-043", "cls-079"],
  },
  {
    id: "stu-083", householdId: "hh-050", firstName: "Ezra", lastName: "Price",
    dateOfBirth: "2015-05-19", age: 10, gender: "male", enrollmentStatus: "active",
    enrolledClassIds: ["cls-007", "cls-055"],
  },
]

// ── Helper functions ──────────────────────────────────────────────────────────

export function getStudentById(id: string): Student | undefined {
  return students.find((s) => s.id === id)
}

export function getStudentsByHousehold(householdId: string): Student[] {
  return students.filter((s) => s.householdId === householdId)
}

export function getStudentsByClass(classId: string): Student[] {
  return students.filter((s) => s.enrolledClassIds.includes(classId))
}

export function getActiveStudents(): Student[] {
  return students.filter((s) => s.enrollmentStatus === "active")
}

export function searchStudents(query: string): Student[] {
  const q = query.toLowerCase()
  return students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q),
  )
}
