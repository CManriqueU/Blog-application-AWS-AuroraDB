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
  // Parse the request body to get the commentId
  console.log("(*(*(*",event);
  // const data = JSON.parse(event);

  // Ensure commentId is provided
  if (!event.pathParameters.id) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'commentId is required' })
    };
  }

  const conn = await connectToDatabase();

  try {
    // Delete the comment with the specified commentId
    const [result] = await conn.execute(
      'DELETE FROM comments WHERE commentId = ?',
      [event.pathParameters.id]
    );

    // Check if any rows were affected (i.e., if the comment was found and deleted)
    if (result.affectedRows === 0) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Comment not found' })
      };
    }

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Comment deleted successfully' })
    };
  } catch (error) {
    console.error('Error deleting item:', error);

    // Return error response
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Error deleting item', error: error.message })
    };
  }
};
