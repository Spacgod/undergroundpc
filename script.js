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
    ram: [
    { id: 'ram-1', name: 'Corsair Vengeance LPX 16GB DDR4 3200MHz', price: 65, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-2', name: 'G.Skill Ripjaws V 32GB DDR4 3600MHz', price: 120, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-3', name: 'Crucial Ballistix 8GB DDR4 2666MHz', price: 35, capacity: 8, type: 'DDR4', speed: 2666 },
    { id: 'ram-4', name: 'Kingston Fury Beast 16GB DDR4 3200MHz', price: 70, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-5', name: 'TeamGroup T-Force Vulcan Z 32GB DDR4 3000MHz', price: 110, capacity: 32, type: 'DDR4', speed: 3000 },
    { id: 'ram-6', name: 'ADATA XPG Spectrix D41 16GB DDR4 3200MHz', price: 80, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-7', name: 'HyperX Fury RGB 32GB DDR4 3466MHz', price: 130, capacity: 32, type: 'DDR4', speed: 3466 },
    { id: 'ram-8', name: 'Patriot Viper Steel 8GB DDR4 3200MHz', price: 40, capacity: 8, type: 'DDR4', speed: 3200 },
    { id: 'ram-9', name: 'Mushkin Enhanced Redline 16GB DDR4 3600MHz', price: 75, capacity: 16, type: 'DDR4', speed: 3600 },
    { id: 'ram-10', name: 'OLOy DDR4 RAM 16GB 3000MHz', price: 60, capacity: 16, type: 'DDR4', speed: 3000 },
    { id: 'ram-11', name: 'PNY XLR8 Gaming EPIC-X RGB 16GB DDR4 3200MHz', price: 68, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-12', name: 'Silicon Power Value Gaming DDR4 16GB 3200MHz', price: 55, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-13', name: 'Thermaltake TOUGHRAM RGB 16GB DDR4 3600MHz', price: 90, capacity: 16, type: 'DDR4', speed: 3600 },
    { id: 'ram-14', name: 'V-Color Prism II RGB 32GB DDR4 3200MHz', price: 115, capacity: 32, type: 'DDR4', speed: 3200 },
    { id: 'ram-15', name: 'ZADAK MOAB RGB DDR4 16GB 3600MHz', price: 85, capacity: 16, type: 'DDR4', speed: 3600 },
    { id: 'ram-16', name: 'Apacer NOX RGB 16GB DDR4 3200MHz', price: 62, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-17', name: 'TeamGroup T-Force Delta RGB 16GB DDR4 3200MHz', price: 72, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-18', name: 'Corsair Vengeance RGB Pro SL 32GB DDR4 3600MHz', price: 125, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-19', name: 'G.Skill Trident Z Neo 16GB DDR4 3600MHz', price: 95, capacity: 16, type: 'DDR4', speed: 3600 },
    { id: 'ram-20', name: 'Crucial Ballistix RGB 16GB DDR4 3200MHz', price: 78, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-21', name: 'Kingston FURY Renegade 32GB DDR4 4000MHz', price: 140, capacity: 32, type: 'DDR4', speed: 4000 },
    { id: 'ram-22', name: 'TeamGroup T-Force XTREEM ARGB 16GB DDR4 3600MHz', price: 105, capacity: 16, type: 'DDR4', speed: 3600 },
    { id: 'ram-23', name: 'ADATA XPG GAMMIX D20 8GB DDR4 3200MHz', price: 38, capacity: 8, type: 'DDR4', speed: 3200 },
    { id: 'ram-24', name: 'HyperX Predator RGB 32GB DDR4 4000MHz', price: 150, capacity: 32, type: 'DDR4', speed: 4000 },
    { id: 'ram-25', name: 'Patriot Viper 4 Blackout 16GB DDR4 3600MHz', price: 82, capacity: 16, type: 'DDR4', speed: 3600 },
    { id: 'ram-26', name: 'Mushkin Redline Lumina 16GB DDR4 3200MHz', price: 73, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-27', name: 'OLOy WarHawk RGB 32GB DDR4 3600MHz', price: 118, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-28', name: 'PNY XLR8 Gaming REVEL RGB 16GB DDR4 3000MHz', price: 67, capacity: 16, type: 'DDR4', speed: 3000 },
    { id: 'ram-29', name: 'Silicon Power XPOWER Turbine 8GB DDR4 3200MHz', price: 42, capacity: 8, type: 'DDR4', speed: 3200 },
    { id: 'ram-30', name: 'Thermaltake TOUGHRAM Z-ONE RGB 32GB DDR4 3200MHz', price: 108, capacity: 32, type: 'DDR4', speed: 3200 },
    { id: 'ram-31', name: 'V-Color Manta XSky RGB 16GB DDR4 3600MHz', price: 92, capacity: 16, type: 'DDR4', speed: 3600 },
    { id: 'ram-32', name: 'ZADAK Spark RGB DDR4 32GB 3200MHz', price: 100, capacity: 32, type: 'DDR4', speed: 3200 },
    { id: 'ram-33', name: 'Apacer Panther Rage RGB 16GB DDR4 3600MHz', price: 88, capacity: 16, type: 'DDR4', speed: 3600 },
    { id: 'ram-34', name: 'Corsair Vengeance LPX 32GB DDR4 3000MHz', price: 105, capacity: 32, type: 'DDR4', speed: 3000 },
    { id: 'ram-35', name: 'G.Skill Ripjaws V 16GB DDR4 3200MHz', price: 68, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-36', name: 'Crucial Ballistix 32GB DDR4 3600MHz', price: 112, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-37', name: 'Kingston Fury Beast 8GB DDR4 2666MHz', price: 37, capacity: 8, type: 'DDR4', speed: 2666 },
    { id: 'ram-38', name: 'TeamGroup T-Force Vulcan Z 16GB DDR4 3200MHz', price: 63, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-39', name: 'ADATA XPG Spectrix D41 32GB DDR4 3600MHz', price: 105, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-40', name: 'HyperX Fury RGB 16GB DDR4 3000MHz', price: 70, capacity: 16, type: 'DDR4', speed: 3000 },
    { id: 'ram-41', name: 'Patriot Viper Steel 32GB DDR4 3000MHz', price: 98, capacity: 32, type: 'DDR4', speed: 3000 },
    { id: 'ram-42', name: 'Mushkin Enhanced Redline 8GB DDR4 3200MHz', price: 45, capacity: 8, type: 'DDR4', speed: 3200 },
    { id: 'ram-43', name: 'OLOy DDR4 RAM 32GB 3600MHz', price: 110, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-44', name: 'PNY XLR8 Gaming EPIC-X RGB 32GB DDR4 3600MHz', price: 122, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-45', name: 'Silicon Power Value Gaming DDR4 8GB 2666MHz', price: 33, capacity: 8, type: 'DDR4', speed: 2666 },
    { id: 'ram-46', name: 'Thermaltake TOUGHRAM RGB 32GB DDR4 3200MHz', price: 110, capacity: 32, type: 'DDR4', speed: 3200 },
    { id: 'ram-47', name: 'V-Color Prism II RGB 16GB DDR4 3000MHz', price: 69, capacity: 16, type: 'DDR4', speed: 3000 },
    { id: 'ram-48', name: 'ZADAK MOAB RGB DDR4 32GB 3466MHz', price: 115, capacity: 32, type: 'DDR4', speed: 3466 },
    { id: 'ram-49', name: 'Apacer NOX RGB 32GB DDR4 3200MHz', price: 102, capacity: 32, type: 'DDR4', speed: 3200 },
    { id: 'ram-50', name: 'TeamGroup T-Force Delta RGB 8GB DDR4 3000MHz', price: 48, capacity: 8, type: 'DDR4', speed: 3000 },
    { id: 'ram-51', name: 'Corsair Vengeance LPX 64GB DDR4 3200MHz', price: 230, capacity: 64, type: 'DDR4', speed: 3200 },
    { id: 'ram-52', name: 'G.Skill Ripjaws V 64GB DDR4 3600MHz', price: 250, capacity: 64, type: 'DDR4', speed: 3600 },
    { id: 'ram-53', name: 'Crucial Ballistix 64GB DDR4 3000MHz', price: 210, capacity: 64, type: 'DDR4', speed: 3000 },
    { id: 'ram-54', name: 'Kingston Fury Beast 64GB DDR4 3600MHz', price: 240, capacity: 64, type: 'DDR4', speed: 3600 },
    { id: 'ram-55', name: 'TeamGroup T-Force Vulcan Z 64GB DDR4 3200MHz', price: 220, capacity: 64, type: 'DDR4', speed: 3200 },
    { id: 'ram-56', name: 'ADATA XPG Spectrix D41 64GB DDR4 3600MHz', price: 245, capacity: 64, type: 'DDR4', speed: 3600 },
    { id: 'ram-57', name: 'HyperX Fury RGB 64GB DDR4 3200MHz', price: 235, capacity: 64, type: 'DDR4', speed: 3200 },
    { id: 'ram-58', name: 'Patriot Viper Steel 64GB DDR4 3600MHz', price: 238, capacity: 64, type: 'DDR4', speed: 3600 },
    { id: 'ram-59', name: 'Mushkin Enhanced Redline 64GB DDR4 3000MHz', price: 215, capacity: 64, type: 'DDR4', speed: 3000 },
    { id: 'ram-60', name: 'OLOy DDR4 RAM 64GB 3200MHz', price: 205, capacity: 64, type: 'DDR4', speed: 3200 },
    { id: 'ram-61', name: 'PNY XLR8 Gaming EPIC-X RGB 64GB DDR4 3600MHz', price: 255, capacity: 64, type: 'DDR4', speed: 3600 },
    { id: 'ram-62', name: 'Silicon Power Value Gaming DDR4 64GB 3200MHz', price: 200, capacity: 64, type: 'DDR4', speed: 3200 },
    { id: 'ram-63', name: 'Thermaltake TOUGHRAM RGB 64GB DDR4 3600MHz', price: 260, capacity: 64, type: 'DDR4', speed: 3600 },
    { id: 'ram-64', name: 'V-Color Prism II RGB 64GB DDR4 3200MHz', price: 225, capacity: 64, type: 'DDR4', speed: 3200 },
    { id: 'ram-65', name: 'ZADAK MOAB RGB DDR4 64GB 3466MHz', price: 248, capacity: 64, type: 'DDR4', speed: 3466 },
    { id: 'ram-66', name: 'Apacer NOX RGB 64GB DDR4 3200MHz', price: 218, capacity: 64, type: 'DDR4', speed: 3200 },
    { id: 'ram-67', name: 'TeamGroup T-Force Delta RGB 64GB DDR4 3000MHz', price: 212, capacity: 64, type: 'DDR4', speed: 3000 },
    { id: 'ram-68', name: 'Corsair Vengeance LPX 16GB DDR5 4800MHz', price: 85, capacity: 16, type: 'DDR5', speed: 4800 },
    { id: 'ram-69', name: 'G.Skill Ripjaws S5 32GB DDR5 5600MHz', price: 160, capacity: 32, type: 'DDR5', speed: 5600 },
    { id: 'ram-70', name: 'Crucial Pro 8GB DDR5 5200MHz', price: 55, capacity: 8, type: 'DDR5', speed: 5200 },
    { id: 'ram-71', name: 'Kingston Fury Beast 16GB DDR5 5200MHz', price: 90, capacity: 16, type: 'DDR5', speed: 5200 },
    { id: 'ram-72', name: 'TeamGroup T-Force Delta RGB 32GB DDR5 6000MHz', price: 180, capacity: 32, type: 'DDR5', speed: 6000 },
    { id: 'ram-73', name: 'ADATA XPG Lancer Blade 16GB DDR5 6000MHz', price: 105, capacity: 16, type: 'DDR5', speed: 6000 },
    { id: 'ram-74', name: 'HyperX Fury Renegade RGB 32GB DDR5 6400MHz', price: 200, capacity: 32, type: 'DDR5', speed: 6400 },
    { id: 'ram-75', name: 'Patriot Viper Venom 8GB DDR5 5600MHz', price: 60, capacity: 8, type: 'DDR5', speed: 5600 },
    { id: 'ram-76', name: 'Mushkin Redline 16GB DDR5 5200MHz', price: 95, capacity: 16, type: 'DDR5', speed: 5200 },
    { id: 'ram-77', name: 'OLOy Blade RGB 32GB DDR5 5600MHz', price: 170, capacity: 32, type: 'DDR5', speed: 5600 },
    { id: 'ram-78', name: 'PNY XLR8 Gaming MAKO RGB 16GB DDR5 5200MHz', price: 88, capacity: 16, type: 'DDR5', speed: 5200 },
    { id: 'ram-79', name: 'Silicon Power XPOWER Zenith 8GB DDR5 4800MHz', price: 50, capacity: 8, type: 'DDR5', speed: 4800 },
    { id: 'ram-80', name: 'Thermaltake TOUGHRAM RC 32GB DDR5 5600MHz', price: 175, capacity: 32, type: 'DDR5', speed: 5600 },
    { id: 'ram-81', name: 'V-Color Manta RGB 16GB DDR5 6000MHz', price: 110, capacity: 16, type: 'DDR5', speed: 6000 },
    { id: 'ram-82', name: 'ZADAK TWIN RGB DDR5 32GB 5200MHz', price: 165, capacity: 32, type: 'DDR5', speed: 5200 },
    { id: 'ram-83', name: 'Apacer NOX RGB 16GB DDR5 5600MHz', price: 98, capacity: 16, type: 'DDR5', speed: 5600 },
    { id: 'ram-84', name: 'Corsair Vengeance 32GB DDR5 5200MHz', price: 155, capacity: 32, type: 'DDR5', speed: 5200 },
    { id: 'ram-85', name: 'G.Skill Trident Z5 RGB 16GB DDR5 6000MHz', price: 125, capacity: 16, type: 'DDR5', speed: 6000 },
    { id: 'ram-86', name: 'Crucial Pro 32GB DDR5 4800MHz', price: 140, capacity: 32, type: 'DDR5', speed: 4800 },
    { id: 'ram-87', name: 'Kingston Fury Beast 8GB DDR5 4800MHz', price: 52, capacity: 8, type: 'DDR5', speed: 4800 },
    { id: 'ram-88', name: 'TeamGroup T-Force Vulcan 16GB DDR5 5600MHz', price: 95, capacity: 16, type: 'DDR5', speed: 5600 },
    { id: 'ram-89', name: 'ADATA XPG Lancer RGB 32GB DDR5 5200MHz', price: 158, capacity: 32, type: 'DDR5', speed: 5200 },
    { id: 'ram-90', name: 'HyperX Fury Beast 16GB DDR5 4800MHz', price: 82, capacity: 16, type: 'DDR5', speed: 4800 },
    { id: 'ram-91', name: 'Patriot Viper Venom 32GB DDR5 6000MHz', price: 178, capacity: 32, type: 'DDR5', speed: 6000 },
    { id: 'ram-92', name: 'Mushkin Redline 8GB DDR5 5600MHz', price: 62, capacity: 8, type: 'DDR5', speed: 5600 },
    { id: 'ram-93', name: 'OLOy Blade RGB 16GB DDR5 6000MHz', price: 115, capacity: 16, type: 'DDR5', speed: 6000 },
    { id: 'ram-94', name: 'PNY XLR8 Gaming MAKO RGB 32GB DDR5 6000MHz', price: 185, capacity: 32, type: 'DDR5', speed: 6000 },
    { id: 'ram-95', name: 'Silicon Power XPOWER Zenith 16GB DDR5 5200MHz', price: 80, capacity: 16, type: 'DDR5', speed: 5200 },
    { id: 'ram-96', name: 'Thermaltake TOUGHRAM RC 16GB DDR5 6000MHz', price: 118, capacity: 16, type: 'DDR5', speed: 6000 },
    { id: 'ram-97', name: 'V-Color Manta RGB 32GB DDR5 5200MHz', price: 168, capacity: 32, type: 'DDR5', speed: 5200 },
    { id: 'ram-98', name: 'ZADAK TWIN RGB DDR5 16GB 5600MHz', price: 102, capacity: 16, type: 'DDR5', speed: 5600 },
    { id: 'ram-99', name: 'Apacer NOX RGB 32GB DDR5 6000MHz', price: 172, capacity: 32, type: 'DDR5', speed: 6000 },
    { id: 'ram-100', name: 'TeamGroup T-Force Delta RGB 16GB DDR5 5200MHz', price: 90, capacity: 16, type: 'DDR5', speed: 5200 },
    { id: 'ram-101', name: 'Corsair Vengeance LPX 16GB DDR4 3000MHz', price: 60, capacity: 16, type: 'DDR4', speed: 3000 },
    { id: 'ram-102', name: 'G.Skill Ripjaws V 32GB DDR4 3200MHz', price: 115, capacity: 32, type: 'DDR4', speed: 3200 },
    { id: 'ram-103', name: 'Crucial Ballistix 8GB DDR4 3000MHz', price: 38, capacity: 8, type: 'DDR4', speed: 3000 },
    { id: 'ram-104', name: 'Kingston Fury Beast 16GB DDR4 2666MHz', price: 65, capacity: 16, type: 'DDR4', speed: 2666 },
    { id: 'ram-105', name: 'TeamGroup T-Force Vulcan Z 32GB DDR4 3600MHz', price: 125, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-106', name: 'ADATA XPG Spectrix D41 16GB DDR4 3000MHz', price: 75, capacity: 16, type: 'DDR4', speed: 3000 },
    { id: 'ram-107', name: 'HyperX Fury RGB 32GB DDR4 3200MHz', price: 128, capacity: 32, type: 'DDR4', speed: 3200 },
    { id: 'ram-108', name: 'Patriot Viper Steel 8GB DDR4 2666MHz', price: 37, capacity: 8, type: 'DDR4', speed: 2666 },
    { id: 'ram-109', name: 'Mushkin Enhanced Redline 16GB DDR4 3200MHz', price: 70, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-110', name: 'OLOy DDR4 RAM 16GB 3600MHz', price: 70, capacity: 16, type: 'DDR4', speed: 3600 },
    { id: 'ram-111', name: 'PNY XLR8 Gaming EPIC-X RGB 16GB DDR4 2666MHz', price: 62, capacity: 16, type: 'DDR4', speed: 2666 },
    { id: 'ram-112', name: 'Silicon Power Value Gaming DDR4 16GB 3000MHz', price: 58, capacity: 16, type: 'DDR4', speed: 3000 },
    { id: 'ram-113', name: 'Thermaltake TOUGHRAM RGB 16GB DDR4 3200MHz', price: 88, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-114', name: 'V-Color Prism II RGB 32GB DDR4 3600MHz', price: 120, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-115', name: 'ZADAK MOAB RGB DDR4 16GB 3200MHz', price: 80, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-116', name: 'Apacer NOX RGB 16GB DDR4 3000MHz', price: 65, capacity: 16, type: 'DDR4', speed: 3000 },
    { id: 'ram-117', name: 'TeamGroup T-Force Delta RGB 16GB DDR4 2666MHz', price: 68, capacity: 16, type: 'DDR4', speed: 2666 },
    { id: 'ram-118', name: 'Corsair Vengeance RGB Pro SL 32GB DDR4 3200MHz', price: 118, capacity: 32, type: 'DDR4', speed: 3200 },
    { id: 'ram-119', name: 'G.Skill Trident Z Neo 16GB DDR4 3200MHz', price: 90, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-120', name: 'Crucial Ballistix RGB 16GB DDR4 3000MHz', price: 75, capacity: 16, type: 'DDR4', speed: 3000 },
    { id: 'ram-121', name: 'Kingston FURY Renegade 32GB DDR4 3600MHz', price: 135, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-122', name: 'TeamGroup T-Force XTREEM ARGB 16GB DDR4 3200MHz', price: 98, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-123', name: 'ADATA XPG GAMMIX D20 8GB DDR4 3000MHz', price: 40, capacity: 8, type: 'DDR4', speed: 3000 },
    { id: 'ram-124', name: 'HyperX Predator RGB 32GB DDR4 3600MHz', price: 145, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-125', name: 'Patriot Viper 4 Blackout 16GB DDR4 3200MHz', price: 78, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-126', name: 'Mushkin Redline Lumina 16GB DDR4 3600MHz', price: 80, capacity: 16, type: 'DDR4', speed: 3600 },
    { id: 'ram-127', name: 'OLOy WarHawk RGB 32GB DDR4 3200MHz', price: 110, capacity: 32, type: 'DDR4', speed: 3200 },
    { id: 'ram-128', name: 'PNY XLR8 Gaming REVEL RGB 16GB DDR4 3200MHz', price: 70, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-129', name: 'Silicon Power XPOWER Turbine 8GB DDR4 3000MHz', price: 45, capacity: 8, type: 'DDR4', speed: 3000 },
    { id: 'ram-130', name: 'Thermaltake TOUGHRAM Z-ONE RGB 32GB DDR4 3600MHz', price: 115, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-131', name: 'V-Color Manta XSky RGB 16GB DDR4 3200MHz', price: 88, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-132', name: 'ZADAK Spark RGB DDR4 32GB 3600MHz', price: 105, capacity: 32, type: 'DDR4', speed: 3600 },
    { id: 'ram-133', name: 'Apacer Panther Rage RGB 16GB DDR4 3200MHz', price: 85, capacity: 16, type: 'DDR4', speed: 3200 },
    { id: 'ram-134', name: 'Corsair Vengeance LPX 64GB DDR5 5200MHz', price: 280, capacity: 64, type: 'DDR5', speed: 5200 },
    { id: 'ram-135', name: 'G.Skill Ripjaws S5 64GB DDR5 6000MHz', price: 320, capacity: 64, type: 'DDR5', speed: 6000 },
    { id: 'ram-136', name: 'Crucial Pro 64GB DDR5 4800MHz', price: 260, capacity: 64, type: 'DDR5', speed: 4800 },
    { id: 'ram-137', name: 'Kingston Fury Beast 64GB DDR5 5600MHz', price: 290, capacity: 64, type: 'DDR5', speed: 5600 },
    { id: 'ram-138', name: 'TeamGroup T-Force Delta RGB 64GB DDR5 6400MHz', price: 340, capacity: 64, type: 'DDR5', speed: 6400 },
    { id: 'ram-139', name: 'ADATA XPG Lancer Blade 64GB DDR5 5200MHz', price: 275, capacity: 64, type: 'DDR5', speed: 5200 },
    { id: 'ram-140', name: 'HyperX Fury Renegade RGB 64GB DDR5 6000MHz', price: 310, capacity: 64, type: 'DDR5', speed: 6000 },
    { id: 'ram-141', name: 'Patriot Viper Venom 64GB DDR5 5200MHz', price: 270, capacity: 64, type: 'DDR5', speed: 5200 },
    { id: 'ram-142', name: 'Mushkin Redline 64GB DDR5 5600MHz', price: 295, capacity: 64, type: 'DDR5', speed: 5600 },
    { id: 'ram-143', name: 'OLOy Blade RGB 64GB DDR5 6000MHz', price: 305, capacity: 64, type: 'DDR5', speed: 6000 },
    { id: 'ram-144', name: 'PNY XLR8 Gaming MAKO RGB 64GB DDR5 5600MHz', price: 298, capacity: 64, type: 'DDR5', speed: 5600 },
    { id: 'ram-145', name: 'Silicon Power XPOWER Zenith 64GB DDR5 4800MHz', price: 255, capacity: 64, type: 'DDR5', speed: 4800 },
    { id: 'ram-146', name: 'Thermaltake TOUGHRAM RC 64GB DDR5 6400MHz', price: 330, capacity: 64, type: 'DDR5', speed: 6400 },
    { id: 'ram-147', name: 'V-Color Manta RGB 64GB DDR5 5600MHz', price: 285, capacity: 64, type: 'DDR5', speed: 5600 },
    { id: 'ram-148', name: 'ZADAK TWIN RGB DDR5 64GB 6000MHz', price: 315, capacity: 64, type: 'DDR5', speed: 6000 },
    { id: 'ram-149', name: 'Apacer NOX RGB 64GB DDR5 5200MHz', price: 278, capacity: 64, type: 'DDR5', speed: 5200 },
    { id: 'ram-150', name: 'TeamGroup T-Force Delta RGB 64GB DDR5 5600MHz', price: 288, capacity: 64, type: 'DDR5', speed: 5600 }
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
    ],
    storage: [
    // NVMe SSDs (High Speed)
    { id: 'storage-1', name: 'Samsung 980 Pro 1TB NVMe PCIe Gen4 SSD', price: 120, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7000, writeSpeed: 5000 },
    { id: 'storage-2', name: 'Western Digital Black SN850X 2TB NVMe PCIe Gen4 SSD', price: 220, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7300, writeSpeed: 6600 },
    { id: 'storage-3', name: 'Crucial P5 Plus 1TB NVMe PCIe Gen4 SSD', price: 100, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 6600, writeSpeed: 5000 },
    { id: 'storage-4', name: 'Kingston KC3000 2TB NVMe PCIe Gen4 SSD', price: 200, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7000, writeSpeed: 7000 },
    { id: 'storage-5', name: 'SK Hynix Platinum P41 1TB NVMe PCIe Gen4 SSD', price: 115, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7000, writeSpeed: 6500 },
    { id: 'storage-6', name: 'Corsair MP600 Pro XT 1TB NVMe PCIe Gen4 SSD', price: 125, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7100, writeSpeed: 6800 },
    { id: 'storage-7', name: 'Seagate FireCuda 530 2TB NVMe PCIe Gen4 SSD', price: 230, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7300, writeSpeed: 6900 },
    { id: 'storage-8', name: 'ADATA XPG GAMMIX S70 Blade 1TB NVMe PCIe Gen4 SSD', price: 95, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7400, writeSpeed: 6800 },
    { id: 'storage-9', name: 'Sabrent Rocket 4 Plus 2TB NVMe PCIe Gen4 SSD', price: 210, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7100, writeSpeed: 6800 },
    { id: 'storage-10', name: 'TeamGroup Cardea A440 1TB NVMe PCIe Gen4 SSD', price: 105, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7000, writeSpeed: 6900 },
    { id: 'storage-11', name: 'Samsung 970 EVO Plus 1TB NVMe PCIe Gen3 SSD', price: 80, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 3300 },
    { id: 'storage-12', name: 'Western Digital Blue SN570 1TB NVMe PCIe Gen3 SSD', price: 70, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 3000 },
    { id: 'storage-13', name: 'Crucial P3 Plus 2TB NVMe PCIe Gen4 SSD', price: 150, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 5000, writeSpeed: 4200 },
    { id: 'storage-14', name: 'Kingston NV2 1TB NVMe PCIe Gen4 SSD', price: 75, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 3500, writeSpeed: 2800 },
    { id: 'storage-15', name: 'SK Hynix Gold P31 1TB NVMe PCIe Gen3 SSD', price: 90, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 3200 },
    { id: 'storage-16', name: 'Corsair MP400 2TB NVMe PCIe Gen3 SSD', price: 140, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3400, writeSpeed: 3000 },
    { id: 'storage-17', name: 'Seagate FireCuda 520 1TB NVMe PCIe Gen4 SSD', price: 100, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 5000, writeSpeed: 4400 },
    { id: 'storage-18', name: 'ADATA XPG SX8200 Pro 1TB NVMe PCIe Gen3 SSD', price: 85, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 3000 },
    { id: 'storage-19', name: 'Sabrent Rocket Q4 2TB NVMe PCIe Gen4 SSD', price: 180, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 4900, writeSpeed: 3500 },
    { id: 'storage-20', name: 'TeamGroup MP34 1TB NVMe PCIe Gen3 SSD', price: 78, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3000, writeSpeed: 2900 },
    // SATA SSDs (Good Performance, Wider Compatibility)
    { id: 'storage-21', name: 'Samsung 870 EVO 1TB SATA SSD', price: 90, capacity: 1000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 530 },
    { id: 'storage-22', name: 'Crucial MX500 2TB SATA SSD', price: 150, capacity: 2000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 510 },
    { id: 'storage-23', name: 'Western Digital Blue 1TB SATA SSD', price: 85, capacity: 1000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 530 },
    { id: 'storage-24', name: 'Kingston A400 480GB SATA SSD', price: 40, capacity: 480, type: 'SATA SSD', interface: 'SATA III', readSpeed: 500, writeSpeed: 450 },
    { id: 'storage-25', name: 'SanDisk Ultra 3D 1TB SATA SSD', price: 92, capacity: 1000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 530 },
    { id: 'storage-26', name: 'Crucial BX500 1TB SATA SSD', price: 75, capacity: 1000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 540, writeSpeed: 500 },
    { id: 'storage-27', name: 'Samsung 870 QVO 4TB SATA SSD', price: 280, capacity: 4000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 530 },
    { id: 'storage-28', name: 'Western Digital Green 240GB SATA SSD', price: 25, capacity: 240, type: 'SATA SSD', interface: 'SATA III', readSpeed: 545, writeSpeed: 430 },
    { id: 'storage-29', name: 'Kingston KC600 512GB SATA SSD', price: 55, capacity: 512, type: 'SATA SSD', interface: 'SATA III', readSpeed: 550, writeSpeed: 520 },
    { id: 'storage-30', name: 'ADATA Ultimate SU800 1TB SATA SSD', price: 80, capacity: 1000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 520 },
    // HDDs (Large Capacity, Cost-Effective)
    { id: 'storage-31', name: 'Seagate Barracuda 2TB 7200RPM HDD', price: 60, capacity: 2000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 256 },
    { id: 'storage-32', name: 'Western Digital Blue 4TB 5400RPM HDD', price: 80, capacity: 4000, type: 'HDD', interface: 'SATA III', rpm: 5400, cache: 256 },
    { id: 'storage-33', name: 'Toshiba P300 1TB 7200RPM HDD', price: 45, capacity: 1000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 64 },
    { id: 'storage-34', name: 'Seagate IronWolf 8TB NAS HDD', price: 180, capacity: 8000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 256 },
    { id: 'storage-35', name: 'Western Digital Red Plus 6TB NAS HDD', price: 150, capacity: 6000, type: 'HDD', interface: 'SATA III', rpm: 5400, cache: 128 },
    { id: 'storage-36', name: 'Seagate Barracuda Compute 3TB 5400RPM HDD', price: 70, capacity: 3000, type: 'HDD', interface: 'SATA III', rpm: 5400, cache: 256 },
    { id: 'storage-37', name: 'Western Digital Black 10TB 7200RPM HDD', price: 280, capacity: 10000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 256 },
    { id: 'storage-38', name: 'Toshiba X300 6TB 7200RPM HDD', price: 140, capacity: 6000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 256 },
    { id: 'storage-39', name: 'Seagate Exos 16TB Enterprise HDD', price: 350, capacity: 16000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 512 },
    { id: 'storage-40', name: 'Western Digital Gold 12TB Enterprise HDD', price: 300, capacity: 12000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 256 },

    // Continuing with various capacities and types to reach 150 entries...
    // Mixing NVMe (PCIe Gen3 & Gen4), SATA SSDs, and HDDs
    { id: 'storage-41', name: 'Samsung 980 500GB NVMe PCIe Gen3 SSD', price: 50, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3100, writeSpeed: 2600 },
    { id: 'storage-42', name: 'Western Digital Black SN770 1TB NVMe PCIe Gen4 SSD', price: 90, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 5150, writeSpeed: 4900 },
    { id: 'storage-43', name: 'Crucial P3 500GB NVMe PCIe Gen3 SSD', price: 45, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 1900 },
    { id: 'storage-44', name: 'Kingston KC3000 1TB NVMe PCIe Gen4 SSD', price: 110, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7000, writeSpeed: 6000 },
    { id: 'storage-45', name: 'SK Hynix Platinum P41 2TB NVMe PCIe Gen4 SSD', price: 230, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7000, writeSpeed: 6500 },
    { id: 'storage-46', name: 'Corsair MP600 Mini 1TB NVMe PCIe Gen4 SSD', price: 130, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 4800, writeSpeed: 4800 },
    { id: 'storage-47', name: 'Seagate FireCuda 530 1TB NVMe PCIe Gen4 SSD', price: 135, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7300, writeSpeed: 6000 },
    { id: 'storage-48', name: 'ADATA XPG GAMMIX S70 Blade 2TB NVMe PCIe Gen4 SSD', price: 190, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7400, writeSpeed: 6800 },
    { id: 'storage-49', name: 'Sabrent Rocket 4.0 1TB NVMe PCIe Gen4 SSD', price: 105, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 5000, writeSpeed: 4400 },
    { id: 'storage-50', name: 'TeamGroup Cardea Zero Z440 2TB NVMe PCIe Gen4 SSD', price: 180, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 5000, writeSpeed: 4400 },
    // SATA SSDs continue
    { id: 'storage-51', name: 'Samsung 870 EVO 500GB SATA SSD', price: 55, capacity: 500, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 530 },
    { id: 'storage-52', name: 'Crucial MX500 1TB SATA SSD', price: 85, capacity: 1000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 510 },
    { id: 'storage-53', name: 'Western Digital Blue 500GB SATA SSD', price: 50, capacity: 500, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 530 },
    { id: 'storage-54', name: 'Kingston A400 240GB SATA SSD', price: 28, capacity: 240, type: 'SATA SSD', interface: 'SATA III', readSpeed: 500, writeSpeed: 350 },
    { id: 'storage-55', name: 'SanDisk Ultra 3D 2TB SATA SSD', price: 170, capacity: 2000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 530 },
    { id: 'storage-56', name: 'Crucial BX500 500GB SATA SSD', price: 48, capacity: 500, type: 'SATA SSD', interface: 'SATA III', readSpeed: 540, writeSpeed: 500 },
    { id: 'storage-57', name: 'Samsung 870 QVO 1TB SATA SSD', price: 95, capacity: 1000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 530 },
    { id: 'storage-58', name: 'Western Digital Green 480GB SATA SSD', price: 42, capacity: 480, type: 'SATA SSD', interface: 'SATA III', readSpeed: 545, writeSpeed: 460 },
    { id: 'storage-59', name: 'Kingston KC600 1TB SATA SSD', price: 90, capacity: 1000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 550, writeSpeed: 520 },
    { id: 'storage-60', name: 'ADATA Ultimate SU800 500GB SATA SSD', price: 52, capacity: 500, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 520 },
    // HDDs continue
    { id: 'storage-61', name: 'Seagate Barracuda 1TB 7200RPM HDD', price: 40, capacity: 1000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 64 },
    { id: 'storage-62', name: 'Western Digital Blue 2TB 5400RPM HDD', price: 55, capacity: 2000, type: 'HDD', interface: 'SATA III', rpm: 5400, cache: 64 },
    { id: 'storage-63', name: 'Toshiba P300 2TB 7200RPM HDD', price: 65, capacity: 2000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 256 },
    { id: 'storage-64', name: 'Seagate IronWolf 4TB NAS HDD', price: 100, capacity: 4000, type: 'HDD', interface: 'SATA III', rpm: 5900, cache: 64 },
    { id: 'storage-65', name: 'Western Digital Red Plus 8TB NAS HDD', price: 190, capacity: 8000, type: 'HDD', interface: 'SATA III', rpm: 5400, cache: 256 },
    { id: 'storage-66', name: 'Seagate Barracuda Compute 4TB 5400RPM HDD', price: 85, capacity: 4000, type: 'HDD', interface: 'SATA III', rpm: 5400, cache: 256 },
    { id: 'storage-67', name: 'Western Digital Black 6TB 7200RPM HDD', price: 170, capacity: 6000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 256 },
    { id: 'storage-68', name: 'Toshiba X300 4TB 7200RPM HDD', price: 105, capacity: 4000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 128 },
    { id: 'storage-69', name: 'Seagate Exos 10TB Enterprise HDD', price: 250, capacity: 10000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 256 },
    { id: 'storage-70', name: 'Western Digital Gold 8TB Enterprise HDD', price: 200, capacity: 8000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 256 },

    // ... (To keep the response concise, the remaining entries from 71 to 150 would follow a similar pattern,
    // ensuring a mix of NVMe, SATA SSD, and HDD types with varying capacities and brands.)
    // For example:
    { id: 'storage-71', name: 'PNY CS3040 1TB NVMe PCIe Gen4 SSD', price: 98, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 5600, writeSpeed: 4300 },
    { id: 'storage-72', name: 'Inland Platinum 2TB NVMe PCIe Gen3 SSD', price: 130, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3400, writeSpeed: 3000 },
    { id: 'storage-73', name: 'Crucial P5 500GB NVMe PCIe Gen3 SSD', price: 58, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3400, writeSpeed: 3000 },
    { id: 'storage-74', name: 'Samsung 990 Pro 2TB NVMe PCIe Gen4 SSD', price: 250, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7450, writeSpeed: 6900 },
    { id: 'storage-75', name: 'Western Digital Red SN700 1TB NVMe NAS SSD', price: 150, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3400, writeSpeed: 3000 },
    { id: 'storage-76', name: 'Gigabyte AORUS Gen4 SSD 1TB NVMe PCIe Gen4', price: 110, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 5000, writeSpeed: 4400 },
    { id: 'storage-77', name: 'HP EX950 1TB NVMe PCIe Gen3 SSD', price: 90, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 2900 },
    { id: 'storage-78', name: 'Intel 670p 2TB NVMe PCIe Gen3 SSD', price: 145, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 2700 },
    { id: 'storage-79', name: 'Lexar NM620 1TB NVMe PCIe Gen3 SSD', price: 72, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3300, writeSpeed: 3000 },
    { id: 'storage-80', name: 'Sabrent Rocket Q 4TB NVMe PCIe Gen3 SSD', price: 280, capacity: 4000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3400, writeSpeed: 3000 },
    { id: 'storage-81', name: 'Corsair Force MP510 1TB NVMe PCIe Gen3 SSD', price: 85, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3480, writeSpeed: 3000 },
    { id: 'storage-82', name: 'Addlink S70 1TB NVMe PCIe Gen3 SSD', price: 78, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3400, writeSpeed: 3000 },
    { id: 'storage-83', name: 'Silicon Power US70 1TB NVMe PCIe Gen4 SSD', price: 105, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 5000, writeSpeed: 4400 },
    { id: 'storage-84', name: 'TeamGroup MP33 500GB NVMe PCIe Gen3 SSD', price: 45, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 1700, writeSpeed: 1400 },
    { id: 'storage-85', name: 'Transcend 220S 1TB NVMe PCIe Gen3 SSD', price: 82, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 2800 },
    { id: 'storage-86', name: 'Crucial BX500 2TB SATA SSD', price: 130, capacity: 2000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 540, writeSpeed: 500 },
    { id: 'storage-87', name: 'Western Digital Blue 250GB SATA SSD', price: 30, capacity: 250, type: 'SATA SSD', interface: 'SATA III', readSpeed: 545, writeSpeed: 450 },
    { id: 'storage-88', name: 'Samsung 860 EVO 1TB SATA SSD', price: 88, capacity: 1000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 550, writeSpeed: 520 },
    { id: 'storage-89', name: 'Kingston KC600 2TB SATA SSD', price: 160, capacity: 2000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 550, writeSpeed: 520 },
    { id: 'storage-90', name: 'ADATA Ultimate SU650 480GB SATA SSD', price: 40, capacity: 480, type: 'SATA SSD', interface: 'SATA III', readSpeed: 520, writeSpeed: 450 },
    { id: 'storage-91', name: 'SanDisk SSD Plus 1TB SATA SSD', price: 80, capacity: 1000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 535, writeSpeed: 450 },
    { id: 'storage-92', name: 'Seagate Barracuda 8TB 7200RPM HDD', price: 170, capacity: 8000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 256 },
    { id: 'storage-93', name: 'Western Digital Blue 6TB 5400RPM HDD', price: 120, capacity: 6000, type: 'HDD', interface: 'SATA III', rpm: 5400, cache: 256 },
    { id: 'storage-94', name: 'Toshiba X300 8TB 7200RPM HDD', price: 180, capacity: 8000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 256 },
    { id: 'storage-95', name: 'Seagate IronWolf Pro 12TB NAS HDD', price: 280, capacity: 12000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 256 },
    { id: 'storage-96', name: 'Western Digital Red Pro 14TB NAS HDD', price: 320, capacity: 14000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 512 },
    { id: 'storage-97', name: 'Seagate Barracuda Compute 6TB 5400RPM HDD', price: 110, capacity: 6000, type: 'HDD', interface: 'SATA III', rpm: 5400, cache: 256 },
    { id: 'storage-98', name: 'Western Digital Black 14TB 7200RPM HDD', price: 380, capacity: 14000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 512 },
    { id: 'storage-99', name: 'Toshiba MG08ACA 16TB Enterprise HDD', price: 390, capacity: 16000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 512 },
    { id: 'storage-100', name: 'Seagate Exos 18TB Enterprise HDD', price: 420, capacity: 18000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 512 },
    { id: 'storage-101', name: 'Samsung 970 EVO 500GB NVMe PCIe Gen3 SSD', price: 60, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3400, writeSpeed: 2300 },
    { id: 'storage-102', name: 'Western Digital Blue SN550 500GB NVMe PCIe Gen3 SSD', price: 45, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 2400, writeSpeed: 1750 },
    { id: 'storage-103', name: 'Crucial P2 1TB NVMe PCIe Gen3 SSD', price: 70, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 2400, writeSpeed: 1800 },
    { id: 'storage-104', name: 'Kingston NV1 500GB NVMe PCIe Gen3 SSD', price: 40, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 2100, writeSpeed: 1700 },
    { id: 'storage-105', name: 'SK Hynix Gold P31 500GB NVMe PCIe Gen3 SSD', price: 65, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 3100 },
    { id: 'storage-106', name: 'Corsair MP600 Core 1TB NVMe PCIe Gen4 SSD', price: 95, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 4700, writeSpeed: 1900 },
    { id: 'storage-107', name: 'Seagate FireCuda 510 1TB NVMe PCIe Gen3 SSD', price: 80, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3400, writeSpeed: 3200 },
    { id: 'storage-108', name: 'ADATA XPG SX6000 Pro 512GB NVMe PCIe Gen3 SSD', price: 50, capacity: 512, type: 'NVMe SSD', interface: 'PCIe Gen3 x2', readSpeed: 2100, writeSpeed: 1500 },
    { id: 'storage-109', name: 'Sabrent Rocket NVMe 256GB PCIe Gen3 SSD', price: 35, capacity: 256, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 2500, writeSpeed: 1100 },
    { id: 'storage-110', name: 'TeamGroup MP34 500GB NVMe PCIe Gen3 SSD', price: 55, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3000, writeSpeed: 1700 },
    { id: 'storage-111', name: 'Samsung 860 QVO 2TB SATA SSD', price: 180, capacity: 2000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 550, writeSpeed: 520 },
    { id: 'storage-112', name: 'Crucial BX500 240GB SATA SSD', price: 25, capacity: 240, type: 'SATA SSD', interface: 'SATA III', readSpeed: 540, writeSpeed: 400 },
    { id: 'storage-113', name: 'Western Digital Blue 2TB SATA SSD', price: 120, capacity: 2000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 530 },
    { id: 'storage-114', name: 'Kingston A400 120GB SATA SSD', price: 18, capacity: 120, type: 'SATA SSD', interface: 'SATA III', readSpeed: 500, writeSpeed: 320 },
    { id: 'storage-115', name: 'SanDisk Ultra 3D 500GB SATA SSD', price: 58, capacity: 500, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 530 },
    { id: 'storage-116', name: 'Crucial MX500 500GB SATA SSD', price: 55, capacity: 500, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 510 },
    { id: 'storage-117', name: 'Samsung 870 QVO 8TB SATA SSD', price: 600, capacity: 8000, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 530 },
    { id: 'storage-118', name: 'Western Digital Green 120GB SATA SSD', price: 20, capacity: 120, type: 'SATA SSD', interface: 'SATA III', readSpeed: 545, writeSpeed: 350 },
    { id: 'storage-119', name: 'Kingston KC600 256GB SATA SSD', price: 40, capacity: 256, type: 'SATA SSD', interface: 'SATA III', readSpeed: 550, writeSpeed: 500 },
    { id: 'storage-120', name: 'ADATA Ultimate SU800 256GB SATA SSD', price: 35, capacity: 256, type: 'SATA SSD', interface: 'SATA III', readSpeed: 560, writeSpeed: 500 },
    { id: 'storage-121', name: 'Seagate Barracuda 500GB 7200RPM HDD', price: 30, capacity: 500, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 32 },
    { id: 'storage-122', name: 'Western Digital Blue 1TB 5400RPM HDD', price: 45, capacity: 1000, type: 'HDD', interface: 'SATA III', rpm: 5400, cache: 64 },
    { id: 'storage-123', name: 'Toshiba P300 500GB 7200RPM HDD', price: 35, capacity: 500, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 32 },
    { id: 'storage-124', name: 'Seagate IronWolf 1TB NAS HDD', price: 55, capacity: 1000, type: 'HDD', interface: 'SATA III', rpm: 5900, cache: 64 },
    { id: 'storage-125', name: 'Western Digital Red Plus 2TB NAS HDD', price: 80, capacity: 2000, type: 'HDD', interface: 'SATA III', rpm: 5400, cache: 128 },
    { id: 'storage-126', name: 'Seagate Barracuda Compute 1TB 5400RPM HDD', price: 48, capacity: 1000, type: 'HDD', interface: 'SATA III', rpm: 5400, cache: 64 },
    { id: 'storage-127', name: 'Western Digital Black 2TB 7200RPM HDD', price: 90, capacity: 2000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 64 },
    { id: 'storage-128', name: 'Toshiba X300 2TB 7200RPM HDD', price: 75, capacity: 2000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 128 },
    { id: 'storage-129', name: 'Seagate Exos 4TB Enterprise HDD', price: 130, capacity: 4000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 128 },
    { id: 'storage-130', name: 'Western Digital Gold 4TB Enterprise HDD', price: 140, capacity: 4000, type: 'HDD', interface: 'SATA III', rpm: 7200, cache: 128 },
    { id: 'storage-131', name: 'Samsung 980 Pro 500GB NVMe PCIe Gen4 SSD', price: 70, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 6900, writeSpeed: 3000 },
    { id: 'storage-132', name: 'Western Digital Black SN850X 1TB NVMe PCIe Gen4 SSD', price: 130, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7300, writeSpeed: 6300 },
    { id: 'storage-133', name: 'Crucial P5 Plus 2TB NVMe PCIe Gen4 SSD', price: 190, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 6600, writeSpeed: 5000 },
    { id: 'storage-134', name: 'Kingston KC3000 4TB NVMe PCIe Gen4 SSD', price: 400, capacity: 4000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7000, writeSpeed: 7000 },
    { id: 'storage-135', name: 'SK Hynix Platinum P41 500GB NVMe PCIe Gen4 SSD', price: 65, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 6500, writeSpeed: 4500 },
    { id: 'storage-136', name: 'Corsair MP600 Pro LPX 1TB NVMe PCIe Gen4 SSD', price: 120, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7100, writeSpeed: 6800 },
    { id: 'storage-137', name: 'Seagate FireCuda 530 4TB NVMe PCIe Gen4 SSD', price: 450, capacity: 4000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7300, writeSpeed: 6900 },
    { id: 'storage-138', name: 'ADATA XPG GAMMIX S70 Blade 500GB NVMe PCIe Gen4 SSD', price: 60, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7400, writeSpeed: 3000 },
    { id: 'storage-139', name: 'Sabrent Rocket 4 Plus 1TB NVMe PCIe Gen4 SSD', price: 110, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7100, writeSpeed: 6800 },
    { id: 'storage-140', name: 'TeamGroup Cardea A440 2TB NVMe PCIe Gen4 SSD', price: 200, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 7000, writeSpeed: 6900 },
    { id: 'storage-141', name: 'Samsung 970 EVO Plus 250GB NVMe PCIe Gen3 SSD', price: 40, capacity: 250, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 2300 },
    { id: 'storage-142', name: 'Western Digital Blue SN570 500GB NVMe PCIe Gen3 SSD', price: 50, capacity: 500, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 2300 },
    { id: 'storage-143', name: 'Crucial P3 Plus 1TB NVMe PCIe Gen4 SSD', price: 90, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 5000, writeSpeed: 3500 },
    { id: 'storage-144', name: 'Kingston NV2 2TB NVMe PCIe Gen4 SSD', price: 140, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 3500, writeSpeed: 2800 },
    { id: 'storage-145', name: 'SK Hynix Gold P31 2TB NVMe PCIe Gen3 SSD', price: 180, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 3200 },
    { id: 'storage-146', name: 'Corsair MP400 1TB NVMe PCIe Gen3 SSD', price: 90, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3400, writeSpeed: 1800 },
    { id: 'storage-147', name: 'Seagate FireCuda 520 2TB NVMe PCIe Gen4 SSD', price: 190, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 5000, writeSpeed: 4400 },
    { id: 'storage-148', name: 'ADATA XPG SX8200 Pro 2TB NVMe PCIe Gen3 SSD', price: 170, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3500, writeSpeed: 3000 },
    { id: 'storage-149', name: 'Sabrent Rocket Q4 1TB NVMe PCIe Gen4 SSD', price: 100, capacity: 1000, type: 'NVMe SSD', interface: 'PCIe Gen4 x4', readSpeed: 4900, writeSpeed: 2500 },
    { id: 'storage-150', name: 'TeamGroup MP34 2TB NVMe PCIe Gen3 SSD', price: 150, capacity: 2000, type: 'NVMe SSD', interface: 'PCIe Gen3 x4', readSpeed: 3000, writeSpeed: 2900 }
    ],
    psu: [
    // High-Wattage, High-Efficiency PSUs
    { id: 'psu-1', name: 'Corsair RM1000x Shift', price: 200, wattage: 1000, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Side Cable Connectors', 'Low Noise', '10 Year Warranty'] },
    { id: 'psu-2', name: 'Seasonic PRIME TX-1000', price: 250, wattage: 1000, efficiencyRating: '80 Plus Titanium', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Top Tier Efficiency', 'Silent Fan Mode', '12 Year Warranty'] },
    { id: 'psu-3', name: 'be quiet! Dark Power 13 1000W', price: 280, wattage: 1000, efficiencyRating: '80 Plus Titanium', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Overclocking Key', 'Silent Wing Fan', '10 Year Warranty'] },
    { id: 'psu-4', name: 'ASUS ROG Thor 1000P2 Gaming', price: 300, wattage: 1000, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['OLED Display', 'Aura Sync RGB', 'ROG Heatsinks'] },
    { id: 'psu-5', name: 'EVGA SuperNOVA 1000 P6', price: 180, wattage: 1000, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Compact Size', 'ECO Mode', '10 Year Warranty'] },
    { id: 'psu-6', name: 'Thermaltake Toughpower GF A3 1200W', price: 170, wattage: 1200, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Quiet Fan', 'Compact Depth'] },
    { id: 'psu-7', name: 'Cooler Master MWE Gold 1250 V2', price: 190, wattage: 1250, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['High Wattage', 'Silent Fan'] },
    { id: 'psu-8', 'name': 'NZXT C1200 Gold', price: 180, wattage: 1200, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Clean Design', 'Silent Operation'] },
    { id: 'psu-9', name: 'MSI MPG A1000G PCIE5', price: 190, wattage: 1000, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['PCIe 5.0 Ready', 'Compact Size'] },
    { id: 'psu-10', name: 'Gigabyte UD1000GM PCIE 5.0', price: 160, wattage: 1000, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['PCIe 5.0 Ready', 'Compact Design'] },

    // Mid-Range Wattage, High-Efficiency PSUs
    { id: 'psu-11', name: 'Corsair RM850e (2023)', price: 120, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Quiet Operation', 'Compact Size'] },
    { id: 'psu-12', name: 'Seasonic Focus GX-850', price: 130, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Reliable Performance', '10 Year Warranty'] },
    { id: 'psu-13', name: 'be quiet! Pure Power 12 M 850W', price: 110, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Silent Wings Fan', 'PCIe 5.0 Ready'] },
    { id: 'psu-14', name: 'EVGA SuperNOVA 850 G6', price: 140, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Compact Size', 'ECO Mode'] },
    { id: 'psu-15', name: 'Cooler Master MWE Gold 850 V2', price: 100, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Silent Fan', 'Affordable Gold'] },
    { id: 'psu-16', name: 'NZXT C850 Gold', price: 115, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Sleek Design', 'Reliable'] },
    { id: 'psu-17', name: 'MSI MAG A850GL PCIE5', price: 125, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['PCIe 5.0 Ready', 'ARGB Lighting'] },
    { id: 'psu-18', name: 'Super Flower Leadex V Platinum PRO 850W', price: 150, wattage: 850, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Excellent Performance', 'Small Footprint'] },
    { id: 'psu-19', name: 'SilverStone DA850 Gold', price: 105, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Compact Design', 'Flat Cables'] },
    { id: 'psu-20', name: 'Fractal Design Ion+ 2 Platinum 860W', price: 160, wattage: 860, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['UltraFlex Cables', 'Quiet Fan'] },

    // Mid-Range Wattage, Standard Efficiency PSUs
    { id: 'psu-21', name: 'Corsair CX750M', price: 80, wattage: 750, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Semi-Modular', features: ['Good Value', 'Reliable'] },
    { id: 'psu-22', name: 'EVGA 750 BQ', price: 75, wattage: 750, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Semi-Modular', features: ['Great Value', 'Affordable'] },
    { id: 'psu-23', name: 'Cooler Master MWE Bronze 750 V2', price: 70, wattage: 750, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Cost-Effective', 'Reliable'] },
    { id: 'psu-24', name: 'Thermaltake Smart BM2 750W', price: 85, wattage: 750, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Semi-Modular', features: ['Quiet Fan', 'Good Performance'] },
    { id: 'psu-25', name: 'Deepcool PM750D', price: 65, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Fixed Cables', 'Cost-Effective Gold'] },
    { id: 'psu-26', name: 'Gigabyte P750GM', price: 90, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Compact Design'] },
    { id: 'psu-27', name: 'SilentiumPC Vero L3 700W', price: 60, wattage: 700, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Basic PSU'] },
    { id: 'psu-28', name: 'Adata XPG Pylon 750W', price: 80, wattage: 750, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Reliable Components'] },
    { id: 'psu-29', name: 'Antec NeoECO Gold Zen 700W', price: 95, wattage: 700, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Quiet Operation'] },
    { id: 'psu-30', name: 'XFX XT Series 700W', price: 70, wattage: 700, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Basic Reliable'] },

    // Lower Wattage PSUs (for budget or compact builds)
    { id: 'psu-31', name: 'Corsair CV550', price: 55, wattage: 550, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Budget Friendly', 'Reliable'] },
    { id: 'psu-32', name: 'EVGA 600 W1', price: 45, wattage: 600, efficiencyRating: '80 Plus White', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Entry Level', 'Very Affordable'] },
    { id: 'psu-33', name: 'Cooler Master MWE White 600 V2', price: 50, wattage: 600, efficiencyRating: '80 Plus Standard', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Cost-Effective'] },
    { id: 'psu-34', name: 'Thermaltake Smart 500W', price: 40, wattage: 500, efficiencyRating: '80 Plus White', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Basic Build'] },
    { id: 'psu-35', name: 'be quiet! System Power 10 550W', price: 60, wattage: 550, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Quiet Fan'] },
    { id: 'psu-36', name: 'Gigabyte P650B', price: 65, wattage: 650, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Fixed Cables'] },
    { id: 'psu-37', name: 'Seasonic Core GC-500', price: 70, wattage: 500, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Reliable Gold', 'Fixed Cables'] },
    { id: 'psu-38', name: 'Deepcool PF550', price: 50, wattage: 550, efficiencyRating: '80 Plus Standard', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Simple', 'Affordable'] },
    { id: 'psu-39', name: 'Adata XPG Pylon 550W', price: 60, wattage: 550, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Reliable'] },
    { id: 'psu-40', name: 'Corsair CX450', price: 50, wattage: 450, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Entry Level Gaming'] },

    // SFX/SFF PSUs (for small form factor builds)
    { id: 'psu-41', name: 'Corsair SF750', price: 160, wattage: 750, efficiencyRating: '80 Plus Platinum', formFactor: 'SFX', modularity: 'Fully Modular', features: ['Best SFX', 'High Power Density'] },
    { id: 'psu-42', name: 'Cooler Master V SFX Gold 750W', price: 140, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'SFX', modularity: 'Fully Modular', features: ['Compact', 'Quiet Fan'] },
    { id: 'psu-43', name: 'Seasonic Focus SGX-650', price: 120, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'SFX-L', modularity: 'Fully Modular', features: ['Extended SFX', 'Quiet'] },
    { id: 'psu-44', name: 'SilverStone SX750 Platinum', price: 150, wattage: 750, efficiencyRating: '80 Plus Platinum', formFactor: 'SFX', modularity: 'Fully Modular', features: ['High Efficiency', 'Compact'] },
    { id: 'psu-45', name: 'Lian Li SP750', price: 130, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'SFX', modularity: 'Fully Modular', features: ['ARGB Lighting', 'White Casing'] },
    { id: 'psu-46', name: 'Fractal Design Ion SFX-L 650W', price: 110, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'SFX-L', modularity: 'Fully Modular', features: ['UltraFlex Cables'] },
    { id: 'psu-47', name: 'Cooler Master V SFX Platinum 1000W', price: 230, wattage: 1000, efficiencyRating: '80 Plus Platinum', formFactor: 'SFX-L', modularity: 'Fully Modular', features: ['High Wattage SFX', 'Quiet'] },
    { id: 'psu-48', name: 'Thermaltake Toughpower SFX 750W Gold', price: 125, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'SFX', modularity: 'Fully Modular', features: ['Compact', 'Quiet'] },
    { id: 'psu-49', name: 'FSP Dagger Pro 650W', price: 115, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'SFX', modularity: 'Fully Modular', features: ['Reliable SFX'] },
    { id: 'psu-50', name: 'Phanteks Revolt SFX 750W', price: 135, wattage: 750, efficiencyRating: '80 Plus Platinum', formFactor: 'SFX', modularity: 'Fully Modular', features: ['Compact', 'Silent'] },

    // More High-Wattage, High-Efficiency PSUs (1000W+)
    { id: 'psu-51', name: 'Corsair HX1200i', price: 280, wattage: 1200, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['iCUE Monitoring', 'High Quality Components'] },
    { id: 'psu-52', name: 'Seasonic PRIME PX-1300', price: 300, wattage: 1300, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['High Power', 'Silent Fan Mode'] },
    { id: 'psu-53', name: 'be quiet! Dark Power 13 1200W', price: 320, wattage: 1200, efficiencyRating: '80 Plus Titanium', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Overclocking Key', 'Silent Wings Fan'] },
    { id: 'psu-54', name: 'EVGA SuperNOVA 1300 P+ Pure Power', price: 250, wattage: 1300, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['High Power', 'ECO Mode'] },
    { id: 'psu-55', name: 'MSI MEG Ai1300P PCIE5', price: 270, wattage: 1300, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['PCIe 5.0 Ready', 'Digital Display'] },
    { id: 'psu-56', name: 'Thermaltake Toughpower GF3 1200W', price: 200, wattage: 1200, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['PCIe 5.0 Ready', 'Smart Zero Fan'] },
    { id: 'psu-57', name: 'Cooler Master MWE Gold 1050 V2', price: 150, wattage: 1050, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Reliable', 'Quiet Fan'] },
    { id: 'psu-58', name: 'NZXT C1000 Gold', price: 150, wattage: 1000, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Clean Design', 'Reliable'] },
    { id: 'psu-59', name: 'Seasonic Prime TX-1600', price: 500, wattage: 1600, efficiencyRating: '80 Plus Titanium', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Extreme Wattage', 'Top Tier Efficiency'] },
    { id: 'psu-60', name: 'Corsair HX1000i', price: 250, wattage: 1000, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['iCUE Monitoring', 'Low Noise'] },

    // More Mid-Range Wattage, High-Efficiency PSUs (750W - 900W)
    { id: 'psu-61', name: 'Corsair RM850x (2021)', price: 150, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Reliable', 'Quiet Operation'] },
    { id: 'psu-62', name: 'Seasonic Focus PX-750', price: 140, wattage: 750, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['High Efficiency', '10 Year Warranty'] },
    { id: 'psu-63', name: 'be quiet! Straight Power 11 850W', price: 130, wattage: 850, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Silent Wings 3 Fan', 'Cable-free Design'] },
    { id: 'psu-64', name: 'EVGA SuperNOVA 750 G6', price: 120, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Compact Size', 'ECO Mode'] },
    { id: 'psu-65', name: 'Cooler Master V850 Gold V2', price: 130, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Modular Cables', 'Quiet Fan'] },
    { id: 'psu-66', name: 'NZXT C750 Gold', price: 100, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Clean Design'] },
    { id: 'psu-67', name: 'MSI MPG A750GF', price: 110, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Premium Capacitors'] },
    { id: 'psu-68', name: 'Super Flower Leadex III Gold 750W', price: 115, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Excellent Voltage Regulation'] },
    { id: 'psu-69', name: 'SilverStone ET850-G', price: 90, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Fixed Cables', 'Value Gold'] },
    { id: 'psu-70', name: 'Fractal Design Ion+ 2 Platinum 760W', price: 140, wattage: 760, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['UltraFlex Cables', 'Quiet Fan'] },

    // More Mid-Range Wattage, Standard Efficiency PSUs (600W - 700W)
    { id: 'psu-71', name: 'Corsair CX650M', price: 70, wattage: 650, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Semi-Modular', features: ['Good Value'] },
    { id: 'psu-72', name: 'EVGA 650 BQ', price: 65, wattage: 650, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Semi-Modular', features: ['Affordable'] },
    { id: 'psu-73', name: 'Cooler Master MWE Bronze 650 V2', price: 60, wattage: 650, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Cost-Effective'] },
    { id: 'psu-74', name: 'Thermaltake Smart BM2 650W', price: 75, wattage: 650, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Semi-Modular', features: ['Quiet Fan'] },
    { id: 'psu-75', name: 'Deepcool PM650D', price: 60, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Fixed Cables', 'Cost-Effective Gold'] },
    { id: 'psu-76', name: 'Gigabyte P650GM', price: 80, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Compact Design'] },
    { id: 'psu-77', name: 'SilentiumPC Supremo FM2 650W', price: 85, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Silent Fan'] },
    { id: 'psu-78', name: 'Adata XPG Pylon 650W', price: 70, wattage: 650, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Reliable Components'] },
    { id: 'psu-79', name: 'Antec NeoECO Gold Zen 600W', price: 85, wattage: 600, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Quiet Operation'] },
    { id: 'psu-80', name: 'XFX XT Series 600W', price: 60, wattage: 600, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Basic Reliable'] },

    // More Lower Wattage PSUs (400W - 550W)
    { id: 'psu-81', name: 'Corsair CV450', price: 50, wattage: 450, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Entry Level'] },
    { id: 'psu-82', name: 'EVGA 500 W1', price: 40, wattage: 500, efficiencyRating: '80 Plus White', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Budget Friendly'] },
    { id: 'psu-83', name: 'Cooler Master MWE White 500 V2', price: 45, wattage: 500, efficiencyRating: '80 Plus Standard', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Cost-Effective'] },
    { id: 'psu-84', name: 'Thermaltake Smart 400W', price: 35, wattage: 400, efficiencyRating: '80 Plus White', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Basic Build'] },
    { id: 'psu-85', name: 'be quiet! System Power 10 450W', price: 55, wattage: 450, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Quiet Fan'] },
    { id: 'psu-86', name: 'Gigabyte P550B', price: 55, wattage: 550, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Fixed Cables'] },
    { id: 'psu-87', name: 'Seasonic Core GC-650', price: 80, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Reliable Gold', 'Fixed Cables'] },
    { id: 'psu-88', name: 'Deepcool PF450', price: 45, wattage: 450, efficiencyRating: '80 Plus Standard', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Simple', 'Affordable'] },
    { id: 'psu-89', name: 'Adata XPG Pylon 450W', price: 50, wattage: 450, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Reliable'] },
    { id: 'psu-90', name: 'Corsair CX550F RGB', price: 70, wattage: 550, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Fully Modular', features: ['RGB Fan', 'Good Value'] },

    // More SFX/SFF PSUs
    { id: 'psu-91', name: 'Corsair SF600', price: 120, wattage: 600, efficiencyRating: '80 Plus Platinum', formFactor: 'SFX', modularity: 'Fully Modular', features: ['High Quality', 'Quiet Fan'] },
    { id: 'psu-92', name: 'Cooler Master V SFX Gold 650W', price: 125, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'SFX', modularity: 'Fully Modular', features: ['Compact', 'Quiet Fan'] },
    { id: 'psu-93', name: 'Seasonic Focus SGX-500', price: 100, wattage: 500, efficiencyRating: '80 Plus Gold', formFactor: 'SFX-L', modularity: 'Fully Modular', features: ['Extended SFX'] },
    { id: 'psu-94', name: 'SilverStone SX650-G', price: 110, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'SFX', modularity: 'Fully Modular', features: ['Compact'] },
    { id: 'psu-95', name: 'Lian Li SP750 Black', price: 130, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'SFX', modularity: 'Fully Modular', features: ['Compact', 'Black Casing'] },
    { id: 'psu-96', name: 'Fractal Design Ion SFX 500W', price: 90, wattage: 500, efficiencyRating: '80 Plus Gold', formFactor: 'SFX', modularity: 'Fully Modular', features: ['UltraFlex Cables'] },
    { id: 'psu-97', name: 'Cooler Master V SFX Platinum 850W', price: 190, wattage: 850, efficiencyRating: '80 Plus Platinum', formFactor: 'SFX-L', modularity: 'Fully Modular', features: ['High Wattage SFX'] },
    { id: 'psu-98', name: 'Thermaltake Toughpower SFX 650W Gold', price: 105, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'SFX', modularity: 'Fully Modular', features: ['Compact', 'Quiet'] },
    { id: 'psu-99', name: 'FSP Dagger Pro 550W', price: 95, wattage: 550, efficiencyRating: '80 Plus Gold', formFactor: 'SFX', modularity: 'Fully Modular', features: ['Reliable SFX'] },
    { id: 'psu-100', name: 'Phanteks Revolt SFX 650W', price: 115, wattage: 650, efficiencyRating: '80 Plus Platinum', formFactor: 'SFX', modularity: 'Fully Modular', features: ['Compact', 'Silent'] },

    // More ATX PSUs - mixed wattages and efficiencies
    { id: 'psu-101', name: 'Corsair RM850 (2021)', price: 140, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Quiet Operation', 'Reliable'] },
    { id: 'psu-102', name: 'Seasonic Focus GX-750', price: 120, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Reliable Performance', '10 Year Warranty'] },
    { id: 'psu-103', name: 'be quiet! Pure Power 12 M 750W', price: 100, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Silent Wings Fan', 'PCIe 5.0 Ready'] },
    { id: 'psu-104', name: 'EVGA SuperNOVA 750 GA', price: 110, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Compact Size', 'ECO Mode'] },
    { id: 'psu-105', name: 'Cooler Master MWE Gold 750 V2', price: 90, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Silent Fan', 'Affordable Gold'] },
    { id: 'psu-106', name: 'NZXT C750 Gold (2022)', price: 95, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Clean Design', 'Reliable'] },
    { id: 'psu-107', name: 'MSI MAG A750GL PCIE5', price: 115, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['PCIe 5.0 Ready', 'ARGB Lighting'] },
    { id: 'psu-108', name: 'Gigabyte UD850GM PCIE 5.0', price: 140, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['PCIe 5.0 Ready'] },
    { id: 'psu-109', name: 'Super Flower Leadex III Gold 650W', price: 105, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Excellent Performance'] },
    { id: 'psu-110', name: 'SilverStone DA750 Gold', price: 95, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Compact Design'] },

    { id: 'psu-111', name: 'Fractal Design Ion+ 2 Platinum 660W', price: 130, wattage: 660, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['UltraFlex Cables', 'Quiet Fan'] },
    { id: 'psu-112', name: 'Corsair RM750e (2023)', price: 100, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Quiet Operation', 'Compact Size'] },
    { id: 'psu-113', name: 'Seasonic Focus GX-650', price: 110, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Reliable Performance'] },
    { id: 'psu-114', name: 'be quiet! Pure Power 12 M 650W', price: 90, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Silent Wings Fan', 'PCIe 5.0 Ready'] },
    { id: 'psu-115', name: 'EVGA SuperNOVA 650 G6', price: 105, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Compact Size', 'ECO Mode'] },
    { id: 'psu-116', name: 'Cooler Master MWE Gold 650 V2', price: 80, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Silent Fan', 'Affordable Gold'] },
    { id: 'psu-117', name: 'NZXT C650 Gold', price: 85, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Clean Design'] },
    { id: 'psu-118', name: 'MSI MPG A650GF', price: 95, wattage: 650, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Premium Capacitors'] },
    { id: 'psu-119', name: 'Thermaltake Toughpower GF1 750W', price: 100, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Reliable', 'Quiet'] },
    { id: 'psu-120', name: 'Gigabyte P850GM', price: 100, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Compact Design'] },

    { id: 'psu-121', name: 'Corsair TX750M', price: 90, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Semi-Modular', features: ['Good Value Gold'] },
    { id: 'psu-122', name: 'EVGA 700 GD', price: 70, wattage: 700, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Cost-Effective Gold'] },
    { id: 'psu-123', name: 'Cooler Master MWE Bronze 700 V2', price: 65, wattage: 700, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Reliable'] },
    { id: 'psu-124', name: 'Thermaltake Smart BM2 700W', price: 80, wattage: 700, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Semi-Modular', features: ['Quiet Fan'] },
    { id: 'psu-125', name: 'Deepcool PM850D', price: 75, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Fixed Cables', 'Cost-Effective Gold'] },
    { id: 'psu-126', name: 'Gigabyte P750B', price: 70, wattage: 750, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Basic PSU'] },
    { id: 'psu-127', name: 'Seasonic Core GC-750', price: 90, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Reliable Gold', 'Fixed Cables'] },
    { id: 'psu-128', name: 'Adata XPG Core Reactor 750W', price: 110, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['High Quality'] },
    { id: 'psu-129', name: 'Antec High Current Gamer Gold 750W', price: 120, wattage: 750, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['High Quality Components'] },
    { id: 'psu-130', name: 'XFX Pro Series 850W', price: 100, wattage: 850, efficiencyRating: '80 Plus Black', formFactor: 'ATX', modularity: 'Fully Modular', features: ['High Wattage', 'Reliable'] },

    { id: 'psu-131', name: 'Corsair CX650', price: 60, wattage: 650, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Entry Level Gaming'] },
    { id: 'psu-132', name: 'EVGA 600 GD', price: 65, wattage: 600, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Cost-Effective Gold'] },
    { id: 'psu-133', name: 'Cooler Master MWE White 700 V2', price: 55, wattage: 700, efficiencyRating: '80 Plus Standard', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Cost-Effective'] },
    { id: 'psu-134', name: 'Thermaltake Smart 600W', price: 50, wattage: 600, efficiencyRating: '80 Plus White', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Basic Build'] },
    { id: 'psu-135', name: 'be quiet! System Power 10 750W', price: 75, wattage: 750, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Quiet Fan'] },
    { id: 'psu-136', name: 'Gigabyte P450B', price: 45, wattage: 450, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Fixed Cables', 'Budget Friendly'] },
    { id: 'psu-137', name: 'Seasonic Core GC-550', price: 75, wattage: 550, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Reliable Gold', 'Fixed Cables'] },
    { id: 'psu-138', name: 'Deepcool PF650', price: 55, wattage: 650, efficiencyRating: '80 Plus Standard', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Simple', 'Affordable'] },
    { id: 'psu-139', name: 'Adata XPG Pylon 600W', price: 65, wattage: 600, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Non-Modular', features: ['Reliable'] },
    { id: 'psu-140', name: 'Corsair CX750F RGB', price: 85, wattage: 750, efficiencyRating: '80 Plus Bronze', formFactor: 'ATX', modularity: 'Fully Modular', features: ['RGB Fan', 'Good Value'] },

    { id: 'psu-141', name: 'SilverStone ST45SF', price: 80, wattage: 450, efficiencyRating: '80 Plus Bronze', formFactor: 'SFX', modularity: 'Non-Modular', features: ['Entry Level SFX'] },
    { id: 'psu-142', name: 'FSP Hydro PTM Pro 1200W', price: 230, wattage: 1200, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Industrial Grade Protection'] },
    { id: 'psu-143', name: 'Super Flower Leadex Platinum SE 1000W', price: 200, wattage: 1000, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Excellent Performance'] },
    { id: 'psu-144', name: 'Corsair RM850 (2023) White', price: 155, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['White Casing', 'Quiet Operation'] },
    { id: 'psu-145', name: 'Thermaltake Toughpower Grand RGB 850W', price: 130, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['RGB Fan', 'Quiet Operation'] },
    { id: 'psu-146', name: 'MSI MPG A850GF White', price: 135, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['White Casing', 'Premium Capacitors'] },
    { id: 'psu-147', name: 'NZXT C850 Gold (White)', price: 125, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['White Casing', 'Sleek Design'] },
    { id: 'psu-148', name: 'be quiet! Pure Power 12 M 1000W', price: 130, wattage: 1000, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['PCIe 5.0 Ready', 'Silent Wings Fan'] },
    { id: 'psu-149', name: 'EVGA SuperNOVA 850 G+ Pure Power', price: 130, wattage: 850, efficiencyRating: '80 Plus Gold', formFactor: 'ATX', modularity: 'Fully Modular', features: ['Compact Size', 'ECO Mode'] },
    { id: 'psu-150', name: 'Cooler Master V1000 Platinum', price: 200, wattage: 1000, efficiencyRating: '80 Plus Platinum', formFactor: 'ATX', modularity: 'Fully Modular', features: ['High Efficiency', 'Stable Power'] }
    ],

    cooler: [
    // High-End Air Coolers
    { id: 'cooler-1', name: 'Noctua NH-D15', price: 110, type: 'Air Cooler', tdpSupport: 220, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x140mm', noiseLevel: 24.6, features: ['Dual Tower', 'Premium Performance', 'Low Noise'] },
    { id: 'cooler-2', name: 'Deepcool Assassin IV', price: 100, type: 'Air Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x140mm, 1x120mm', noiseLevel: 29, features: ['Dual Tower', 'Stealth Design', 'High Performance'] },
    { id: 'cooler-3', name: 'be quiet! Dark Rock Pro 4', price: 90, type: 'Air Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x135mm, 1x120mm', noiseLevel: 24.3, features: ['Dual Tower', 'Silent Operation', 'Premium Build'] },
    { id: 'cooler-4', name: 'Thermalright Phantom Spirit 120 SE', price: 40, type: 'Air Cooler', tdpSupport: 245, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 25.6, features: ['Dual Tower', 'Excellent Value', 'ARGB Lighting'] },
    { id: 'cooler-5', name: 'Scythe Fuma 3', price: 65, type: 'Air Cooler', tdpSupport: 200, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 28.5, features: ['Dual Tower', 'Compact Dual Tower'] },

    // Mid-Range Air Coolers
    { id: 'cooler-6', name: 'Cooler Master Hyper 212 RGB Black Edition', price: 45, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 26, features: ['Single Tower', 'RGB Lighting'] },
    { id: 'cooler-7', name: 'Deepcool AK620 Digital', price: 75, type: 'Air Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 28, features: ['Dual Tower', 'Digital Display', 'RGB Lighting'] },
    { id: 'cooler-8', name: 'Thermalright Peerless Assassin 120 SE', price: 35, type: 'Air Cooler', tdpSupport: 240, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 25.6, features: ['Dual Tower', 'Great Value'] },
    { id: 'cooler-9', name: 'ARCTIC Freezer 34 eSports DUO', price: 50, type: 'Air Cooler', tdpSupport: 210, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '2x120mm', noiseLevel: 24, features: ['Single Tower', 'Push-Pull Fans', 'Color Options'] },
    { id: 'cooler-10', name: 'Vetroo V5', price: 30, type: 'Air Cooler', tdpSupport: 150, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 30, features: ['Single Tower', 'RGB Lighting'] },

    // Budget Air Coolers
    { id: 'cooler-11', name: 'ID-COOLING SE-214-XT', price: 20, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 30.5, features: ['Single Tower', 'ARGB Lighting'] },
    { id: 'cooler-12', name: 'Thermalright Assassin X 120 R SE', price: 18, type: 'Air Cooler', tdpSupport: 170, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 28.5, features: ['Single Tower', 'Value'] },
    { id: 'cooler-13', name: 'Deepcool AG400', price: 25, type: 'Air Cooler', tdpSupport: 220, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 31.6, features: ['Single Tower', 'High Efficiency'] },
    { id: 'cooler-14', name: 'Cooler Master Hyper 212 EVO V2', price: 40, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 29, features: ['Single Tower', 'Updated Design'] },
    { id: 'cooler-15', name: 'GAMDIAS Chione E1A 120', price: 15, type: 'Air Cooler', tdpSupport: 130, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 35, features: ['Single Tower', 'ARGB Fan'] },

    // High-End AIO Liquid Coolers (360mm / 420mm)
    { id: 'cooler-16', name: 'ARCTIC Liquid Freezer II 360', price: 140, type: 'AIO Liquid Cooler', tdpSupport: 300, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 24, features: ['Thick Radiator', 'Excellent Performance'] },
    { id: 'cooler-17', name: 'Corsair iCUE H150i ELITE CAPELLIX XT', price: 200, type: 'AIO Liquid Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 34, features: ['RGB Lighting', 'iCUE Control', 'LCD Display Option'] },
    { id: 'cooler-18', name: 'NZXT Kraken 360 RGB', price: 180, type: 'AIO Liquid Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 33.8, features: ['RGB Fans', 'Infinity Mirror Pump Cap'] },
    { id: 'cooler-19', name: 'Lian Li Galahad II LCD SL-INF 360', price: 250, type: 'AIO Liquid Cooler', tdpSupport: 300, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 32, features: ['LCD Screen', 'Infinity Mirror Fans', 'Premium Build'] },
    { id: 'cooler-20', name: 'EK-Nucleus AIO CR360 Lux D-RGB', price: 170, type: 'AIO Liquid Cooler', tdpSupport: 290, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 36, features: ['ARGB Lighting', 'Rotatable Pump Top'] },

    // Mid-Range AIO Liquid Coolers (240mm / 280mm)
    { id: 'cooler-21', name: 'ARCTIC Liquid Freezer II 280', price: 120, type: 'AIO Liquid Cooler', tdpSupport: 270, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '280mm', fanSize: '2x140mm', noiseLevel: 23, features: ['Thick Radiator', 'Excellent Performance'] },
    { id: 'cooler-22', name: 'Cooler Master MasterLiquid 240L Core ARGB', price: 80, type: 'AIO Liquid Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 30, features: ['ARGB Lighting', 'New Pump Design'] },
    { id: 'cooler-23', name: 'Deepcool LS520 SE', price: 90, type: 'AIO Liquid Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 32.9, features: ['Infinity Mirror Pump Cap', 'ARGB Fans'] },
    { id: 'cooler-24', name: 'Corsair iCUE H100i ELITE CAPELLIX XT', price: 160, type: 'AIO Liquid Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 34, features: ['RGB Lighting', 'iCUE Control'] },
    { id: 'cooler-25', name: 'NZXT Kraken 240 RGB', price: 150, type: 'AIO Liquid Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 33.8, features: ['RGB Fans', 'Infinity Mirror Pump Cap'] },

    // Budget AIO Liquid Coolers (120mm)
    { id: 'cooler-26', name: 'Cooler Master MasterLiquid Lite 120', price: 60, type: 'AIO Liquid Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], radiatorSize: '120mm', fanSize: '1x120mm', noiseLevel: 25, features: ['Basic AIO'] },
    { id: 'cooler-27', name: 'Deepcool LE300 Marrs', price: 55, type: 'AIO Liquid Cooler', tdpSupport: 190, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], radiatorSize: '120mm', fanSize: '1x120mm', noiseLevel: 30, features: ['Static RGB Fan'] },
    { id: 'cooler-28', name: 'ID-COOLING DASHFLOW 120 BASIC', price: 50, type: 'AIO Liquid Cooler', tdpSupport: 160, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], radiatorSize: '120mm', fanSize: '1x120mm', noiseLevel: 32, features: ['ARGB Lighting'] },
    { id: 'cooler-29', name: 'Thermaltake TH120 ARGB Sync', price: 65, type: 'AIO Liquid Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], radiatorSize: '120mm', fanSize: '1x120mm', noiseLevel: 28.2, features: ['ARGB Lighting'] },
    { id: 'cooler-30', name: 'Enermax AQUAFUSION 120', price: 70, type: 'AIO Liquid Cooler', tdpSupport: 170, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], radiatorSize: '120mm', fanSize: '1x120mm', noiseLevel: 32, features: ['ARGB Pump & Fan'] },

    // More diverse entries, ensuring a mix of types, performance levels, and features to reach 150
    // Air Coolers - various models, sizes, and price points
    { id: 'cooler-31', name: 'Noctua NH-U12A chromax.black', price: 120, type: 'Air Cooler', tdpSupport: 200, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 22.4, features: ['Premium Aesthetics', 'High Performance'] },
    { id: 'cooler-32', name: 'be quiet! Pure Rock 2 Black', price: 40, type: 'Air Cooler', tdpSupport: 150, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 26.8, features: ['Silent Operation', 'Sleek Design'] },
    { id: 'cooler-33', name: 'Thermalright Frost Commander 140', price: 50, type: 'Air Cooler', tdpSupport: 265, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x140mm, 1x120mm', noiseLevel: 28, features: ['Dual Tower', 'Excellent Price/Performance'] },
    { id: 'cooler-34', name: 'Scythe Mugen 5 Rev.B', price: 55, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 24.9, features: ['Single Tower', 'Offset Design'] },
    { id: 'cooler-35', name: 'Cooler Master Hyper 620S', price: 60, type: 'Air Cooler', tdpSupport: 220, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 28, features: ['Dual Tower', 'Compact Size'] },
    { id: 'cooler-36', name: 'Deepcool AK500 Digital', price: 65, type: 'Air Cooler', tdpSupport: 240, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 31, features: ['Single Tower', 'Digital Display', 'ARGB Lighting'] },
    { id: 'cooler-37', name: 'Noctua NH-U14S', price: 80, type: 'Air Cooler', tdpSupport: 190, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x140mm', noiseLevel: 24.5, features: ['Single Tower', 'High Clearance'] },
    { id: 'cooler-38', name: 'be quiet! Dark Rock Slim', price: 60, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 23.6, features: ['Slim Design', 'Silent Operation'] },
    { id: 'cooler-39', name: 'Thermalright Peerless Assassin 120 SE ARGB', price: 45, type: 'Air Cooler', tdpSupport: 240, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 25.6, features: ['Dual Tower', 'ARGB Lighting'] },
    { id: 'cooler-40', name: 'ARCTIC Freezer 7 X', price: 20, type: 'Air Cooler', tdpSupport: 100, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x92mm', noiseLevel: 25.1, features: ['Compact', 'Budget'] },

    // Low Profile Air Coolers
    { id: 'cooler-41', name: 'Noctua NH-L9i chromax.black', price: 55, type: 'Air Cooler', tdpSupport: 95, socketSupport: ['LGA1700', 'LGA1200'], fanSize: '1x92mm', noiseLevel: 23.6, features: ['Low Profile', 'ITX Compatible'] },
    { id: 'cooler-42', name: 'Scythe Shuriken 3', price: 45, type: 'Air Cooler', tdpSupport: 100, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x92mm', noiseLevel: 24.5, features: ['Low Profile', 'Top Flow'] },
    { id: 'cooler-43', name: 'Thermalright AXP90-X36', price: 30, type: 'Air Cooler', tdpSupport: 130, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x92mm', noiseLevel: 25, features: ['Ultra Low Profile'] },
    { id: 'cooler-44', name: 'Cooler Master MasterAir G200P RGB', price: 40, type: 'Air Cooler', tdpSupport: 95, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x92mm', noiseLevel: 28, features: ['Low Profile', 'RGB Lighting'] },
    { id: 'cooler-45', name: 'ID-COOLING IS-60 EVO ARGB', price: 50, type: 'Air Cooler', tdpSupport: 120, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm slim', noiseLevel: 30, features: ['Low Profile', 'ARGB'] },

    // AIO Liquid Coolers - various models, sizes, and price points
    { id: 'cooler-46', name: 'ARCTIC Liquid Freezer II 420', price: 160, type: 'AIO Liquid Cooler', tdpSupport: 320, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '420mm', fanSize: '3x140mm', noiseLevel: 25, features: ['Max Performance', 'Thick Radiator'] },
    { id: 'cooler-47', name: 'Corsair iCUE H170i ELITE CAPELLIX XT', price: 230, type: 'AIO Liquid Cooler', tdpSupport: 300, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '420mm', fanSize: '3x140mm', noiseLevel: 35, features: ['Max RGB', 'iCUE Control'] },
    { id: 'cooler-48', name: 'NZXT Kraken Elite 360 RGB', price: 250, type: 'AIO Liquid Cooler', tdpSupport: 300, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 33.8, features: ['LCD Screen', 'RGB Fans'] },
    { id: 'cooler-49', name: 'Lian Li Galahad II Trinity SL-INF 360', price: 190, type: 'AIO Liquid Cooler', tdpSupport: 290, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 31, features: ['Infinity Mirror Fans', 'ARGB Pump'] },
    { id: 'cooler-50', name: 'EK-Nucleus AIO CR240 Lux D-RGB', price: 130, type: 'AIO Liquid Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 34, features: ['ARGB Lighting'] },
    { id: 'cooler-51', name: 'Cooler Master MasterLiquid 360L Core ARGB', price: 100, type: 'AIO Liquid Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 31, features: ['ARGB Lighting', 'New Pump Design'] },
    { id: 'cooler-52', name: 'Deepcool LS720 SE', price: 120, type: 'AIO Liquid Cooler', tdpSupport: 290, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 32.9, features: ['Infinity Mirror Pump Cap', 'ARGB Fans'] },
    { id: 'cooler-53', name: 'Corsair iCUE H115i ELITE CAPELLIX XT', price: 180, type: 'AIO Liquid Cooler', tdpSupport: 270, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '280mm', fanSize: '2x140mm', noiseLevel: 35, features: ['RGB Lighting', 'iCUE Control'] },
    { id: 'cooler-54', name: 'NZXT Kraken X63 RGB', price: 140, type: 'AIO Liquid Cooler', tdpSupport: 270, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '280mm', fanSize: '2x140mm', noiseLevel: 38, features: ['RGB Fans', 'Infinity Mirror Pump Cap'] },
    { id: 'cooler-55', name: 'Lian Li Galahad II Trinity SL-INF 240', price: 160, type: 'AIO Liquid Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 30, features: ['Infinity Mirror Fans', 'ARGB Pump'] },
    { id: 'cooler-56', name: 'MSI MAG CoreLiquid 240R V2', price: 90, type: 'AIO Liquid Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 28, features: ['ARGB Lighting', 'Rotatable Blockhead'] },
    { id: 'cooler-57', name: 'ASUS ROG Ryuo III 240 ARGB', price: 200, type: 'AIO Liquid Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 29, features: ['Anime Matrix LED Display', 'ARGB Fans'] },
    { id: 'cooler-58', name: 'Thermaltake TH360 V2 Ultra ARGB Sync', price: 150, type: 'AIO Liquid Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 28.2, features: ['LCD Display', 'ARGB Fans'] },
    { id: 'cooler-59', name: 'G.Skill ENKI 360 AIO', price: 130, type: 'AIO Liquid Cooler', tdpSupport: 270, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 36, features: ['High Performance'] },
    { id: 'cooler-60', name: 'SilverStone Permafrost PF240-ARGB', price: 85, type: 'AIO Liquid Cooler', tdpSupport: 240, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 28, features: ['ARGB Lighting', 'Sleeve Bearing Fans'] },

    // More Air Coolers
    { id: 'cooler-61', name: 'Noctua NH-U9S chromax.black', price: 70, type: 'Air Cooler', tdpSupport: 160, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x92mm', noiseLevel: 22.8, features: ['Compact Tower', 'High RAM Clearance'] },
    { id: 'cooler-62', name: 'Deepcool GAMMAXX AG620', price: 50, type: 'Air Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 31.6, features: ['Dual Tower', 'Good Value'] },
    { id: 'cooler-63', name: 'be quiet! Pure Rock Slim 2', price: 30, type: 'Air Cooler', tdpSupport: 130, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x92mm', noiseLevel: 25.4, features: ['Ultra Compact', 'Silent'] },
    { id: 'cooler-64', name: 'Thermalright Burst Assassin 120', price: 25, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 28.5, features: ['Single Tower', 'Value'] },
    { id: 'cooler-65', name: 'Scythe Ninja 5', price: 80, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '2x120mm slim', noiseLevel: 14.5, features: ['Massive Heatsink', 'Extremely Silent'] },
    { id: 'cooler-66', name: 'Cooler Master MasterAir MA612 Stealth', price: 70, type: 'Air Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 27, features: ['Dual Tower', 'Black Coating'] },
    { id: 'cooler-67', name: 'Deepcool AK400 ZERO DARK PLUS', price: 35, type: 'Air Cooler', tdpSupport: 220, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 29, features: ['Single Tower', 'All Black'] },
    { id: 'cooler-68', name: 'Thermalright Spirit 120 V2', price: 30, type: 'Air Cooler', tdpSupport: 210, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 25.6, features: ['Single Tower', 'ARGB Fan'] },
    { id: 'cooler-69', name: 'ARCTIC Freezer 50', price: 70, type: 'Air Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm, 1x140mm', noiseLevel: 29, features: ['Dual Tower', 'ARGB Lighting'] },
    { id: 'cooler-70', name: 'ID-COOLING SE-207-XT Black', price: 45, type: 'Air Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 35.2, features: ['Dual Tower', 'All Black'] },

    // More AIO Liquid Coolers
    { id: 'cooler-71', name: 'ARCTIC Liquid Freezer III 360 A-RGB', price: 160, type: 'AIO Liquid Cooler', tdpSupport: 310, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 25, features: ['New Pump Design', 'ARGB Fans'] },
    { id: 'cooler-72', name: 'Corsair iCUE H150i RGB PRO XT', price: 170, type: 'AIO Liquid Cooler', tdpSupport: 270, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 37, features: ['RGB Lighting', 'iCUE Control'] },
    { id: 'cooler-73', name: 'NZXT Kraken X73 RGB', price: 180, type: 'AIO Liquid Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 38, features: ['RGB Fans', 'Infinity Mirror Pump Cap'] },
    { id: 'cooler-74', name: 'Lian Li Galahad II LCD 280', price: 220, type: 'AIO Liquid Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '280mm', fanSize: '2x140mm', noiseLevel: 31, features: ['LCD Screen', 'Premium Build'] },
    { id: 'cooler-75', name: 'EK-AIO Basic 360', price: 140, type: 'AIO Liquid Cooler', tdpSupport: 270, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 33.5, features: ['No RGB', 'High Performance'] },
    { id: 'cooler-76', name: 'Cooler Master MasterLiquid ML280 Mirror', price: 100, type: 'AIO Liquid Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '280mm', fanSize: '2x140mm', noiseLevel: 30, features: ['Infinity Mirror Pump', 'ARGB Fans'] },
    { id: 'cooler-77', name: 'Deepcool LS320 SE', price: 75, type: 'AIO Liquid Cooler', tdpSupport: 220, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '120mm', fanSize: '1x120mm', noiseLevel: 30, features: ['Infinity Mirror', 'ARGB Fan'] },
    { id: 'cooler-78', name: 'Corsair H60 RGB PRO XT', price: 80, type: 'AIO Liquid Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], radiatorSize: '120mm', fanSize: '1x120mm', noiseLevel: 28, features: ['RGB Lighting'] },
    { id: 'cooler-79', name: 'NZXT Kraken 120 RGB', price: 100, type: 'AIO Liquid Cooler', tdpSupport: 160, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], radiatorSize: '120mm', fanSize: '1x120mm', noiseLevel: 32, features: ['RGB Fan', 'Infinity Mirror Pump'] },
    { id: 'cooler-80', name: 'Lian Li Galahad II Performance 360', price: 180, type: 'AIO Liquid Cooler', tdpSupport: 320, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 35, features: ['High Performance', 'Optimized Fans'] },

    // Continuation for 150 entries, ensuring variety in brands, sizes, features, and price points for both air and AIO.
    // This section will maintain the established pattern for the remaining entries.

    // Air Coolers continued...
    { id: 'cooler-81', name: 'Cooler Master MasterAir MA824 Stealth', price: 105, type: 'Air Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x140mm', noiseLevel: 29.8, features: ['Dual Tower', 'Stealth Design'] },
    { id: 'cooler-82', name: 'Deepcool AK400', price: 28, type: 'Air Cooler', tdpSupport: 220, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 29, features: ['Single Tower', 'Good Value'] },
    { id: 'cooler-83', name: 'Noctua NH-D12L', price: 90, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm, 1x92mm', noiseLevel: 23.8, features: ['Low Height Dual Tower'] },
    { id: 'cooler-84', name: 'Thermalright PA120SE ARGB White', price: 45, type: 'Air Cooler', tdpSupport: 240, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 25.6, features: ['Dual Tower', 'ARGB Lighting', 'White'] },
    { id: 'cooler-85', name: 'Scythe Ninja 6', price: 90, type: 'Air Cooler', tdpSupport: 200, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 20, features: ['Super Silent', 'Asymmetrical Design'] },
    { id: 'cooler-86', name: 'be quiet! Shadow Rock 3', price: 65, type: 'Air Cooler', tdpSupport: 190, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 24.4, features: ['Asymmetrical Design', 'Silent Wings 3 Fan'] },
    { id: 'cooler-87', name: 'ARCTIC Freezer 34 eSports', price: 40, type: 'Air Cooler', tdpSupport: 190, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 24, features: ['Single Tower', 'Performance'] },
    { id: 'cooler-88', name: 'ID-COOLING FROZN A620 Black', price: 60, type: 'Air Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 32, features: ['Dual Tower', 'High Performance'] },
    { id: 'cooler-89', name: 'Vetroo M98 White', price: 35, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 30, features: ['Single Tower', 'White', 'ARGB'] },
    { id: 'cooler-90', name: 'Thermalright Silver Soul 135', price: 40, type: 'Air Cooler', tdpSupport: 200, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm slim', noiseLevel: 28, features: ['Slim Tower', 'High Compatibility'] },

    // AIO Liquid Coolers continued...
    { id: 'cooler-91', name: 'ARCTIC Liquid Freezer III 240 A-RGB', price: 130, type: 'AIO Liquid Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 24, features: ['New Pump Design', 'ARGB Fans'] },
    { id: 'cooler-92', name: 'Corsair iCUE H100i ELITE LCD XT', price: 230, type: 'AIO Liquid Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 34, features: ['LCD Display', 'RGB Lighting', 'iCUE Control'] },
    { id: 'cooler-93', name: 'NZXT Kraken 280 RGB', price: 160, type: 'AIO Liquid Cooler', tdpSupport: 270, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '280mm', fanSize: '2x140mm', noiseLevel: 33.8, features: ['RGB Fans', 'Infinity Mirror Pump Cap'] },
    { id: 'cooler-94', name: 'Lian Li Galahad II Trinity Performance 240', price: 150, type: 'AIO Liquid Cooler', tdpSupport: 270, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 32, features: ['High Performance', 'Optimized Fans'] },
    { id: 'cooler-95', name: 'EK-AIO 240 D-RGB', price: 110, type: 'AIO Liquid Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 33.5, features: ['ARGB Lighting', 'High Performance'] },
    { id: 'cooler-96', name: 'Cooler Master MasterLiquid ML360 Illusion', price: 130, type: 'AIO Liquid Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 30, features: ['Translucent Pump', 'ARGB Fans'] },
    { id: 'cooler-97', name: 'Deepcool LT720 WH', price: 140, type: 'AIO Liquid Cooler', tdpSupport: 300, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 32.9, features: ['Multi-dimensional Infinity Mirror', 'White'] },
    { id: 'cooler-98', name: 'MSI MAG CoreLiquid 360R V2', price: 120, type: 'AIO Liquid Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 28, features: ['ARGB Lighting', 'Rotatable Blockhead'] },
    { id: 'cooler-99', name: 'ASUS ROG Strix LC II 280 ARGB', price: 180, type: 'AIO Liquid Cooler', tdpSupport: 270, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '280mm', fanSize: '2x140mm', noiseLevel: 29.7, features: ['ROG Design', 'ARGB Fans'] },
    { id: 'cooler-100', name: 'Thermaltake Floe RC240 ARGB Sync', price: 100, type: 'AIO Liquid Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 28.2, features: ['RAM Cooler Integration', 'ARGB'] },

    // More Air Coolers
    { id: 'cooler-101', name: 'Noctua NH-L12S', price: 60, type: 'Air Cooler', tdpSupport: 120, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm slim', noiseLevel: 23.9, features: ['Low Profile', 'High Compatibility'] },
    { id: 'cooler-102', name: 'Deepcool AS500 Plus', price: 60, type: 'Air Cooler', tdpSupport: 220, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x140mm', noiseLevel: 29.2, features: ['Single Tower', 'ARGB Lighting'] },
    { id: 'cooler-103', name: 'be quiet! Shadow Rock LP', price: 50, type: 'Air Cooler', tdpSupport: 130, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm slim', noiseLevel: 25.5, features: ['Low Profile', 'Silent'] },
    { id: 'cooler-104', name: 'Thermalright Burst Assassin 120 ARGB', price: 30, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 28.5, features: ['Single Tower', 'ARGB Fan'] },
    { id: 'cooler-105', name: 'Scythe Big Shuriken 3', price: 50, type: 'Air Cooler', tdpSupport: 130, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm slim', noiseLevel: 27.5, features: ['Low Profile', 'Top Flow'] },
    { id: 'cooler-106', name: 'Cooler Master MasterAir MA624 Stealth', price: 95, type: 'Air Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x140mm', noiseLevel: 29, features: ['Dual Tower', 'Stealth Black'] },
    { id: 'cooler-107', name: 'Deepcool GAMMAXX GTE V2 ARGB', price: 30, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 29.5, features: ['Single Tower', 'ARGB Fan'] },
    { id: 'cooler-108', name: 'Thermalright Assassin King 120 SE', price: 20, type: 'Air Cooler', tdpSupport: 170, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 28.5, features: ['Single Tower', 'Budget Friendly'] },
    { id: 'cooler-109', name: 'ARCTIC Freezer 34 eSports DUO White', price: 55, type: 'Air Cooler', tdpSupport: 210, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '2x120mm', noiseLevel: 24, features: ['Single Tower', 'White', 'Push-Pull'] },
    { id: 'cooler-110', name: 'ID-COOLING SE-224-XT ARGB V2', price: 25, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x120mm', noiseLevel: 30.5, features: ['Single Tower', 'ARGB Lighting'] },

    // More AIO Liquid Coolers
    { id: 'cooler-111', name: 'ARCTIC Liquid Freezer II 240 A-RGB', price: 110, type: 'AIO Liquid Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 23, features: ['Thick Radiator', 'ARGB Fans'] },
    { id: 'cooler-112', name: 'Corsair iCUE H100i RGB ELITE', price: 120, type: 'AIO Liquid Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 34, features: ['RGB Lighting', 'iCUE Control'] },
    { id: 'cooler-113', name: 'NZXT Kraken X53 RGB', price: 130, type: 'AIO Liquid Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 33.8, features: ['RGB Fans', 'Infinity Mirror Pump'] },
    { id: 'cooler-114', name: 'Lian Li Galahad II Trinity 360', price: 170, type: 'AIO Liquid Cooler', tdpSupport: 290, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 31, features: ['RGB Fans', 'Rotatable Pump Block'] },
    { id: 'cooler-115', name: 'EK-Nucleus AIO CR120 Lux D-RGB', price: 90, type: 'AIO Liquid Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], radiatorSize: '120mm', fanSize: '1x120mm', noiseLevel: 32, features: ['ARGB Lighting'] },
    { id: 'cooler-116', name: 'Cooler Master MasterLiquid ML120L RGB V2', price: 70, type: 'AIO Liquid Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], radiatorSize: '120mm', fanSize: '1x120mm', noiseLevel: 25, features: ['RGB Lighting'] },
    { id: 'cooler-117', name: 'Deepcool LS520 ARGB', price: 95, type: 'AIO Liquid Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 32.9, features: ['Infinity Mirror', 'ARGB Fans'] },
    { id: 'cooler-118', name: 'Corsair H100x RGB Elite', price: 100, type: 'AIO Liquid Cooler', tdpSupport: 220, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 28, features: ['RGB Fans', 'Value'] },
    { id: 'cooler-119', name: 'NZXT Kraken Elite 240 RGB', price: 200, type: 'AIO Liquid Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 33.8, features: ['LCD Screen', 'RGB Fans'] },
    { id: 'cooler-120', name: 'Lian Li Galahad II LCD SL-INF 280', price: 230, type: 'AIO Liquid Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '280mm', fanSize: '2x140mm', noiseLevel: 31, features: ['LCD Screen', 'Infinity Mirror Fans'] },

    // More Air Coolers
    { id: 'cooler-121', name: 'Noctua NH-P1', price: 110, type: 'Air Cooler', tdpSupport: 120, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: 'Fanless', noiseLevel: 0, features: ['Passive Cooling', 'Silent'] },
    { id: 'cooler-122', name: 'Deepcool AG620 Digital', price: 80, type: 'Air Cooler', tdpSupport: 260, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 31.6, features: ['Dual Tower', 'Digital Display', 'ARGB'] },
    { id: 'cooler-123', name: 'be quiet! Dark Rock 4', price: 75, type: 'Air Cooler', tdpSupport: 200, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x135mm', noiseLevel: 21.4, features: ['Single Tower', 'Silent Operation'] },
    { id: 'cooler-124', name: 'Thermalright Phantom Spirit 120 SE ARGB', price: 45, type: 'Air Cooler', tdpSupport: 245, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 25.6, features: ['Dual Tower', 'ARGB Lighting'] },
    { id: 'cooler-125', name: 'Scythe Kotetsu Mark II Rev.B', price: 40, type: 'Air Cooler', tdpSupport: 160, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 24.9, features: ['Single Tower', 'High RAM Compatibility'] },
    { id: 'cooler-126', name: 'Cooler Master Hyper 212 Spectrum V3', price: 50, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 26, features: ['Single Tower', 'ARGB Fan'] },
    { id: 'cooler-127', name: 'Deepcool AK500 WH', price: 60, type: 'Air Cooler', tdpSupport: 240, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 31, features: ['Single Tower', 'White'] },
    { id: 'cooler-128', name: 'Thermalright Peerless Assassin 120 SE White', price: 40, type: 'Air Cooler', tdpSupport: 240, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 25.6, features: ['Dual Tower', 'White'] },
    { id: 'cooler-129', name: 'ARCTIC Freezer i35 A-RGB', price: 45, type: 'Air Cooler', tdpSupport: 200, socketSupport: ['LGA1700', 'LGA1200'], fanSize: '1x120mm', noiseLevel: 28, features: ['Single Tower', 'ARGB Fan'] },
    { id: 'cooler-130', name: 'ID-COOLING SE-914-XT ARGB', price: 22, type: 'Air Cooler', tdpSupport: 160, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x92mm', noiseLevel: 28, features: ['Compact', 'ARGB Fan'] },

    // More AIO Liquid Coolers
    { id: 'cooler-131', name: 'ARCTIC Liquid Freezer III 420 A-RGB', price: 180, type: 'AIO Liquid Cooler', tdpSupport: 320, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '420mm', fanSize: '3x140mm', noiseLevel: 25, features: ['New Pump Design', 'ARGB Fans'] },
    { id: 'cooler-132', name: 'Corsair iCUE H170i ELITE LCD XT', price: 260, type: 'AIO Liquid Cooler', tdpSupport: 300, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '420mm', fanSize: '3x140mm', noiseLevel: 35, features: ['LCD Display', 'RGB Lighting'] },
    { id: 'cooler-133', name: 'NZXT Kraken Z73 RGB', price: 230, type: 'AIO Liquid Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 38, features: ['LCD Display', 'RGB Fans'] },
    { id: 'cooler-134', name: 'Lian Li Galahad II Trinity SL-INF 280', price: 180, type: 'AIO Liquid Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '280mm', fanSize: '2x140mm', noiseLevel: 31, features: ['Infinity Mirror Fans', 'ARGB Pump'] },
    { id: 'cooler-135', name: 'EK-AIO Basic 240', price: 100, type: 'AIO Liquid Cooler', tdpSupport: 230, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 33.5, features: ['No RGB', 'Good Performance'] },
    { id: 'cooler-136', name: 'Cooler Master MasterLiquid ML240L ARGB V2', price: 85, type: 'AIO Liquid Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '240mm', fanSize: '2x120mm', noiseLevel: 25, features: ['ARGB Lighting'] },
    { id: 'cooler-137', name: 'Deepcool LS720 ARGB', price: 130, type: 'AIO Liquid Cooler', tdpSupport: 290, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 32.9, features: ['Infinity Mirror Pump', 'ARGB Fans'] },
    { id: 'cooler-138', name: 'Corsair H150i RGB Elite', price: 150, type: 'AIO Liquid Cooler', tdpSupport: 270, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '360mm', fanSize: '3x120mm', noiseLevel: 28, features: ['RGB Fans', 'Good Value'] },
    { id: 'cooler-139', name: 'NZXT Kraken Elite 420 RGB', price: 270, type: 'AIO Liquid Cooler', tdpSupport: 300, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '420mm', fanSize: '3x140mm', noiseLevel: 33.8, features: ['LCD Screen', 'RGB Fans'] },
    { id: 'cooler-140', name: 'Lian Li Galahad II LCD SL-INF 420', price: 280, type: 'AIO Liquid Cooler', tdpSupport: 300, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], radiatorSize: '420mm', fanSize: '3x140mm', noiseLevel: 32, features: ['LCD Screen', 'Infinity Mirror Fans'] },

    // Final Air Coolers
    { id: 'cooler-141', name: 'Noctua NH-C14S', price: 90, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM4'], fanSize: '1x140mm', noiseLevel: 26.5, features: ['Top Flow', 'High Compatibility'] },
    { id: 'cooler-142', name: 'Deepcool Assassin III', price: 90, type: 'Air Cooler', tdpSupport: 280, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x140mm', noiseLevel: 29.5, features: ['Dual Tower', 'High Performance'] },
    { id: 'cooler-143', name: 'be quiet! Pure Rock FX', price: 50, type: 'Air Cooler', tdpSupport: 150, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 26.8, features: ['ARGB Fan', 'Silent Operation'] },
    { id: 'cooler-144', name: 'Thermalright PA120 Black', price: 40, type: 'Air Cooler', tdpSupport: 240, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 25.6, features: ['Dual Tower', 'All Black'] },
    { id: 'cooler-145', name: 'Scythe Mugen 6', price: 70, type: 'Air Cooler', tdpSupport: 200, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 24.9, features: ['Single Tower', 'Improved Design'] },
    { id: 'cooler-146', name: 'Cooler Master Hyper 212 Halo', price: 55, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 27, features: ['ARGB Halo Fan'] },
    { id: 'cooler-147', name: 'Deepcool AK400 Digital', price: 45, type: 'Air Cooler', tdpSupport: 220, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 29, features: ['Single Tower', 'Digital Display'] },
    { id: 'cooler-148', name: 'Thermalright FC140 Black', price: 60, type: 'Air Cooler', tdpSupport: 265, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x140mm, 1x120mm', noiseLevel: 28, features: ['Dual Tower', 'Black Coating'] },
    { id: 'cooler-149', name: 'ARCTIC Freezer 36', price: 35, type: 'Air Cooler', tdpSupport: 180, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '1x120mm', noiseLevel: 25, features: ['Single Tower', 'New Model'] },
    { id: 'cooler-150', name: 'ID-COOLING SE-226-XT Black', price: 38, type: 'Air Cooler', tdpSupport: 250, socketSupport: ['LGA1700', 'LGA1200', 'AM5', 'AM4'], fanSize: '2x120mm', noiseLevel: 35.2, features: ['Dual Tower', 'All Black'] }
    ], 

    case: [
    // Mid-Tower ATX Cases (Common, Varied Features)
    { id: 'case-1', name: 'NZXT H5 Flow RGB ATX Mid Tower Case', price: 90, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x140mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Lighting'], color: 'Black' },
    { id: 'case-2', name: 'Lian Li Lancool 216 ATX Mid Tower Case', price: 100, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x160mm front, 1x140mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'High Airflow', 'RGB Lighting'], color: 'Black' },
    { id: 'case-3', name: 'Corsair 4000D Airflow ATX Mid Tower Case', price: 95, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 280mm top', features: ['Tempered Glass', 'Mesh Front'], color: 'White' },
    { id: 'case-4', name: 'Fractal Design Pop Air ATX Mid Tower Case', price: 80, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front'], color: 'Black' },
    { id: 'case-5', name: 'Phanteks Eclipse G300A ATX Mid Tower Case', price: 70, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 3x120mm front, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'High Airflow'], color: 'Black' },
    { id: 'case-6', name: 'Montech AIR 903 MAX ATX Mid Tower Case', price: 75, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 1x140mm rear, 2x120mm top', radiatorSupport: '360mm front, 280mm top', features: ['Tempered Glass', 'RGB Lighting', 'High Airflow'], color: 'Black' },
    { id: 'case-7', name: 'Cooler Master TD500 Mesh V2 ATX Mid Tower Case', price: 110, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Lighting'], color: 'White' },
    { id: 'case-8', name: 'HYTE Y60 ATX Mid Tower Case', price: 200, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm bottom, 1x120mm rear, 2x140mm top', radiatorSupport: '360mm side, 280mm top', features: ['Panoramic Glass', 'Vertical GPU Mount'], color: 'Black' },
    { id: 'case-9', name: 'Deepcool CH510 ATX Mid Tower Case', price: 70, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x140mm top', radiatorSupport: '360mm front, 280mm top', features: ['Tempered Glass', 'Clean Design'], color: 'Black' },
    { id: 'case-10', name: 'Thermaltake Ceres 300 TG ARGB ATX Mid Tower Case', price: 90, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x140mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'RGB Lighting'], color: 'White' },

    // Micro-ATX Cases (Compact, Smaller Builds)
    { id: 'case-11', name: 'Thermaltake S100 Micro-ATX Mini Tower Case', price: 60, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front, 1x120mm top', radiatorSupport: '240mm front, 120mm top', features: ['Tempered Glass', 'Compact'], color: 'Black' },
    { id: 'case-12', name: 'Cooler Master MasterBox Q300L Micro-ATX Mini Tower Case', price: 50, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front, 2x120mm top', radiatorSupport: '240mm front, 120mm top', features: ['Magnetic Dust Filters'], color: 'Black' },
    { id: 'case-13', name: 'Fractal Design Meshify C Mini Micro-ATX Tower Case', price: 90, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front'], color: 'Black' },
    { id: 'case-14', name: 'NZXT H400i Micro-ATX Mid Tower Case', price: 120, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass', 'Smart Device'], color: 'White' },
    { id: 'case-15', name: 'Lian Li O11 Air Mini Micro-ATX Case', price: 110, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top, 2x120mm bottom', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass', 'High Airflow'], color: 'Black' },

    // Mini-ITX Cases (Ultra Compact Builds)
    { id: 'case-16', name: 'Fractal Design Ridge Mini-ITX Console Case', price: 130, formFactorSupport: ['Mini-ITX'], fanSupport: '2x120mm side, 1x80mm rear', radiatorSupport: 'N/A', features: ['Slim Design', 'Vertical/Horizontal Orientation'], color: 'Black' },
    { id: 'case-17', name: 'Cooler Master MasterBox NR200P Mini-ITX Case', price: 90, formFactorSupport: ['Mini-ITX'], fanSupport: '2x120mm top, 2x120mm bottom, 1x92mm rear', radiatorSupport: '240mm side, 240mm top', features: ['Tempered Glass', 'Mesh Side Panels', 'Vertical GPU Support'], color: 'White' },
    { id: 'case-18', name: 'Lian Li A4-H2O Mini-ITX Case', price: 160, formFactorSupport: ['Mini-ITX'], fanSupport: '2x120mm top', radiatorSupport: '240mm top', features: ['Sandwich Layout', 'Compact'], color: 'Black' },
    { id: 'case-19', name: 'NZXT H1 V2 Mini-ITX Case (with PSU & AIO)', price: 300, formFactorSupport: ['Mini-ITX'], fanSupport: '1x140mm AIO', radiatorSupport: '140mm AIO', features: ['Integrated PSU & AIO', 'Vertical GPU Mount'], color: 'Matte Black' },
    { id: 'case-20', name: 'Streacom DA2 Mini-ITX Case', price: 180, formFactorSupport: ['Mini-ITX'], fanSupport: 'Flexible mounting', radiatorSupport: '240mm', features: ['Premium Aluminum', 'Modular Interior'], color: 'Silver' },

    // Full-Tower/Enthusiast Cases (Max Expandability)
    { id: 'case-21', name: 'Lian Li O11 Dynamic XL Full Tower Case', price: 230, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm top, 3x120mm bottom, 3x120mm side, 1x120mm rear', radiatorSupport: '360mm top, 360mm bottom, 360mm side', features: ['Dual Chamber', 'Tempered Glass', 'RGB Lighting'], color: 'Black' },
    { id: 'case-22', name: 'Corsair 7000D Airflow Full Tower Case', price: 260, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 3x120mm top, 1x140mm rear', radiatorSupport: '420mm front, 420mm top', features: ['High Airflow', 'Tempered Glass'], color: 'White' },
    { id: 'case-23', name: 'Cooler Master HAF 700 EVO Full Tower Case', price: 450, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x200mm front, 2x120mm rear, 3x120mm top, 3x120mm bottom', radiatorSupport: '360mm front, 360mm top, 360mm bottom', features: ['Extreme Airflow', 'ARGB Lighting', 'LCD Display'], color: 'Grey' },
    { id: 'case-24', 'name': 'Phanteks Enthoo Pro 2 Full Tower Case', price: 180, formFactorSupport: ['SSI-EEB', 'E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 3x140mm top, 1x140mm rear', radiatorSupport: '420mm front, 420mm top', features: ['High Airflow', 'Server Ready'], color: 'Black' },
    { id: 'case-25', name: 'Thermaltake Core P3 TG Pro Full Tower Case', price: 160, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm side, 3x120mm top', radiatorSupport: '420mm side', features: ['Open Frame', 'Tempered Glass', 'Wall-Mountable'], color: 'Black' },

    // More diverse entries, including different price points, colors, and specific features to reach 150
    { id: 'case-26', name: 'NZXT H7 Flow ATX Mid Tower Case', price: 100, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'High Airflow'], color: 'Black' },
    { id: 'case-27', name: 'Lian Li O11 Dynamic EVO ATX Mid Tower Case', price: 150, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm top, 3x120mm bottom, 3x120mm side', radiatorSupport: '360mm top, 360mm bottom, 360mm side', features: ['Dual Chamber', 'Reversible Layout', 'Tempered Glass'], color: 'White' },
    { id: 'case-28', name: 'Corsair iCUE 5000D RGB Airflow ATX Mid Tower Case', price: 170, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Lighting', 'iCUE Controller'], color: 'Black' },
    { id: 'case-29', name: 'Fractal Design Torrent ATX Mid Tower Case', price: 200, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x180mm front, 3x140mm bottom, 1x140mm rear', radiatorSupport: '420mm front, 420mm bottom', features: ['Massive Airflow', 'Open Layout'], color: 'Black' },
    { id: 'case-30', name: 'Phanteks Enthoo Pro Tempered Glass ATX Full Tower Case', price: 130, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x140mm front, 1x140mm rear, 2x140mm top', radiatorSupport: '360mm front, 280mm top', features: ['Tempered Glass', 'Spacious Interior'], color: 'Black' },
    { id: 'case-31', name: 'be quiet! Pure Base 500DX ATX Mid Tower Case', price: 100, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '1x140mm front, 1x140mm rear, 1x140mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'High Airflow', 'ARGB Lighting'], color: 'White' },
    { id: 'case-32', name: 'Antec NX410 ATX Mid Tower Case', price: 80, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x140mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'RGB Fans'], color: 'Black' },
    { id: 'case-33', name: 'Thermaltake H200 TG RGB ATX Mid Tower Case', price: 75, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'RGB Lighting'], color: 'White' },
    { id: 'case-34', name: 'MSI MPG GUNGNIR 110R ATX Mid Tower Case', price: 90, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'RGB Lighting'], color: 'Black' },
    { id: 'case-35', name: 'G.Skill Z5i Mini-ITX Tower Case', price: 180, formFactorSupport: ['Mini-ITX'], fanSupport: '2x140mm side, 1x120mm rear', radiatorSupport: '280mm side', features: ['Curved Tempered Glass', 'Compact'], color: 'Black' },
    { id: 'case-36', name: 'SilverStone Fara B1 RGB ATX Mid Tower Case', price: 65, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'RGB Lighting'], color: 'Black' },
    { id: 'case-37', name: 'MetallicGear Neo Qube ATX Mid Tower Case', price: 105, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm top, 3x120mm bottom, 3x120mm side', radiatorSupport: '360mm top, 360mm bottom, 360mm side', features: ['Dual Chamber', 'Tempered Glass'], color: 'White' },
    { id: 'case-38', name: 'Cougar Archon 2 Mesh RGB ATX Mid Tower Case', price: 55, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear', radiatorSupport: '360mm front, 240mm top', features: ['Mesh Front', 'RGB Lighting'], color: 'Black' },
    { id: 'case-39', name: 'GameMax Fortress RGB ATX Mid Tower Case', price: 60, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'RGB Lighting'], color: 'Black' },
    { id: 'case-40', name: 'InWin 101 ATX Mid Tower Case', price: 80, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm bottom, 1x120mm rear', radiatorSupport: '360mm bottom, 120mm rear', features: ['Tempered Glass', 'Minimalist Design'], color: 'White' },
    { id: 'case-41', name: 'Aerocool Cylon RGB ATX Mid Tower Case', price: 50, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front, 2x120mm top', radiatorSupport: '240mm front, 120mm rear', features: ['RGB Front Panel'], color: 'Black' },
    { id: 'case-42', name: 'Kolink Citadel Mesh RGB Micro-ATX Case', price: 65, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Fans'], color: 'Black' },
    { id: 'case-43', name: 'Phanteks Eclipse P360A ATX Mid Tower Case', price: 90, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Lighting'], color: 'Black' },
    { id: 'case-44', name: 'Thermaltake Versa H18 Micro-ATX Case', price: 45, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front, 1x120mm top', radiatorSupport: '240mm front, 120mm rear', features: ['Mesh Front Panel'], color: 'Black' },
    { id: 'case-45', name: 'NZXT H7 Elite ATX Mid Tower Case', price: 180, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'RGB Lighting', 'NZXT CAM Smart Device'], color: 'White' },
    { id: 'case-46', name: 'Lian Li PC-O11 Dynamic Mid Tower Case', price: 140, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm top, 3x120mm bottom, 3x120mm side', radiatorSupport: '360mm top, 360mm bottom, 360mm side', features: ['Dual Chamber', 'Tempered Glass'], color: 'Black' },
    { id: 'case-47', name: 'Corsair 7000X RGB Full Tower Case', price: 300, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 3x120mm top, 1x140mm rear', radiatorSupport: '420mm front, 420mm top', features: ['Tempered Glass', 'RGB Fans', 'iCUE Controller'], color: 'Black' },
    { id: 'case-48', name: 'Fractal Design Define 7 XL Full Tower Case', price: 230, formFactorSupport: ['SSI-EEB', 'E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 3x140mm top, 1x140mm rear', radiatorSupport: '420mm front, 420mm top', features: ['Noise Dampening', 'Modular Interior'], color: 'Black' },
    { id: 'case-49', name: 'Cooler Master Cosmos C700M Full Tower Case', price: 400, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 3x140mm top, 1x140mm rear', radiatorSupport: '420mm front, 420mm top', features: ['Highly Modular', 'ARGB Lighting'], color: 'Gunmetal' },
    { id: 'case-50', name: 'Thermaltake View 71 TG RGB Full Tower Case', price: 190, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 1x140mm rear, 3x140mm top', radiatorSupport: '420mm front, 420mm top', features: ['Four Tempered Glass Panels', 'RGB Fans'], color: 'Black' },
    { id: 'case-51', name: 'NZXT H5 Elite ATX Mid Tower Case', price: 130, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x140mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass', 'Integrated Fan Controller'], color: 'White' },
    { id: 'case-52', name: 'Lian Li Lancool III ATX Mid Tower Case', price: 150, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 1x140mm rear, 3x120mm top', radiatorSupport: '420mm front, 360mm top', features: ['High Airflow', 'Tempered Glass', 'RGB Lighting'], color: 'Black' },
    { id: 'case-53', name: 'Corsair 4000X RGB ATX Mid Tower Case', price: 130, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 280mm top', features: ['Tempered Glass', 'RGB Fans', 'iCUE Controller'], color: 'White' },
    { id: 'case-54', name: 'Fractal Design Pop Silent ATX Mid Tower Case', price: 85, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear', radiatorSupport: '280mm front, 240mm top', features: ['Noise Dampening'], color: 'Black' },
    { id: 'case-55', name: 'Phanteks Eclipse P400A Digital ATX Mid Tower Case', price: 90, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front', 'Digital RGB'], color: 'Black' },
    { id: 'case-56', name: 'Montech X3 Mesh ATX Mid Tower Case', price: 60, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Mesh Front', 'RGB Fans'], color: 'Black' },
    { id: 'case-57', name: 'Cooler Master MasterBox TD500 Mesh ATX Mid Tower Case', price: 100, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Lighting'], color: 'Black' },
    { id: 'case-58', name: 'HYTE Y40 ATX Mid Tower Case', price: 150, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm bottom, 1x120mm rear, 2x140mm top', radiatorSupport: '280mm side, 280mm top', features: ['Panoramic Glass', 'Vertical GPU Mount'], color: 'White' },
    { id: 'case-59', name: 'Deepcool MATREXX 55 V3 ADD-RGB ATX Mid Tower Case', price: 70, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'RGB Lighting'], color: 'Black' },
    { id: 'case-60', name: 'Thermaltake Core P5 TG Full Tower Case', price: 180, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '4x120mm side', radiatorSupport: '480mm side', features: ['Open Frame', 'Tempered Glass', 'Wall-Mountable'], color: 'Black' },
    { id: 'case-61', name: 'NZXT H9 Flow ATX Mid Tower Case', price: 160, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm side, 3x120mm top, 3x120mm bottom, 1x120mm rear', radiatorSupport: '360mm side, 360mm top, 360mm bottom', features: ['Dual Chamber', 'Tempered Glass', 'High Airflow'], color: 'Black' },
    { id: 'case-62', name: 'Lian Li O11 Dynamic EVO XL Full Tower Case', price: 270, formFactorSupport: ['SSI-EEB', 'E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '4x140mm top, 4x140mm bottom, 4x140mm side, 1x120mm rear', radiatorSupport: '480mm top, 480mm bottom, 480mm side', features: ['Dual Chamber', 'Tempered Glass', 'Modular Layout'], color: 'Silver' },
    { id: 'case-63', name: 'Corsair 5000X RGB Mid Tower Case', price: 180, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'RGB Fans', 'iCUE Commander CORE XT'], color: 'Black' },
    { id: 'case-64', name: 'Fractal Design Define 7 Compact ATX Mid Tower Case', price: 120, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '280mm front, 240mm top', features: ['Noise Dampening', 'Modular Top Panel'], color: 'Black' },
    { id: 'case-65', name: 'Phanteks Eclipse P500A Digital ATX Mid Tower Case', price: 140, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 1x140mm rear, 3x120mm top', radiatorSupport: '420mm front, 360mm top', features: ['Tempered Glass', 'Mesh Front', 'Digital RGB'], color: 'White' },
    { id: 'case-66', name: 'be quiet! Pure Base 600 ATX Mid Tower Case', price: 90, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '1x140mm front, 1x120mm rear, 2x140mm top', radiatorSupport: '360mm front, 240mm top', features: ['Noise Dampening', 'Movable HDD Slots'], color: 'Black' },
    { id: 'case-67', name: 'Antec P101 Silent Full Tower Case', price: 110, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x140mm rear, 2x120mm top', radiatorSupport: '360mm front, 280mm top', features: ['Noise Dampening', 'High Drive Capacity'], color: 'Black' },
    { id: 'case-68', name: 'Thermaltake Core V1 Mini-ITX Cube Case', price: 50, formFactorSupport: ['Mini-ITX'], fanSupport: '1x200mm front, 2x80mm rear', radiatorSupport: '140mm front', features: ['Cube Design', 'Interchangeable Side Panels'], color: 'Black' },
    { id: 'case-69', name: 'MSI MAG FORGE 100R ATX Mid Tower Case', price: 70, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'RGB Lighting'], color: 'Black' },
    { id: 'case-70', name: 'G.Skill Z5 Mini-ITX Tower Case', price: 160, formFactorSupport: ['Mini-ITX'], fanSupport: '2x120mm side', radiatorSupport: '240mm side', features: ['Compact', 'Premium Build'], color: 'Silver' },
    { id: 'case-71', name: 'SilverStone Fara R1 PRO ATX Mid Tower Case', price: 75, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Fans'], color: 'Black' },
    { id: 'case-72', name: 'MetallicGear Neo G Mid-Tower Case', price: 85, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'RGB Strip'], color: 'White' },
    { id: 'case-73', name: 'Cougar MX410 Mesh-G RGB ATX Mid Tower Case', price: 65, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear', radiatorSupport: '240mm front, 240mm top', features: ['Mesh Front', 'RGB Fans'], color: 'Black' },
    { id: 'case-74', name: 'GameMax Revolt RGB ATX Mid Tower Case', price: 70, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'RGB Lighting'], color: 'White' },
    { id: 'case-75', name: 'InWin 303 RGB ATX Mid Tower Case', price: 95, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm bottom, 3x120mm top, 1x120mm rear', radiatorSupport: '360mm bottom, 360mm top', features: ['Tempered Glass', 'Unique PSU Placement'], color: 'Black' },
    { id: 'case-76', name: 'Aerocool Mirage A11 Mini Tower Case', price: 55, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front', radiatorSupport: '240mm front', features: ['Infinity Mirror RGB'], color: 'Black' },
    { id: 'case-77', name: 'Kolink Observatory Lite Mesh RGB ATX Mid Tower Case', price: 70, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Fans'], color: 'Black' },
    { id: 'case-78', name: 'Phanteks Eclipse P300A ATX Mid Tower Case', price: 70, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front'], color: 'White' },
    { id: 'case-79', name: 'Thermaltake Versa H17 Micro-ATX Case', price: 40, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front, 1x120mm top', radiatorSupport: '240mm front, 120mm rear', features: ['Compact'], color: 'Black' },
    { id: 'case-80', name: 'NZXT H6 Flow RGB ATX Mid Tower Case', price: 110, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm top, 240mm side', features: ['Panoramic Glass', 'Side Fan Mount', 'RGB Lighting'], color: 'Black' },
    { id: 'case-81', name: 'Lian Li O11 Vision ATX Mid Tower Case', price: 180, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm top, 3x120mm bottom, 3x120mm side', radiatorSupport: '360mm top, 360mm bottom, 360mm side', features: ['Full Glass Front & Side', 'Dual Chamber'], color: 'Black' },
    { id: 'case-82', name: 'Corsair 6500D Airflow ATX Mid Tower Case', price: 190, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 1x140mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Dual Chamber', 'High Airflow'], color: 'Black' },
    { id: 'case-83', name: 'Fractal Design Define S2 Vision RGB ATX Mid Tower Case', price: 250, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 1x140mm rear, 3x120mm top', radiatorSupport: '360mm front, 420mm top', features: ['Tempered Glass on All Sides', 'RGB Fans'], color: 'Black' },
    { id: 'case-84', name: 'Cooler Master HAF 500 ATX Mid Tower Case', price: 150, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x200mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Large RGB Fans', 'High Airflow'], color: 'Black' },
    { id: 'case-85', name: 'Thermaltake Level 20 GT ARGB Full Tower Case', price: 250, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x200mm front, 1x140mm rear, 3x140mm top', radiatorSupport: '420mm front, 360mm top', features: ['Four Tempered Glass Panels', 'RGB Lighting'], color: 'Black' },
    { id: 'case-86', name: 'NZXT H7 Elite RGB ATX Mid Tower Case', price: 190, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'RGB Fans', 'Smart Device'], color: 'Black' },
    { id: 'case-87', name: 'Lian Li O11D EVO Micro-ATX Case', price: 140, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm top, 3x120mm bottom, 3x120mm side', radiatorSupport: '360mm top, 360mm bottom, 360mm side', features: ['Dual Chamber', 'Reversible Layout', 'Tempered Glass'], color: 'White' },
    { id: 'case-88', name: 'Corsair 3000D Airflow ATX Mid Tower Case', price: 80, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 280mm top', features: ['Mesh Front'], color: 'Black' },
    { id: 'case-89', name: 'Fractal Design Meshify 2 Lite RGB ATX Mid Tower Case', price: 120, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 1x140mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Fans'], color: 'Black' },
    { id: 'case-90', name: 'Phanteks Eclipse P360X ATX Mid Tower Case', price: 85, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'D-RGB Lighting'], color: 'Black' },
    { id: 'case-91', name: 'Montech Sky Two ATX Mid Tower Case', price: 90, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 280mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Fans'], color: 'White' },
    { id: 'case-92', name: 'Cooler Master MasterBox MB511 ARGB ATX Mid Tower Case', price: 90, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Mesh Front', 'RGB Fans'], color: 'Black' },
    { id: 'case-93', name: 'HYTE Rebel Pro RGB ATX Mid Tower Case', price: 160, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm side, 3x120mm top, 1x120mm rear', radiatorSupport: '360mm side, 360mm top', features: ['Panoramic Glass', 'Vertical GPU Mount', 'RGB Lighting'], color: 'Black' },
    { id: 'case-94', name: 'Deepcool CH370 Micro-ATX Case', price: 60, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'Compact'], color: 'White' },
    { id: 'case-95', name: 'Thermaltake Core P1 TG Mini-ITX Case', price: 100, formFactorSupport: ['Mini-ITX'], fanSupport: '1x120mm side', radiatorSupport: '240mm side', features: ['Open Frame', 'Tempered Glass', 'Wall-Mountable'], color: 'Black' },
    { id: 'case-96', name: 'NZXT H9 Elite ATX Mid Tower Case', price: 240, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm side, 3x120mm top, 3x120mm bottom, 1x120mm rear', radiatorSupport: '360mm side, 360mm top, 360mm bottom', features: ['Dual Chamber', 'Tempered Glass on All Sides', 'RGB Lighting', 'CAM Hub'], color: 'White' },
    { id: 'case-97', name: 'Lian Li Lancool 205 Mesh ATX Mid Tower Case', price: 80, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front'], color: 'Black' },
    { id: 'case-98', name: 'Corsair 220T RGB Airflow ATX Mid Tower Case', price: 100, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'RGB Fans'], color: 'White' },
    { id: 'case-99', name: 'Fractal Design Meshify 2 Compact ATX Mid Tower Case', price: 110, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front'], color: 'Black' },
    { id: 'case-100', name: 'Phanteks Eclipse P600S Hybrid ATX Mid Tower Case', price: 150, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 1x140mm rear, 3x120mm top', radiatorSupport: '420mm front, 360mm top', features: ['Silent/Airflow Hybrid', 'Tempered Glass'], color: 'Black' },
    { id: 'case-101', name: 'be quiet! Silent Base 802 ATX Mid Tower Case', price: 170, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x140mm front, 1x140mm rear, 2x140mm top', radiatorSupport: '420mm front, 360mm top', features: ['Noise Dampening', 'Interchangeable Top/Front Panel'], color: 'Black' },
    { id: 'case-102', name: 'Antec DF700 Flux ATX Mid Tower Case', price: 90, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 1x120mm bottom, 2x120mm top', radiatorSupport: '360mm front, 280mm top', features: ['High Airflow', 'RGB Lighting'], color: 'Black' },
    { id: 'case-103', name: 'Thermaltake Versa J24 TG RGB ATX Mid Tower Case', price: 80, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'RGB Fans'], color: 'Black' },
    { id: 'case-104', name: 'MSI MAG VAMPIRIC 010 ATX Mid Tower Case', price: 65, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 3x120mm front, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'RGB Fan'], color: 'Black' },
    { id: 'case-105', name: 'G.Skill Z3 Mid-Tower Case', price: 100, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'Clean Aesthetics'], color: 'White' },
    { id: 'case-106', name: 'SilverStone Fara H1M PRO Micro-ATX Case', price: 55, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front'], color: 'Black' },
    { id: 'case-107', name: 'MetallicGear Neo Air ATX Mid Tower Case', price: 75, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Mesh Front', 'RGB Fans'], color: 'Black' },
    { id: 'case-108', name: 'Cougar MX330-G Pro ATX Mid Tower Case', price: 60, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'Budget Friendly'], color: 'Black' },
    { id: 'case-109', name: 'GameMax Centauri ATX Mid Tower Case', price: 50, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front', radiatorSupport: '240mm front', features: ['Tempered Glass', 'Budget Friendly'], color: 'Black' },
    { id: 'case-110', name: 'InWin A1 PLUS Mini-ITX Case (with PSU & RGB)', price: 200, formFactorSupport: ['Mini-ITX'], fanSupport: '2x120mm bottom, 1x120mm rear', radiatorSupport: '120mm rear', features: ['Integrated PSU', 'RGB Base Lighting', 'Wireless Charging Pad'], color: 'White' },
    { id: 'case-111', name: 'Aerocool QS-240 Micro-ATX Case', price: 48, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Compact'], color: 'Black' },
    { id: 'case-112', name: 'Kolink Observatory HF Mesh RGB ATX Mid Tower Case', price: 80, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '4x120mm pre-installed RGB fans', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Fans'], color: 'Black' },
    { id: 'case-113', name: 'Phanteks Eclipse P300 Tempered Glass ATX Mid Tower Case', price: 60, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass'], color: 'Black' },
    { id: 'case-114', name: 'Thermaltake Core G3 ATX Slim Case', price: 70, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm top, 2x120mm bottom', radiatorSupport: '240mm top', features: ['Slim Design', 'Vertical/Horizontal Orientation'], color: 'Black' },
    { id: 'case-115', name: 'NZXT H510 Flow ATX Mid Tower Case', price: 80, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 1x120mm top', radiatorSupport: '280mm front', features: ['Tempered Glass', 'Mesh Front'], color: 'Black' },
    { id: 'case-116', name: 'Lian Li Lancool 205M Mesh Micro-ATX Case', price: 70, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '240mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front'], color: 'White' },
    { id: 'case-117', name: 'Corsair 110R Mid Tower Case', price: 70, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front, 2x120mm top', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass'], color: 'Black' },
    { id: 'case-118', name: 'Fractal Design Define 7 Mini-ITX Case', price: 110, formFactorSupport: ['Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 1x120mm top', radiatorSupport: '240mm front, 120mm rear', features: ['Noise Dampening', 'Compact'], color: 'Black' },
    { id: 'case-119', name: 'Cooler Master MasterBox Lite 5 RGB ATX Mid Tower Case', price: 65, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'RGB Fans'], color: 'Black' },
    { id: 'case-120', name: 'Thermaltake Core W100 Super Tower Case', price: 400, formFactorSupport: ['XL-ATX', 'E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: 'Many flexible options', radiatorSupport: 'Up to 600mm', features: ['Modular Design', 'Liquid Cooling Optimized'], color: 'Black' },
    { id: 'case-121', name: 'NZXT H5 Flow ATX Mid Tower Case (White)', price: 90, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x140mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front'], color: 'White' },
    { id: 'case-122', name: 'Lian Li Lancool 216 RGB ATX Mid Tower Case (White)', price: 105, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x160mm front, 1x140mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'High Airflow', 'RGB Lighting'], color: 'White' },
    { id: 'case-123', name: 'Corsair 4000D Airflow ATX Mid Tower Case (Black)', price: 95, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '360mm front, 280mm top', features: ['Tempered Glass', 'Mesh Front'], color: 'Black' },
    { id: 'case-124', name: 'Fractal Design Pop Air RGB ATX Mid Tower Case (White)', price: 85, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Lighting'], color: 'White' },
    { id: 'case-125', name: 'Phanteks Eclipse G300A DRGB ATX Mid Tower Case', price: 75, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 3x120mm front, 2x120mm top', radiatorSupport: '360mm front, 240mm top', features: ['Tempered Glass', 'High Airflow', 'DRGB Fans'], color: 'Black' },
    { id: 'case-126', name: 'Montech AIR 1000 Premium ATX Mid Tower Case', price: 85, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 1x140mm rear, 2x120mm top', radiatorSupport: '360mm front, 280mm top', features: ['Tempered Glass', 'RGB Lighting', 'High Airflow'], color: 'White' },
    { id: 'case-127', name: 'Cooler Master TD500 Mesh V2 ARGB ATX Mid Tower Case', price: 115, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'Mesh Front', 'ARGB Lighting'], color: 'Black' },
    { id: 'case-128', name: 'HYTE Y70 Touch Full Tower Case', price: 360, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm bottom, 1x120mm rear, 2x140mm top', radiatorSupport: '360mm side, 280mm top', features: ['Panoramic Glass', 'Touchscreen Display', 'Vertical GPU Mount'], color: 'Black' },
    { id: 'case-129', name: 'Deepcool CH510 Mesh ATX Mid Tower Case', price: 75, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 2x140mm top', radiatorSupport: '360mm front, 280mm top', features: ['Tempered Glass', 'Mesh Front'], color: 'Black' },
    { id: 'case-130', name: 'Thermaltake Ceres 500 TG ARGB Mid Tower Case', price: 120, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x140mm front, 1x140mm rear, 3x120mm top', radiatorSupport: '420mm front, 360mm top', features: ['Tempered Glass', 'RGB Lighting'], color: 'White' },
    { id: 'case-131', name: 'Thermaltake S300 TG Micro-ATX Mini Tower Case', price: 70, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front, 1x120mm top', radiatorSupport: '240mm front, 120mm top', features: ['Tempered Glass', 'Compact'], color: 'Black' },
    { id: 'case-132', name: 'Cooler Master MasterBox Q500L ATX Mid Tower Case', price: 65, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '1x120mm rear, 2x120mm front, 2x120mm top', radiatorSupport: '240mm front, 120mm top', features: ['Magnetic Dust Filters'], color: 'Black' },
    { id: 'case-133', name: 'Fractal Design Meshify 2 Mini Micro-ATX Tower Case', price: 95, formFactorSupport: ['Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass', 'Mesh Front'], color: 'Black' },
    { id: 'case-134', name: 'NZXT H500i ATX Mid Tower Case', price: 110, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass', 'Smart Device'], color: 'Black' },
    { id: 'case-135', name: 'Lian Li O11 Air Mini Mid Tower Case (White)', price: 115, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x120mm front, 1x120mm rear, 2x120mm top, 2x120mm bottom', radiatorSupport: '280mm front, 240mm top', features: ['Tempered Glass', 'High Airflow'], color: 'White' },
    { id: 'case-136', name: 'Fractal Design Terra Mini-ITX Case', price: 190, formFactorSupport: ['Mini-ITX'], fanSupport: '1x120mm top', radiatorSupport: 'N/A', features: ['Small Form Factor', 'Aluminum Exterior'], color: 'Silver' },
    { id: 'case-137', name: 'Cooler Master NR200 Mini-ITX Case', price: 80, formFactorSupport: ['Mini-ITX'], fanSupport: '2x120mm top, 2x120mm bottom, 1x92mm rear', radiatorSupport: '240mm side, 240mm top', features: ['Mesh Panels', 'Compact'], color: 'Black' },
    { id: 'case-138', name: 'Lian Li Q58 Mini-ITX Case', price: 130, formFactorSupport: ['Mini-ITX'], fanSupport: '2x120mm top, 2x120mm bottom', radiatorSupport: '280mm top', features: ['Modular Side Panels', 'Tempered Glass/Mesh'], color: 'Black' },
    { id: 'case-139', name: 'NZXT H1 Mini-ITX Case (Black, with PSU & AIO)', price: 280, formFactorSupport: ['Mini-ITX'], fanSupport: '1x140mm AIO', radiatorSupport: '140mm AIO', features: ['Integrated PSU & AIO', 'Vertical GPU Mount'], color: 'Matte Black' },
    { id: 'case-140', name: 'Streacom F12C Alpha Opt. Mini-ITX Case', price: 250, formFactorSupport: ['Mini-ITX'], fanSupport: 'Flexible mounting', radiatorSupport: '280mm', features: ['Fanless Cooling', 'Aluminum Design'], color: 'Black' },
    { id: 'case-141', name: 'Lian Li O11 Dynamic XL (White) Full Tower Case', price: 240, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm top, 3x120mm bottom, 3x120mm side, 1x120mm rear', radiatorSupport: '360mm top, 360mm bottom, 360mm side', features: ['Dual Chamber', 'Tempered Glass', 'RGB Lighting'], color: 'White' },
    { id: 'case-142', name: 'Corsair 7000D Airflow (White) Full Tower Case', price: 265, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 3x120mm top, 1x140mm rear', radiatorSupport: '420mm front, 420mm top', features: ['High Airflow', 'Tempered Glass'], color: 'White' },
    { id: 'case-143', name: 'Cooler Master HAF 700 Full Tower Case', price: 400, formFactorSupport: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x200mm front, 2x120mm rear, 3x120mm top, 3x120mm bottom', radiatorSupport: '360mm front, 360mm top, 360mm bottom', features: ['Extreme Airflow', 'Modular Design'], color: 'Black' },
    { id: 'case-144', name: 'Phanteks Enthoo Pro 2 (White) Full Tower Case', price: 185, formFactorSupport: ['SSI-EEB', 'E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 3x140mm top, 1x140mm rear', radiatorSupport: '420mm front, 420mm top', features: ['High Airflow', 'Server Ready'], color: 'White' },
    { id: 'case-145', name: 'Thermaltake Core P6 TG Full Tower Case', price: 190, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm side, 3x120mm top', radiatorSupport: '420mm side', features: ['Convertible Open/Closed Frame', 'Tempered Glass'], color: 'Black' },
    { id: 'case-146', name: 'NZXT H7 Elite (Black) ATX Mid Tower Case', price: 190, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'RGB Lighting', 'NZXT CAM Smart Device'], color: 'Black' },
    { id: 'case-147', name: 'Lian Li O11 Dynamic EVO (Black) ATX Mid Tower Case', price: 150, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm top, 3x120mm bottom, 3x120mm side', radiatorSupport: '360mm top, 360mm bottom, 360mm side', features: ['Dual Chamber', 'Reversible Layout', 'Tempered Glass'], color: 'Black' },
    { id: 'case-148', name: 'Corsair iCUE 5000D RGB Airflow (White) ATX Mid Tower Case', price: 175, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x120mm front, 1x120mm rear, 3x120mm top', radiatorSupport: '360mm front, 360mm top', features: ['Tempered Glass', 'Mesh Front', 'RGB Lighting', 'iCUE Controller'], color: 'White' },
    { id: 'case-149', name: 'Fractal Design Torrent Compact ATX Mid Tower Case', price: 170, formFactorSupport: ['ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '2x180mm front, 1x140mm bottom, 1x140mm rear', radiatorSupport: '360mm front, 280mm bottom', features: ['High Airflow', 'Compact Size'], color: 'Black' },
    { id: 'case-150', name: 'Phanteks Enthoo 719 Full Tower Case', price: 210, formFactorSupport: ['SSI-EEB', 'E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], fanSupport: '3x140mm front, 3x140mm top, 1x140mm rear', radiatorSupport: '480mm front, 480mm top', features: ['Dual System Support', 'Tempered Glass'], color: 'Black' }
    
    ],

    
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

// === Captcha + confirm-field validation for forms that request email/phone ===
document.addEventListener('DOMContentLoaded', () => {
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateCaptchaForForm(form) {
        const a = randInt(2, 9);
        const b = randInt(2, 9);
        const answer = a + b;
        form.dataset.captchaAnswer = String(answer);
        const q = form.querySelector('.captcha-question');
        if (q) q.textContent = `What is ${a} + ${b}?`;
        const input = form.querySelector('input[name="captcha"], #captcha-input');
        if (input) input.value = '';
        // trigger input event so other scripts (e.g., submit validation) re-evaluate state
        if (input) {
            try { input.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) { /* ignore */ }
        }
    }

    function showFormError(form, msg) {
        // Try to show in a nearby feedback element, fall back to alert
        const fb = form.querySelector('#captcha-feedback, #contact-email-match, #email-match-status');
        if (fb) {
            fb.textContent = msg;
            fb.classList.remove('sr-only');
            fb.style.color = 'orange';
            setTimeout(() => { fb.classList.add('sr-only'); fb.textContent = ''; }, 4000);
        } else {
            alert(msg);
        }
    }

    function attachValidation(form) {
        if (!form) return;

        form.addEventListener('submit', function (e) {
            // run validations early in capture phase
            const confirms = form.querySelectorAll('input[id$="-confirm"]');
            for (const c of confirms) {
                const baseId = c.id.replace(/-confirm$/, '');
                const original = form.querySelector(`#${baseId}`) || form.querySelector(`input[name=\"${baseId}\"]`);
                if (original) {
                    const a = String(original.value || '').trim();
                    const b = String(c.value || '').trim();
                    if (a === '' || b === '') {
                        e.preventDefault(); e.stopPropagation();
                        showFormError(form, 'Please complete both contact fields.');
                        c.focus();
                        return;
                    }
                    if (a !== b) {
                        e.preventDefault(); e.stopPropagation();
                        showFormError(form, 'Contact entries do not match. Please re-check.');
                        c.focus();
                        return;
                    }
                }
            }

            // Captcha validation removed - no longer required
            // if all checks pass, allow other submit handlers to proceed
        }, { capture: true });
    }

    // Attach to known forms across the site
    const formsToProtect = document.querySelectorAll('#contact-form, .contact-form, #merch-contact-form');
    formsToProtect.forEach(f => attachValidation(f));

    // Regenerate captcha for visibility when clicking the question (optional usability)
    document.addEventListener('click', (ev) => {
        const q = ev.target.closest('.captcha-question');
        if (q) {
            const form = q.closest('form');
            if (form) generateCaptchaForForm(form);
        }
    });
});
