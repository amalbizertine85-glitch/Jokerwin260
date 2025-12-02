/* =====================================================
   👑 Jokerwin365 Full Login System
   JSONBin connection + Register + Login + No duplicates
   ===================================================== */

//  ضع قيمك هنا
const BIN_ID = "692eeefbae596e708f7e9e72";  
const API_KEY = "$2a$10$xo7737I0Lvf2A45pzw7K..3BIsLkwG.e1/T3dmI4UEQCFOR040je.2";

const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;


/* -----------------------------------------------------
   SHA-256 تشفير كلمة المرور 
----------------------------------------------------- */
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}


/* -----------------------------------------------------
   إحضار المستخدمين من JSONBin
----------------------------------------------------- */
async function getUsers() {
    const res = await fetch(API_URL + "/latest", {
        headers: { "X-Master-Key": API_KEY }
    });

    const data = await res.json();

    if (data.record && Array.isArray(data.record.users)) {
        return data.record.users;
    } else {
        return [];
    }
}


/* -----------------------------------------------------
   حفظ المستخدمين (PUT)
----------------------------------------------------- */
async function saveUsers(users) {
    const body = {
        users: users
    };

    await fetch(API_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": API_KEY
        },
        body: JSON.stringify(body)
    });
}


/* -----------------------------------------------------
   إنشاء حساب جديد
----------------------------------------------------- */
async function register() {
    const newuser = document.getElementById("newuser").value.trim().toLowerCase();
    const newpass = document.getElementById("newpass").value.trim();

    if (!newuser || !newpass) {
        alert("❌ Please fill all fields");
        return;
    }

    const users = await getUsers();

    if (users.find(u => u.username === newuser)) {
        alert("❌ Username already exists");
        return;
    }

    const hashed = await sha256(newpass);

    users.push({
        username: newuser,
        password: hashed,
        balance: 0
    });

    await saveUsers(users);

    alert("✔ Account created successfully!");
}


/* -----------------------------------------------------
   تسجيل الدخول
----------------------------------------------------- */
async function login() {
    const user = document.getElementById("username").value.trim().toLowerCase();
    const pass = document.getElementById("password").value.trim();

    const users = await getUsers();

    const hashed = await sha256(pass);

    const found = users.find(u => u.username === user && u.password === hashed);

    if (!found) {
        alert("❌ Wrong username or password");
        return;
    }

    localStorage.setItem("joker_user", JSON.stringify(found));

    alert("✔ Login successful!");

    window.location.href = "dashboard.html";
}


/* -----------------------------------------------------
   ربط الأزرار عند تحميل الصفحة
----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    const btnRegister = document.getElementById("btnRegister");

    if (btnLogin) btnLogin.onclick = login;
    if (btnRegister) btnRegister.onclick = register;
});
