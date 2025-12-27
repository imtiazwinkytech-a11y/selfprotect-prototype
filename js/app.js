
        // Start by defining the initial state
        let navStack = [{ id: 'homeView', title: 'SelfProtect' }];

        // 1. Listen for the phone's physical back button
        window.onpopstate = function(event) {
            // If the user presses back, we pop our internal stack and show the previous view
            if (navStack.length > 1) {
                const lastView = navStack.pop();
                document.getElementById(lastView.id).classList.remove('active');
                
                const currentView = navStack[navStack.length - 1];
                document.getElementById(currentView.id).classList.add('active');
                updateUI();
            }
        };

        function navigateTo(viewId, title) {
            // Hide current
            const currentView = navStack[navStack.length - 1];
            document.getElementById(currentView.id).classList.remove('active');

            // Add to internal stack
            navStack.push({ id: viewId, title: title });

            // 2. Add to browser/phone history
            // This is what makes the phone's back button work!
            window.history.pushState({ viewId: viewId }, title);

            // Show new
            document.getElementById(viewId).classList.add('active');
            updateUI();
        }

        function updateUI() {
            const currentView = navStack[navStack.length - 1];
            const backBtn = document.getElementById('customBackBtn');
            const titleEl = document.getElementById('pageTitle');

            titleEl.innerText = currentView.title;

            // Update UI button state
            if (navStack.length > 1) {
                backBtn.disabled = false;
                backBtn.classList.remove('opacity-30', 'cursor-not-allowed');
            } else {
                backBtn.disabled = true;
                backBtn.classList.add('opacity-30', 'cursor-not-allowed');
            }
        }
