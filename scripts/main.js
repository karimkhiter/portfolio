document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MENU MOBILE ---
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.getElementById('close-btn');

    if (burger && mobileNav) {
        burger.addEventListener('click', () => {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }

    // --- 3. FILTRAGE ET TRI PROJETS (AVEC BOUTON VOIR PLUS) ---
    const filterPills = document.querySelectorAll('.filter-pill');
    const projectCards = Array.from(document.querySelectorAll('.project-card[data-tags]'));
    const projectsGrid = document.querySelector('.projects-grid');
    const sortSelect = document.getElementById('sort-select');
    const noResults = document.querySelector('.no-results');
    const countDisplay = document.querySelector('.projects-count span');
    
    // Nouveaux éléments pour la limite
    const voirPlusBtn = document.getElementById('voir-plus-btn');
    let currentLimit = 10; // Limite d'affichage par défaut

    if (filterPills.length && projectCards.length && projectsGrid) {

        const activeFilters = { type: [], tech: [], comp: [] };

        function applyFiltersAndSort() {
            let matchingCards = [];

            // 1. Identifier les cartes qui correspondent aux filtres
            projectCards.forEach(card => {
                const cardTags = card.getAttribute('data-tags').split(',').map(t => t.trim());
                const cardComps = (card.getAttribute('data-comp') || '').split(',').map(t => t.trim());
                const cardType = card.getAttribute('data-type') || '';

                const typeMatch = activeFilters.type.length === 0 || activeFilters.type.includes(cardType);
                const techMatch = activeFilters.tech.length === 0 || activeFilters.tech.some(f => cardTags.includes(f));
                const compMatch = activeFilters.comp.length === 0 || activeFilters.comp.some(f => cardComps.includes(f));

                if (typeMatch && techMatch && compMatch) {
                    matchingCards.push(card);
                } else {
                    // Cacher immédiatement celles qui ne matchent pas
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });

            // Mise à jour du texte avec le nombre total de résultats trouvés
            if (countDisplay) countDisplay.textContent = matchingCards.length;
            
            if (noResults) {
                if (matchingCards.length === 0) {
                    noResults.classList.add('visible');
                    noResults.style.display = 'block';
                } else {
                    noResults.classList.remove('visible');
                    noResults.style.display = 'none';
                }
            }

            // 2. Trier le tableau de cartes MATCHING
            if (sortSelect) {
                const sortValue = sortSelect.value;

                matchingCards.sort((a, b) => {
                    const dateA = parseInt(a.getAttribute('data-date')) || 0;
                    const dateB = parseInt(b.getAttribute('data-date')) || 0;
                    const pertA = parseInt(a.getAttribute('data-pertinence')) || 99;
                    const pertB = parseInt(b.getAttribute('data-pertinence')) || 99;

                    if (sortValue === 'date-desc') {
                        return dateB - dateA;
                    } else if (sortValue === 'date-asc') {
                        return dateA - dateB;
                    } else if (sortValue === 'pertinence') {
                        if (pertA === pertB) {
                            return dateB - dateA;
                        }
                        return pertA - pertB; 
                    }
                    return 0;
                });
            }

            // 3. Gérer l'affichage avec la limite de 10
            matchingCards.forEach((card, index) => {
                if (index < currentLimit) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
                // On réinjecte dans le DOM pour appliquer l'ordre du tri
                projectsGrid.appendChild(card);
            });

            if (noResults) {
                projectsGrid.appendChild(noResults);
            }

            // 4. Gérer l'apparition du bouton "Voir plus"
            if (voirPlusBtn) {
                if (matchingCards.length > currentLimit) {
                    voirPlusBtn.style.display = 'inline-block';
                } else {
                    voirPlusBtn.style.display = 'none';
                }
            }
        }

        // Evénements sur les filtres
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                currentLimit = 10; // On réinitialise l'affichage à 10 quand on filtre
                const filterValue = pill.getAttribute('data-filter');
                const filterGroup = pill.getAttribute('data-group');

                if (filterValue === 'all') {
                    activeFilters[filterGroup] = [];
                    document.querySelectorAll(`.filter-pill[data-group="${filterGroup}"]`).forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                } else {
                    const allBtn = document.querySelector(`.filter-pill[data-group="${filterGroup}"][data-filter="all"]`);
                    if (allBtn) allBtn.classList.remove('active');

                    const idx = activeFilters[filterGroup].indexOf(filterValue);
                    if (idx === -1) {
                        activeFilters[filterGroup].push(filterValue);
                        pill.classList.add('active');
                    } else {
                        activeFilters[filterGroup].splice(idx, 1);
                        pill.classList.remove('active');
                    }

                    if (activeFilters[filterGroup].length === 0 && allBtn) {
                        allBtn.classList.add('active');
                    }
                }

                applyFiltersAndSort();
            });
        });

        // Evénement sur le tri
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                currentLimit = 10; // On réinitialise à 10 quand on change l'ordre de tri
                applyFiltersAndSort();
            });
        }

        // Evénement sur le bouton Voir Plus
        if (voirPlusBtn) {
            voirPlusBtn.addEventListener('click', () => {
                currentLimit += 10; // Rajoute 10 projets de plus à chaque clic
                applyFiltersAndSort();
            });
        }

        // Initialisation au chargement de la page
        applyFiltersAndSort();
    }
});