
(()=>{
 const root=document.querySelector('.reference-product-page[data-catalog-product]');if(!root)return;
 const options=[...root.querySelectorAll('[data-pattern-option]')],sizes=[...root.querySelectorAll('[data-size-option]')],thumbs=[...root.querySelectorAll('[data-gallery-thumb]')];
 let variant=options[0]?.dataset.patternOption||'',size=sizes[0]?.dataset.sizeOption||'Confirm size';
 const title=root.dataset.catalogProduct;
 const select=(els,chosen)=>els.forEach(el=>{const on=el===chosen;el.classList.toggle('is-selected',on);el.setAttribute('aria-pressed',String(on))});
 function update(){const text=title+' — '+variant+' — Size: '+size;root.querySelectorAll('input[name="product"]').forEach(el=>el.value=text);const summary=root.querySelector('[data-selection-summary]');if(summary)summary.textContent='Selected: '+variant+' · '+size;}
 options.forEach(b=>b.addEventListener('click',()=>{variant=b.dataset.patternOption;select(options,b);const n=b.dataset.galleryIndex;if(n!==undefined&&thumbs[Number(n)])thumbs[Number(n)].click();update()}));
 sizes.forEach(b=>b.addEventListener('click',()=>{size=b.dataset.sizeOption;select(sizes,b);update()}));
 thumbs.forEach((b,i)=>b.addEventListener('click',()=>{const opt=options.find(o=>Number(o.dataset.galleryIndex)===i&&o.dataset.galleryIndex!==undefined);if(opt){variant=opt.dataset.patternOption;select(options,opt);update()}}));
 const tabs=[...root.querySelectorAll('[data-ref-tab]')],panels=[...root.querySelectorAll('[data-ref-panel]')];
 function tab(name,focus=false){tabs.forEach(t=>{const on=t.dataset.refTab===name;t.classList.toggle('is-active',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;if(on&&focus)t.focus()});panels.forEach(p=>p.hidden=p.dataset.refPanel!==name)}
 tabs.forEach((t,i)=>{t.addEventListener('click',()=>tab(t.dataset.refTab));t.addEventListener('keydown',ev=>{let n;if(ev.key==='ArrowRight')n=(i+1)%tabs.length;if(ev.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(ev.key==='Home')n=0;if(ev.key==='End')n=tabs.length-1;if(n!==undefined){ev.preventDefault();tab(tabs[n].dataset.refTab,true)}})});
 function fromHash(){const h=location.hash;if(h==='#faq')tab('faq');else if(h==='#custom-service')tab('custom');else if(['#product-details','#size-guide','#purchasing'].includes(h))tab('details')}
 window.addEventListener('hashchange',fromHash);fromHash();update();root.querySelectorAll('form').forEach(f=>f.addEventListener('reset',()=>setTimeout(update,0)));
})();
