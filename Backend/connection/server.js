import connectDB from './db.js';
import app from '../index.js';

const port = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
    }
}

startServer();
