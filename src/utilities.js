const { v4: uuidv4 } = require("uuid");

const createDefaultUserMacroGoal = (userOBJ) => {
  let bmrWithBenedict = 0;
  if (userOBJ.gender === "Male") {
    bmrWithBenedict = (
      (88.362 +
        13.397 * conversion_LbToKg(userOBJ.weight) +
        4.799 * conversion_inToCm(userOBJ.height) -
        5.677 * userOBJ.age) *
        createBenedictConstant(userOBJ.fitnessLevel) +
      createGoalConstant(userOBJ.weeklyLossGoal)
    ).toFixed(0);
    //35 25 40 default ratio
    return [
      bmrWithBenedict,
      ((0.35 * bmrWithBenedict) / 4).toFixed(0),
      ((0.25 * bmrWithBenedict) / 9).toFixed(0),
      ((0.4 * bmrWithBenedict) / 4).toFixed(0),
      30,
      2300,
    ];
  } else {
    //female
    bmrWithBenedict = (
      447.593 +
      9.247 * conversion_LbToKg(userOBJ.weight) +
      3.0998 * conversion_inToCm(userOBJ.height) -
      4.33 * userOBJ.age * createBenedictConstant(userOBJ.fitnessLevel) +
      createGoalConstant(userOBJ.weeklyLossGoal)
    ).toFixed(0);
    return [
      bmrWithBenedict,
      ((0.35 * bmrWithBenedict) / 4).toFixed(0),
      ((0.25 * bmrWithBenedict) / 9).toFixed(0),
      ((0.4 * bmrWithBenedict) / 4).toFixed(0),
      30,
      2300,
    ];
  }
};

const createBenedictConstant = (input) => {
  if (input === 1) {
    return 1.2;
  } else if (input === 2) {
    return 1.375;
  } else if (input === 3) {
    return 1.55;
  } else if (input === 4) {
    return 1.725;
  } else if (input === 5) {
    return 1.9;
  }
};

const createGoalConstant = (input) => {
  if (input === 1) {
    return -1000;
  } else if (input === 2) {
    return -500;
  } else if (input === 3) {
    return 0;
  } else if (input === 4) {
    return 500;
  } else if (input === 5) {
    return 1000;
  }
};

const conversion_MacroToCalorie = (protein, fat, carbs) => {
  return protein * 4 + fat * 9 + carbs * 4;
};

const conversion_LbToKg = (input) => {
  return input * 0.453592;
};

const conversion_inToCm = (input) => {
  return input * 2.54;
};

const status = {
  succeded: { valid: true },
  success: "success",
  error: "error",
  failed: { valid: false },
  invalidUserOBJ: { error: "invalid user object" },
};
function createID() {
  return uuidv4();
}

module.exports = {
  createID,
  status,
  createDefaultUserMacroGoal,
  conversion_MacroToCalorie,
};
