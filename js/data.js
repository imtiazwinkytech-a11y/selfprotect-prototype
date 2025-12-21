
  
      // --- DATA STATE ---
        const state = {
            points: 12450,
            location: 'Gulshan 2, Dhaka',
            history: JSON.parse(localStorage.getItem('sp_history')) || [
                { id: 'SOS-9912', type: 'Emergency SOS', time: '2 days ago', status: 'Resolved', icon: 'fa-bullhorn', color: 'text-red-500' },
                { id: 'WLK-1122', type: 'SafeWalk Active', time: 'Last week', status: 'Completed', icon: 'fa-person-walking', color: 'text-blue-500' },
                { id: 'GRD-5521', type: 'Guardian Enable', time: '3 weeks ago', status: 'Inactive', icon: 'fa-robot', color: 'text-accent' }
            ],
            notifs: [],
            reports: [
                { author: 'User881', body: 'Spotted illegal street racing near Airport Road. Be careful.', votes: 24, time: '12m ago' },
                { author: 'DhakaSafety', body: 'New security cameras installed in Nikunja 2 zone.', votes: 112, time: '1h ago' },
                { author: 'MedicRoot', body: 'Emergency blood required at United Hospital, Gulshan.', votes: 45, time: '3h ago' }
            ]
        };

        // --- NAVIGATION SYSTEM ---
        
        function switchView(viewId) {
            // UI Update
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            const targetView = document.getElementById(`view-${viewId}`);
            if(targetView) targetView.classList.add('active');
            
            // Nav Update
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('text-primary');
                btn.classList.add('text-zinc-300');
            });

            // Find matching nav button
            const navButtons = document.querySelectorAll('.nav-btn');
            const map = { home: 0, explore: 1, history: 2, profile: 3 };
            if(navButtons[map[viewId]]) {
                navButtons[map[viewId]].classList.add('text-primary');
                navButtons[map[viewId]].classList.remove('text-zinc-300');
            }

            // Scroll to top
            document.querySelector('main').scrollTop = 0;
            
            if(viewId === 'history') renderHistory();
            if(viewId === 'home') renderHomeActivity();
        }

        // --- SOS LOGIC ---
        let sosTimer;
        let sosProgress = 0;
        const SOS_DURATION = 3000;

        function openSOSModal() {
            document.getElementById('sosOverlay').classList.remove('hidden');
        }

        function closeSOSModal() {
            document.getElementById('sosOverlay').classList.add('hidden');
            cancelSOSHold();
        }

        function startSOSHold() {
            const ring = document.getElementById('sosProgressRing');
            const btn = document.getElementById('sosActionBtn');
            btn.classList.add('sos-btn-holding');
            
            sosProgress = 0;
            sosTimer = setInterval(() => {
                sosProgress += 100;
                const offset = 283 - (283 * (sosProgress / SOS_DURATION));
                ring.style.strokeDashoffset = offset;
                
                if (sosProgress >= SOS_DURATION) {
                    clearInterval(sosTimer);
                    executeSOS();
                }
            }, 100);
        }

        function cancelSOSHold() {
            clearInterval(sosTimer);
            const ring = document.getElementById('sosProgressRing');
            const btn = document.getElementById('sosActionBtn');
            btn.classList.remove('sos-btn-holding');
            ring.style.strokeDashoffset = 283;
        }

        function executeSOS() {
            cancelSOSHold();
            closeSOSModal();
            
            const newCase = {
                id: 'SOS-' + Math.floor(Math.random() * 9000 + 1000),
                type: 'CRITICAL SOS',
                time: 'Just now',
                status: 'Dispatched',
                icon: 'fa-bullhorn',
                color: 'text-red-600'
            };
            
            state.history.unshift(newCase);
            saveData();
            showToast("🚨 SOS TRIGGERED! Help is coming.");
            addNotif("EMERGENCY: SOS broadcasted to nearby responders.");
            renderHistory();
        }

        // --- SERVICES ---
        function triggerService(name) {
            showToast(`Activating ${name}...`);
            setTimeout(() => {
                const newLog = {
                    id: 'LOG-' + Math.floor(Math.random() * 9000),
                    type: name + ' Active',
                    time: 'Starting now',
                    status: 'Active',
                    icon: name === 'Guardian' ? 'fa-robot' : 'fa-shield',
                    color: 'text-accent'
                };
                state.history.unshift(newLog);
                saveData();
                showToast(`${name} is now monitoring.`);
                renderHistory();
            }, 1000);
        }

        // --- UI RENDERING ---
        function renderHomeActivity() {
            const container = document.getElementById('activityFeed');
            container.innerHTML = state.reports.map(r => `
                <div class="p-4 bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-100 dark:border-zinc-800 tap-active">
                    <div class="flex justify-between items-start mb-2">
                        <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">${r.author}</p>
                        <span class="text-[9px] text-zinc-400">${r.time}</span>
                    </div>
                    <p class="text-sm font-medium dark:text-zinc-300 mb-3 leading-snug">${r.body}</p>
                    <div class="flex items-center gap-4">
                        <button class="flex items-center gap-1.5 text-xs font-black text-primary">
                            <i class="fas fa-caret-up"></i> ${r.votes}
                        </button>
                        <button class="text-xs font-black text-zinc-300 uppercase">Reply</button>
                    </div>
                </div>
            `).join('');
        }

        // --- Community handlers (UI matches mobile design) ---
        function openCommunity(){
            document.getElementById('communityModal').classList.remove('hidden');
            renderCommunityList();
        }
        function closeCommunity(){ document.getElementById('communityModal').classList.add('hidden'); }
        function openReportModal(){ document.getElementById('reportTitle').value=''; document.getElementById('reportBodyInput').value=''; document.getElementById('reportModal').classList.remove('hidden'); }
        function closeReportModal(){ document.getElementById('reportModal').classList.add('hidden'); }

        function submitReport(){
            const title = document.getElementById('reportTitle').value.trim();
            const body = document.getElementById('reportBodyInput').value.trim();
            if(!title && !body) return showToast('Please enter title or details');
            const newR = { author: 'You', title: title || '', body: body || '', votes: 0, time: 'Just now', location: state.location };
            state.reports.unshift(newR);
            renderHomeActivity();
            renderCommunityPreview();
            closeReportModal();
            addNotif('New community report submitted');
            showToast('Report submitted');
        }

        function renderCommunityPreview(){
            const preview = document.getElementById('communityPreview');
            const reports = state.reports.slice(0,2);
            if(!reports.length) return preview.innerHTML = '<p class="text-sm text-zinc-400">No recent reports</p>';
            preview.innerHTML = reports.map(r=> `
                <div class="p-4 bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-100 dark:border-zinc-800 tap-active">
                    <div class="flex justify-between items-start mb-2">
                        <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">${escapeHtml(r.author||'User')}</p>
                        <span class="text-[9px] text-zinc-400">${escapeHtml(r.time||'')}</span>
                    </div>
                    <p class="text-sm font-medium dark:text-zinc-300 mb-3 leading-snug">${escapeHtml(r.body||r.title||'')}</p>
                    <div class="flex items-center gap-4">
                        <button class="flex items-center gap-1.5 text-xs font-black text-primary" onclick="upvoteReportByIndex(${state.reports.indexOf(r)})">
                            <i class="fas fa-caret-up"></i> ${r.votes||0}
                        </button>
                        <button class="text-xs font-black text-zinc-300 uppercase" onclick="openReportModal()">Reply</button>
                    </div>
                </div>
            `).join('');
        }

        function renderCommunityList(){
            const list = document.getElementById('communityList');
            if(!state.reports.length) return list.innerHTML = '<p class="text-sm text-zinc-400">No reports yet</p>';
            list.innerHTML = state.reports.map((r, idx)=>{
                const flagged = r.flagged ? ' • Flagged' : '';
                const when = escapeHtml(r.time||'');
                return `
                    <div class="p-3 border rounded-lg">
                        <div class="flex justify-between items-center mb-2"><div class="font-bold">${escapeHtml(r.title||r.body||'Report')}</div><div class="text-xs text-zinc-500">${when}${flagged}</div></div>
                        <div class="text-xs text-zinc-600 mb-2">${escapeHtml(r.body||'')}</div>
                        <div class="flex gap-2 items-center">
                            <button onclick="upvoteReportByIndex(${idx})" class="px-3 py-1 bg-primary text-white rounded">▲ ${r.votes||0}</button>
                            <button onclick="flagReportByIndex(${idx})" class="px-3 py-1 bg-white border rounded">Flag</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function upvoteReportByIndex(idx){ if(state.reports[idx]){ state.reports[idx].votes = (state.reports[idx].votes||0)+1; renderCommunityList(); renderCommunityPreview(); showToast('Report upvoted'); } }
        function flagReportByIndex(idx){ if(!state.reports[idx]) return; if(!confirm('Flag this report as inappropriate?')) return; state.reports[idx].flagged = true; renderCommunityList(); renderCommunityPreview(); addNotif('Report flagged'); showToast('Report flagged'); }


        function renderHistory() {
            const container = document.getElementById('historyList');
            container.innerHTML = state.history.map(h => `
                <div class="p-5 bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
                    <div class="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center ${h.color}">
                        <i class="fas ${h.icon} text-xl"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between">
                            <h4 class="text-sm font-black">${h.type}</h4>
                            <span class="text-[9px] font-black uppercase text-zinc-400">${h.id}</span>
                        </div>
                        <p class="text-[10px] text-zinc-500 font-bold">${h.time}</p>
                        <p class="text-[10px] font-black uppercase tracking-widest mt-1 ${h.status === 'Dispatched' ? 'text-red-500 animate-pulse' : 'text-emerald-500'}">${h.status}</p>
                    </div>
                </div>
            `).join('');
        }

        // --- UTILS ---
        function showToast(msg) {
            const root = document.getElementById('toastRoot');
            const toast = document.createElement('div');
            toast.className = "bg-zinc-900/95 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-[11px] font-black shadow-2xl border border-white/10 text-center uppercase tracking-wider";
            toast.innerText = msg;
            root.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 500);
            }, 3000);
        }

        function toggleNotifs() {
            document.getElementById('notifPanel').classList.toggle('hidden');
            if(!document.getElementById('notifPanel').classList.contains('hidden')) {
                document.getElementById('notifBadge').classList.add('hidden');
            }
        }

function toggleSettings() {
            alert('Settings panel is under development.');
            document.getElementById('settingsPanel').classList.toggle('hidden');
        }
        function toggleTracking() {
            alert('Location tracking settings are under development.');
            document.getElementById('trackingPanel').classList.toggle('hidden');
        }

        function addNotif(msg) {
            state.notifs.unshift({ msg, time: 'Just now' });
            document.getElementById('notifBadge').classList.remove('hidden');
            renderNotifs();
        }

        function renderNotifs() {
            const list = document.getElementById('notifList');
            if(state.notifs.length === 0) {
                list.innerHTML = `<p class="text-xs text-zinc-400 text-center py-6 uppercase font-bold tracking-widest">No Alerts</p>`;
                return;
            }
            list.innerHTML = state.notifs.map(n => `
                <div class="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                    <p class="text-xs font-bold leading-tight">${n.msg}</p>
                    <p class="text-[9px] text-zinc-400 font-black uppercase mt-2 tracking-tighter">${n.time}</p>
                </div>
            `).join('');
        }

        function clearNotifs() {
            state.notifs = [];
            renderNotifs();
        }

        function exportCSV() {
            let csv = "ID,Type,Status,Time\n";
            state.history.forEach(h => csv += `${h.id},${h.type},${h.status},${h.time}\n`);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `SelfProtect_Log_${new Date().getTime()}.csv`;
            a.click();
            showToast("Log exported to CSV");
        }

        function saveData() {
            localStorage.setItem('sp_history', JSON.stringify(state.history));
        }

        // Initial Load
        window.onload = () => {
            renderHomeActivity();
            renderNotifs();
            // Start with a safe greeting
            setTimeout(() => addNotif("Security Check: Your home zone Gulshan-2 is currently rated 'Green'."), 1500);
            // render community preview
            renderCommunityPreview();
        };

        function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
   