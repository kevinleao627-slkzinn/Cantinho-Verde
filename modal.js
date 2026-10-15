// Cria (ou reaproveita) a instância do modal do Bootstrap
const modalProduto = bootstrap.Modal.getOrCreateInstance(
  document.getElementById('modalProduto')
);

// Preenche o modal com os dados de um produto
function preencherModal(p) {
  $('#modalTitulo').text(p.nome);
  $('#modalCategoria').text(p.categoria);
  $('#modalDescricao').text(p.descricao);
  $('#modalPreco').text(formatarPreco(p.preco));

  // Imagem: foto se existir, senão emoji
  const $imagem = $('#modalImagem');
  if (p.imagem) {
    $imagem.html($('<img>').attr({ src: p.imagem, alt: p.nome }));
  } else {
    $imagem.text(p.emoji);
  }

  // Cuidados da planta
  const etiquetas = [
    '☀️ ' + p.luz,
    '💧 ' + p.rega,
    '📏 ' + p.tamanho,
    p.pet ? '🐾 Seguro para pets' : '🐾 Não indicada para pets'
  ];
  const $cuidados = $('#modalCuidados').empty();
  etiquetas.forEach(texto => $cuidados.append($('<span>').text(texto)));

  // .data() como "setter": guarda o produto no botão do modal
  // para o clique em "Adicionar ao carrinho" saber quem adicionar
  $('#modalAdicionar').data('produto', p);
}

// Abrir o modal dos botoes "Detalhes" dos cards. O modal é o mesmo para todos os produtos, só muda o conteúdo.
$('#listaProdutos').on('click', '.btn-detalhes', function () {
  const id = $(this).data('id');                 // .data() lê o data-id do botão
  const produto = produtos.find(p => p.id === id); // acha o produto no array

  if (!produto) return;

  preencherModal(produto);
  modalProduto.show();
});

// Adicionar ao carrinho pelo modal 
$('#modalAdicionar').on('click', function () {
  const p = $(this).data('produto'); // .data() como "getter"
  if (!p) return;

  adicionarAoCarrinho(p.id, p.nome, p.preco);
  modalProduto.hide();
});