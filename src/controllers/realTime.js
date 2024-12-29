// controllers/realTime.js

const notifyReservationUpdate = (io, reservation) => {
    io.emit('reservation:update', reservation); // Broadcast to all clients
};

module.exports = {
    notifyReservationUpdate,
};
