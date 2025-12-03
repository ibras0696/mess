// Simple helper to clear wm tokens in the browser (run via devtools snippet)
localStorage.removeItem('wm.access');
localStorage.removeItem('wm.refresh');
console.log('[clear-localstorage] removed wm.access & wm.refresh');
