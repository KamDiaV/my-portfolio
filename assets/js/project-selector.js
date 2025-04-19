function selectProject(name) {
  localStorage.setItem('selectedProject', name);
  window.location.href = 'projects.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const sel = localStorage.getItem('selectedProject');
  if (!sel) return;
  const list = document.querySelector('.projects-detail__list');
  const items = Array.from(list.children);
  const picked = items.find(li =>
    li.querySelector('.project-detail')?.dataset.project === sel
  );
  if (picked) {
    localStorage.removeItem('selectedProject');
    list.insertBefore(picked, list.firstChild);
  }
});

window.selectProject = selectProject;

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    const project = card.dataset.project;
    window.location.href = `projects.html?project=${project}`;
  });
});

document.querySelectorAll('.project-card__link').forEach(link => {
  link.addEventListener('click', e => {
    e.stopPropagation();
  });
});

