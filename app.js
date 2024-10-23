const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const originalFilePath = req.file.path;
    const shrekFilePath = originalFilePath.replace(path.extname(originalFilePath), '.shrek');

    fs.copyFile(originalFilePath, shrekFilePath, (err) => {
        if (err) {
            return res.status(500).send('Error converting file to .shrek.');
        }

        const shrekFileUrl = `/${shrekFilePath}`;
        res.render('result', { shrekFileUrl });
    });
});

app.get('/download', (req, res) => {
    const file = req.query.file;
    res.download(file);
});

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
