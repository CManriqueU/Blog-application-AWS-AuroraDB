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
  // Parse the request body to get the commentId and new commentText
  // const parsedBody = JSON.parse(event.body);
  const body = JSON.parse(event.body); 
  console.log("****&&&**",event);
  console.log("!!!!!!!",body.commentText);

  // Ensure both commentId and commentText are provided
  if (!event.pathParameters.id || !body.commentText) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Both commentId and commentText are required' })
    };
  }

  const conn = await connectToDatabase();

  try {
    // Update the comment text in the database for the specified commentId
    const [result] = await conn.execute(
      'UPDATE comments SET commentText = ? WHERE commentId = ?',
      [body.commentText, event.pathParameters.id]
    );

    // Check if any rows were affected (i.e., if the comment was found and updated)
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
      body: JSON.stringify({ message: 'Comment updated successfully' })
    };
  } catch (error) {
    console.error('Error updating item:', error);

    // Return error response
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Error updating item', error: error.message })
    };
  }
};
