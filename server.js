const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join( 'users.json');

app.use(express.json()); // Để xử lý JSON trong body yêu cầu



// đọc dữ liệu từ tệp JSON
function readUsersFromFile() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2));
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data).users;
}



// ghi dữ liệu vào tệp JSON
function writeUsersToFile(users) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users }, null, 2));
}



// kiểm tra ký tự đặc biệt trong username
function hasSpecialCharacters(str) {
    const regex = /[^a-zA-Z0-9]/;
    return regex.test(str);
}



app.post('/api/register', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            code: 400,
            message: 'Vui lòng cung cấp username'
        });
    }

    const users = readUsersFromFile();

    // Kiểm tra nếu username đã tồn tại
    if (users.includes(username)) {
        return res.status(400).json({
            code: 400,
            message: 'Trùng username'
        });
    }

    // Kiểm tra nếu username chứa ký tự đặc biệt
    if (hasSpecialCharacters(username)) {
        return res.status(400).json({
            code: 400,
            message: 'username chứa ký tự đặc biệt'
        });
    }

    // Thêm username mới vào danh sách và ghi vào tệp
    users.push(username);
    writeUsersToFile(users);

    return res.status(200).json({
        code: 200
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
