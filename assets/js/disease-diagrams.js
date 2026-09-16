(() => {
  const diagrams = document.querySelectorAll('#mechanism .practice-card svg');
  if (!diagrams.length || !window.HTMLDialogElement) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'diagram-dialog';
  dialog.setAttribute('aria-labelledby', 'diagram-dialog-title');
  dialog.innerHTML = '<header><h2 id="diagram-dialog-title"></h2><button type="button">閉じる</button></header><p>図を左右・上下に動かして確認できる。</p><div class="diagram-dialog-scroll" tabindex="0" role="region" aria-label="拡大した病態図"></div>';
  document.body.append(dialog);
  const title = dialog.querySelector('h2');
  const surface = dialog.querySelector('.diagram-dialog-scroll');
  const close = dialog.querySelector('button');
  let opener;
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    surface.replaceChildren();
    document.body.classList.remove('diagram-dialog-open');
    opener?.focus();
  });
  diagrams.forEach((svg) => {
    const name = svg.closest('article').querySelector('h3').textContent;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'diagram-expand';
    button.textContent = '図を拡大';
    button.setAttribute('aria-label', `${name}の図を拡大`);
    button.setAttribute('aria-haspopup', 'dialog');
    svg.after(button);
    button.addEventListener('click', () => {
      opener = button;
      title.textContent = name;
      const copy = svg.cloneNode(true);
      // Keep marker/title references valid without duplicating document IDs.
      const ids = [...copy.querySelectorAll('[id]')];
      ids.forEach((node) => {
        const old = node.id;
        const next = `enlarged-${old}`;
        node.id = next;
        [copy, ...copy.querySelectorAll('*')].forEach((element) => {
          [...element.attributes].forEach((attribute) => {
            if (attribute.name === 'id') return;
            const value = attribute.value.replaceAll(`url(#${old})`, `url(#${next})`);
            element.setAttribute(attribute.name, attribute.name === 'aria-labelledby' && value === old ? next : value);
          });
        });
      });
      surface.replaceChildren(copy);
      document.body.classList.add('diagram-dialog-open');
      dialog.showModal();
      surface.scrollTo(0, 0);
      close.focus();
    });
  });
})();
