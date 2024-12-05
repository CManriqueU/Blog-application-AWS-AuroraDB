import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
    host: 'blogdb.cluster-ro-cd4a222gwjvn.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin123',
    database: 'blog',
    port: 3306 // Default MySQL port, adjust if needed
};

let connection;

// Function to connect to the database
const connectToDatabase = async () => {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig);
  }
  return connection;
};

// Lambda handler function
export const handler = async (event) => {
  const data = JSON.parse(event); // Assuming the comment text is sent in the request body
  const conn = await connectToDatabase();

  try {
    const [result] = await conn.execute(
      'INSERT INTO comments (commentId, commentText) VALUES (?, ?)', 
      [data.commentId, data.commentText]
    );
    
    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Comment added successfully', commentId: result.insertId }),
    };
  } catch (error) {
    console.error('Error inserting item:', error);
    
    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error inserting item', error: error.message }),
    };
  }
};

