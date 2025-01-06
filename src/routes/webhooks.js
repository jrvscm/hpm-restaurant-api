const express = require('express');
const { UserPoints, Payment, User, PointsHistory } = require('../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    let event;
    try {
        // Verify the webhook signature
        const signature = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;

            try {
                // Extract rewards number from the description
                const description = paymentIntent.description || process.env.NODE_ENV === 'development' ? '100003' : '';
                const rewardsNumber = description.match(/\b\d+\b/)?.[0]; // Extract first standalone number

                if (!rewardsNumber) {
                    console.warn('No rewards number found in the description.');
                    return res.status(400).send('No rewards number provided in description.');
                }

                console.log(`Rewards number found: ${rewardsNumber}`);

                // Process rewards logic
                await handleRewardsLogic(rewardsNumber, paymentIntent.amount, paymentIntent.id);

                res.status(200).send({ received: true });
            } catch (err) {
                console.error('Failed to process rewards:', err.message);
                res.status(500).send('Internal Server Error');
            }
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
            res.status(200).send({ received: true });
            break;
    }
});

async function handleRewardsLogic(rewardsNumber, amount, paymentIntentId) {
    const user = await User.findOne({ where: { rewardsNumber } });
    if (!user) {
        throw new Error(`User with rewards number ${rewardsNumber} not found.`);
    }

    const poinstPerDollar = .1;
    const pointsEarned = Math.floor((amount / 100) * poinstPerDollar); 
    console.log(`Adding ${pointsEarned} points to user ${user.id}`);

    // Update the user's points
    let loyaltyRecord = await UserPoints.findOne({ where: { userId: user.id } });
    if (!loyaltyRecord) {
        throw new Error(`Loyalty record not found for user ${user.id}`);
    }

    loyaltyRecord.totalPoints += pointsEarned;
    await loyaltyRecord.save();

    // Record the payment
    await Payment.create({
        userId: user.id,
        organizationId: loyaltyRecord.organizationId, // Assuming loyalty record holds org info
        amount: amount / 100, // Convert to dollars
        paymentIntentId,
    });

    // Add an entry to PointsHistory
    await PointsHistory.create({
        userId: user.id,
        type: 'earned',
        points: pointsEarned,
        description: `Points earned for payment intent: ${paymentIntentId}`,
    });

    console.log(`Successfully added ${pointsEarned} points for user ${user.id}`);
}

module.exports = router;
