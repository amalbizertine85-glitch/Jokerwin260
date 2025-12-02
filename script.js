
// ====== CONFIG ======
const BIN_ID = "692eeefbae596e708f7e9e72";  
const API_KEY = "$2a$10$hCALb9EdUjLfi38M4RhCMOdm8.1y36yYtLvW0BYdZTfqjpHtlAY7S";

// ====== GET USERS ======
async function getUsers() {
    let res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { "X-Master-Key": API_KEY }
    });
    let data = await res.json();
    return data.record;
}

// ====== SAVE USERS ======
async function saveUsers(users) {
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": API_KEY
        },
        body: JSON.stringify(users)
    });
}

// ====== LOGIN ======
async function login() {
    let u = document.getElementById("username").value.trim();
    let p = document.getElementById("password").value.trim();

    let users = await getUsers();

    if (users[u] && users[u].password === p) {
        localStorage.setItem("logged", u);
        alert("Login successful");
        window.location.href = "dashboard.html";
    } else {
        alert("❌ Wrong username or password");
    }
}

// ====== REGISTER ======
async function register() {
    let u = document.getElementById("newuser").value.trim();
    let p = document.getElementById("newpass").value.trim();

    let users = await getUsers();

    if (users[u]) {
        alert("❌ Username already exists!");
        return;
    }

    users[u] = { password: p, balance: 0 };

    await saveUsers(users);
    alert("✔️ Account created!");
}
async function createNewUser() {
    let u = document.getElementById("newUser").value.trim();
    let p = document.getElementById("newPass").value.trim();

    if (!u || !p) {
        alert("Please fill all fields.");
        return;
    }

    let users = await getUsers();

    if (users[u]) {
        alert("Username already exists!");
        return;
    }

    users[u] = {
        password: p,
        balance: 0
    };

    await saveUsers(users);
    alert("Account created!");
}
