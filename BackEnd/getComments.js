import mysql from 'mysql2/promise';

export const handler = async (event) => {
    // Database connection configuration
    const dbConfig = {
        host: 'blogdb.cluster-ro-cd4a222gwjvn.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: 'admin123',
        database: 'blog',
        port: 3306 // Default MySQL port, adjust if needed
    };

    let connection;
    try {
        // Create a connection to the database
        connection = await mysql.createConnection(dbConfig);
        // Perform the read operation (example: SELECT query)
        const [rows] = await connection.execute('SELECT * FROM comments LIMIT 10');

        // Return the results
        return {
            statusCode: 200,
            body: JSON.stringify(rows)
        };
    } catch (error) {
        console.error('Error connecting to the database or executing query:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error reading from database', error })
        };
    } finally {
        // Ensure the connection is closed
        if (connection) {
            await connection.end();
        }
    }
};
