const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./modules/auth/auth.route');
const userRoutes = require('./modules/users/user.route');
const classRoutes = require('./modules/classes/class.route');
const bookingRoutes = require('./modules/bookings/booking.route');
const favoriteRoutes = require('./modules/favorites/favorite.route');
const applicationRoutes = require('./modules/trainerApplications/application.route');
const forumRoutes = require('./modules/forum/forum.route');
const paymentRoutes = require('./modules/payments/payment.route');
const statsRoutes = require('./modules/stats/stats.route');

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('FlexForge server is running ✅');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/trainer-applications', applicationRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stats', statsRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;