const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema = mongoose.Schema;

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      max: 200,
    },

    mobileNumber: {
      type: Number,
      required: true,
      minlength: 10,
      maxlength: 10,
    },
    password: {
      required: true,
      type: String,
      max: 100,
    },
    profileImage: {
      type: String,
      default: "",
    },
    public_id: String,
    verified: {
      type: Boolean,
      default: false,
    },
    otpKey: {
      type: String,
      default: "",
    },
    connections: {
      type: [schema.Types.ObjectId],
    },
    requests: {
      type: [schema.Types.ObjectId],
      ref: "Request",
    },

    _individual: {
      type: schema.Types.ObjectId,
      ref: "Individual",
    },

    _mentor: {
      type: schema.Types.ObjectId,
      ref: "Mentor",
    },

    _incubator: {
      type: schema.Types.ObjectId,
      ref: "Incubator",
    },

    _startup: {
      type: schema.Types.ObjectId,
      ref: "Startup",
    },

    _investor: {
      type: schema.Types.ObjectId,
      ref: "Investor",
    },

    _corporates: {
      type: schema.Types.ObjectId,
      ref: "Corporate",
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      console.log(hashedPassword);
      this.password = hashedPassword;
      next();
    }
  } catch (err) {
    console.log(err);
  }
});

accountSchema.pre("updateOne", async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());

  try {
    if (docToUpdate.password !== this._update.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this._update.password, salt);
      this._update.password = hashedPassword;
      next();
    }
  } catch (err) {
    console.log(err);
  }
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
