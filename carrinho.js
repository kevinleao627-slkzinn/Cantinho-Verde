const FRETE_GRATIS = 150; // valor mínimo para frete grátis

// Cada item: { id, nome, preco, qtd }
let carrinho = [];

// Adciona produto no carrinho
function adicionarAoCarrinho(id, nome, preco) {
  const existente = carrinho.find(item => item.id === id);

  if (existente) {
    existente.qtd++; // já está no carrinho: só aumenta a quantidade
  } else {
    carrinho.push({ id, nome, preco, qtd: 1 });
  }

  renderizarCarrinho();
}

// Atualiza o HTML do carrinho, contador, total e barra de frete grátis
function renderizarCarrinho() {
  const $lista = $('#listaCarrinho').empty(); // também remove o item de exemplo do HTML

  $('#carrinhoVazio').toggleClass('d-none', carrinho.length > 0);

  carrinho.forEach(item => {
    const produto = produtos.find(p => p.id === item.id);

    const $li = $(`
      <li class="cv-item-carrinho">
        <div class="cv-item-icone"></div>
        <div class="flex-grow-1">
          <strong></strong><br>
          <small></small>
        </div>
        <div class="text-end">
          <span class="cv-preco"></span><br>
          <button class="btn btn-link btn-sm p-0 btn-remover">Remover</button>
        </div>
      </li>`);

    // Ícone: foto se existir, senão o emoji
    const $icone = $li.find('.cv-item-icone');
    if (produto && produto.imagem) {
      $icone.html($('<img>').attr({ src: produto.imagem, alt: item.nome }));
    } else {
      $icone.text(produto ? produto.emoji : '🪴');
    }

    $li.find('strong').text(item.nome);
    $li.find('small').text(item.qtd + ' × ' + formatarPreco(item.preco));
    $li.find('.cv-preco').text(formatarPreco(item.preco * item.qtd));
    $li.find('.btn-remover').attr('data-id', item.id);

    $lista.append($li);
  });

  atualizarResumo();
}

// Contador, total e frete grátis
function atualizarResumo() {
  // reduce: soma de todas as quantidades / de todos os subtotais
  const quantidade = carrinho.reduce((soma, item) => soma + item.qtd, 0);
  const total = carrinho.reduce((soma, item) => soma + item.preco * item.qtd, 0);

  $('#contadorCarrinho').text(quantidade);
  $('#totalCarrinho').text(formatarPreco(total));

  // Barra de progresso do frete grátis
  const porcentagem = Math.min(100, (total / FRETE_GRATIS) * 100);
  $('#barraFrete').css('width', porcentagem + '%');
  $('.cv-frete .progress').attr('aria-valuenow', Math.round(porcentagem));

  $('#textoFrete').text(
    total >= FRETE_GRATIS
      ? 'Você ganhou frete grátis! 🎉'
      : 'Faltam ' + formatarPreco(FRETE_GRATIS - total) + ' para o frete grátis'
  );
}

// Eventos ao clicar nos botões de adicionar, remover, limpar e finalizar
$('#listaProdutos').on('click', '.btn-adicionar', function () {
  const $botao = $(this);

  // .data() lê os atributos data-id, data-nome e data-preco do botão
  adicionarAoCarrinho($botao.data('id'), $botao.data('nome'), $botao.data('preco'));

  // Feedback rápido no botão
  $botao.text('Adicionado ✓');
  setTimeout(() => $botao.text('Adicionar'), 1000);
});

// Mesma ideia para os itens do carrinho, que também são criados pelo JS
$('#listaCarrinho').on('click', '.btn-remover', function () {
  const id = $(this).data('id');
  carrinho = carrinho.filter(item => item.id !== id);
  renderizarCarrinho();
});

$('#btnLimpar').on('click', function () {
  carrinho = [];
  renderizarCarrinho();
});

$('#btnFinalizar').on('click', function () {
  if (carrinho.length === 0) return;
  alert('Pedido finalizado! Obrigado pela compra 🌿');
  carrinho = [];
  renderizarCarrinho();
});

renderizarCarrinho(); // zera o contador e remove o item de exemplo