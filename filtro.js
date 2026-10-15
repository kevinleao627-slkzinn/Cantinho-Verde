// Tira acentos e deixa minúsculo: "Costela-de-Adão" -> "costela-de-adao"
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Lê os dois controles, filtra o array e redesenha a lista
function aplicarFiltros() {
  if (produtos.length === 0) return;

  const termo = normalizar($('#busca').val().trim());
  const categoria = $('#categoria').val(); // "" = todas

  const resultado = produtos.filter(p => {
    const bateNome = normalizar(p.nome).includes(termo);
    const bateCategoria = categoria === '' || p.categoria === categoria;
    return bateNome && bateCategoria; // precisa passar nos dois
  });

  renderizarProdutos(resultado);
}

// Busca: roda a cada letra digitada
$('#busca').on('input', aplicarFiltros);

// Filtro: roda quando a categoria muda
$('#categoria').on('change', aplicarFiltros);