const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "blood_bank_db"
});

db.connect(err => {
    if (err) {
        console.log("XAMPP MySQL connect hoyni! XAMPP chalu ache toh?");
    } else {
        console.log("Database Connected Successfully!");
    }
});

// --- DONOR API ---
app.post('/register-donor', (req, res) => {
    const { donor_name, blood_type, contact_no, dob, gender } = req.body;
    const sql = "INSERT INTO donors (donor_name, blood_type, contact_number, dob, gender) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [donor_name, blood_type, contact_no, dob, gender], (err, result) => {
        if (err) return res.status(500).send(err.message);
        
        // Donor register hole inventory-te oi group-er 1 bag auto bere jabe
        const updateStock = "UPDATE inventory SET bag_count = bag_count + 1 WHERE blood_group = ?";
        db.query(updateStock, [blood_type], (err2) => {
            if (err2) console.log("Inventory update failed:", err2.message);
            res.send("Donor Registered and Inventory Updated!");
        });
    });
});

// --- HOSPITAL API ---
app.post('/add-hospital', (req, res) => {
    const { hospital_name, address, contact_number } = req.body;
    const sql = "INSERT INTO hospital (hospital_name, address, contact_number) VALUES (?, ?, ?)";
    db.query(sql, [hospital_name, address, contact_number], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.send("Hospital Added Successfully!");
    });
});

// --- INVENTORY API ---
app.get('/get-inventory', (req, res) => {
    const sql = "SELECT * FROM inventory";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Inventory error:", err.message);
            return res.status(500).send(err.message);
        }
        res.json(result);
    });
});

// --- DONOR SEARCH API ---
app.get('/search-donor', (req, res) => {
    const bloodType = req.query.blood_type;
    const sql = "SELECT * FROM donors WHERE blood_type = ?";
    db.query(sql, [bloodType], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Server Start
app.listen(5000, () => console.log("Server running on http://localhost:5000"));