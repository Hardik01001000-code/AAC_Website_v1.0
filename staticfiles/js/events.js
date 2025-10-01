document.addEventListener("DOMContentLoaded", () => {
    const prevBtn = document.getElementById("prev-month");
    const nextBtn = document.getElementById("next-month");
    const controls = document.getElementById("calendar-controls");
    const calendarTable = document.querySelector("table tbody");
    const eventsList = document.querySelector(".events-list");
    const monthTitle = document.querySelector("h3");
    const majorTemplate = document.getElementById("major-events-template");

    const currentYear = parseInt(controls.dataset.currentYear, 10);
    const currentMonth = parseInt(controls.dataset.currentMonth, 10);

    let activeDay = null;

    function buildCalendarCells(month_days, events_by_day, year, month) {
        calendarTable.innerHTML = "";
        month_days.forEach(week => {
            const tr = document.createElement("tr");
            week.forEach(dayNum => {
                const td = document.createElement("td");
                if (dayNum === 0) {
                    td.classList.add("bg-light");
                } else {
                    td.dataset.day = dayNum;
                    td.classList.add("calendar-day");
                    td.innerHTML = `<div class="fw-bold">${dayNum}</div>`;
                    if (events_by_day && events_by_day[dayNum]) {
                        td.classList.add("bg-primary", "text-white");
                    }
                    if (String(dayNum) === String(activeDay)) {
                        td.classList.add("active");
                    }
                }
                tr.appendChild(td);
            });
            calendarTable.appendChild(tr);
        });

        document.querySelectorAll(".calendar-day").forEach(cell => {
            cell.onclick = () => {
                const clicked = cell.dataset.day;
                if (String(activeDay) === String(clicked)) {
                    activeDay = null; // reset to month view
                    loadMonth(year, month);
                } else {
                    activeDay = clicked;
                    loadMonth(year, month, clicked);
                }
            };
        });
    }

    function loadMonth(year, month, day = null) {
        let url = `/events?year=${year}&month=${month}`;
        if (day) url += `&day=${day}`;

        fetch(url, { headers: { "X-Requested-With": "XMLHttpRequest" } })
        .then(res => res.json())
        .then(data => {
            monthTitle.textContent = `Events in ${data.month_name} ${data.year}`;
            document.getElementById("calendar-month").textContent = `${data.month_name} ${data.year}`;
            buildCalendarCells(data.month_days, data.events_by_day, data.year, data.month);

            // 🔑 Change here: only show events when a date is selected
            const mainEvents = day ? data.selected_events : [];
            renderEvents(mainEvents);

            prevBtn.dataset.year = data.prev_year;
            prevBtn.dataset.month = data.prev_month;
            nextBtn.dataset.year = data.next_year;
            nextBtn.dataset.month = data.next_month;
        });
    }

    function appendCard(container, e) {
    	// helper to shift +5:30
    	function toIST(dateStr, timeStr) {
		if (!dateStr || !timeStr) return "";
    		// Treat incoming as UTC explicitly
    		const d = new Date(`${dateStr}T${timeStr}Z`);  
    		if (isNaN(d)) return `${dateStr} ${timeStr}`; 
    		// Add +5:30
    		d.setMinutes(d.getMinutes() + 330);
   		return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}


    	const startTime = toIST(e.date_str, e.time_str);
	const endTime = e.end_time_str ? toIST(e.date_str, e.end_time_str) : "";


    	const card = document.createElement("div");
    	card.className = "card mb-3 shadow-sm";
    	card.innerHTML = `
        	<div class="row g-0 h-100">
            		<div class="col-md-8 d-flex flex-column justify-content-between p-3">
                		<div>
                    			<p class="h5 fw-bold mb-1">${e.title}</p>
                    			<p class="text-muted small mb-3">
                        			${e.date_str}
                    			</p>
                		</div>
                		<a href="${e.detail_url || ('/events/' + e.id)}" 
                		class="btn btn-primary btn-sm mt-auto">View Details</a>
            		</div>
            		<div class="col-md-4 d-flex">
                		<div style="
                    			background-image: url('${e.image_url}');
                    			background-size: cover; 
                    			background-position: center; 
                    			width: 100%;
                    			border-radius: 0 6px 6px 0;">
                		</div>
            		</div>
        	</div>
    	`;
    	container.appendChild(card);
	}


    function renderEvents(mainEvents) {
        eventsList.innerHTML = "";
        mainEvents = mainEvents || [];

        const mainIds = new Set(mainEvents.map(ev => String(ev.id)));

        if (!mainEvents.length && activeDay) {
            // case: user clicked a date but no events
            const p = document.createElement("p");
            p.className = "text-muted";
            p.innerHTML = `There are no events planned on that date, meanwhile check out our Major Events.`;
            eventsList.appendChild(p);
        } else {
            // render day events (if any)
            mainEvents.forEach(e => appendCard(eventsList, e));
        }

        // Always append static major events
        if (majorTemplate) {
            const clone = majorTemplate.cloneNode(true);
            clone.style.display = "block";
            clone.id = "";

            clone.querySelectorAll(".major-card").forEach(card => {
                const did = card.dataset.eventId;
                if (did && mainIds.has(String(did))) {
                    card.remove();
                }
            });

            if (clone.querySelectorAll(".major-card").length) {
                Array.from(clone.children).forEach(child => eventsList.appendChild(child));
            }
        }
    }

    prevBtn.onclick = () => loadMonth(prevBtn.dataset.year, prevBtn.dataset.month);
    nextBtn.onclick = () => loadMonth(nextBtn.dataset.year, nextBtn.dataset.month);

    loadMonth(currentYear, currentMonth);
});


document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("calendar-toggle");
    const popup = document.getElementById("calendar-popup");

    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        popup.style.display = (popup.style.display === "block") ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
        if (popup.style.display === "block" &&
            !popup.contains(e.target) &&
            e.target !== toggleBtn) {
            popup.style.display = "none";
        }
    });
});
