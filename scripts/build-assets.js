const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        if (fs.lstatSync(fromPath).isFile()) {
            fs.copyFileSync(fromPath, toPath);
        } else {
            copyFolderSync(fromPath, toPath);
        }
    });
}

function copyAssets() {
    const assets = [
        'public',
        'private_key.pem',
        'ca-cert.pem',
        'package.json'
    ];

    const distPath = path.join(__dirname, '..', 'dist');
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
    }

    for (const asset of assets) {
        const src = path.join(__dirname, '..', asset);
        const dest = path.join(__dirname, '..', 'dist', asset);

        if (fs.existsSync(src)) {
            if (fs.lstatSync(src).isDirectory()) {
                copyFolderSync(src, dest);
            } else {
                fs.copyFileSync(src, dest);
            }
            console.log(`Copied ${asset} to dist/`);
        } else {
            console.warn(`Warning: ${asset} not found, skipping.`);
        }
    }
}

try {
    copyAssets();
    console.log('Assets copy completed successfully.');
} catch (err) {
    console.error('Error copying assets:', err);
    process.exit(1);
}
