import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  website: String,
  logo: String,
  address: String,
  themeColor: {
    type: String,
    default: '#ea580c',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  smtpConfig: {
    host: String,
    port: Number,
    user: String,
    pass: {
      type: String,
      select: false,
    },
    senderName: String,
  },
});

const Company = mongoose.model('Company', companySchema);
export default Company;
