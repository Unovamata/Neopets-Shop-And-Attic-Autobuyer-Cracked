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
    { id: 115, name: 'Nothing' },
    { id: 116, name: 'Springy Things' },
    { id: 117, name: 'Ugga Shinies' }
];

const shopListContainer = document.getElementById('shop-list'); // Replace with your container ID
const table = document.createElement('table');

for (let i = 0; i < shopData.length; i += 3) {
    const row = document.createElement('tr');

    for (let j = 0; j < 3; j++) {
        const dataIndex = i + j;
        if (dataIndex < shopData.length) {
            const cell = document.createElement('td');
            
            const idSpan = document.createElement('span');
            idSpan.textContent = shopData[dataIndex].id;
            
            const nameSpan = document.createElement('span');
            const label = document.createElement('label');
            label.classList.add('shop-toggle');
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.classList.add('shop-checkbox');
            
            const text = document.createTextNode(shopData[dataIndex].name);
            label.appendChild(input);
            label.appendChild(text);
            nameSpan.appendChild(label);
            
            cell.appendChild(idSpan);
            cell.appendChild(nameSpan);
            row.appendChild(cell);
        }
    }

    table.appendChild(row);
}

shopListContainer.appendChild(table);