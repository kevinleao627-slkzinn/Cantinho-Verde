// ===== Cantinho Verde: carregamento dos produtos =====

const URL_PRODUTOS = 'produtos.json';

// Guarda todos os produtos carregados.
// Vai ser útil depois, na busca e no filtro (arrays + filter).
let produtos = [];

// Formata número como moeda brasileira: 89.9 -> "R$ 89,90"
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ---------- 1. Buscar os dados ----------
async function carregarProdutos() {
  // Estado "carregando": mostra o spinner, esconde erro e limpa a lista
  $('#spinner').removeClass('d-none');
  $('#alertaErro').addClass('d-none');
  $('#semResultados').addClass('d-none');
  $('#listaProdutos').empty(); // também remove o card de exemplo do HTML

  try {
    const resposta = await fetch(URL_PRODUTOS);

    // fetch NÃO dá erro em 404/500, então checamos manualmente
    if (!resposta.ok) {
      throw new Error('Falha ao carregar: HTTP ' + resposta.status);
    }

    produtos = await resposta.json(); // converte o JSON em array de objetos

    preencherCategorias(produtos);
    renderizarProdutos(produtos);
  } catch (erro) {
    console.error(erro);
    $('#alertaErro').removeClass('d-none'); // estado "erro"
  } finally {
    $('#spinner').addClass('d-none'); // roda sempre, com sucesso ou erro
  }
}

// ---------- 2. Preencher o <select> de categorias ----------
function preencherCategorias(lista) {
  // Set remove categorias repetidas
  const categorias = [...new Set(lista.map(p => p.categoria))].sort();

  categorias.forEach(cat => {
    $('#categoria').append($('<option>').val(cat).text(cat));
  });
}

// ---------- 3. Montar os cards na tela ----------
function renderizarProdutos(lista) {
  const $container = $('#listaProdutos').empty();

  // Nenhum resultado: mostra a mensagem e para
  $('#semResultados').toggleClass('d-none', lista.length > 0);

  lista.forEach(p => {
    // Clona o molde do <template id="tplProduto">
    const $card = $($('#tplProduto').html());

    // Imagem (se houver) ou emoji
   
    // Imagem (se houver) ou emoji
    const $img = $card.find('.cv-produto-img');

    if (p.imagem && p.imagem.trim() !== '') {
      const imagem = $('<img>').attr({
        src: p.imagem,
        alt: p.nome,
        loading: 'lazy'
      });

      imagem.on('load', function () {
        console.log('Imagem carregada:', p.nome, p.imagem);
      });

      imagem.on('error', function () {
        console.error('Erro ao carregar imagem:', p.nome, p.imagem);
        $img.empty().text(p.emoji || '🪴');
      });

      $img.empty().append(imagem);
    } else {
      console.warn('Produto sem imagem cadastrada:', p.nome);
      $img.empty().text(p.emoji || '🪴');
    }


    // Textos (.text() evita injetar HTML vindo do JSON)
    $card.find('.cv-cat').text(p.categoria);
    $card.find('.card-title').text(p.nome);
    $card.find('.card-text').text(p.descricao);
    $card.find('.cv-preco').text(formatarPreco(p.preco));

    // Etiquetas de cuidado
    const etiquetas = ['☀️ ' + p.luz, '💧 ' + p.rega, '📏 ' + p.tamanho];
    if (p.pet) etiquetas.push('🐾 Seguro para pets');
    etiquetas.forEach(texto => {
      $card.find('.cv-cuidados').append($('<span>').text(texto));
    });

    // Dados nos botões (os próximos passos vão ler com .data())
    $card.find('.btn-detalhes').attr('data-id', p.id);
    $card.find('.btn-adicionar').attr({
      'data-id': p.id,
      'data-nome': p.nome,
      'data-preco': p.preco
    });

    $container.append($card);
  });
}

// ---------- Início ----------
$(carregarProdutos); // executa quando a página termina de carregar