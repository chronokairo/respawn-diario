// Exemplo de teste unitário simples para função de sanitização
const assert = (desc, cond) => {
  if (!cond) throw new Error('❌ ' + desc);
  console.log('✅ ' + desc);
};

// Função a ser testada (deve ser igual à usada no projeto)
function sanitizeInput(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// Testes
assert('Remove tags HTML', sanitizeInput('<img src=x onerror=alert(1)>') === '&lt;img src=x onerror=alert(1)&gt;');
assert('Mantém texto puro', sanitizeInput('texto seguro') === 'texto seguro');
assert('Escapa aspas', sanitizeInput('a"b<c>d') === 'a&quot;b&lt;c&gt;d');

console.log('Todos os testes passaram!');
