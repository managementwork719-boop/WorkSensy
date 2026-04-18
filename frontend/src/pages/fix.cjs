const fs = require('fs');
const p = 'c:/Users/siyam/OneDrive/Desktop/Work_Managment_Website/frontend/src/pages/SalesDashboard.jsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/\\"/g, '"');
c = c.replace(/\\`/g, '`');

fs.writeFileSync(p, c, 'utf8');
