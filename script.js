document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration and Element References ---

    const BUILDING_FEE = 150.00; // Fixed building and testing fee

    // Dynamically gather component select and display elements
    const componentSelects = {}; // Stores references to <select> elements
    const selectedComponentDisplays = {}; // Stores references to <div> where selection is shown
      // --- Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#main-nav ul li a'); // Select all navigation links

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active'); // Toggle 'active' class on main navigation
            // Toggle aria-expanded for accessibility (informs screen readers)
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            // Toggle 'no-scroll' class on body to prevent background scrolling
            document.body.classList.toggle('no-scroll');
        });
        // Existing Intersection Observer for reveal-on-scroll (ensure this is present)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, observerOptions);
        // Close menu when a navigation link is clicked (for seamless navigation)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active'); // Hide the navigation
                menuToggle.setAttribute('aria-expanded', 'false'); // Reset aria-expanded
                document.body.classList.remove('no-scroll'); // Re-enable body scrolling
            });
        });
    }


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
        { id: 'cpu-20', name: 'Intel Core Ultra 9 285K', price: 800, socket: 'LGA1851', tdp: 150 }, // More hypothetical high-end
        // Additional 80 CPU entries (hypothetical)
        { id: 'cpu-21', name: 'Intel Core i3-14100', price: 130, socket: 'LGA1700', tdp: 60 },
        { id: 'cpu-22', name: 'Intel Core i5-14500', price: 210, socket: 'LGA1700', tdp: 65 },
        { id: 'cpu-23', name: 'Intel Core i5-14600KF', price: 290, socket: 'LGA1700', tdp: 125 },
        { id: 'cpu-24', name: 'Intel Core i7-14700KF', price: 390, socket: 'LGA1700', tdp: 125 },
        { id: 'cpu-25', name: 'Intel Core i9-14900KF', price: 580, socket: 'LGA1700', tdp: 125 },
        { id: 'cpu-26', name: 'Intel Core i5-15500', price: 240, socket: 'LGA1851', tdp: 65 },
        { id: 'cpu-27', name: 'Intel Core i7-15700', price: 420, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-28', name: 'Intel Core i9-15900', price: 650, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-29', name: 'AMD Ryzen 3 7300X', price: 180, socket: 'AM5', tdp: 65 },
        { id: 'cpu-30', name: 'AMD Ryzen 5 7500F', price: 190, socket: 'AM5', tdp: 65 },
        { id: 'cpu-31', name: 'AMD Ryzen 7 7700', price: 280, socket: 'AM5', tdp: 65 },
        { id: 'cpu-32', name: 'AMD Ryzen 7 7800', price: 320, socket: 'AM5', tdp: 65 },
        { id: 'cpu-33', name: 'AMD Ryzen 9 7900', price: 380, socket: 'AM5', tdp: 65 },
        { id: 'cpu-34', name: 'AMD Ryzen 9 7950X', price: 600, socket: 'AM5', tdp: 170 },
        { id: 'cpu-35', name: 'AMD Ryzen 5 9600', price: 250, socket: 'AM5', tdp: 65 },
        { id: 'cpu-36', name: 'AMD Ryzen 7 9700', price: 350, socket: 'AM5', tdp: 65 },
        { id: 'cpu-37', name: 'AMD Ryzen 7 9800', price: 420, socket: 'AM5', tdp: 65 },
        { id: 'cpu-38', name: 'AMD Ryzen 9 9900', price: 520, socket: 'AM5', tdp: 65 },
        { id: 'cpu-39', name: 'AMD Ryzen 9 9950X', price: 700, socket: 'AM5', tdp: 170 },
        { id: 'cpu-40', name: 'Intel Core Ultra 7 265K', price: 650, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-41', name: 'Intel Core i3-15100F', price: 140, socket: 'LGA1851', tdp: 60 },
        { id: 'cpu-42', name: 'Intel Core i5-15400F', price: 220, socket: 'LGA1851', tdp: 65 },
        { id: 'cpu-43', name: 'Intel Core i5-15600K', price: 320, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-44', name: 'Intel Core i7-15700KF', price: 430, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-45', name: 'Intel Core i9-15900KF', price: 670, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-46', name: 'AMD Ryzen 5 9500X', price: 260, socket: 'AM5', tdp: 105 },
        { id: 'cpu-47', name: 'AMD Ryzen 7 9700X3D', price: 400, socket: 'AM5', tdp: 120 },
        { id: 'cpu-48', name: 'AMD Ryzen 9 9900X3D', price: 600, socket: 'AM5', tdp: 170 },
        { id: 'cpu-49', name: 'Intel Core Ultra 5 245K', price: 500, socket: 'LGA1851', tdp: 100 },
        { id: 'cpu-50', name: 'Intel Core i3-16100 (Hypothetical)', price: 150, socket: 'LGA1851', tdp: 60 },
        { id: 'cpu-51', name: 'Intel Core i5-16400 (Hypothetical)', price: 250, socket: 'LGA1851', tdp: 65 },
        { id: 'cpu-52', name: 'Intel Core i7-16700K (Hypothetical)', price: 480, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-53', name: 'AMD Ryzen 3 8300G (Hypothetical)', price: 160, socket: 'AM5', tdp: 65 },
        { id: 'cpu-54', name: 'AMD Ryzen 5 8600G (Hypothetical)', price: 240, socket: 'AM5', tdp: 65 },
        { id: 'cpu-55', name: 'AMD Ryzen 7 8700G (Hypothetical)', price: 340, socket: 'AM5', tdp: 65 },
        { id: 'cpu-56', name: 'Intel Xeon E3-1270 v6 (Server)', price: 300, socket: 'LGA1151', tdp: 73 },
        { id: 'cpu-57', name: 'AMD EPYC 7302 (Server)', price: 800, socket: 'SP3', tdp: 155 },
        { id: 'cpu-58', name: 'Intel Core i9-13900K', price: 550, socket: 'LGA1700', tdp: 125 },
        { id: 'cpu-59', name: 'AMD Ryzen 7 5800X3D', price: 280, socket: 'AM4', tdp: 105 },
        { id: 'cpu-60', name: 'Intel Core i5-13600K', price: 270, socket: 'LGA1700', tdp: 125 },
        { id: 'cpu-61', name: 'Intel Core i7-13700K', price: 350, socket: 'LGA1700', tdp: 125 },
        { id: 'cpu-62', name: 'AMD Ryzen 5 5600X', price: 150, socket: 'AM4', tdp: 65 },
        { id: 'cpu-63', name: 'AMD Ryzen 9 5900X', price: 300, socket: 'AM4', tdp: 105 },
        { id: 'cpu-64', name: 'Intel Core i3-12100F', price: 90, socket: 'LGA1700', tdp: 58 },
        { id: 'cpu-65', name: 'Intel Core i5-12400F', price: 160, socket: 'LGA1700', tdp: 65 },
        { id: 'cpu-66', name: 'AMD Ryzen 3 4100', price: 70, socket: 'AM4', tdp: 65 },
        { id: 'cpu-67', name: 'Intel Core i7-12700K', price: 300, socket: 'LGA1700', tdp: 125 },
        { id: 'cpu-68', name: 'AMD Ryzen 5 5600G', price: 130, socket: 'AM4', tdp: 65 },
        { id: 'cpu-69', name: 'Intel Core i9-12900K', price: 450, socket: 'LGA1700', tdp: 125 },
        { id: 'cpu-70', name: 'AMD Ryzen 7 5700X', price: 180, socket: 'AM4', tdp: 65 },
        { id: 'cpu-71', name: 'Intel Core i5-11600K', price: 180, socket: 'LGA1200', tdp: 125 },
        { id: 'cpu-72', name: 'AMD Ryzen 9 3900X', price: 250, socket: 'AM4', tdp: 105 },
        { id: 'cpu-73', name: 'Intel Core i7-11700K', price: 250, socket: 'LGA1200', tdp: 125 },
        { id: 'cpu-74', name: 'AMD Ryzen 7 3700X', price: 170, socket: 'AM4', tdp: 65 },
        { id: 'cpu-75', name: 'Intel Core i9-11900K', price: 300, socket: 'LGA1200', tdp: 125 },
        { id: 'cpu-76', name: 'AMD Ryzen 5 2600', price: 80, socket: 'AM4', tdp: 65 },
        { id: 'cpu-77', name: 'Intel Core i5-10400F', price: 100, socket: 'LGA1200', tdp: 65 },
        { id: 'cpu-78', name: 'AMD Ryzen 7 2700X', price: 120, socket: 'AM4', tdp: 105 },
        { id: 'cpu-79', name: 'Intel Core i7-10700K', price: 200, socket: 'LGA1200', tdp: 125 },
        { id: 'cpu-80', name: 'AMD Ryzen 9 3950X', price: 350, socket: 'AM4', tdp: 105 },
        { id: 'cpu-81', name: 'Intel Core i3-10100', price: 70, socket: 'LGA1200', tdp: 65 },
        { id: 'cpu-82', name: 'AMD Ryzen 5 3600', price: 110, socket: 'AM4', tdp: 65 },
        { id: 'cpu-83', name: 'Intel Core i5-9600K', price: 150, socket: 'LGA1151', tdp: 95 },
        { id: 'cpu-84', name: 'AMD Ryzen 7 1700X', price: 90, socket: 'AM4', tdp: 95 },
        { id: 'cpu-85', name: 'Intel Core i7-9700K', price: 200, socket: 'LGA1151', tdp: 95 },
        { id: 'cpu-86', name: 'AMD Ryzen 5 1600', price: 70, socket: 'AM4', tdp: 65 },
        { id: 'cpu-87', name: 'Intel Core i9-9900K', price: 300, socket: 'LGA1151', tdp: 95 },
        { id: 'cpu-88', name: 'AMD Ryzen 7 5700G', price: 200, socket: 'AM4', tdp: 65 },
        { id: 'cpu-89', name: 'Intel Core i5-8400', price: 120, socket: 'LGA1151', tdp: 65 },
        { id: 'cpu-90', name: 'AMD Ryzen 3 3100', price: 60, socket: 'AM4', tdp: 65 },
        { id: 'cpu-91', name: 'Intel Core i7-8700K', price: 250, socket: 'LGA1151', tdp: 95 },
        { id: 'cpu-92', name: 'AMD Ryzen 5 3400G', price: 100, socket: 'AM4', tdp: 65 },
        { id: 'cpu-93', name: 'Intel Core i3-9100F', price: 60, socket: 'LGA1151', tdp: 65 },
        { id: 'cpu-94', name: 'AMD Athlon 3000G', price: 50, socket: 'AM4', tdp: 35 },
        { id: 'cpu-95', name: 'Intel Pentium Gold G6400', price: 70, socket: 'LGA1200', tdp: 58 },
        { id: 'cpu-96', 'name': 'Intel Core i5-17400 (Hypothetical)', 'price': 280, 'socket': 'LGA1851', 'tdp': 65 },
        { id: 'cpu-97', 'name': 'Intel Core i7-17700K (Hypothetical)', 'price': 520, 'socket': 'LGA1851', 'tdp': 125 },
        { id: 'cpu-98', 'name': 'AMD Ryzen 5 10600X (Hypothetical)', 'price': 300, 'socket': 'AM5', 'tdp': 105 },
        { id: 'cpu-99', 'name': 'AMD Ryzen 7 10700X3D (Hypothetical)', 'price': 480, 'socket': 'AM5', 'tdp': 120 },
        { id: 'cpu-100', 'name': 'Intel Core Ultra 9 385K (Hypothetical)', 'price': 900, 'socket': 'LGA1851', 'tdp': 170 },
        { id: 'cpu-101', name: 'Intel Core i3-17100 (Hypothetical)', price: 160, socket: 'LGA1851', tdp: 60 },
        { id: 'cpu-102', name: 'Intel Core i5-17600K (Hypothetical)', price: 350, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-103', name: 'Intel Core i9-17900K (Hypothetical)', price: 700, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-104', name: 'AMD Ryzen 5 10600 (Hypothetical)', price: 270, socket: 'AM5', tdp: 65 },
        { id: 'cpu-105', name: 'AMD Ryzen 7 10700 (Hypothetical)', price: 390, socket: 'AM5', tdp: 65 },
        { id: 'cpu-106', name: 'AMD Ryzen 9 10900X (Hypothetical)', price: 600, socket: 'AM5', tdp: 170 },
        { id: 'cpu-107', name: 'Intel Core Ultra 7 365K (Hypothetical)', price: 700, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-108', name: 'Intel Celeron G6900', price: 60, socket: 'LGA1700', tdp: 46 },
        { id: 'cpu-109', name: 'AMD Ryzen 3 5300G', price: 110, socket: 'AM4', tdp: 65 },
        { id: 'cpu-110', name: 'Intel Core i5-10600K', price: 180, socket: 'LGA1200', tdp: 125 },
        { id: 'cpu-111', name: 'AMD Ryzen 9 7900X3D', price: 580, socket: 'AM5', tdp: 120 },
        { id: 'cpu-112', name: 'Intel Core i7-13700KF', price: 340, socket: 'LGA1700', tdp: 125 },
        { id: 'cpu-113', name: 'AMD Ryzen 5 7500F', price: 190, socket: 'AM5', tdp: 65 },
        { id: 'cpu-114', name: 'Intel Core i9-13900KF', price: 520, socket: 'LGA1700', tdp: 125 },
        { id: 'cpu-115', name: 'AMD Ryzen 7 7700', price: 280, socket: 'AM5', tdp: 65 },
        { id: 'cpu-116', name: 'Intel Core i5-12600K', price: 280, socket: 'LGA1700', tdp: 125 },
        { id: 'cpu-117', name: 'AMD Ryzen 5 5500', price: 120, socket: 'AM4', tdp: 65 },
        { id: 'cpu-118', name: 'Intel Core i3-13100F', price: 110, socket: 'LGA1700', tdp: 58 },
        { id: 'cpu-119', name: 'AMD Ryzen 7 5700G', price: 200, socket: 'AM4', tdp: 65 },
        { id: 'cpu-120', name: 'Intel Core i7-12700F', price: 280, socket: 'LGA1700', tdp: 65 },
        { id: 'cpu-121', name: 'AMD Ryzen 9 5950X', price: 400, socket: 'AM4', tdp: 105 },
        { id: 'cpu-122', name: 'Intel Core i5-11400F', price: 120, socket: 'LGA1200', tdp: 65 },
        { id: 'cpu-123', name: 'AMD Ryzen 3 3200G', price: 80, socket: 'AM4', tdp: 65 },
        { id: 'cpu-124', name: 'Intel Core i7-11700F', price: 220, socket: 'LGA1200', tdp: 65 },
        { id: 'cpu-125', name: 'AMD Ryzen 5 4600G', price: 140, socket: 'AM4', tdp: 65 },
        { id: 'cpu-126', name: 'Intel Core i9-10900K', price: 280, socket: 'LGA1200', tdp: 125 },
        { id: 'cpu-127', name: 'AMD Ryzen 7 3800X', price: 200, socket: 'AM4', tdp: 105 },
        { id: 'cpu-128', name: 'Intel Core i5-9400F', price: 100, socket: 'LGA1151', tdp: 65 },
        { id: 'cpu-129', name: 'AMD Ryzen 5 2600X', price: 90, socket: 'AM4', tdp: 95 },
        { id: 'cpu-130', name: 'Intel Core i7-9700F', price: 180, socket: 'LGA1151', tdp: 65 },
        { id: 'cpu-131', name: 'AMD Ryzen 7 1800X', price: 100, socket: 'AM4', tdp: 95 },
        { id: 'cpu-132', name: 'Intel Core i9-9900KF', price: 280, socket: 'LGA1151', tdp: 95 },
        { id: 'cpu-133', name: 'AMD Ryzen 5 3500X', price: 90, socket: 'AM4', tdp: 65 },
        { id: 'cpu-134', name: 'Intel Core i5-8600K', price: 180, socket: 'LGA1151', tdp: 95 },
        { id: 'cpu-135', name: 'AMD Ryzen 3 2200G', price: 70, socket: 'AM4', tdp: 65 },
        { id: 'cpu-136', name: 'Intel Core i7-8700', price: 200, socket: 'LGA1151', tdp: 65 },
        { id: 'cpu-137', name: 'AMD Ryzen 5 1500X', price: 75, socket: 'AM4', tdp: 65 },
        { id: 'cpu-138', name: 'Intel Core i3-8100', price: 80, socket: 'LGA1151', tdp: 65 },
        { id: 'cpu-139', name: 'AMD Ryzen 3 1300X', price: 60, socket: 'AM4', tdp: 65 },
        { id: 'cpu-140', name: 'Intel Core i5-7600K', price: 150, socket: 'LGA1151', tdp: 91 },
        { id: 'cpu-141', name: 'AMD FX-8350', price: 60, socket: 'AM3+', tdp: 125 },
        { id: 'cpu-142', name: 'Intel Core i7-7700K', price: 200, socket: 'LGA1151', tdp: 91 },
        { id: 'cpu-143', name: 'AMD Ryzen 5 1400', price: 65, socket: 'AM4', tdp: 65 },
        { id: 'cpu-144', name: 'Intel Core i3-7100', price: 70, socket: 'LGA1151', tdp: 51 },
        { id: 'cpu-145', name: 'AMD Ryzen 3 1200', price: 55, socket: 'AM4', tdp: 65 },
        { id: 'cpu-146', name: 'Intel Core i5-6600K', price: 120, socket: 'LGA1151', tdp: 91 },
        { id: 'cpu-147', name: 'AMD A10-7850K', price: 40, socket: 'FM2+', tdp: 95 },
        { id: 'cpu-148', name: 'Intel Core i7-6700K', price: 180, socket: 'LGA1151', tdp: 91 },
        { id: 'cpu-149', name: 'AMD Ryzen 7 2700', price: 150, socket: 'AM4', tdp: 65 },
        { id: 'cpu-150', name: 'Intel Core i5-16500 (Hypothetical)', price: 260, socket: 'LGA1851', tdp: 65 },
        { id: 'cpu-151', name: 'Intel Core i7-16800K (Hypothetical)', price: 500, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-152', name: 'AMD Ryzen 5 8700G (Hypothetical)', price: 260, socket: 'AM5', tdp: 65 },
        { id: 'cpu-153', name: 'AMD Ryzen 7 8800X (Hypothetical)', price: 420, socket: 'AM5', tdp: 105 },
        { id: 'cpu-154', name: 'Intel Core Ultra 5 345K (Hypothetical)', price: 550, socket: 'LGA1851', tdp: 100 },
        { id: 'cpu-155', name: 'Intel Core i3-17100F (Hypothetical)', price: 130, socket: 'LGA1851', tdp: 60 },
        { id: 'cpu-156', name: 'AMD Ryzen 9 10950X3D (Hypothetical)', price: 800, socket: 'AM5', tdp: 170 },
        { id: 'cpu-157', name: 'Intel Core i5-17500 (Hypothetical)', price: 270, socket: 'LGA1851', tdp: 65 },
        { id: 'cpu-158', name: 'AMD Ryzen 7 10800X (Hypothetical)', price: 450, socket: 'AM5', tdp: 105 },
        { id: 'cpu-159', name: 'Intel Core i9-17900KF (Hypothetical)', price: 680, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-160', name: 'AMD Ryzen 5 10500 (Hypothetical)', price: 240, socket: 'AM5', tdp: 65 },
        { id: 'cpu-161', name: 'Intel Core i7-17700 (Hypothetical)', price: 490, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-162', name: 'AMD Ryzen 9 10900 (Hypothetical)', price: 580, socket: 'AM5', tdp: 65 },
        { id: 'cpu-163', name: 'Intel Core Ultra 7 375K (Hypothetical)', price: 750, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-164', name: 'AMD Ryzen 7 8700 (Hypothetical)', price: 330, socket: 'AM5', tdp: 65 },
        { id: 'cpu-165', name: 'Intel Core i5-18400 (Hypothetical)', price: 290, socket: 'LGA1851', tdp: 65 },
        { id: 'cpu-166', name: 'AMD Ryzen 5 11600X (Hypothetical)', price: 310, socket: 'AM5', tdp: 105 },
        { id: 'cpu-167', name: 'Intel Core i7-18700K (Hypothetical)', price: 530, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-168', name: 'AMD Ryzen 7 11700X3D (Hypothetical)', price: 500, socket: 'AM5', tdp: 120 },
        { id: 'cpu-169', name: 'Intel Core i9-18900K (Hypothetical)', price: 920, socket: 'LGA1851', tdp: 170 },
        { id: 'cpu-170', name: 'AMD Ryzen 9 11950X3D (Hypothetical)', price: 850, socket: 'AM5', tdp: 170 },
        { id: 'cpu-171', name: 'Intel Core Ultra 9 395K (Hypothetical)', price: 950, socket: 'LGA1851', tdp: 190 },
        { id: 'cpu-172', name: 'Intel Core i3-18100F (Hypothetical)', price: 150, socket: 'LGA1851', tdp: 65 },
        { id: 'cpu-173', name: 'AMD Ryzen 3 9300 (Hypothetical)', price: 170, socket: 'AM5', tdp: 65 },
        { id: 'cpu-174', name: 'Intel Core i5-18500 (Hypothetical)', price: 290, socket: 'LGA1851', tdp: 65 },
        { id: 'cpu-175', name: 'AMD Ryzen 5 9500 (Hypothetical)', price: 280, socket: 'AM5', tdp: 65 },
        { id: 'cpu:176', name: 'Intel Core i7-18700F (Hypothetical)', price: 470, socket: 'LGA1851', tdp: 125 },
        { id: 'cpu-177', name: 'AMD Ryzen 7 9700 (Hypothetical)', price: 380, socket: 'AM5', tdp: 65 },
        { id: 'cpu-178', name: 'Intel Core i9-18900KF (Hypothetical)', price: 890, socket: 'LGA1851', tdp: 170 },
        { id: 'cpu-179', name: 'AMD Ryzen 9 9900 (Hypothetical)', price: 540, socket: 'AM5', tdp: 65 },
        { id: 'cpu-180', name: 'Intel Core Ultra 7 385K (Hypothetical)', price: 780, socket: 'LGA1851', tdp: 150 }
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
        { id: 'gpu-20', name: 'NVIDIA RTX 5090 (Hypothetical)', price: 2500, power: 500, length: 360 },
        // Additional 80 GPU entries (hypothetical)
        { id: 'gpu-21', name: 'NVIDIA RTX 3060', price: 280, power: 170, length: 240 },
        { id: 'gpu-22', name: 'NVIDIA RTX 3060 Ti', price: 350, power: 200, length: 240 },
        { id: 'gpu-23', name: 'NVIDIA RTX 3070', price: 450, power: 220, length: 240 },
        { id: 'gpu-24', name: 'NVIDIA RTX 3070 Ti', price: 500, power: 290, length: 267 },
        { id: 'gpu-25', name: 'NVIDIA RTX 3080', price: 650, power: 320, length: 285 },
        { id: 'gpu-26', name: 'NVIDIA RTX 3080 Ti', price: 750, power: 350, length: 285 },
        { id: 'gpu-27', name: 'NVIDIA RTX 3090', price: 900, power: 350, length: 313 },
        { id: 'gpu-28', name: 'NVIDIA RTX 3090 Ti', price: 1100, power: 450, length: 313 },
        { id: 'gpu-29', name: 'AMD RX 6600 XT', price: 250, power: 160, length: 220 },
        { id: 'gpu-30', name: 'AMD RX 6700 XT', price: 350, power: 230, length: 267 },
        { id: 'gpu-31', name: 'AMD RX 6800', price: 450, power: 250, length: 267 },
        { id: 'gpu-32', name: 'AMD RX 6800 XT', price: 550, power: 300, length: 267 },
        { id: 'gpu-33', name: 'AMD RX 6900 XT', price: 650, power: 300, length: 267 },
        { id: 'gpu-34', name: 'AMD RX 6950 XT', price: 700, power: 335, length: 267 },
        { id: 'gpu-35', name: 'Intel Arc A380', price: 130, power: 75, length: 170 },
        { id: 'gpu-36', name: 'Intel Arc A770 8GB', price: 250, power: 225, length: 280 },
        { id: 'gpu-37', name: 'NVIDIA RTX 4050 (Hypothetical)', price: 250, power: 100, length: 180 },
        { id: 'gpu-38', name: 'AMD RX 7600 XT (Hypothetical)', price: 300, power: 180, length: 220 },
        { id: 'gpu-39', name: 'NVIDIA RTX 4060 Ti 16GB', price: 450, power: 165, length: 250 },
        { id: 'gpu-40', name: 'AMD RX 7900 GRE', price: 600, power: 260, length: 280 },
        { id: 'gpu-41', name: 'NVIDIA RTX 2060 Super', price: 180, power: 175, length: 228 },
        { id: 'gpu-42', name: 'AMD RX 5700 XT', price: 150, power: 225, length: 272 },
        { id: 'gpu-43', name: 'NVIDIA GTX 1660 Super', price: 160, power: 125, length: 229 },
        { id: 'gpu-44', name: 'AMD RX 580 8GB', price: 100, power: 185, length: 241 },
        { id: 'gpu-45', name: 'NVIDIA GTX 1070', price: 120, power: 150, length: 267 },
        { id: 'gpu-46', name: 'AMD RX 5500 XT 8GB', price: 120, power: 130, length: 220 },
        { id: 'gpu-47', name: 'NVIDIA RTX A2000 (Workstation)', price: 400, power: 70, length: 169 },
        { id: 'gpu-48', name: 'AMD Radeon Pro W6800 (Workstation)', price: 1500, power: 250, length: 267 },
        { id: 'gpu-49', name: 'NVIDIA Quadro RTX 4000 (Workstation)', price: 800, power: 160, length: 241 },
        { id: 'gpu-50', name: 'AMD FirePro W9100 (Workstation)', price: 600, power: 275, length: 305 },
        { id: 'gpu-51', name: 'NVIDIA RTX 4000 Ada (Workstation)', price: 1200, power: 100, length: 241 },
        { id: 'gpu-52', name: 'AMD Radeon Pro W7800 (Workstation)', price: 1000, power: 260, length: 267 },
        { id: 'gpu-53', name: 'NVIDIA CMP 170HX (Mining)', price: 2000, power: 400, length: 300 },
        { id: 'gpu-54', name: 'AMD Instinct MI250X (HPC)', price: 5000, power: 500, length: 350 },
        { id: 'gpu-55', name: 'NVIDIA H100 (HPC)', price: 10000, power: 700, length: 380 },
        { id: 'gpu-56', 'name': 'NVIDIA RTX 4070 Ti', 'price': 650, 'power': 285, 'length': 300 },
        { id: 'gpu-57', 'name': 'NVIDIA RTX 4080', 'price': 900, 'power': 320, 'length': 310 },
        { id: 'gpu-58', 'name': 'AMD RX 6700', 'price': 300, 'power': 175, 'length': 240 },
        { id: 'gpu-59', 'name': 'AMD RX 6650 XT', 'price': 280, 'power': 180, 'length': 230 },
        { id: 'gpu-60', 'name': 'Intel Arc A580', 'price': 180, 'power': 175, 'length': 250 },
        { id: 'gpu-61', 'name': 'NVIDIA RTX 2070 Super', 'price': 220, 'power': 215, 'length': 267 },
        { id: 'gpu-62', 'name': 'AMD RX 5600 XT', 'price': 140, 'power': 150, 'length': 230 },
        { id: 'gpu-63', 'name': 'NVIDIA GTX 1650 Super', 'price': 130, 'power': 100, 'length': 200 },
        { id: 'gpu-64', 'name': 'AMD RX 570 4GB', 'price': 80, 'power': 150, 'length': 230 },
        { id: 'gpu-65', 'name': 'NVIDIA GTX 1060 6GB', 'price': 90, 'power': 120, 'length': 250 },
        { id: 'gpu-66', 'name': 'AMD RX 5500 XT 4GB', 'price': 100, 'power': 130, 'length': 220 },
        { id: 'gpu-67', 'name': 'NVIDIA GT 1030', 'price': 70, 'power': 30, 'length': 150 },
        { id: 'gpu-68', 'name': 'AMD Radeon RX 6400', 'price': 120, 'power': 53, 'length': 165 },
        { id: 'gpu-69', 'name': 'NVIDIA RTX 3050 Ti Laptop (Mobile)', 'price': 250, 'power': 60, 'length': 0 },
        { id: 'gpu-70', 'name': 'AMD Radeon RX 6600M (Mobile)', 'price': 200, 'power': 80, 'length': 0 },
        { id: 'gpu-71', 'name': 'NVIDIA RTX 4070 Laptop (Mobile)', 'price': 600, 'power': 100, 'length': 0 },
        { id: 'gpu-72', 'name': 'AMD Radeon RX 7800M (Mobile)', 'price': 450, 'power': 120, 'length': 0 },
        { id: 'gpu-73', 'name': 'NVIDIA Quadro T1000 (Workstation Mobile)', 'price': 300, 'power': 50, 'length': 0 },
        { id: 'gpu-74', 'name': 'AMD Radeon Pro W5500M (Workstation Mobile)', 'price': 400, 'power': 85, 'length': 0 },
        { id: 'gpu-75', 'name': 'NVIDIA Tesla P100 (Data Center)', 'price': 1000, 'power': 300, 'length': 270 },
        { id: 'gpu-76', 'name': 'AMD MI100 (Data Center)', 'price': 1500, 'power': 300, 'length': 270 },
        { id: 'gpu-77', 'name': 'NVIDIA RTX 6000 Ada (Workstation)', 'price': 7000, 'power': 300, 'length': 330 },
        { id: 'gpu-78', 'name': 'AMD Radeon Pro W7900 (Workstation)', 'price': 3500, 'power': 295, 'length': 280 },
        { id: 'gpu-79', 'name': 'NVIDIA L40 (Data Center)', 'price': 8000, 'power': 300, 'length': 330 },
        { id: 'gpu-80', 'name': 'AMD Instinct MI300X (HPC)', 'price': 7000, 'power': 700, 'length': 380 },
        { id: 'gpu-81', 'name': 'NVIDIA RTX 5060 (Hypothetical)', 'price': 450, 'power': 150, 'length': 220 },
        { id: 'gpu-82', 'name': 'NVIDIA RTX 5060 Ti (Hypothetical)', 'price': 550, 'power': 180, 'length': 250 },
        { id: 'gpu-83', 'name': 'NVIDIA RTX 5070 Ti (Hypothetical)', 'price': 850, 'power': 300, 'length': 280 },
        { id: 'gpu-84', 'name': 'NVIDIA RTX 5080 Ti (Hypothetical)', 'price': 1500, 'power': 400, 'length': 330 },
        { id: 'gpu-85', 'name': 'AMD RX 8600 (Hypothetical)', 'price': 300, 'power': 180, 'length': 220 },
        { id: 'gpu-86', 'name': 'AMD RX 8600 XT (Hypothetical)', 'price': 380, 'power': 200, 'length': 240 },
        { id: 'gpu-87', 'name': 'AMD RX 8800 XT (Hypothetical)', 'price': 650, 'power': 300, 'length': 280 },
        { id: 'gpu-88', 'name': 'AMD RX 8900 XTX (Hypothetical)', 'price': 1100, 'power': 400, 'length': 310 },
        { id: 'gpu-89', 'name': 'Intel Arc B750 (Hypothetical)', 'price': 250, 'power': 200, 'length': 260 },
        { id: 'gpu-90', 'name': 'Intel Arc B770 (Hypothetical)', 'price': 320, 'power': 250, 'length': 290 },
        { id: 'gpu-91', 'name': 'NVIDIA RTX 6000 (Data Center)', 'price': 5000, 'power': 300, 'length': 330 },
        { id: 'gpu-92', 'name': 'AMD Instinct MI210 (Data Center)', 'price': 2500, 'power': 300, 'length': 270 },
        { id: 'gpu-93', 'name': 'NVIDIA A100 (Data Center)', 'price': 8000, 'power': 400, 'length': 350 },
        { id: 'gpu-94', 'name': 'AMD EPYC 7763 (CPU with iGPU)', 'price': 4000, 'power': 280, 'length': 0 },
        { id: 'gpu-95', 'name': 'Intel Iris Xe Max (Laptop)', 'price': 100, 'power': 25, 'length': 0 },
        { id: 'gpu-96', 'name': 'NVIDIA GeForce GT 710', 'price': 40, 'power': 19, 'length': 146 },
        { id: 'gpu-97', 'name': 'AMD Radeon R5 230', 'price': 35, 'power': 20, 'length': 168 },
        { id: 'gpu-98', 'name': 'NVIDIA Quadro NVS 310', 'price': 50, 'power': 19, 'length': 150 },
        { id: 'gpu-99', 'name': 'Intel HD Graphics 630 (Integrated)', 'price': 0, 'power': 15, 'length': 0 }, // Integrated graphics
        { id: 'gpu-100', 'name': 'AMD Radeon Graphics (Integrated)', 'price': 0, 'power': 15, 'length': 0 }, // Integrated graphics
        { id: 'gpu-101', name: 'NVIDIA RTX 3050 6GB', price: 220, power: 100, length: 170 },
        { id: 'gpu-102', name: 'AMD RX 6500 XT', price: 150, power: 107, length: 180 },
        { id: 'gpu-103', name: 'NVIDIA GTX 1630', price: 100, power: 75, length: 170 },
        { id: 'gpu-104', name: 'AMD Radeon RX 550', price: 60, power: 50, length: 150 },
        { id: 'gpu-105', name: 'NVIDIA GT 730', price: 50, power: 49, length: 145 },
        { id: 'gpu-106', name: 'Intel Arc A310', price: 110, power: 75, length: 170 },
        { id: 'gpu-107', name: 'NVIDIA CMP 30HX (Mining)', price: 300, power: 125, length: 200 },
        { id: 'gpu-108', name: 'AMD Radeon Pro WX 3200 (Workstation)', price: 150, power: 50, length: 170 },
        { id: 'gpu-109', name: 'NVIDIA Quadro P620 (Workstation)', price: 180, power: 40, length: 150 },
        { id: 'gpu-110', name: 'AMD Radeon RX 7600M XT (Mobile)', price: 350, power: 100, length: 0 },
        { id: 'gpu-111', name: 'NVIDIA RTX 4050 Laptop (Mobile)', price: 500, power: 80, length: 0 },
        { id: 'gpu-112', name: 'AMD Radeon RX 8500 XT (Hypothetical)', price: 280, power: 160, length: 200 },
        { id: 'gpu-113', name: 'NVIDIA RTX 5050 (Hypothetical)', price: 350, power: 120, length: 190 },
        { id: 'gpu-114', name: 'Intel Arc B580 (Hypothetical)', price: 200, power: 180, length: 250 },
        { id: 'gpu-115', name: 'AMD RX 8700 (Hypothetical)', price: 480, power: 250, length: 270 },
        { id: 'gpu-116', name: 'NVIDIA RTX 5060 12GB (Hypothetical)', price: 500, power: 160, length: 230 },
        { id: 'gpu-117', name: 'AMD RX 8800 (Hypothetical)', price: 580, power: 280, length: 280 },
        { id: 'gpu-118', name: 'Intel Arc B780 (Hypothetical)', price: 350, power: 270, length: 300 },
        { id: 'gpu-119', name: 'NVIDIA RTX 5070 Founders Edition (Hypothetical)', price: 720, power: 260, length: 270 },
        { id: 'gpu-120', name: 'AMD RX 8900 XT (Hypothetical)', price: 950, power: 380, length: 300 },
        { id: 'gpu-121', name: 'NVIDIA GeForce GT 1030 DDR4', price: 60, power: 20, length: 150 },
        { id: 'gpu-122', name: 'AMD Radeon RX 6700 XT (OEM)', price: 320, power: 230, length: 260 },
        { id: 'gpu-123', name: 'NVIDIA RTX A4000 (Workstation)', price: 1000, power: 140, length: 241 },
        { id: 'gpu-124', name: 'AMD Radeon Pro W6600 (Workstation)', price: 400, power: 100, length: 240 },
        { id: 'gpu-125', name: 'Intel Arc Pro A50 (Workstation)', price: 250, power: 75, length: 180 },
        { id: 'gpu-126', name: 'NVIDIA H200 (HPC)', price: 12000, power: 1000, length: 400 },
        { id: 'gpu-127', name: 'AMD Instinct MI300A (HPC)', price: 6000, power: 550, length: 360 },
        { id: 'gpu-128', name: 'NVIDIA RTX 4070 Laptop 8GB (Mobile)', price: 580, power: 90, length: 0 },
        { id: 'gpu-129', name: 'AMD Radeon RX 7700S (Mobile)', price: 420, power: 80, length: 0 },
        { id: 'gpu-130', name: 'Intel Arc A730M (Mobile)', price: 250, power: 65, length: 0 },
        { id: 'gpu-131', name: 'NVIDIA CMP 90HX (Mining)', price: 800, power: 320, length: 280 },
        { id: 'gpu-132', name: 'AMD Radeon RX 6900 XT LC', price: 800, power: 330, length: 280 },
        { id: 'gpu-133', name: 'NVIDIA Titan RTX', price: 1500, power: 280, length: 267 },
        { id: 'gpu-134', name: 'Intel Iris Xe (Integrated)', price: 0, power: 28, length: 0 },
        { id: 'gpu-135', name: 'NVIDIA GeForce MX570 (Laptop)', price: 150, power: 30, length: 0 },
        { id: 'gpu-136', name: 'AMD Radeon 610M (Laptop)', price: 100, power: 15, length: 0 },
        { id: 'gpu-137', name: 'NVIDIA RTX 5070 Max-Q (Hypothetical Mobile)', price: 650, power: 90, length: 0 },
        { id: 'gpu-138', name: 'AMD RX 8800S (Hypothetical Mobile)', price: 500, power: 110, length: 0 },
        { id: 'gpu-139', name: 'Intel Arc B770M (Hypothetical Mobile)', price: 300, power: 80, length: 0 },
        { id: 'gpu-140', name: 'NVIDIA GeForce GT 1010', price: 65, power: 30, length: 150 },
        { id: 'gpu-141', name: 'AMD Radeon RX 6300', price: 100, power: 50, length: 160 },
        { id: 'gpu-142', name: 'NVIDIA Quadro T400', price: 120, power: 30, length: 140 },
        { id: 'gpu-143', name: 'AMD Radeon Pro W6400', price: 200, power: 50, length: 170 },
        { id: 'gpu-144', name: 'Intel Arc Pro A40', price: 180, power: 50, length: 160 },
        { id: 'gpu-145', name: 'NVIDIA A40', price: 4000, power: 300, length: 330 },
        { id: 'gpu-146', name: 'AMD Instinct MI100', price: 2000, power: 300, length: 270 },
        { id: 'gpu-147', name: 'NVIDIA Tesla T4', price: 1500, power: 70, length: 168 },
        { id: 'gpu-148', name: 'AMD Radeon Pro V520 (Virtual)', price: 1000, power: 75, length: 0 },
        { id: 'gpu-149', name: 'Intel Data Center GPU Flex 140', price: 1500, power: 150, length: 270 },
        { id: 'gpu-150', name: 'NVIDIA RTX 5090 Ti (Hypothetical)', price: 3000, power: 600, length: 380 }
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
        { id: 'mobo-20', name: 'Gigabyte Z890I AORUS Ultra (Hypothetical)', price: 300, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ITX' },
        // Additional 80 Motherboard entries (hypothetical)
        { id: 'mobo-21', name: 'ASUS Prime B660M-A D4', price: 110, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'mATX' },
        { id: 'mobo-22', name: 'MSI PRO Z690-A WiFi DDR4', price: 180, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-23', name: 'ASRock B650M Pro RS WiFi', price: 160, socket: 'AM5', ramType: 'DDR5', formFactor: 'mATX' },
        { id: 'mobo-24', name: 'Gigabyte B650 AORUS Elite AX', price: 220, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-25', name: 'MSI MPG Z790 Carbon WiFi', price: 320, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-26', name: 'ASUS ROG Strix B650-A Gaming WiFi', price: 250, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-27', name: 'Gigabyte Z790 AORUS Master', price: 400, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-28', name: 'ASRock B860 Steel Legend (Hypothetical)', price: 200, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-29', name: 'MSI PRO X870-P WiFi (Hypothetical)', price: 270, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-30', name: 'Gigabyte B860 AORUS Elite AX (Hypothetical)', price: 250, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-31', name: 'ASUS Prime Z690-P D4', price: 150, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-32', name: 'MSI MAG B550 Tomahawk', price: 140, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-33', name: 'Gigabyte B550 AORUS Elite V2', price: 130, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-34', name: 'ASRock B450M Pro4 R2.0', price: 80, socket: 'AM4', ramType: 'DDR4', formFactor: 'mATX' },
        { id: 'mobo-35', name: 'MSI B450 TOMAHAWK MAX II', price: 90, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-36', name: 'ASUS Prime X570-P', price: 180, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-37', name: 'Gigabyte X570 AORUS Elite WiFi', price: 200, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-38', name: 'ASUS TUF Gaming X570-PLUS WiFi', price: 190, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-39', name: 'MSI MEG X570 ACE', price: 300, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-40', name: 'ASRock Z590 Steel Legend', price: 160, socket: 'LGA1200', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-41', name: 'Gigabyte Z590 AORUS Elite', price: 170, socket: 'LGA1200', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-42', name: 'MSI MPG Z490 Gaming Edge WiFi', price: 150, socket: 'LGA1200', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-43', name: 'ASUS Prime B460M-A', price: 70, socket: 'LGA1200', ramType: 'DDR4', formFactor: 'mATX' },
        { id: 'mobo-44', name: 'Gigabyte B460M DS3H', price: 65, socket: 'LGA1200', ramType: 'DDR4', formFactor: 'mATX' },
        { id: 'mobo-45', name: 'ASRock H470 Steel Legend', price: 100, socket: 'LGA1200', ramType: 'DDR4', formFactor: 'ATX' },
        { id: 'mobo-46', 'name': 'ASUS Prime H610M-K', 'price': 70, 'socket': 'LGA1700', 'ramType': 'DDR4', 'formFactor': 'mATX' },
        { id: 'mobo-47', 'name': 'MSI PRO H610M-G', 'price': 75, 'socket': 'LGA1700', 'ramType': 'DDR4', 'formFactor': 'mATX' },
        { id: 'mobo-48', 'name': 'Gigabyte B760 Gaming X AX', 'price': 170, 'socket': 'LGA1700', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-49', 'name': 'ASRock B760 Pro RS', 'price': 150, 'socket': 'LGA1700', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-50', 'name': 'MSI PRO Z790-P WiFi', 'price': 220, 'socket': 'LGA1700', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-51', 'name': 'Gigabyte Z790 AORUS Pro X', 'price': 300, 'socket': 'LGA1700', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-52', 'name': 'ASUS Prime B860M-A (Hypothetical)', 'price': 140, 'socket': 'LGA1851', 'ramType': 'DDR5', 'formFactor': 'mATX' },
        { id: 'mobo-53', 'name': 'MSI MAG B860 Tomahawk WiFi (Hypothetical)', 'price': 210, 'socket': 'LGA1851', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-54', 'name': 'Gigabyte X870 AORUS Pro AX (Hypothetical)', 'price': 350, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-55', 'name': 'ASRock X870E Nova WiFi (Hypothetical)', 'price': 420, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-56', 'name': 'ASUS ROG Crosshair X870E Extreme (Hypothetical)', 'price': 600, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'EATX' },
        { id: 'mobo-57', 'name': 'MSI PRO A620M-G', 'price': 95, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'mATX' },
        { id: 'mobo-58', 'name': 'Gigabyte B650 Gaming X AX', 'price': 190, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-59', 'name': 'ASUS TUF Gaming A620M-PLUS WiFi', 'price': 110, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'mATX' },
        { id: 'mobo-60', 'name': 'MSI PRO B650M-A WiFi', 'price': 150, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'mATX' },
        { id: 'mobo-61', 'name': 'Gigabyte B650I AORUS Ultra', 'price': 250, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'ITX' },
        { id: 'mobo-62', 'name': 'ASUS ROG Strix X670E-I Gaming WiFi', 'price': 400, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'ITX' },
        { id: 'mobo-63', 'name': 'ASRock Z890 Phantom Gaming Nova WiFi (Hypothetical)', 'price': 550, 'socket': 'LGA1851', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-64', 'name': 'MSI MPG Z890 Edge WiFi (Hypothetical)', 'price': 380, 'socket': 'LGA1851', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-65', 'name': 'Gigabyte H810M S2H (Hypothetical)', 'price': 85, 'socket': 'LGA1851', 'ramType': 'DDR5', 'formFactor': 'mATX' },
        { id: 'mobo-66', 'name': 'ASUS Prime B850-Plus (Hypothetical)', 'price': 170, 'socket': 'LGA1851', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-67', 'name': 'MSI MAG B850 Tomahawk (Hypothetical)', 'price': 230, 'socket': 'LGA1851', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-68', 'name': 'Gigabyte X870E AORUS Master (Hypothetical)', 'price': 500, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-69', 'name': 'ASRock B850M Pro RS (Hypothetical)', 'price': 160, 'socket': 'LGA1851', 'ramType': 'DDR5', 'formFactor': 'mATX' },
        { id: 'mobo-70', 'name': 'MSI PRO B850M-A WiFi (Hypothetical)', 'price': 180, 'socket': 'LGA1851', 'ramType': 'DDR5', 'formFactor': 'mATX' },
        { id: 'mobo-71', 'name': 'Gigabyte A620M S2H', 'price': 85, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'mATX' },
        { id: 'mobo-72', 'name': 'ASUS Prime B650M-A II', 'price': 145, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'mATX' },
        { id: 'mobo-73', 'name': 'MSI PRO B650-S WiFi', 'price': 175, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-74', 'name': 'Gigabyte B650 GAMING X AX V2', 'price': 195, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-75', 'name': 'ASRock B650E PG Riptide WiFi', 'price': 280, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-76', 'name': 'MSI MPG B650I Edge WiFi', 'price': 220, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'ITX' },
        { id: 'mobo-77', 'name': 'ASUS ROG Strix B650-F Gaming WiFi', 'price': 270, 'socket': 'AM5', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-78', 'name': 'Gigabyte B760M GAMING X AX', 'price': 155, 'socket': 'LGA1700', 'ramType': 'DDR5', 'formFactor': 'mATX' },
        { id: 'mobo-79', 'name': 'ASRock B760M Steel Legend WiFi', 'price': 170, 'socket': 'LGA1700', 'ramType': 'DDR5', 'formFactor': 'mATX' },
        { id: 'mobo-80', 'name': 'MSI MAG B760M Mortar WiFi', 'price': 185, 'socket': 'LGA1700', 'ramType': 'DDR5', 'formFactor': 'mATX' },
        { id: 'mobo-81', 'name': 'Gigabyte H610M S2H DDR4', 'price': 75, 'socket': 'LGA1700', 'ramType': 'DDR4', 'formFactor': 'mATX' },
        { id: 'mobo-82', 'name': 'ASUS Prime H510M-E', 'price': 65, 'socket': 'LGA1200', 'ramType': 'DDR4', 'formFactor': 'mATX' },
        { id: 'mobo-83', 'name': 'MSI PRO B550M-VC WiFi', 'price': 120, 'socket': 'AM4', 'ramType': 'DDR4', 'formFactor': 'mATX' },
        { id: 'mobo-84', 'name': 'Gigabyte B450M GAMING', 'price': 75, 'socket': 'AM4', 'ramType': 'DDR4', 'formFactor': 'mATX' },
        { id: 'mobo-85', 'name': 'ASRock H670M Pro RS', 'price': 110, 'socket': 'LGA1700', 'ramType': 'DDR4', 'formFactor': 'mATX' },
        { id: 'mobo-86', 'name': 'MSI PRO Z690-A WiFi DDR5', 'price': 200, 'socket': 'LGA1700', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-87', 'name': 'Gigabyte Z690 UD', 'price': 170, 'socket': 'LGA1700', 'ramType': 'DDR4', 'formFactor': 'ATX' },
        { id: 'mobo-88', 'name': 'ASUS ROG Strix Z690-F Gaming WiFi', 'price': 300, 'socket': 'LGA1700', 'ramType': 'DDR5', 'formFactor': 'ATX' },
        { id: 'mobo-89', 'name': 'ASRock B550 Phantom Gaming 4', 'price': 100, 'socket': 'AM4', 'ramType': 'DDR4', 'formFactor': 'ATX' },
        { id: 'mobo-90', 'name': 'MSI PRO B550-A PRO', 'price': 110, 'socket': 'AM4', 'ramType': 'DDR4', 'formFactor': 'ATX' },
        { id: 'mobo-91', 'name': 'Gigabyte X570S AORUS Elite AX', 'price': 250, 'socket': 'AM4', 'ramType': 'DDR4', 'formFactor': 'ATX' },
        { id: 'mobo-92', name: 'MSI PRO B760M-A WiFi', price: 140, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'mATX' },
        { id: 'mobo-93', name: 'ASUS Prime Z790-A WiFi', price: 280, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-94', name: 'Gigabyte Z890 Gaming X AX (Hypothetical)', price: 290, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-95', name: 'ASRock B860M-HDV (Hypothetical)', price: 120, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'mATX' },
        { id: 'mobo-96', name: 'MSI PRO X870-A WiFi (Hypothetical)', price: 300, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-97', name: 'ASUS TUF Gaming X870E-PLUS WiFi (Hypothetical)', price: 380, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-98', name: 'Gigabyte A620I AX (ITX)', price: 160, socket: 'AM5', ramType: 'DDR5', formFactor: 'ITX' },
        { id: 'mobo-99', name: 'ASRock B650M-HDV', price: 130, socket: 'AM5', ramType: 'DDR5', formFactor: 'mATX' },
        { id: 'mobo-100', name: 'MSI MAG B650M Mortar WiFi', price: 180, socket: 'AM5', ramType: 'DDR5', formFactor: 'mATX' },
        { id: 'mobo-101', name: 'Gigabyte B760M DS3H DDR4', price: 120, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'mATX' },
        { id: 'mobo-102', name: 'ASUS ROG Strix Z790-F Gaming WiFi II', price: 350, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-103', name: 'MSI PRO Z790-A WiFi', price: 250, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-104', name: 'ASRock Z890 Steel Legend (Hypothetical)', price: 400, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-105', name: 'Gigabyte B860M Gaming X (Hypothetical)', price: 160, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'mATX' },
        { id: 'mobo-106', name: 'ASUS Prime X870-P (Hypothetical)', price: 320, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-107', name: 'MSI PRO A620M-A', price: 85, socket: 'AM5', ramType: 'DDR5', formFactor: 'mATX' },
        { id: 'mobo-108', name: 'ASRock B650 PG Lightning', price: 170, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-109', name: 'Gigabyte B650M K', price: 110, socket: 'AM5', ramType: 'DDR5', formFactor: 'mATX' },
        { id: 'mobo-110', name: 'MSI PRO B650M-G WiFi', price: 160, socket: 'AM5', ramType: 'DDR5', formFactor: 'mATX' },
        { id: 'mobo-111', name: 'ASUS Prime H670M-PLUS D4', price: 120, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'mATX' },
        { id: 'mobo-112', name: 'Gigabyte B660M Gaming X DDR4', price: 100, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'mATX' },
        { id: 'mobo-113', name: 'MSI MAG B760M Bazooka WiFi', price: 190, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'mATX' },
        { id: 'mobo-114', name: 'ASRock Z790 LiveMixer', price: 260, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-115', name: 'Gigabyte Z790 AORUS ELITE AX ICE', price: 320, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-116', name: 'ASUS Prime B860M-C (Hypothetical)', price: 150, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'mATX' },
        { id: 'mobo-117', name: 'MSI MAG Z890 Edge WiFi (Hypothetical)', price: 400, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-118', name: 'Gigabyte X870 AORUS Pro X (Hypothetical)', price: 380, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX' },
        { id: 'mobo-119', name: 'ASRock X870E Taichi Carrara (Hypothetical)', price: 500, socket: 'AM5', ramType: 'DDR5', formFactor: 'EATX' },
        { id: 'mobo-120', name: 'MSI PRO B850-A (Hypothetical)', price: 190, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX' }
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
