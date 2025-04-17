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

// проект–селектор: кликаем либо по карточке (но не по ссылкам внутри), либо по самим ссылкам — тогда они работают сами
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', e => {
    // если клик пришёлся на ссылку — дайте ей отработать как обычно
    if (e.target.closest('a')) return;
    const project = card.dataset.project;
    // сохраняете куда-нибудь выбор или передаёте параметром в queryString
    window.location.href = `projects.html?project=${project}`;
  });
});

// чтобы ссылки внутри карточки с внешним target=_blank тоже не «глушились», можно их дополнительно прервать от делегата:
document.querySelectorAll('.project-card__link').forEach(link => {
  link.addEventListener('click', e => {
    e.stopPropagation();
    // для уверенности — не меняем href
  });
});

