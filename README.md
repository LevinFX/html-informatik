Ich habe Inspiration an dem Code von https://github.com/beekurt98/terminal-portfolio/tree/main genommen für das Terminal (Das Projekt verlangt nach HTML & CSS, nicht nach eigenem JS)

https://patorjk.com/software/taag/


<script>
  // Trace
  GameState.addTrace(3);

  // Toolset & Files
  GameState.addToList('toolset', 'nmap');
  GameState.addToList('files', 'creds.txt');

  // Access-Rechte
  GameState.set('dbAccess', true);
  GameState.set('fwAccess', false);
  GameState.set('userAccess', true);

  // Auslesen
  console.log('Trace:', GameState.getTraceLevel());
  console.log('Tools:', GameState.getList('toolset'));
  console.log('Files:', GameState.getList('files'));
  console.log('DB?', GameState.get('dbAccess'));
</script>