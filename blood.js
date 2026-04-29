// --- REGISTRATION LOGIC (Donor & Hospital) ---

// Donor Registration Form
const donorForm = document.getElementById('donorForm');
if (donorForm) {
    donorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            donor_name: document.getElementById('name').value,
            blood_type: document.getElementById('bloodGroup').value,
            contact_no: document.getElementById('phone').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value
        };
        sendData('http://localhost:5000/register-donor', data);
    });
}

// Hospital Registration Form
const hospitalForm = document.getElementById('hospitalForm');
if (hospitalForm) {
    hospitalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            hospital_name: document.getElementById('hName').value,
            address: document.getElementById('hAddress').value,
            contact_number: document.getElementById('hContact').value
        };
        sendData('http://localhost:5000/add-hospital', data);
    });
}

// --- DONOR SEARCH LOGIC ---

function searchDonor() {
    const bg = document.getElementById('searchBloodGroup').value;
    const resultsDiv = document.getElementById('searchResults');

    if (!bg) {
        alert("Please select a blood group first!");
        return;
    }

    fetch(`http://localhost:5000/search-donor?blood_type=${encodeURIComponent(bg)}`)
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            resultsDiv.innerHTML = "<p style='color:red;'>No donors found for this group.</p>";
            return;
        }

        let tableHTML = `
            <table border="1" style="width:100%; margin-top:20px; border-collapse: collapse; text-align: left;">
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 10px;">Name</th>
                    <th style="padding: 10px;">Blood Group</th>
                    <th style="padding: 10px;">Contact</th>
                    <th style="padding: 10px;">Gender</th>
                </tr>
        `;

        data.forEach(donor => {
            tableHTML += `
                <tr>
                    <td style="padding: 10px;">${donor.donor_name}</td>
                    <td style="padding: 10px;">${donor.blood_type}</td>
                    <td style="padding: 10px;">${donor.contact_number}</td>
                    <td style="padding: 10px;">${donor.gender}</td>
                </tr>
            `;
        });

        tableHTML += '</table>';
        resultsDiv.innerHTML = tableHTML;
    })
    .catch(err => {
        console.error("Search Error:", err);
        alert("Server connection failed!");
    });
}

// --- ADMIN LOGIN & INVENTORY LOGIC ---

function login() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;

    // Hardcoded Admin Credentials
    if (user === "admin" && pass === "1234") {
        alert("Login Successful! Loading Blood Inventory...");
        loadInventory(); 
    } else {
        alert("Invalid Username or Password!");
    }
}

function loadInventory() {
    const inventoryDiv = document.getElementById('inventoryTable');
    
    fetch('http://localhost:5000/get-inventory')
    .then(res => res.json())
    .then(data => {
        let html = `
            <h3>Blood Bank Inventory</h3>
            <table border="1" style="width:100%; border-collapse: collapse; text-align: center; margin-top: 10px;">
                <tr style="background-color: #e74c3c; color: white;">
                    <th style="padding: 10px;">Blood Group</th>
                    <th style="padding: 10px;">Bags Available</th>
                </tr>
        `;
        
        data.forEach(item => {
            html += `
                <tr>
                    <td style="padding: 10px;">${item.blood_group}</td>
                    <td style="padding: 10px;">${item.bag_count}</td>
                </tr>
            `;
        });
        
        html += '</table>';
        inventoryDiv.innerHTML = html;
    })
    .catch(err => {
        console.error("Inventory Error:", err);
        alert("Could not load inventory!");
    });
}

// --- UTILITY FUNCTIONS ---

function sendData(url, payload) {
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        location.reload(); 
    })
    .catch(err => {
        console.error("Connection Error:", err);
        alert("Server start kora nai! Terminal e 'node server.js' likhun.");
    });
}