const { User, Organization, Announcement, Payment, Message, SupportTicket, HOAInfo } = require('../models');

const getDashboardData = async (req, res) => {
    try {
        const { organizationId } = req.user;

        if (!organizationId) {
            return res.status(400).json({ error: 'User is not associated with an organization.' });
        }

        // Fetch organization details
        const organization = await Organization.findByPk(organizationId);

        // Fetch users (residents and admins)
        const users = await User.findAll({
            where: { organizationId },
            attributes: ['id', 'fullName', 'email', 'role', 'status'], // Minimal fields
        });

        // Fetch recent announcements
        const announcements = await Announcement.findAll({
            where: { organizationId },
            order: [['createdAt', 'DESC']],
            limit: 5,
        });

        // Fetch payment statistics
        const [pendingPayments, overduePayments] = await Promise.all([
            Payment.count({ where: { organizationId, status: 'pending' } }),
            Payment.count({ where: { organizationId, status: 'overdue' } }),
        ]);

        // Fetch recent messages
        const messages = await Message.findAll({
            where: { recipientId: req.user.id },
            include: [{ model: User, as: 'messageSender', attributes: ['fullName', 'email'] }],
            order: [['createdAt', 'DESC']],
            limit: 5,
        });

        // Fetch open support tickets
        const supportTickets = await SupportTicket.findAll({
            where: { organizationId, status: 'open' },
            limit: 5,
        });

        // Fetch HOA info
        const hoaInfo = await HOAInfo.findAll({
            where: { organizationId },
        });

        // Respond with aggregated data
        res.status(200).json({
            organization,
            users,
            announcements,
            payments: { pending: pendingPayments, overdue: overduePayments },
            messages,
            supportTickets,
            hoaInfo,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data.' });
    }
};

module.exports = { getDashboardData };
