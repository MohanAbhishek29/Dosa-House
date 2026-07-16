const fs = require('fs');
const files = ['index.html', 'menu.html', 'about.html', 'booking.html', 'account.html', 'admin.html', 'kitchen.html', 'delivery.html', 'login.html'];
files.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        if (!content.includes('styles/mobile.css')) {
            content = content.replace('<link rel="stylesheet" href="styles/ui.css">', '<link rel="stylesheet" href="styles/ui.css">\n    <link rel="stylesheet" href="styles/mobile.css">');
            fs.writeFileSync(f, content);
            console.log('Updated ' + f);
        }
    } catch (e) {
        console.log('Skipped ' + f);
    }
});
