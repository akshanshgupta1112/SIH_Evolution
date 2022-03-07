const Account = require("../models/Account");

const saveIndividual = async (req, res, next) => {
  try {
    const newIndividual = new Individual(reqData);
    await newIndividual.save();
    const accountId = req.userId;
    const foundAccount = await Account.findByIdAndUpdate(
      accountId,
      {
        $set: { _individual: newIndividual.id },
      },
      { returnOriginal: false }
    );
    return foundAccount;
  } catch (err) {
    next(err);
  }
};

const saveStartup = async (req, res, next) => {
  try {
    const newStartup = await new Startup(reqData);
    await newStartup.save();
    const accountId = req.userId;
    const foundAccount = await Account.findByIdAndUpdate(
      accountId,
      {
        $set: { _startup: newStartup.id },
      },
      { returnOriginal: false }
    );
    return foundAccount;
  } catch (err) {
    next(err);
  }
};

const saveIncubator = async (req, res, next) => {
  try {
    const newIncubator = await new Incubator(reqData);
    await newIncubator.save();
    const accountId = req.userId;
    const foundAccount = await Account.findByIdAndUpdate(
      accountId,
      {
        $set: { _incubator: newIncubator.id },
      },
      { returnOriginal: false }
    );
    return foundAccount;
  } catch (err) {
    next(err);
  }
};

const saveInvestor = async (req, res, next) => {
  try {
    const newInvestor = await new Investor(reqData);
    await newInvestor.save();
    const accountId = req.userId;
    const foundAccount = await Account.findByIdAndUpdate(
      accountId,
      {
        $set: { _investor: newInvestor.id },
      },
      { returnOriginal: false }
    );
    return foundAccount;
  } catch (err) {
    next(err);
  }
};

const saveCorporation = async (req, res, next) => {
  try {
    const newCorporation = await new Corporation(reqData);
    await newCorporation.save();
    const accountId = req.userId;
    const foundAccount = await Account.findByIdAndUpdate(
      accountId,
      {
        $set: { _corporation: newCorporation.id },
      },
      { returnOriginal: false }
    );
    return foundAccount;
  } catch (err) {
    next(err);
  }
};

module.exports = {
  saveIncubator,
  saveIndividual,
  saveStartup,
  saveCorporation,
  saveInvestor,
};
