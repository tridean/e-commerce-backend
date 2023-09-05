// Import required modules and dependencies
const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection'); // Import your Sequelize instance and models

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount your routes on the Express app
app.use(routes);

// Sync sequelize models to the database, then start the server
sequelize.sync({ force: false }) // Set force to false to avoid dropping tables on every sync
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
