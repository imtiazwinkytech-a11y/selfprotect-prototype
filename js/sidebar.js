 /**
         * Toggles the 'active' class on the sidebar and overlay.
         * This function is triggered by the onclick attribute on #side.
         */
        function sideBar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            const icon = document.querySelector('#side i');

            // Toggle visibility classes
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');

            // Optional: Toggle icon between bars and 'X'
            if (sidebar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }

        // Close sidebar if 'Esc' key is pressed
        document.addEventListener('keydown', (e) => {
            const sidebar = document.getElementById('sidebar');
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                sideBar();
            }
        });