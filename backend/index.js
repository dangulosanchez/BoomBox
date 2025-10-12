const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./router/auth');
const protectedRoutes = require('./router/protected');

const app = express();

app.use(cors());
app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose
  .connect(process.env.MONGODB_URL || '')
//   .then(() => {
//     app.listen(PORT, async () =>
//       {
//         console.log(`Server listening on http://localhost:${PORT}`)
//         await initializeLongestWinStreaks();
//       }
//     );
//   })
//   .catch((error) => console.log(error.message));

//   process.on("SIGINT", () => {
//     process.exit(0);
//   });

//   server.listen(3001, () => {
//     console.log('listening on *:3001');
//   });

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

var os = require('os');

var networkInterfaces = os.networkInterfaces();

console.log(networkInterfaces);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
