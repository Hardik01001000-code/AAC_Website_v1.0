document.addEventListener("DOMContentLoaded", function () {
    const blogDataEl = document.getElementById("blog-data");
    let blogData = [];

    if (blogDataEl) {
        try {
            blogData = JSON.parse(blogDataEl.textContent);
            // console.log("Blog data from Django:", blogData);
        } catch (e) {
            console.error("Failed to parse blog json:", e);
        }
    }

    const input = document.getElementById("search");
    const categorySelect = document.getElementById("category");
    const box = document.getElementById("blogs-container");
    const paginationEl = document.getElementById("pagination");

    // Pagination settings
    const itemsPerPage = 5;
    let currentPage = 1;
    let currentFiltered = blogData.slice();

    function filterBlogs() {
        const query = input.value.trim().toLowerCase();
        const selectedCategory = categorySelect.value;

        currentFiltered = blogData.filter(info => {
            const matchesSearch = !query || (info.title && info.title.toLowerCase().includes(query));
            const matchesCategory = selectedCategory === "" || info.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        currentPage = 1; // reset to first page on new filter
        renderPage();
    }

    input.addEventListener('input', debounce(filterBlogs, 200));
    categorySelect.addEventListener('change', filterBlogs);

    // Initial render page 1
    renderPage();

    // Renders the current page of currentFiltered
    function renderPage() {
        const totalItems = currentFiltered.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = currentFiltered.slice(start, end);

        box.innerHTML = "";

        if (pageItems.length === 0) {
            box.insertAdjacentHTML('beforeend', "<p>No matching blog posts found.</p>");
        } else {
            pageItems.forEach(blog => {
                const blogHTML = `
                <div class="card mb-3" style="max-width: 1000px;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="/media/${blog.blog_image}" class="img-fluid rounded-start" alt="${escapeHtml(blog.title || '')}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <a href="/blog/${blog.id}" class="stretched-link"></a>
                                <h5 class="card-title">${escapeHtml(blog.title || '')}</h5>
                                <p class="card-text blog-description">${escapeHtml(blog.description || '')}</p>
                                <p class="card-text"><small class="text-muted">By: ${escapeHtml(blog.author || '')}</small></p>
                                <p class="card-text"><small class="text-muted"><strong>Category:</strong> ${escapeHtml(blog.category_display || '')}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                box.insertAdjacentHTML('beforeend', blogHTML);
            });
        }

        renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
        if (!paginationEl) return;
        paginationEl.innerHTML = "";

        // Helper to create page item
        function pageItem(page, text = null, disabled = false, active = false) {
            const li = document.createElement('li');
            li.className = 'page-item' + (disabled ? ' disabled' : '') + (active ? ' active' : '');
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.dataset.page = page;
            a.textContent = text === null ? page : text;
            a.addEventListener('click', function (e) {
                e.preventDefault();
                if (disabled || page === currentPage) return;
                currentPage = page;
                renderPage();
                scrollToTopOfList();
            });
            li.appendChild(a);
            return li;
        }

        // Prev
        const prevLi = pageItem(Math.max(1, currentPage - 1), 'Prev', currentPage === 1);
        paginationEl.appendChild(prevLi);

        // Show page numbers (for many pages we can show a condensed version)
        const maxShow = 7; // max buttons including first/last
        if (totalPages <= maxShow) {
            for (let p = 1; p <= totalPages; p++) {
                paginationEl.appendChild(pageItem(p, null, false, p === currentPage));
            }
        } else {
            // Always show 1 and last and some around current
            paginationEl.appendChild(pageItem(1, '1', false, currentPage === 1));

            let left = Math.max(2, currentPage - 2);
            let right = Math.min(totalPages - 1, currentPage + 2);

            if (left > 2) {
                const gap = document.createElement('li');
                gap.className = 'page-item disabled';
                gap.innerHTML = '<span class="page-link">…</span>';
                paginationEl.appendChild(gap);
            }

            for (let p = left; p <= right; p++) {
                paginationEl.appendChild(pageItem(p, null, false, p === currentPage));
            }

            if (right < totalPages - 1) {
                const gap = document.createElement('li');
                gap.className = 'page-item disabled';
                gap.innerHTML = '<span class="page-link">…</span>';
                paginationEl.appendChild(gap);
            }

            paginationEl.appendChild(pageItem(totalPages, String(totalPages), false, currentPage === totalPages));
        }

        // Next
        const nextLi = pageItem(Math.min(totalPages, currentPage + 1), 'Next', currentPage === totalPages);
        paginationEl.appendChild(nextLi);
    }

    function scrollToTopOfList() {
        // scroll to the top of the blogs container for better UX when switching pages
        if (box) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // small utility: prevent XSS by escaping strings
    function escapeHtml(unsafe) {
        return String(unsafe)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // simple debounce
    function debounce(fn, wait) {
        let t;
        return function () {
            clearTimeout(t);
            const args = arguments;
            t = setTimeout(function () {
                fn.apply(null, args);
            }, wait);
        };
    }
});
