document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration and Element References ---

    const BUILDING_FEE = 150.00; // Fixed building and testing fee

    // Dynamically gather component select and display elements
    const componentSelects = {}; // Stores references to <select> elements
    const selectedComponentDisplays = {}; // Stores references to <div> where selection is shown

    document.querySelectorAll('.component-select').forEach(selectElement => {
        const category = selectElement.id.split('-')[0];
        if (category) {
            componentSelects[category] = selectElement;
            selectedComponentDisplays[category] = document.getElementById(`${category}-selected`);
            if (!selectedComponentDisplays[category]) {
                console.warn(`WARNING: Display element #${category}-selected not found. Check HTML.`);
            }
        } else {
            console.warn(`WARNING: Could not derive category from select element ID: ${selectElement.id}.`);
        }
    });

    // Other key DOM elements
    const totalPriceDisplay = document.getElementById('total-price');
    const compatibilityStatusDiv = document.getElementById('compatibility-status');
    const buildSummaryList = document.getElementById('build-list'); // Right-side summary
    const submitBuildBtn = document.getElementById('submit-build-btn'); // Main "Complete Build" button

    // Modal elements (keeping these for existing modal functionality, but Formspree submission is separate)
    const buildSummaryModal = document.getElementById('buildSummaryModal');
    const closeButton = buildSummaryModal?.querySelector('.close-button'); // Optional chaining for safety
    const buildSpecsDiv = document.getElementById('buildSpecs');
    const copyBuildBtn = document.getElementById('copyBuildBtn');
    const emailBuildBtn = document.getElementById('emailBuildBtn');

    // Hidden form fields for submission (e.g., to Formspree)
    const hiddenFormFields = {
        cpu: document.getElementById('hidden-cpu'),
        motherboard: document.getElementById('hidden-motherboard'),
        ram: document.getElementById('hidden-ram'),
        gpu: document.getElementById('hidden-gpu'),
        storage: document.getElementById('hidden-storage'),
        psu: document.getElementById('hidden-psu'),
        case: document.getElementById('hidden-case'),
        cooler: document.getElementById('hidden-cooler'),
        totalPrice: document.getElementById('hidden-total-price'),
        compatibilityStatus: document.getElementById('hidden-compatibility-status') // Ensure this is in your HTML
    };

    // --- Component Data (Expanded with ~20 parts per category) ---
    const componentsData = {
        cpu: [
            { id: 'cpu-1', name: 'Intel Core i3-14100F', price: 120, socket: 'LGA1700', tdp: 58 },
            { id: 'cpu-2', name: 'Intel Core i5-14400', price: 200, socket: 'LGA1700', tdp: 65 },
            { id: 'cpu-3', name: 'Intel Core i5-14600K', price: 300, socket: 'LGA1700', tdp: 125 },
            { id: 'cpu-4', name: 'Intel Core i7-14700K', price: 400, socket: 'LGA1700', tdp: 125 },
            { id: 'cpu-5', name: 'Intel Core i9-14900K', price: 600, socket: 'LGA1700', tdp: 125 },
            { id: 'cpu-6', name: 'Intel Core i5-15400', price: 230, socket: 'LGA1851', tdp: 65 }, // Hypothetical 15th gen
            { id: 'cpu-7', name: 'Intel Core i7-15700K', price: 450, socket: 'LGA1851', tdp: 125 },
            { id: 'cpu-8', name: 'Intel Core i9-15900K', price: 680, socket: 'LGA1851', tdp: 125 },
            { id: 'cpu-9', name: 'AMD Ryzen 5 7600', price: 220, socket: 'AM5', tdp: 65 },
            { id: 'cpu-10', name: 'AMD Ryzen 5 7600X', price: 250, socket: 'AM5', tdp: 105 },
            { id: 'cpu-11', name: 'AMD Ryzen 7 7700X', price: 300, socket: 'AM5', tdp: 105 },
            { id: 'cpu-12', name: 'AMD Ryzen 7 7800X3D', price: 350, socket: 'AM5', tdp: 120 },
            { id: 'cpu-13', name: 'AMD Ryzen 9 7900X', price: 400, socket: 'AM5', tdp: 170 },
            { id: 'cpu-14', name: 'AMD Ryzen 9 7950X3D', price: 650, socket: 'AM5', tdp: 170 },
            { id: 'cpu-15', name: 'AMD Ryzen 5 9600X', price: 280, socket: 'AM5', tdp: 105 }, // Hypothetical 9000 series
            { id: 'cpu-16', name: 'AMD Ryzen 7 9700X', price: 380, socket: 'AM5', tdp: 105 },
            { id: 'cpu-17', name: 'AMD Ryzen 7 9800X3D', price: 450, socket: 'AM5', tdp: 120 },
            { id: 'cpu-18', name: 'AMD Ryzen 9 9900X', price: 550, socket: 'AM5', tdp: 170 },
            { id: 'cpu-19', name: 'AMD Ryzen 9 9950X3D', price: 750, socket: 'AM5', tdp: 170 },
            { id: 'cpu-20', name: 'Intel Core Ultra 9 285K', price: 800, socket: 'LGA1851', tdp: 150 } // More hypothetical high-end
        ],
        gpu: [
            { id: 'gpu-1', name: 'NVIDIA RTX 3050', price: 200, power: 130, length: 200 },
            { id: 'gpu-2', name: 'NVIDIA RTX 4060', price: 300, power: 115, length: 200 },
            { id: 'gpu-3', name: 'NVIDIA RTX 4060 Ti 8GB', price: 400, power: 160, length: 250 },
            { id: 'gpu-4', name: 'NVIDIA RTX 4070', price: 500, power: 200, length: 240 },
            { id: 'gpu-5', name: 'NVIDIA RTX 4070 Super', price: 600, power: 220, length: 240 },
            { id: 'gpu-6', name: 'NVIDIA RTX 4070 Ti Super', price: 750, power: 285, length: 300 },
            { id: 'gpu-7', name: 'NVIDIA RTX 4080 Super', price: 1000, power: 320, length: 310 },
            { id: 'gpu-8', name: 'NVIDIA RTX 4090', price: 1800, power: 450, length: 340 },
            { id: 'gpu-9', name: 'NVIDIA RTX 5070 (Hypothetical)', price: 700, power: 250, length: 260 },
            { id: 'gpu-10', name: 'NVIDIA RTX 5080 (Hypothetical)', price: 1300, power: 350, length: 320 },
            { id: 'gpu-11', name: 'AMD RX 6600', price: 180, power: 132, length: 200 },
            { id: 'gpu-12', name: 'AMD RX 7600', price: 250, power: 165, length: 210 },
            { id: 'gpu-13', name: 'AMD RX 7700 XT', price: 400, power: 245, length: 280 },
            { id: 'gpu-14', name: 'AMD RX 7800 XT', price: 500, power: 263, length: 267 },
            { id: 'gpu-15', name: 'AMD RX 7900 XT', price: 700, power: 300, length: 276 },
            { id: 'gpu-16', name: 'AMD RX 7900 XTX', price: 900, power: 355, length: 287 },
            { id: 'gpu-17', name: 'Intel Arc A750', price: 220, power: 225, length: 270 },
            { id: 'gpu-18', name: 'Intel Arc A770 16GB', price: 280, power: 225, length: 280 },
            { id: 'gpu-19', name: 'AMD RX 8700 XT (Hypothetical)', price: 550, power: 280, length: 290 },
            { id: 'gpu-20', name: 'NVIDIA RTX 5090 (Hypothetical)', price: 2500, power: 500, length: 360 }
        ],
        motherboard: [
            { id: 'mobo-1', name: 'Gigabyte H610M H', price: 80, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'mATX' },
            { id: 'mobo-2', name: 'ASUS Prime B760M-A', price: 130, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'mATX' },
            { id: 'mobo-3', name: 'MSI PRO B760-P WiFi', price: 160, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX' },
            { id: 'mobo-4', name: 'Gigabyte Z790 UD AC', price: 200, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX' },
            { id: 'mobo-5', name: 'ASUS ROG Strix Z790-E Gaming WiFi II', price: 380, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX' },
            { id: 'mobo-6', name: 'Gigabyte B860M DS3H (Hypothetical)', price: 150, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'mATX' },
            { id: 'mobo-7', name: 'MSI MAG Z890 Tomahawk WiFi (Hypothetical)', price: 280, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX' },
            { id: 'mobo-8', name: 'ASUS ROG Maximus Z890 Hero (Hypothetical)', price: 480, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX' },
            { id: 'mobo-9', name: 'MSI PRO A620M-E', price: 90, socket: 'AM5', ramType: 'DDR5', formFactor: 'mATX' },
            { id: 'mobo-10', name: 'Gigabyte B650M DS3H', price: 140, socket: 'AM5', ramType: 'DDR5', formFactor: 'mATX' },
            { id: 'mobo-11', name: 'ASUS TUF Gaming B650-PLUS WiFi', price: 180, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
            { id: 'mobo-12', name: 'MSI MAG B650 Tomahawk WiFi', price: 200, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
            { id: 'mobo-13', name: 'Gigabyte X670 Gaming X AX', price: 260, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
            { id: 'mobo-14', name: 'ASRock X670E Steel Legend', price: 320, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
            { id: 'mobo-15', name: 'ASUS ROG Crosshair X670E Hero', price: 450, socket: 'AM5', ramType: 'DDR5', formFactor: 'EATX' },
            { id: 'mobo-16', name: 'ASRock X870 Taichi (Hypothetical)', price: 400, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
            { id: 'mobo-17', name: 'MSI MPG X870E Carbon WiFi (Hypothetical)', price: 350, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
            { id: 'mobo-18', name: 'ASUS Prime H810M-K (Hypothetical)', price: 100, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'mATX' },
            { id: 'mobo-19', name: 'Biostar A620NH (ITX)', price: 120, socket: 'AM5', ramType: 'DDR5', formFactor: 'ITX' },
            { id: 'mobo-20', name: 'Gigabyte Z890I AORUS Ultra (Hypothetical)', price: 300, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ITX' }
        ],
        ram: [
            { id: 'ram-1', name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz', price: 55, type: 'DDR4', capacity: 16 },
            { id: 'ram-2', name: 'G.Skill Ripjaws V 32GB (2x16GB) DDR4 3600MHz', price: 85, type: 'DDR4', capacity: 32 },
            { id: 'ram-3', name: 'Kingston Fury Beast 16GB (2x8GB) DDR5 5200MHz', price: 70, type: 'DDR5', capacity: 16 },
            { id: 'ram-4', name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz CL30', price: 120, type: 'DDR5', capacity: 32 },
            { id: 'ram-5', name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6400MHz CL32', price: 140, type: 'DDR5', capacity: 32 },
            { id: 'ram-6', name: 'TeamGroup T-Force Delta RGB 32GB (2x16GB) DDR5 6000MHz CL30', price: 115, type: 'DDR5', capacity: 32 },
            { id: 'ram-7', name: 'Crucial Pro 48GB (2x24GB) DDR5 5600MHz', price: 160, type: 'DDR5', capacity: 48 }, // Non-standard capacity
            { id: 'ram-8', name: 'Kingston Fury Renegade 64GB (2x32GB) DDR5 6800MHz CL34', price: 220, type: 'DDR5', capacity: 64 },
            { id: 'ram-9', name: 'Corsair Dominator Platinum RGB 64GB (2x32GB) DDR5 7200MHz CL34', price: 280, type: 'DDR5', capacity: 64 },
            { id: 'ram-10', name: 'G.Skill Trident Z5 RGB 48GB (2x24GB) DDR5 7600MHz CL38', price: 200, type: 'DDR5', capacity: 48 },
            { id: 'ram-11', name: 'Patriot Viper Venom 16GB (2x8GB) DDR5 6000MHz', price: 90, type: 'DDR5', capacity: 16 },
            { id: 'ram-12', name: 'ADATA XPG Lancer Blade RGB 32GB (2x16GB) DDR5 6000MHz', price: 125, type: 'DDR5', capacity: 32 },
            { id: 'ram-13', name: 'Lexar Ares RGB 32GB (2x16GB) DDR5 6400MHz', price: 135, type: 'DDR5', capacity: 32 },
            { id: 'ram-14', name: 'TeamGroup T-Create Expert 64GB (2x32GB) DDR5 6000MHz', price: 190, type: 'DDR5', capacity: 64 },
            { id: 'ram-15', name: 'V-Color Manta XPrism 64GB (2x32GB) DDR5 6600MHz', price: 230, type: 'DDR5', capacity: 64 },
            { id: 'ram-16', name: 'PNY XLR8 Gaming RGB 16GB (2x8GB) DDR4 3200MHz', price: 60, type: 'DDR4', capacity: 16 },
            { id: 'ram-17', name: 'Corsair Vengeance LPX 32GB (4x8GB) DDR4 3200MHz', price: 100, type: 'DDR4', capacity: 32 },
            { id: 'ram-18', name: 'G.Skill Flare X5 32GB (2x16GB) DDR5 6000MHz CL32 (AMD Expo)', price: 120, type: 'DDR5', capacity: 32 },
            { id: 'ram-19', name: 'Kingston Fury Beast 96GB (2x48GB) DDR5 5600MHz', price: 320, type: 'DDR5', capacity: 96 },
            { id: 'ram-20', name: 'Corsair Dominator Titanium 48GB (2x24GB) DDR5 8000MHz CL38', price: 350, type: 'DDR5', capacity: 48 }
        ],
        storage: [
            { id: 'storage-1', name: 'Crucial P3 1TB NVMe SSD PCIe 3.0', price: 60, type: 'NVMe', capacityGB: 1000 },
            { id: 'storage-2', name: 'Kingston NV2 1TB NVMe SSD PCIe 4.0', price: 75, type: 'NVMe', capacityGB: 1000 },
            { id: 'storage-3', name: 'Samsung 970 Evo Plus 1TB NVMe SSD PCIe 3.0', price: 85, type: 'NVMe', capacityGB: 1000 },
            { id: 'storage-4', name: 'WD Blue SN580 1TB NVMe SSD PCIe 4.0', price: 90, type: 'NVMe', capacityGB: 1000 },
            { id: 'storage-5', name: 'Samsung 990 Pro 1TB NVMe SSD PCIe 4.0', price: 120, type: 'NVMe', capacityGB: 1000 },
            { id: 'storage-6', name: 'Crucial P5 Plus 2TB NVMe SSD PCIe 4.0', price: 180, type: 'NVMe', capacityGB: 2000 },
            { id: 'storage-7', name: 'WD Black SN850X 2TB NVMe SSD PCIe 4.0', price: 200, type: 'NVMe', capacityGB: 2000 },
            { id: 'storage-8', name: 'Samsung 990 Pro 2TB NVMe SSD PCIe 4.0', price: 230, type: 'NVMe', capacityGB: 2000 },
            { id: 'storage-9', name: 'Kingston KC3000 4TB NVMe SSD PCIe 4.0', price: 280, type: 'NVMe', capacityGB: 4000 },
            { id: 'storage-10', name: 'Samsung 990 Pro 4TB NVMe SSD PCIe 4.0', price: 380, type: 'NVMe', capacityGB: 4000 },
            { id: 'storage-11', name: 'Seagate FireCuda 540 1TB NVMe SSD PCIe 5.0', price: 180, type: 'NVMe', capacityGB: 1000 },
            { id: 'storage-12', name: 'Crucial T700 2TB NVMe SSD PCIe 5.0', price: 350, type: 'NVMe', capacityGB: 2000 },
            { id: 'storage-13', name: 'Samsung 870 Evo 1TB SATA SSD', price: 70, type: 'SATA', capacityGB: 1000 },
            { id: 'storage-14', name: 'Crucial MX500 2TB SATA SSD', price: 130, type: 'SATA', capacityGB: 2000 },
            { id: 'storage-15', name: 'WD Red Plus 4TB HDD', price: 100, type: 'HDD', capacityGB: 4000 },
            { id: 'storage-16', name: 'Seagate IronWolf Pro 8TB HDD', price: 180, type: 'HDD', capacityGB: 8000 },
            { id: 'storage-17', name: 'Crucial P3 500GB NVMe SSD PCIe 3.0', price: 40, type: 'NVMe', capacityGB: 500 },
            { id: 'storage-18', name: 'WD Black SN850X 4TB NVMe SSD PCIe 4.0', price: 350, type: 'NVMe', capacityGB: 4000 },
            { id: 'storage-19', name: 'Samsung 990 Pro 8TB NVMe SSD PCIe 4.0', price: 700, type: 'NVMe', capacityGB: 8000 },
            { id: 'storage-20', name: 'WD Red Pro 16TB HDD', price: 280, type: 'HDD', capacityGB: 16000 }
        ],
        psu: [
            { id: 'psu-1', name: 'Corsair CV550 550W Bronze', price: 60, wattage: 550 },
            { id: 'psu-2', name: 'EVGA 600 BR 600W Bronze', price: 65, wattage: 600 },
            { id: 'psu-3', name: 'Thermaltake Smart 700W Bronze', price: 75, wattage: 700 },
            { id: 'psu-4', name: 'Corsair RM750e 750W Gold', price: 100, wattage: 750 },
            { id: 'psu-5', name: 'Seasonic FOCUS Plus Gold 750W', price: 110, wattage: 750 },
            { id: 'psu-6', name: 'NZXT C750 750W Gold', price: 115, wattage: 750 },
            { id: 'psu-7', name: 'Corsair RM850e 850W Gold', price: 120, wattage: 850 },
            { id: 'psu-8', name: 'Seasonic FOCUS Plus Gold 850W', price: 130, wattage: 850 },
            { id: 'psu-9', name: 'Cooler Master MWE Gold V2 850W', price: 125, wattage: 850 },
            { id: 'psu-10', name: 'NZXT C1000 1000W Gold', price: 160, wattage: 1000 },
            { id: 'psu-11', name: 'Corsair RM1000x 1000W Gold', price: 180, wattage: 1000 },
            { id: 'psu-12', name: 'Seasonic FOCUS Plus Gold 1000W', price: 180, wattage: 1000 },
            { id: 'psu-13', name: 'EVGA SuperNOVA 1000 G6 1000W Gold', price: 175, wattage: 1000 },
            { id: 'psu-14', name: 'be quiet! Dark Power 13 850W Platinum', price: 200, wattage: 850 },
            { id: 'psu-15', name: 'Corsair HX1000i 1000W Platinum', price: 230, wattage: 1000 },
            { id: 'psu-16', name: 'Seasonic PRIME TX-1000 1000W Titanium', price: 280, wattage: 1000 },
            { id: 'psu-17', name: 'be quiet! Dark Power Pro 12 1200W Titanium', price: 300, wattage: 1200 },
            { id: 'psu-18', name: 'Corsair HX1200 1200W Platinum', price: 260, wattage: 1200 },
            { id: 'psu-19', name: 'SilverStone HELA 1200R 1200W Platinum (ATX 3.0)', price: 320, wattage: 1200 },
            { id: 'psu-20', name: 'Corsair HX1500i 1500W Platinum', price: 380, wattage: 1500 }
        ],
        case: [
            { id: 'case-1', name: 'Cooler Master MasterBox Q300L (mATX)', price: 60, formFactor: 'mATX', gpuClearance: 360, moboSupport: ['mATX', 'ITX'] },
            { id: 'case-2', name: 'Fractal Design Pop Air Mini (mATX)', price: 80, formFactor: 'mATX', gpuClearance: 335, moboSupport: ['mATX', 'ITX'] },
            { id: 'case-3', name: 'Lian Li Lancool 216', price: 100, formFactor: 'ATX', gpuClearance: 380, moboSupport: ['ATX', 'mATX', 'ITX'] },
            { id: 'case-4', name: 'Montech AIR 903 MAX', price: 75, formFactor: 'ATX', gpuClearance: 400, moboSupport: ['ATX', 'mATX', 'ITX'] },
            { id: 'case-5', name: 'NZXT H5 Flow', price: 90, formFactor: 'ATX', gpuClearance: 365, moboSupport: ['ATX', 'mATX', 'ITX'] },
            { id: 'case-6', name: 'Corsair 4000D Airflow', price: 100, formFactor: 'ATX', gpuClearance: 360, moboSupport: ['ATX', 'mATX', 'ITX'] },
            { id: 'case-7', name: 'Fractal Design North', price: 150, formFactor: 'ATX', gpuClearance: 355, moboSupport: ['ATX', 'mATX', 'ITX'] },
            { id: 'case-8', name: 'Hyte Y60', price: 180, formFactor: 'ATX', gpuClearance: 375, moboSupport: ['ATX', 'mATX', 'ITX'] },
            { id: 'case-9', name: 'NZXT H9 Flow', price: 200, formFactor: 'ATX', gpuClearance: 435, moboSupport: ['ATX', 'mATX', 'ITX', 'EATX'] },
            { id: 'case-10', name: 'Lian Li O11 Dynamic EVO', price: 170, formFactor: 'ATX', gpuClearance: 422, moboSupport: ['ATX', 'mATX', 'ITX', 'EATX'] },
            { id: 'case-11', name: 'Thermaltake Core P3 TG Pro (Open Frame)', price: 140, formFactor: 'ATX', gpuClearance: 450, moboSupport: ['ATX', 'mATX', 'ITX'] },
            { id: 'case-12', name: 'Phanteks Eclipse G360A', price: 95, formFactor: 'ATX', gpuClearance: 400, moboSupport: ['ATX', 'mATX', 'ITX'] },
            { id: 'case-13', name: 'be quiet! Pure Base 500DX', price: 110, formFactor: 'ATX', gpuClearance: 369, moboSupport: ['ATX', 'mATX', 'ITX'] },
            { id: 'case-14', name: 'Cooler Master HAF 700 EVO (Full Tower)', price: 400, formFactor: 'EATX', gpuClearance: 490, moboSupport: ['ATX', 'mATX', 'ITX', 'EATX', 'SSI CEB'] },
            { id: 'case-15', name: 'Fractal Design Torrent', price: 230, formFactor: 'ATX', gpuClearance: 423, moboSupport: ['ATX', 'mATX', 'ITX', 'EATX'] },
            { id: 'case-16', name: 'SSUPD Meshroom S (ITX)', price: 100, formFactor: 'ITX', gpuClearance: 336, moboSupport: ['ITX'] },
            { id: 'case-17', name: 'Lian Li O11 Air Mini (mATX)', price: 110, formFactor: 'mATX', gpuClearance: 362, moboSupport: ['ATX', 'mATX', 'ITX'] },
            { id: 'case-18', name: 'Corsair 5000D Airflow', price: 150, formFactor: 'ATX', gpuClearance: 420, moboSupport: ['ATX', 'mATX', 'ITX'] },
            { id: 'case-19', name: 'SilverStone Fara H1M Pro (mATX)', price: 70, formFactor: 'mATX', gpuClearance: 339, moboSupport: ['mATX', 'ITX'] },
            { id: 'case-20', name: 'InWin D-Frame 2.0 (Open Frame)', price: 900, formFactor: 'ATX', gpuClearance: 350, moboSupport: ['ATX', 'EATX'] }
        ],
        cooler: [
            { id: 'cooler-1', name: 'Cooler Master Hyper 212 Black Edition (Air)', price: 35, type: 'Air', tdp: 180 },
            { id: 'cooler-2', name: 'Thermalright Peerless Assassin 120 SE (Air)', price: 40, type: 'Air', tdp: 265 },
            { id: 'cooler-3', name: 'DeepCool AK620 (Air)', price: 60, type: 'Air', tdp: 260 },
            { id: 'cooler-4', name: 'Noctua NH-D15 (Air)', price: 110, type: 'Air', tdp: 280 },
            { id: 'cooler-5', name: 'Arctic Freezer 34 eSports DUO (Air)', price: 45, type: 'Air', tdp: 210 },
            { id: 'cooler-6', name: 'be quiet! Dark Rock Pro 4 (Air)', price: 85, type: 'Air', tdp: 250 },
            { id: 'cooler-7', name: 'Cooler Master MasterLiquid ML240L RGB V2 (AIO 240mm)', price: 80, type: 'AIO', tdp: 250 },
            { id: 'cooler-8', name: 'Arctic Liquid Freezer II 280 (AIO 280mm)', price: 100, type: 'AIO', tdp: 280 },
            { id: 'cooler-9', name: 'Lian Li Galahad II Trinity SL-INF 240mm (AIO 240mm)', price: 150, type: 'AIO', tdp: 270 },
            { id: 'cooler-10', name: 'NZXT Kraken 240 RGB (AIO 240mm)', price: 140, type: 'AIO', tdp: 260 },
            { id: 'cooler-11', name: 'Corsair iCUE H150i Elite LCD XT (AIO 360mm)', price: 280, type: 'AIO', tdp: 320 },
            { id: 'cooler-12', name: 'NZXT Kraken Elite 360 (AIO 360mm)', price: 250, type: 'AIO', tdp: 320 },
            { id: 'cooler-13', name: 'Arctic Liquid Freezer II 360 (AIO 360mm)', price: 120, type: 'AIO', tdp: 300 },
            { id: 'cooler-14', name: 'DeepCool LS720 SE (AIO 360mm)', price: 100, type: 'AIO', tdp: 300 },
            { id: 'cooler-15', name: 'Lian Li Galahad II LCD 360mm (AIO 360mm)', price: 200, type: 'AIO', tdp: 320 },
            { id: 'cooler-16', name: 'Noctua NH-U12A (Air)', price: 100, type: 'Air', tdp: 240 },
            { id: 'cooler-17', name: 'DeepCool AG400 (Air)', price: 25, type: 'Air', tdp: 150 },
            { id: 'cooler-18', name: 'Cooler Master MasterLiquid ML360L V2 (AIO 360mm)', price: 110, type: 'AIO', tdp: 280 },
            { id: 'cooler-19', name: 'EK-Nucleus AIO CR360 Lux (AIO 360mm)', price: 180, type: 'AIO', tdp: 310 },
            { id: 'cooler-20', name: 'Phanteks Glacier One 420mm D30 (AIO 420mm)', price: 220, type: 'AIO', tdp: 340 }
        ]
    };

    // This object holds the currently selected full component objects
    const selectedComponents = {
        cpu: null,
        gpu: null,
        motherboard: null,
        ram: null,
        storage: null,
        psu: null,
        case: null,
        cooler: null
    };

    // --- Core PC Builder Functions ---

    /**
     * Populates all component dropdowns based on componentsData.
     */
    function populateDropdowns() {
        Object.keys(componentSelects).forEach(category => {
            const selectElement = componentSelects[category];
            const categoryData = componentsData[category];

            if (selectElement && categoryData) {
                selectElement.innerHTML = `<option value="">Select a ${category.charAt(0).toUpperCase() + category.slice(1)}</option>`;
                categoryData.forEach(component => {
                    const option = document.createElement('option');
                    option.value = component.id;
                    option.textContent = `${component.name} ($${component.price.toFixed(2)})`;
                    selectElement.appendChild(option);
                });
            } else {
                console.error(`Error populating dropdown for category: ${category}. Element or data missing.`);
            }
        });
    }

    /**
     * Updates the displayed selected components, total price, and triggers compatibility check.
     */
    function updateBuildSummary() {
        let currentTotal = 0;
        let allComponentsSelected = true; // Assume all are selected until one is found missing

        // Update selectedComponents object based on dropdown selections
        Object.keys(componentSelects).forEach(category => {
            const selectElement = componentSelects[category];
            const selectedId = selectElement ? selectElement.value : '';

            if (selectedId && componentsData[category]) {
                const component = componentsData[category].find(comp => comp.id === selectedId);
                selectedComponents[category] = component || null; // Ensure null if not found
            } else {
                selectedComponents[category] = null;
            }

            // Update display area
            const displayElement = selectedComponentDisplays[category];
            if (displayElement) {
                const component = selectedComponents[category];
                if (component) {
                    displayElement.innerHTML = `<span class="component-name">${component.name}</span><span class="component-price">$${component.price.toFixed(2)}</span>`;
                    currentTotal += component.price;
                } else {
                    displayElement.innerHTML = `<span class="component-name">Not selected</span><span class="component-price"></span>`;
                    allComponentsSelected = false; // Mark if any component is not selected
                }
            }
        });
        console.log("Current selectedComponents state:", selectedComponents);

        // Update the main build summary list (right panel)
        if (buildSummaryList) {
            buildSummaryList.innerHTML = ''; // Clear existing list
            let hasAnySelection = false;
            Object.keys(selectedComponents).forEach(type => {
                const component = selectedComponents[type];
                if (component) {
                    hasAnySelection = true;
                    const p = document.createElement('p');
                    p.innerHTML = `<span class="component-label">${type.charAt(0).toUpperCase() + type.slice(1)}:</span> <span class="component-name">${component.name}</span> <span class="component-price">$${component.price.toFixed(2)}</span>`;
                    buildSummaryList.appendChild(p);
                }
            });

            if (!hasAnySelection) {
                buildSummaryList.innerHTML = `<p class="placeholder-text">Select components to see your build here.</p>`;
            }
        }

        // Add building fee if all components are selected
        if (allComponentsSelected) {
            currentTotal += BUILDING_FEE;
            // Add building fee to the buildSummaryList if not already present
            if (buildSummaryList && !buildSummaryList.querySelector('.building-fee-item')) {
                const feeP = document.createElement('p');
                feeP.classList.add('building-fee-item'); // Add a class to easily find/remove it later
                feeP.innerHTML = `<span class="component-label">Building & Testing Fee:</span> <span class="component-price">$${BUILDING_FEE.toFixed(2)}</span>`;
                buildSummaryList.appendChild(feeP);
            }
        } else {
            // Remove building fee from buildSummaryList if components are incomplete
            const existingFee = buildSummaryList ? buildSummaryList.querySelector('.building-fee-item') : null;
            if (existingFee) {
                existingFee.remove();
            }
        }


        // Update total price display
        if (totalPriceDisplay) {
            totalPriceDisplay.textContent = `$${currentTotal.toFixed(2)}`;
        }

        // Run compatibility checks
        const { isCompatible, message, type } = checkCompatibility(allComponentsSelected);

        // Update compatibility status display
        if (compatibilityStatusDiv) {
            compatibilityStatusDiv.classList.remove('compatible', 'incompatible');
            compatibilityStatusDiv.classList.add(type);
            compatibilityStatusDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
        } else {
            console.error('ERROR: Compatibility status display element not found!');
        }

        // Populate hidden compatibility status field
        if (hiddenFormFields.compatibilityStatus) {
            hiddenFormFields.compatibilityStatus.value = message;
        }

        // Enable/disable the "Complete Build" button
        if (submitBuildBtn) {
            submitBuildBtn.disabled = !(allComponentsSelected && isCompatible);
            submitBuildBtn.classList.toggle('disabled', !(allComponentsSelected && isCompatible));
        }

        // Populate other hidden fields for Formspree
        for (const category in selectedComponents) {
            if (hiddenFormFields[category]) {
                hiddenFormFields[category].value = selectedComponents[category] ? selectedComponents[category].name : 'N/A';
            }
        }
        if (hiddenFormFields.totalPrice) {
            hiddenFormFields.totalPrice.value = currentTotal.toFixed(2);
        }
    }

    /**
     * Performs compatibility checks on selected components.
     * @param {boolean} allSelected - True if all component dropdowns have a selection.
     * @returns {{isCompatible: boolean, message: string, type: string}} - Object with compatibility status.
     */
    function checkCompatibility(allSelected) {
        let compatible = true;
        let messages = [];
        let statusType = 'incomplete'; // Default status

        const { cpu, motherboard, ram, gpu, psu, case: pcCase, cooler } = selectedComponents;

        if (!allSelected) {
            return { isCompatible: false, message: 'Please select all components to check full compatibility.', type: 'incompatible' };
        } else {
            // --- Specific Compatibility Rules ---

            // CPU & Motherboard Socket
            if (cpu.socket !== motherboard.socket) {
                compatible = false;
                messages.push(`CPU socket (${cpu.socket}) is incompatible with Motherboard socket (${motherboard.socket}).`);
            }
            // RAM & Motherboard RAM Type
            if (ram.type !== motherboard.ramType) {
                compatible = false;
                messages.push(`RAM type (${ram.type}) is incompatible with Motherboard RAM type (${motherboard.ramType}).`);
            }
            // GPU Length vs. Case Clearance
            if (gpu.length > pcCase.gpuClearance) {
                compatible = false;
                messages.push(`GPU (${gpu.name}) length (${gpu.length}mm) exceeds Case clearance (${pcCase.gpuClearance}mm).`);
            }
            // PSU Wattage vs. Estimated System Power (with buffer)
            const estimatedCpuPower = cpu.tdp || 100; // Use CPU TDP or a default if not specified
            const estimatedGpuPower = gpu.power || 150; // Use GPU power or a default if not specified
            const estimatedRamPower = (ram.capacity / 16) * 10; // Approx 10W per 16GB RAM
            const totalEstimatedWattage = 100 + estimatedCpuPower + estimatedGpuPower + estimatedRamPower; // Base system + components
            const requiredPsuWattage = totalEstimatedWattage * 1.2; // 20% overhead

            if (psu.wattage < requiredPsuWattage) {
                compatible = false;
                messages.push(`PSU wattage (${psu.wattage}W) might be insufficient (estimated need ~${requiredPsuWattage.toFixed(0)}W).`);
            }
            // Cooler TDP vs. CPU TDP
            if (cooler.tdp < cpu.tdp) {
                compatible = false;
                messages.push(`Cooler (${cooler.name}) TDP (${cooler.tdp}W) might be insufficient for CPU (${cpu.name}, TDP ${cpu.tdp}W).`);
            }
            // Motherboard Form Factor vs. Case Support
            if (!pcCase.moboSupport.includes(motherboard.formFactor)) {
                compatible = false;
                messages.push(`Motherboard form factor (${motherboard.formFactor}) is not supported by selected Case (${pcCase.name}).`);
            }
        }

        if (messages.length > 0) {
            statusType = 'incompatible';
            return { isCompatible: false, message: messages.join(' '), type: statusType };
        } else {
            statusType = 'compatible';
            return { isCompatible: true, message: 'All selected components are compatible!', type: statusType };
        }
    }

    /**
     * Generates a plain text summary of the build for copying/emailing.
     * @returns {{text: string, total: number, allSelected: boolean}} An object containing the summary string, total price, and whether all components are selected.
     */
    function generateBuildSummaryText() {
        let summaryText = '--- Your Custom PC Build ---\n\n';
        let total = 0;
        let allSelected = true;

        Object.keys(selectedComponents).forEach(type => {
            const component = selectedComponents[type];
            const displayType = type.charAt(0).toUpperCase() + type.slice(1);
            if (component) {
                summaryText += `${displayType}: ${component.name} ($${component.price.toFixed(2)})\n`;
                total += component.price;
            } else {
                summaryText += `${displayType}: Not Selected\n`;
                allSelected = false;
            }
        });

        if (allSelected) {
            summaryText += `\nBuilding & Testing Fee: $${BUILDING_FEE.toFixed(2)}\n`;
            total += BUILDING_FEE;
        }

        summaryText += `\nTotal Estimated Price: $${total.toFixed(2)}\n`;

        const { message: compatibilityMessage } = checkCompatibility(allSelected);
        summaryText += `Compatibility Status: ${compatibilityMessage}\n`;

        return { text: summaryText, total: total, allSelected: allSelected };
    }

    // --- Event Listeners ---

    // Add event listeners to all component select dropdowns
    Object.values(componentSelects).forEach(selectElement => {
        selectElement.addEventListener('change', updateBuildSummary);
    });

    // Handle form submission
    const buildSubmissionForm = document.getElementById('build-submission-form');
    if (buildSubmissionForm) {
        buildSubmissionForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            // Ensure all hidden fields are up-to-date right before submission
            updateBuildSummary();

            const { isCompatible, message: compatibilityMessage, type: compatibilityType } = checkCompatibility(Object.values(selectedComponents).every(c => c !== null));

            // Prevent submission if not all components are selected or if there are incompatibilities
            if (!isCompatible || compatibilityType === 'incompatible') {
                showMessageBox('error', `Cannot submit: ${compatibilityMessage}. Please ensure all components are selected and compatible.`);
                return;
            }

            const form = event.target;
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for Formspree to return JSON
                    }
                });

                if (response.ok) {
                    showMessageBox('success', 'Your build request has been submitted successfully! We will contact you shortly.');
                    form.reset(); // Clear the form after successful submission
                    // Reset selected values and summary display
                    Object.values(componentSelects).forEach(select => {
                        select.selectedIndex = 0; // Set back to "Select a..." option
                    });
                    Object.keys(selectedComponents).forEach(key => selectedComponents[key] = null); // Clear selected components
                    updateBuildSummary(); // Update summary and price to initial state
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        const errorMessages = data.errors.map(e => e.message).join(' ');
                        showMessageBox('error', `Submission failed: ${errorMessages}`);
                    } else {
                        showMessageBox('error', 'An error occurred during submission. Please try again.');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                showMessageBox('error', 'Network error or problem submitting the form. Please check your internet connection and try again.');
            }
        });
    } else {
        console.error('ERROR: Build submission form not found!');
    }


    // Modal functionality (This part seems to be for a 'preview' or 'finalize' modal)
    // The actual Formspree submission happens via the form's submit event listener above.
    if (submitBuildBtn) {
        submitBuildBtn.addEventListener('click', (e) => {
            // This click handler is for the modal, not the direct form submission.
            // The form's submit event listener handles the actual Formspree send.
            // If submitBuildBtn is type="submit", this will fire before the form's submit event.
            // If it's type="button", it needs to explicitly trigger form submission or just open modal.
            // Given it's type="submit" in the HTML, the form.addEventListener('submit') will be primary.
            // This block is now redundant for actual submission but can remain for modal display.
            // e.preventDefault(); // This would prevent the form submission if uncommented.

            const { text: buildText, allSelected } = generateBuildSummaryText();
            const { isCompatible, message: compatibilityMessage } = checkCompatibility(allSelected);

            if (allSelected && isCompatible) {
                if (buildSpecsDiv) {
                    // Convert plain text newlines to HTML <br> for display
                    buildSpecsDiv.innerHTML = buildText.replace(/\n/g, '<br>');
                }
                if (buildSummaryModal) {
                    buildSummaryModal.style.display = 'block';
                }
            } else {
                // This scenario should ideally be prevented by the disabled button,
                // but as a fallback, show an error if somehow clicked.
                showMessageBox('error', `Please ensure all components are selected and compatible before finalizing your build: ${compatibilityMessage}`);
            }
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (buildSummaryModal) {
                buildSummaryModal.style.display = 'none';
            }
        });
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (buildSummaryModal && event.target === buildSummaryModal) {
            buildSummaryModal.style.display = 'none';
        }
    });

    if (copyBuildBtn) {
        copyBuildBtn.addEventListener('click', () => {
            const { text: buildText } = generateBuildSummaryText();
            // Using execCommand for broader iframe compatibility
            const textarea = document.createElement('textarea');
            textarea.value = buildText;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showMessageBox('success', 'Build summary copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
                showMessageBox('error', 'Failed to copy build summary. Please try manually.');
            }
            document.body.removeChild(textarea);
        });
    }

    if (emailBuildBtn) {
        emailBuildBtn.addEventListener('click', () => {
            const { text: buildText } = generateBuildSummaryText();
            const subject = encodeURIComponent('My Custom PC Build from UndergroundPC');
            const body = encodeURIComponent(buildText + '\n\nVisit: ' + window.location.href);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        });
    }

    // --- Message Box Functionality (for success/error alerts) ---
    // Ensure these elements exist in your HTML
    const errorMessageContent = document.getElementById('error-message-content');
    const errorMessagebox = document.getElementById('error-message-box');
    const successMessageContent = document.getElementById('success-message-content');
    const successMessageBox = document.getElementById('success-message-box');

    /**
     * Shows a message box with the given type and message.
     * @param {'success'|'error'} type - The type of message box to show.
     * @param {string} message - The message to display.
     */
    function showMessageBox(type, message) {
        let contentElement;
        let boxElement;

        if (type === 'success') {
            contentElement = successMessageContent;
            boxElement = successMessageBox;
        } else { // 'error'
            contentElement = errorMessageContent;
            boxElement = errorMessagebox;
        }

        if (contentElement && boxElement) {
            contentElement.textContent = message;
            boxElement.classList.remove('hidden');
            // Hide after a few seconds (optional)
            setTimeout(() => {
                boxElement.classList.add('hidden');
            }, 7000); // Message disappears after 7 seconds
        } else {
            console.error(`Attempted to show a ${type} message, but content or box element was not found.`);
            // Removed alert fallback as per instructions.
        }
    }


    // --- Initialization Calls ---
    populateDropdowns();
    updateBuildSummary(); // Initial calculation and compatibility check on page load

    // Scroll reveal effect (assuming you have this CSS and potentially JS for it)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealItemElements = document.querySelectorAll('.reveal-item');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item must be visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });

    revealItemElements.forEach(element => {
        observer.observe(element);
    });

    // FAQ Accordion functionality
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');

            question.classList.toggle('active');
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon.classList.replace('fa-minus-circle', 'fa-plus-circle');
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.replace('fa-plus-circle', 'fa-minus-circle');
            }
        });
    });
});
