document.addEventListener("DOMContentLoaded", function () {
    const mainCircle = document.getElementById("mainCircle");
    const menuContainer = document.querySelector(".menu-items");
    const menuItems = document.querySelectorAll(".menu-item");
    let isOpen = false;

    mainCircle.addEventListener("click", function () {
        if (!isOpen) {
            showMenu();
        } else {
            hideMenu();
        }
        isOpen = !isOpen;
    });

    function showMenu() {
        menuContainer.classList.add("menu-open"); // Make menu visible
        const angleStep = (2 * Math.PI) / menuItems.length;
        const radius = 120;

        menuItems.forEach((item, index) => {
            const angle = angleStep * index;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            item.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    function hideMenu() {
        menuContainer.classList.remove("menu-open"); // Hide menu
        menuItems.forEach((item) => {
            item.style.transform = "translate(0, 0)";
        });
    }
});
