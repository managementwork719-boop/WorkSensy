import Lead from '../models/Lead.js';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Company from '../models/Company.js';
import * as xlsx from 'xlsx';
import { recalculateClientStats } from './clientController.js';

export const importLeads = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log('Importing leads... Total rows found:', data.length);
    if (data.length > 0) console.log('Sample Row 1:', data[0]);

    const companyId = req.user.companyId;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    let addedCount = 0;
    let skippedCount = 0;

    for (const row of data) {
      // Create a normalized row (lowercase keys and trimmed values)
      const normalizedRow = {};
      Object.keys(row).forEach(key => {
        normalizedRow[key.toLowerCase().trim()] = row[key];
      });

      const leadId = normalizedRow['id'];
      if (!leadId) {
        console.log('Skipping row - No ID found in row keys:', Object.keys(row));
        continue;
      }

      // Check if duplicate
      const existing = await Lead.findOne({ leadId, companyId });
      if (existing) {
        skippedCount++;
        continue;
      }

      const getVal = (keys) => {
        for (const k of keys) {
           if (normalizedRow[k]) return normalizedRow[k];
        }
        return '';
      };

      const phone = getVal(['phone', 'mobile', 'contact']);
      let clientId = null;

      if (phone) {
        let client = await Client.findOne({ phone, companyId });
        if (!client) {
          client = await Client.create({
            name: getVal(['name', 'full name', 'fullname']) || 'Unknown',
            phone,
            companyId
          });
        }
        clientId = client._id;
      }

      await Lead.create({
        leadId,
        name: getVal(['name', 'full name', 'fullname']) || 'Unknown',
        phone,
        source: getVal(['source', 'origin']),
        campaign: getVal(['campaign', 'ads']),
        requirement: getVal(['requirement', 'needs', 'service']),
        budget: parseFloat(getVal(['budget', 'cost', 'price']) || 0),
        location: getVal(['location', 'city', 'address']),
        companyId,
        month: currentMonth,
        status: 'origin',
        clientId
      });
      addedCount++;
    }

    res.status(200).json({
      status: 'success',
      message: `Successfully processed ${data.length} rows. Added: ${addedCount}, Skipped: ${skippedCount}`,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const getSalesDashboard = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear().toString();

    // Fetch company registration year
    const company = await Company.findById(companyId).select('createdAt');
    const registrationYear = company?.createdAt ? new Date(company.createdAt).getFullYear() : 2026;
    
    // Base match query with year filter (month starting with the year string)
    let matchQuery = { 
      companyId,
      month: { $regex: `^${currentYear}` }
    };
    
    // If user is sales-team, they see their own performance data + all origin (unassigned) leads
    if (req.user.role === 'sales-team') {
      matchQuery.$or = [
        { status: 'origin' },
        { convertedBy: req.user.name }
      ];
    }

    // Aggregate by month (Monthly Breakdown)
    const monthlyData = await Lead.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$month',
          revenue: { 
            $sum: { 
              $cond: [
                { $and: [{ $eq: ['$status', 'converted'] }, { $eq: ['$convertedBy', req.user.name] }] }, 
                { $cond: [{ $gt: ['$totalAmount', 0] }, '$totalAmount', '$budget'] }, 
                0
              ] 
            } 
          },
          received: { 
            $sum: { $cond: [{ $and: [{ $eq: ['$status', 'converted'] }, { $eq: ['$convertedBy', req.user.name] }] }, '$advanceAmount', 0] } 
          },
          leads: { 
            $sum: { $cond: [{ $eq: ['$convertedBy', req.user.name] }, 1, 0] } 
          },
          available: { 
            $sum: { $cond: [{ $eq: ['$status', 'origin'] }, 1, 0] } 
          },
          converted: { 
            $sum: { $cond: [{ $and: [{ $eq: ['$status', 'converted'] }, { $eq: ['$convertedBy', req.user.name] }] }, 1, 0] } 
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Total Stats (Personal context)
    let totalRevenue = 0;
    let totalReceived = 0;
    let totalLeads = 0;
    let totalConverted = 0;

    monthlyData.forEach(m => {
      totalRevenue += (m.revenue || 0);
      totalReceived += (m.received || 0);
      totalLeads += (m.leads || 0);
      totalConverted += (m.converted || 0);
    });

    res.status(200).json({
      status: 'success',
      data: {
        total: {
          revenue: totalRevenue,
          received: totalReceived,
          leads: totalLeads,
          converted: totalConverted,
          conversionRate: totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : 0
        },
        months: monthlyData,
        registrationYear
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMyLeads = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const name = req.user.name;

    const followUp = await Lead.find({ 
      companyId, 
      convertedBy: name,
      status: 'follow-up' 
    }).sort({ nextFollowUp: 1 }).lean();

    const converted = await Lead.find({ 
      companyId, 
      convertedBy: name,
      status: 'converted' 
    }).sort({ updatedAt: -1 }).lean();

    res.status(200).json({
      status: 'success',
      data: { followUp, converted }
    });
  } catch (err) {
    next(err);
  }
};

export const getMonthlyOverview = async (req, res, next) => {
  try {
    const { month } = req.query; // format YYYY-MM
    const companyId = req.user.companyId;

    let query = { month, companyId };

    // Sales team sees all Origin leads + leads handled by them
    if (req.user.role === 'sales-team') {
      query = {
        month,
        companyId,
        $or: [
          { status: 'origin' },
          { convertedBy: req.user.name }
        ]
      };
    }

    const leads = await Lead.find(query).lean();

    const stats = {
      revenue: leads.reduce((acc, l) => l.status === 'converted' ? acc + (l.totalAmount || l.budget || 0) : acc, 0),
      received: leads.reduce((acc, l) => l.status === 'converted' ? acc + (l.advanceAmount || 0) : acc, 0),
      count: leads.length,
      converted: leads.filter(l => l.status === 'converted').length,
    };

    // Calculate profit as 60% of revenue (as per visual inference)
    stats.profit = stats.revenue * 0.6;

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        leads
      }
    });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Calculate pending amount if total and advance are present
    if (updateData.totalAmount !== undefined || updateData.advanceAmount !== undefined) {
      const lead = await Lead.findById(id);
      const total = updateData.totalAmount !== undefined ? updateData.totalAmount : lead.totalAmount;
      const advance = updateData.advanceAmount !== undefined ? updateData.advanceAmount : lead.advanceAmount;
      updateData.pendingAmount = total - advance;
    }

    // Auto-set next follow-up date to tomorrow if switching to follow-up and date is empty
    if (updateData.status === 'follow-up') {
      const lead = await Lead.findById(id);
      if (!lead.nextFollowUp && !updateData.nextFollowUp) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0); // Default to 9:00 AM
        updateData.nextFollowUp = tomorrow;
      }
    }

    const leadBefore = await Lead.findById(id);
    
    // Check if status is becoming converted
    if (updateData.status === 'converted' && leadBefore.status !== 'converted' && !leadBefore.clientId && leadBefore.phone) {
      let client = await Client.findOne({ phone: leadBefore.phone, companyId: req.user.companyId });
      if (!client) {
        client = await Client.create({
          name: leadBefore.name,
          phone: leadBefore.phone,
          companyId: req.user.companyId
        });
      }
      updateData.clientId = client._id;
    }

    const lead = await Lead.findOneAndUpdate(
      { _id: id, companyId: req.user.companyId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ status: 'fail', message: 'Lead not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { lead }
    });
  } catch (err) {
    next(err);
  }
};
export const createLead = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const { leadId, name, phone, source, campaign, requirement, budget, location, month } = req.body;
    
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const initialStatus = req.body.status || 'origin';

    // Check if duplicate
    if (leadId) {
      const existing = await Lead.findOne({ leadId, companyId });
      if (existing) {
        return res.status(400).json({ status: 'fail', message: 'Lead ID already exists' });
      }
    }

    let clientId = null;
    // ONLY create client if status is converted
    if (phone && initialStatus === 'converted') {
      let client = await Client.findOne({ phone, companyId });
      if (!client) {
        client = await Client.create({
          name,
          phone,
          companyId
        });
      }
      clientId = client._id;
    }

    const lead = await Lead.create({
      ...req.body,
      leadId: leadId || `ML-${Math.floor(Math.random() * 900000 + 100000)}`,
      companyId,
      month: targetMonth,
      status: initialStatus,
      clientId
    });

    res.status(201).json({
      status: 'success',
      data: { lead }
    });
  } catch (err) {
    next(err);
  }
};

