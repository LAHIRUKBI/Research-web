/* =========================================================
   SmartAgri — Milestones Interactive Filter
   Supports tabs (All, Completed, Upcoming) & Dropdown Selector (PDF Page 11)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const milestoneCards = document.querySelectorAll('.milestone-card');
  const dropdownSelect = document.getElementById('milestoneDropdown');

  // Tab Filtering
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      milestoneCards.forEach(card => {
        const status = card.getAttribute('data-status');
        if (filter === 'all' || status === filter) {
          card.style.display = 'grid';
        } else {
          card.style.display = 'none';
        }
      });

      if (dropdownSelect) {
        dropdownSelect.value = filter;
      }
    });
  });

  // Dropdown Filtering (PDF Page 11)
  if (dropdownSelect) {
    dropdownSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      milestoneCards.forEach(card => {
        const id = card.id;
        const status = card.getAttribute('data-status');
        if (val === 'all') {
          card.style.display = 'grid';
        } else if (val === 'completed' || val === 'upcoming') {
          card.style.display = (status === val) ? 'grid' : 'none';
        } else {
          // Filter by specific assessment ID (e.g. ms-proposal)
          card.style.display = (id === val) ? 'grid' : 'none';
        }
      });
    });
  }
});
