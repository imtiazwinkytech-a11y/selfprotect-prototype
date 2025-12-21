function toggleSidebar() {
            const sidebar = document.getElementById('sideBar');
            const overlay = document.getElementById('spOverlay');
            
            if (sidebar.classList.contains('-translate-x-full')) {
                // Open
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
                setTimeout(() => overlay.classList.add('opacity-100'), 10);
            } else {
                // Close
                sidebar.classList.add('-translate-x-full');
                overlay.classList.remove('opacity-100');
                setTimeout(() => overlay.classList.add('hidden'), 300);
            }
        }

        // Handle Escape Key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const sidebar = document.getElementById('spSidebar');
                if (!sidebar.classList.contains('-translate-x-full')) toggleSidebar();
            }
        });