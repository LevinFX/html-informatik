document.addEventListener('DOMContentLoaded', () => {
    console.log('Trace:', GameState.getTraceLevel());
  console.log('Tools:', GameState.getList('toolset'));
  console.log('Files:', GameState.getList('files'));
  console.log('DB?', GameState.get('dbAccess'));
});