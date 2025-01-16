const User = require('./User');
const Organization = require('./Organization');
const Message = require('./Message');
const Announcement = require('./Announcement');
const SupportTicket = require('./SupportTicket');
const Payment = require('./Payment');
const Availability = require('./Availability');
const Reservation = require('./Reservation');
const LoyaltySettings = require('./LoyaltySettings');
const UserPoints = require('./UserPoints');
const PointsHistory = require('./PointsHistory');

// Define associations
Organization.hasMany(User, { foreignKey: 'organizationId', as: 'users' });
User.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(Announcement, { foreignKey: 'organizationId', as: 'announcements' });
Announcement.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'recipientId', as: 'receivedMessages' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'messageSender' });
Message.belongsTo(User, { foreignKey: 'recipientId', as: 'messageRecipient' });

User.hasMany(SupportTicket, { foreignKey: 'userId', as: 'supportTickets' });
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });

Organization.hasMany(Availability, { foreignKey: 'organizationId' });
Organization.hasMany(Reservation, { foreignKey: 'organizationId' });

Availability.belongsTo(Organization, { foreignKey: 'organizationId' });

Reservation.belongsTo(Organization, { foreignKey: 'organizationId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

LoyaltySettings.belongsTo(Organization, { foreignKey: 'organizationId' });
UserPoints.belongsTo(User, { foreignKey: 'userId' });
UserPoints.belongsTo(Organization, { foreignKey: 'organizationId' });
PointsHistory.belongsTo(User, { foreignKey: 'userId' });

// Export all models
module.exports = {
    User,
    Organization,
    Message,
    Announcement,
    SupportTicket,
    Payment,
    Availability,
    Reservation,
    LoyaltySettings,
    UserPoints,
    PointsHistory
};
