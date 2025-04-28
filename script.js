// script.js (updated without Filtering)

// Dark Mode Toggle
const darkToggle = document.getElementById('dark-mode-toggle');
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

// Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.style.display = 'block';
  } else {
    backToTop.style.display = 'none';
  }
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// GitHub Repositories + Loader + Pagination (NO Filtering)
const projectGrid = document.querySelector('.project-grid');
const sectionProjects = document.getElementById('projects');
const loader = document.createElement('div');
loader.className = 'loader';
const paginationContainer = document.createElement('div');
paginationContainer.className = 'pagination';
sectionProjects.appendChild(paginationContainer);

let allRepos = [];
const reposPerPage = 6;
let currentPage = 1;

// Show loader
function showLoader() {
  projectGrid.innerHTML = '';
  projectGrid.appendChild(loader);
}

// Hide loader
function hideLoader() {
  if (projectGrid.contains(loader)) {
    projectGrid.removeChild(loader);
  }
}

// Render projects for a page
function renderProjects(repos) {
  projectGrid.innerHTML = '';
  const start = (currentPage - 1) * reposPerPage;
  const end = start + reposPerPage;
  const pageRepos = repos.slice(start, end);

  pageRepos.forEach(repo => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description ? repo.description : 'No description available.'}</p>
      <p><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Repository →</a></p>
    `;
    projectGrid.appendChild(card);
  });
}

// Render pagination buttons
function renderPagination(repos) {
  paginationContainer.innerHTML = '';
  const totalPages = Math.ceil(repos.length / reposPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    if (i === currentPage) button.classList.add('active');
    button.addEventListener('click', () => {
      currentPage = i;
      renderProjects(repos);
      renderPagination(repos);
      window.scrollTo({ top: sectionProjects.offsetTop - 50, behavior: 'smooth' });
    });
    paginationContainer.appendChild(button);
  }
}

// Fetch repos from GitHub
async function fetchRepos() {
  showLoader();
  try {
    const response = await fetch('https://api.github.com/users/ItsBurakVatan/repos', {
      headers: { Accept: "application/vnd.github.mercy-preview+json" }
    });
    const repos = await response.json();
    
    // Only public repos
    const portfolioRepos = repos.filter(repo => !repo.private);

    allRepos = portfolioRepos;

    renderProjects(allRepos);
    renderPagination(allRepos);
  } catch (error) {
    console.error('Error fetching repos:', error);
    projectGrid.innerHTML = '<p>Unable to load projects at the moment.</p>';
  } finally {
    hideLoader();
  }
}

fetchRepos();
