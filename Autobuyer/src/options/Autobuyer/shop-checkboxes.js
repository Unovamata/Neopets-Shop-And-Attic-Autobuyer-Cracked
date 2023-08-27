const shopData = [
    { id: 1, name: 'Food Shop' },
    { id: 14, name: 'Chocolate Factory' },
    { id: 15, name: 'Bakery' },
    { id: 16, name: 'Healthy Food' },
    { id: 18, name: 'Smoothie Store' },
    { id: 20, name: 'Tropical Food' },
    { id: 22, name: 'Grundos' },
    { id: 30, name: 'Spooky Food' },
    { id: 34, name: 'Ye Olde Coffee Shop' },
    { id: 35, name: 'Slushie Shop' },
    { id: 37, name: 'Icy Fun Snow Shop' },
    { id: 39, name: 'Faerie Food' },
    { id: 42, name: 'Tyrannian Food' },
    { id: 46, name: "Hubert's Hot Dog" },
    { id: 47, name: 'Pizzaroo' },
    { id: 49, name: 'Food of the Lost Desert' },
    { id: 56, name: 'Merifoods' },
    { id: 62, name: 'Jelly Food' },
    { id: 63, name: 'Refreshments' },
    { id: 66, name: 'Kiko Lake Treats' },
    { id: 72, name: 'Cafe Kreludor' },
    { id: 81, name: 'Brightvale Fruits' },
    { id: 90, name: 'Qasalan Delights' },
    { id: 95, name: 'Exquisite Ambrosia' },
    { id: 101, name: 'Exotic Foods' },
    { id: 105, name: 'The Crumpetmonger' },
    { id: 112, name: 'Molten Morsels' },
    { id: 113, name: 'Moltaran Petpets' },
    { id: 114, name: 'Moltaran Books' },
    { id: 116, name: 'Springy Things' },
    { id: 117, name: 'Ugga Shinies' }
];

const table = document.createElement('table');

const groups = 3; // Number of groups

const headerLabels = ['Visit', 'Name'];

// Create the caption for the table
const caption = document.createElement('caption');
caption.textContent = 'Food Shops';
table.appendChild(caption);

const headerRow = document.createElement('tr');

for (let group = 0; group < groups; group++) {
    for (const headerLabel of headerLabels) {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerLabel;
        headerRow.appendChild(headerCell);
        headerCell.classList.add(`class-${headerLabel}`);
    }
}

table.appendChild(headerRow);

const itemsPerGroup = Math.ceil(shopData.length / groups);
console.log(groups);

for (let i = 0; i < itemsPerGroup; i++) {
    const row = document.createElement('tr');

    for (let group = 0; group < groups; group++) {
        const dataIndex = i + group * itemsPerGroup;
        if (dataIndex < shopData.length) {
            // Checkbox
            const checkboxCell = document.createElement('td');
            const checkboxInput = document.createElement('input');
            checkboxInput.type = 'checkbox';
            checkboxCell.appendChild(checkboxInput);
            
            // Shop Name
            const nameCell = document.createElement('td');
            const nameSpan = document.createElement('span');
            const label = document.createElement('label');
            
            const text = document.createTextNode(shopData[dataIndex].name);
            label.appendChild(text);
            nameSpan.appendChild(label);
            nameCell.appendChild(nameSpan);
            
            row.appendChild(checkboxCell);
            row.appendChild(nameCell);
        }
    }

    table.appendChild(row);
}

const shopListContainer = document.getElementById('shop-list'); // Replace with your container ID
shopListContainer.appendChild(table);