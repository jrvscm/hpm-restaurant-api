const User = require('./User');
const Organization = require('./Organization');
const Message = require('./Message');
const Announcement = require('./Announcement');
const SupportTicket = require('./SupportTicket');
const Payment = require('./Payment');
const HOAInfo = require('./HOAInfo');

// Define associations
Organization.hasMany(User, { foreignKey: 'organizationId', as: 'users' });
User.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(Announcement, { foreignKey: 'organizationId', as: 'announcements' });
Announcement.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(HOAInfo, { foreignKey: 'organizationId', as: 'hoaInfo' });
HOAInfo.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'recipientId', as: 'receivedMessages' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'messageSender' });
Message.belongsTo(User, { foreignKey: 'recipientId', as: 'messageRecipient' });

User.hasMany(SupportTicket, { foreignKey: 'userId', as: 'supportTickets' });
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });

// Export all models
module.exports = {
    User,
    Organization,
    Message,
    Announcement,
    SupportTicket,
    Payment,
    HOAInfo,
};
