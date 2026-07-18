document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. BASE SLIDE NAVIGATION ENGINE
    // ----------------------------------------------------
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const slideNumDisplay = document.getElementById('slide-number-display');
    const progressDotsContainer = document.getElementById('progress-dots-container');

    let currentSlideIndex = 0;

    // Generate dots
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('progress-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        progressDotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.progress-dot');

    function updateControls() {
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentSlideIndex);
        });
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlideIndex);
        });

        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === slides.length - 1;

        slideNumDisplay.textContent = `Slide ${currentSlideIndex + 1} of ${slides.length}`;
    }

    function goToSlide(index) {
        if (index >= 0 && index < slides.length) {
            currentSlideIndex = index;
            updateControls();
        }
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
            if (currentSlideIndex < slides.length - 1) {
                goToSlide(currentSlideIndex + 1);
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentSlideIndex > 0) {
                goToSlide(currentSlideIndex - 1);
            }
        }
    });

    // Initialize nav states
    updateControls();

    // ----------------------------------------------------
    // 2. SCOPED TAB SELECTION SYSTEM
    // ----------------------------------------------------
    document.querySelectorAll('.tabs-container').forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-btn');
        const tabContents = container.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTabId = btn.getAttribute('data-tab');

                tabButtons.forEach(b => b.classList.toggle('active', b === btn));
                tabContents.forEach(content => {
                    content.classList.toggle('active', content.id === targetTabId);
                });
            });
        });
    });

    // ----------------------------------------------------
    // 3. HETEROGENEOUS ALIGNMENT TABLE REVEALER
    // ----------------------------------------------------
    const alignTable = document.getElementById('alignment-table-interact');
    const alignDetailBox = document.getElementById('align-detail-box');

    const alignmentDetails = {
        tech: "<strong>Technical Mechanisms:</strong> Standard protocols like TCP/IP, JSON schemas, gRPC, and consensus rules (Raft/Paxos) guarantee that technical node instances read message bytes in the exact same structural way, establishing base semantic agreement.",
        human: "<strong>Human Mechanisms:</strong> User experience design, authorization tokens, visual dashboards, and clear roles (e.g. administrator vs client) ensure human entities understand their permissions and responsibilities without breaking constraints.",
        org: "<strong>Organizational Mechanisms:</strong> Formal service level agreements (SLAs), compliance rules, budgets, and corporate structures align departments, ensuring overall team workflows map to systemic software designs.",
        hybrid: "<strong>Hybrid Mechanisms:</strong> Devops teams rely on automated pipelines, continuous delivery logs, feedback dashboards, and system metrics to bridge human decision making with software speed, preventing operational gaps."
    };

    if (alignTable && alignDetailBox) {
        alignTable.querySelectorAll('tbody tr').forEach(row => {
            row.addEventListener('click', () => {
                const key = row.getAttribute('data-align');
                alignDetailBox.innerHTML = alignmentDetails[key] || "";
                
                // Highlight row
                alignTable.querySelectorAll('tbody tr').forEach(r => {
                    r.style.background = r === row ? 'rgba(168, 85, 247, 0.1)' : '';
                });
            });
        });
    }

    // ----------------------------------------------------
    // 4. DEPENDENCY FRAGILITY VS RESILIENCE SIMULATOR
    // ----------------------------------------------------
    const netContainer = document.getElementById('network-sim-container');
    const btnFragile = document.getElementById('sim-btn-fragile');
    const btnResilient = document.getElementById('sim-btn-resilient');
    const simTitle = document.getElementById('sim-detail-title');
    const simDesc = document.getElementById('sim-detail-desc');

    let simMode = 'fragile'; // or 'resilient'
    let isFailed = false;

    function renderSimulator() {
        if (!netContainer) return;
        netContainer.innerHTML = '';
        isFailed = false;
        
        if (simMode === 'fragile') {
            simTitle.textContent = "Mode: Tightly Coupled (Fragile)";
            simTitle.style.color = "var(--accent-purple)";
            simDesc.textContent = "Click on the central API Node in the diagram to simulate a crash.";

            // Nodes
            const nodes = [
                { id: 'central', label: 'Central API', x: 50, y: 50, isCore: true },
                { id: 'clientA', label: 'Client A', x: 15, y: 20 },
                { id: 'clientB', label: 'Client B', x: 15, y: 80 },
                { id: 'clientC', label: 'Client C', x: 85, y: 50 }
            ];

            // Render lines
            nodes.forEach(n => {
                if (n.isCore) return;
                createLine('central', n.id, 50, 50, n.x, n.y);
            });

            // Render nodes
            nodes.forEach(n => {
                createNode(n);
            });

        } else {
            simTitle.textContent = "Mode: Redundant paths (Resilient)";
            simTitle.style.color = "var(--accent-green)";
            simDesc.textContent = "Click on API 1 to crash it, and watch traffic automatically reroute to API 2.";

            // Nodes
            const nodes = [
                { id: 'api1', label: 'API 1', x: 25, y: 25, isCore: true },
                { id: 'api2', label: 'API 2', x: 25, y: 75 },
                { id: 'client', label: 'Client', x: 75, y: 50 }
            ];

            // Render lines (active flow from api1 to client, backup flow from api2)
            createLine('api1', 'client', 25, 25, 75, 50, true); // Active route
            createLine('api2', 'client', 25, 75, 75, 50, false); // Idle route

            // Render nodes
            nodes.forEach(n => {
                createNode(n);
            });
        }
    }

    function createNode(n) {
        const nodeEl = document.createElement('div');
        nodeEl.classList.add('net-node');
        nodeEl.id = `node-${n.id}`;
        nodeEl.textContent = n.label;
        nodeEl.style.left = `${n.x}%`;
        nodeEl.style.top = `${n.y}%`;
        nodeEl.style.transform = 'translate(-50%, -50%)';

        if (n.isCore) {
            nodeEl.style.cursor = 'pointer';
            nodeEl.addEventListener('click', () => handleCoreNodeClick(n.id));
        }

        netContainer.appendChild(nodeEl);
    }

    function createLine(fromId, toId, x1, y1, x2, y2, isActive = false) {
        const lineEl = document.createElement('div');
        lineEl.classList.add('net-line');
        lineEl.id = `line-${fromId}-${toId}`;
        
        // Calculate angle and distance between percentages
        const w = netContainer.clientWidth;
        const h = netContainer.clientHeight;
        const px1 = (x1 / 100) * w;
        const py1 = (y1 / 100) * h;
        const px2 = (x2 / 100) * w;
        const py2 = (y2 / 100) * h;

        const dist = Math.sqrt((px2 - px1)**2 + (py2 - py1)**2);
        const angle = Math.atan2(py2 - py1, px2 - px1) * 180 / Math.PI;

        lineEl.style.width = `${dist}px`;
        lineEl.style.left = `${x1}%`;
        lineEl.style.top = `${y1}%`;
        lineEl.style.transform = `rotate(${angle}deg)`;

        if (isActive) {
            lineEl.classList.add('active-route');
        }

        netContainer.appendChild(lineEl);
    }

    function handleCoreNodeClick(id) {
        if (isFailed) return;
        isFailed = true;

        if (simMode === 'fragile') {
            // Fragile failure: Central API fails, everything fails
            document.getElementById('node-central').classList.add('core-failed');
            document.getElementById('node-central').textContent = 'OFFLINE';

            // Cascade failure
            setTimeout(() => {
                ['clientA', 'clientB', 'clientC'].forEach(c => {
                    document.getElementById(`node-${c}`).classList.add('dep-failed');
                    document.getElementById(`node-${c}`).textContent = 'FAILED';
                });
                
                document.querySelectorAll('.net-line').forEach(line => {
                    line.classList.add('failed');
                    line.classList.remove('active-route');
                });

                simTitle.textContent = "CRITICAL OUTAGE!";
                simTitle.style.color = "var(--accent-red)";
                simDesc.textContent = "Central API collapsed. Because the dependency was tightly coupled, all downstream clients (A, B, C) crashed. (100% Cascade Failure).";
            }, 300);

        } else {
            // Resilient failure: API 1 fails, traffic reroutes to API 2
            document.getElementById('node-api1').classList.add('core-failed');
            document.getElementById('node-api1').textContent = 'OFFLINE';
            
            // Break line 1, activate line 2
            const line1 = document.getElementById('line-api1-client');
            const line2 = document.getElementById('line-api2-client');
            const nodeApi2 = document.getElementById('node-api2');

            setTimeout(() => {
                if (line1) line1.classList.add('failed');
                if (line1) line1.classList.remove('active-route');
                
                if (line2) line2.classList.add('active-route');
                if (nodeApi2) nodeApi2.classList.add('active-route');

                simTitle.textContent = "SELF-HEALED (RESILIENT)";
                simTitle.style.color = "var(--accent-green)";
                simDesc.textContent = "API 1 crashed. The system detected the outage and dynamically rerouted messages to the redundant API 2 instance. No clients crashed!";
            }, 300);
        }
    }

    // Toggle simulator modes
    if (btnFragile && btnResilient) {
        btnFragile.addEventListener('click', () => {
            btnFragile.classList.add('active');
            btnResilient.classList.remove('active');
            simMode = 'fragile';
            renderSimulator();
        });

        btnResilient.addEventListener('click', () => {
            btnResilient.classList.add('active');
            btnFragile.classList.remove('active');
            simMode = 'resilient';
            renderSimulator();
        });
    }

    // Initial render of simulator
    renderSimulator();
    
    // Rerender on window resize to keep lines correctly positioned
    window.addEventListener('resize', renderSimulator);
});
