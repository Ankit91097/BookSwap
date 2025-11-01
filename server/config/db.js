const mongoose = require('mongoose');

const connectDB = async () => {
  let retries = 5;
  
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      
      console.log(`MongoDB Connected Successfully`);
      return conn;
    } catch (error) {
      retries -= 1;
      console.error(`MongoDB Connection Error: ${error.message}`);
      
      if (retries === 0) {
        console.error('Failed to connect to MongoDB after 5 attempts');
        process.exit(1);
      }
      
      console.log(`Retrying connection... (${retries} attempts remaining)`);
      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

module.exports = connectDB;