export const getTeamStats = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    // Fetch all sales team members
    const salesTeam = await User.find({ companyId, role: 'sales-team' }).select('name email profilePic');

    // Fetch aggregated stats for these users
    // 'convertedBy' holds the user's name
    const teamNames = salesTeam.map(u => u.name);

    const stats = await Lead.aggregate([
      { $match: { companyId, convertedBy: { $in: teamNames } } },
      {
        $group: {
          _id: '$convertedBy',
          totalRevenue: { 
            $sum: { 
              $cond: [
                { $eq: ['$status', 'converted'] }, 
                { $cond: [{ $gt: ['$totalAmount', 0] }, '$totalAmount', '$budget'] }, 
                0
              ] 
            } 
          },
          totalReceived: { 
            $sum: { $cond: [{ $eq: ['$status', 'converted'] }, '$advanceAmount', 0] } 
          },
          totalLeads: { $sum: 1 },
          convertedCount: { 
            $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } 
          }
        }
      }
    ]);

    // Map stats back to users
    const teamStats = salesTeam.map(user => {
      const userStat = stats.find(s => s._id === user.name) || { totalRevenue: 0, totalLeads: 0, convertedCount: 0 };
      const conversionRate = userStat.totalLeads > 0 
        ? ((userStat.convertedCount / userStat.totalLeads) * 100).toFixed(1) 
        : 0;

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        stats: {
          totalRevenue: userStat.totalRevenue,
          totalReceived: userStat.totalReceived || 0,
          totalLeads: userStat.totalLeads,
          converted: userStat.convertedCount,
          conversionRate
        }
      };
    });

    res.status(200).json({
      status: 'success',
      data: { teamStats }
    });
  } catch (err) {
    next(err);
  }
};

