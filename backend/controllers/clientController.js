import Client from '../models/Client.js';
import Lead from '../models/Lead.js';
import mongoose from 'mongoose';

export const getAllClients = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    
    // Sort by last activity or name
    const clients = await Client.find({ companyId }).sort({ lastActivity: -1 });

    res.status(200).json({
      status: 'success',
      data: { clients }
    });
  } catch (err) {
    next(err);
  }
};

export const getClientProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const client = await Client.findOne({ _id: id, companyId });
    if (!client) {
      return res.status(404).json({ status: 'fail', message: 'Client not found' });
    }

    // Fetch all leads associated with this client
    const leads = await Lead.find({ clientId: id, companyId }).sort({ date: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        client,
        leads
      }
    });
  } catch (err) {
    next(err);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const client = await Client.findOneAndUpdate(
      { _id: id, companyId: req.user.companyId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ status: 'fail', message: 'Client not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { client }
    });
  } catch (err) {
    next(err);
  }
};

export const syncClients = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const leads = await Lead.find({ companyId, clientId: { $exists: false } });
    
    let created = 0;
    let linked = 0;

    for (const lead of leads) {
      if (!lead.phone) continue;

      let client = await Client.findOne({ phone: lead.phone, companyId });
      if (!client) {
        client = await Client.create({
          name: lead.name,
          phone: lead.phone,
          companyId
        });
        created++;
      } else {
        linked++;
      }

      lead.clientId = client._id;
      await lead.save();
      
      // Recalculate for each client once
      await recalculateClientStats(client._id);
    }

    res.status(200).json({
      status: 'success',
      message: `Sync complete. Created ${created} clients and linked ${linked} leads.`
    });
  } catch (err) {
    next(err);
  }
};

export const recalculateClientStats = async (clientId) => {
  const stats = await Lead.aggregate([
    { $match: { clientId: new mongoose.Types.ObjectId(clientId) } },
    {
      $group: {
        _id: null,
        totalWorks: { $sum: 1 },
        totalRevenue: { 
          $sum: { 
            $cond: [
              { $eq: ['$status', 'converted'] }, 
              { $cond: [{ $gt: ['$totalAmount', 0] }, '$totalAmount', '$budget'] }, 
              0
            ] 
          } 
        }
      }
    }
  ]);

  if (stats.length > 0) {
    await Client.findByIdAndUpdate(clientId, {
      totalWorks: stats[0].totalWorks,
      totalRevenue: stats[0].totalRevenue,
      lastActivity: new Date()
    });
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const client = await Client.findOneAndDelete({ _id: id, companyId });

    if (!client) {
      return res.status(404).json({ status: 'fail', message: 'Client not found' });
    }

    // Unlink leads from this client (optional but safer than orphaned IDs)
    await Lead.updateMany({ clientId: id, companyId }, { $unset: { clientId: 1 } });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};
