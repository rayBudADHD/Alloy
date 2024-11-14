// JavaScript to toggle the panels
document.getElementById('leftToggleBtn').addEventListener('click', function() {
    const leftPanel = document.getElementById('leftPanel');
    leftPanel.classList.toggle('collapsed');
    leftPanel.classList.toggle('collapsed-left');
  });
  
  document.getElementById('rightToggleBtn').addEventListener('click', function() {
    const rightPanel = document.getElementById('rightPanel');
    rightPanel.classList.toggle('collapsed');
    rightPanel.classList.toggle('collapsed-right');
  });
  
  document.getElementById('bottomToggleBtn').addEventListener('click', function() {
    const bottomPanel = document.getElementById('bottomPanel');
    bottomPanel.classList.toggle('collapsed');
    bottomPanel.classList.toggle('collapsed-bottom');
  });
  
  document.getElementById('topToggleBtn').addEventListener('click', function() {
    const topPanel = document.getElementById('topPanel');
    topPanel.classList.toggle('collapsed');
    topPanel.classList.toggle('collapsed-top');
  });
  