export const getMemberLeads = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const { name } = req.params;

    const followUp = await Lead.find({ 
      companyId, 
      convertedBy: name,
      status: 'follow-up' 
    }).sort({ nextFollowUp: 1 });

    const converted = await Lead.find({ 
      companyId, 
      convertedBy: name,
      status: 'converted' 
    }).sort({ updatedAt: -1 }).limit(10); // Limit trailing data for UI perf

    // Aggregation for monthly/yearly stats
    const monthlyStats = await Lead.aggregate([
      { $match: { companyId, convertedBy: name, status: 'converted' } },
      {
        $group: {
          _id: '$month', // format YYYY-MM
          revenue: { 
            $sum: { $cond: [{ $gt: ['$totalAmount', 0] }, '$totalAmount', '$budget'] } 
          },
          received: { $sum: '$advanceAmount' },
          converted: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: { followUp, converted, monthlyStats }
    });
  } catch (err) {
    next(err);
  }
};

export const addLeadNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const author = req.user.name;

    const lead = await Lead.findOneAndUpdate(
      { _id: id, companyId: req.user.companyId },
      { 
        $push: { 
          conversationLogs: { 
            note, 
            author, 
            timestamp: new Date() 
          } 
        } 
      },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ status: 'fail', message: 'Lead not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { logs: lead.conversationLogs }
    });
  } catch (err) {
    next(err);
  }
};

export const addLeadPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, method, note, date } = req.body;
    const receivedBy = req.user.name;

    const lead = await Lead.findOne({ _id: id, companyId: req.user.companyId });
    if (!lead) {
      return res.status(404).json({ status: 'fail', message: 'Lead not found' });
    }

    // Add to history
    lead.paymentHistory.push({
      amount,
      method,
      note,
      date: date || new Date(),
      receivedBy
    });

    // Recalculate totals
    const totalPaid = lead.paymentHistory.reduce((sum, p) => sum + p.amount, 0);
    lead.advanceAmount = totalPaid;
    lead.pendingAmount = (lead.totalAmount || lead.budget || 0) - totalPaid;

    // Update status
    if (lead.pendingAmount <= 0) {
      lead.paymentStatus = 'received';
    } else {
      lead.paymentStatus = 'partial';
    }

    await lead.save();

    // Update client stats if linked
    if (lead.clientId) {
      await recalculateClientStats(lead.clientId);
    }

    res.status(200).json({
      status: 'success',
      data: { 
        paymentHistory: lead.paymentHistory,
        advanceAmount: lead.advanceAmount,
        pendingAmount: lead.pendingAmount,
        paymentStatus: lead.paymentStatus
      }
    });
  } catch (err) {
    next(err);
  }
};
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};
