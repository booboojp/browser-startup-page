document.addEventListener('DOMContentLoaded', function () {
    const music = document.getElementById('background-music');
    const preloadImage = new Image();
    preloadImage.src = 'background.gif';

    music.load();
    function playMusic() {
        music.loop = true;

        music.play()
            .then(() => {
                console.log('Audio started playing');
            })
            .catch(error => {
                console.log('Audio autoplay failed: ' + error);
                document.addEventListener('click', () => {
                    music.play();
                    const notice = document.querySelector('.music-notice');
                    if (notice) notice.remove();
                }, { once: true });

                const notice = document.createElement('div');
                notice.className = 'music-notice';
                notice.innerHTML = 'Click anywhere to play background music';
                notice.style.position = 'fixed';
                notice.style.bottom = '20px';
                notice.style.left = '50%';
                notice.style.transform = 'translateX(-50%)';
                notice.style.padding = '10px 15px';
                notice.style.backgroundColor = 'rgba(0,0,0,0.7)';
                notice.style.color = 'white';
                notice.style.borderRadius = '5px';
                notice.style.zIndex = '1000';
                document.body.appendChild(notice);
            });
    }

    playMusic();

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const altSearchLinks = document.getElementById('alt-search-links');
    
    const searchEngines = {
        Google: (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        Bing: (query) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
        DuckDuckGo: (query) => `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        Yahoo: (query) => `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`,
        Brave: (query) => `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
		GitHub: (query) => `https://github.com/search?q=${encodeURIComponent(query)}`,
		Reddit: (query) => `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`,
		StackOverflow: (query) => `https://stackoverflow.com/search?q=${encodeURIComponent(query)}`,
		Wikipedia: (query) => `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`,
		YouTube: (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
		Amazon: (query) => `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
		ExHentai: (query) => `https://exhentai.org/?f_search=${encodeURIComponent(query)}`,

    };
    
    let selectedEngine = 'Google';
    let lastQuery = '';
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        lastQuery = query;
        
        if (query) {
            updateSearchEngines(query);
        } else {
            altSearchLinks.innerHTML = '';
        }
    });
    
    function updateSearchEngines(query) {
        altSearchLinks.innerHTML = '';
        
        Object.keys(searchEngines).forEach((name, index) => {
            const link = document.createElement('a');
            link.href = searchEngines[name](query);
            link.textContent = name;
            link.dataset.engine = name;
            link.className = 'search-link';
            
            if (name === selectedEngine) {
                link.classList.add('selected');
                link.setAttribute('tabindex', '1');
            } else {
                link.setAttribute('tabindex', '2');
            }
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                selectedEngine = name;
                
                document.querySelectorAll('.search-link').forEach(l => {
                    l.classList.remove('selected');
                    l.setAttribute('tabindex', '2');
                });
                
                this.classList.add('selected');
                this.setAttribute('tabindex', '1');
                
                if (query) {
                    window.location.href = searchEngines[name](query);
                }
            });
            
            link.addEventListener('focus', function() {
                selectedEngine = name;
                
                document.querySelectorAll('.search-link').forEach(l => {
                    l.classList.remove('selected');
                });
                
                this.classList.add('selected');
            });
            
            altSearchLinks.appendChild(link);
        });
    }

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (query) {
            window.location.href = searchEngines[selectedEngine](query);
        }
    });

    document.addEventListener('keydown', function(e) {
        const query = searchInput.value.trim();
        
        if (!query) return;
        
        if (e.key === 'Tab') {
            e.preventDefault();
            
            const engines = Object.keys(searchEngines);
            const currentIndex = engines.indexOf(selectedEngine);
            const nextIndex = (currentIndex + 1) % engines.length;
            selectedEngine = engines[nextIndex];
            const links = document.querySelectorAll('.search-link');
            links.forEach(link => {
                link.classList.remove('selected');
                link.setAttribute('tabindex', '2');
            });
            
            links[nextIndex].classList.add('selected');
            links[nextIndex].setAttribute('tabindex', '1');
            links[nextIndex].focus();
        }
    });
    searchInput.focus();
});