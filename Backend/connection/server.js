import connectDB from './db.js';
import app from '../index.js';

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(`Error during connection to the DB: ${err.message}`);
  });
