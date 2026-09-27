(() => {
  const grids = [...document.querySelectorAll('[data-card-flow]')];
  if (!grids.length) return;

  let markerIndex = 0;
  const draw = grid => {
    grid.querySelector(':scope > .practice-flow-connectors')?.remove();
    const cards = [...grid.querySelectorAll(':scope > .practice-card')];
    if (cards.length < 2) return;

    const box = grid.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const markerId = `flow-arrow-${markerIndex++}`;
    svg.classList.add('practice-flow-connectors');
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<defs><marker id="${markerId}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth"><path d="M0 0L7 3.5L0 7Z"/></marker></defs>`;

    const local = card => {
      const rect = card.getBoundingClientRect();
      return {
        left:rect.left-box.left, right:rect.right-box.left,
        top:rect.top-box.top, bottom:rect.bottom-box.top,
        cx:(rect.left+rect.right)/2-box.left,
        cy:(rect.top+rect.bottom)/2-box.top
      };
    };
    cards.slice(0,-1).forEach((card,index) => {
      const a=local(card), b=local(cards[index+1]);
      const sameColumn=Math.abs(a.cx-b.cx)<8;
      const sameRow=Math.abs(a.cy-b.cy)<8;
      let d;
      if (sameColumn) {
        d=`M${a.cx} ${a.bottom+5} L${b.cx} ${b.top-10}`;
      } else if (sameRow) {
        d=`M${a.right+5} ${a.cy} L${b.left-10} ${b.cy}`;
      } else {
        const centerX=box.width/2;
        const startY=a.bottom+10, endY=b.top-10, bendY=(startY+endY)/2;
        d=`M${centerX+24} ${startY} C${centerX+10} ${bendY-2} ${centerX-10} ${bendY+2} ${centerX-24} ${endY}`;
      }
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',d);
      path.setAttribute('marker-end',`url(#${markerId})`);
      svg.append(path);
    });
    grid.prepend(svg);
  };

  const redraw=()=>grids.forEach(draw);
  let frame;
  const schedule=()=>{ cancelAnimationFrame(frame); frame=requestAnimationFrame(redraw); };
  new ResizeObserver(schedule).observe(document.documentElement);
  window.addEventListener('load',schedule,{once:true});
  schedule();
})();
