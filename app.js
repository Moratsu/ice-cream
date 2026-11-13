import mysql2 from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

//Import the express module
import express from 'express';

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
}).promise();

//Create an instance of an Express application
const app = express();

//Define the port number where our server will listen
const PORT = 3001;

const orders = [];

app.use(express.static('public'));

//Add "middleware" to allow the app to parse form data
//Access form data through req.body
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Create a route to test the database
app.get('/db-test', async(req, res) => {
    try {
        const [orders] = await 
            pool.query('SELECT * FROM orders');
        res.send(orders);
    } catch(err) {
        console.error('Database error: ', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

//Define a default "route" ('/')
//req: contains information about the incoming request
//res: allows us to send back a response to the client
app.get('/', (req, res) => {
    //res.send('Welcome to My Ice Cream Shop!');
    res.render('home');
});

// Add 'async' right before (req, res)
app.post('/submit-order', async (req, res) => {
    try {
        const order = req.body;
        console.log('New Order submitted:', order);

        order.toppings = Array.isArray(order.toppings) ? 
        order.toppings.join(", ") : "";

        const sql = 'INSERT INTO orders (name, email, flavor, toppings, method, comment) VALUES (?, ?, ?, ?, ?, ?)';

        const params = [
            order.name,
            order.email,
            order.flavor,
            order.toppings,
            order.method,
            order.comment
        ];

        const [result] = await pool.execute(sql, params);

        order.id = result.insertId;
        console.log('Order saved with ID: ', order.id);

        res.render('confirm', { order });

    } catch (err) {
        console.error('Error saving order :', err);
        res.status(500).send('Sorry there was an error processing your order. Please try again.');
    }
});



//Add an admin route
app.get('/admin', (req, res) => {
    res.render('admin', {orders});
});

//Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at
        http://localhost:${PORT}`);
});