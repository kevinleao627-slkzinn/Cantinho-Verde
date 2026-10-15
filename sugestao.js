// API de teste: aceita qualquer POST e devolve o objeto com um id (não salva nada de verdade).
const URL_SUGESTAO = 'https://jsonplaceholder.typicode.com/posts';

// Letras com acentos: A-Za-zÀ-ÖØ-öø-ÿ
const regras = {
  // Nome e sobrenome: pelo menos duas palavras, só letras (aceita ' e -)
  sugNome: /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}(\s+[A-Za-zÀ-ÖØ-öø-ÿ'-]+)+$/,

  // E-mail: algo@dominio.ext, sem espaços
  sugEmail: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,

  // Nome da planta: de 3 a 40 caracteres (letras, números, espaço, ' e -)
  sugProduto: /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s'-]{3,40}$/
};

// Valida um campo e pinta de verde ou vermelho. Devolve true/false.
function validarCampo($campo) {
  const regex = regras[$campo.attr('id')];
  if (!regex) return true; // campo sem regra (ex.: mensagem) é sempre válido

  const valido = regex.test($campo.val().trim());
  $campo.toggleClass('is-valid', valido).toggleClass('is-invalid', !valido);
  return valido;
}

// Mostra a resposta do envio. tipo: 'success' ou 'danger'
function mostrarRetorno(tipo, texto) {
  $('#retornoSugestao')
    .removeClass('d-none alert-success alert-danger')
    .addClass('alert-' + tipo)
    .text(texto);
}

// Validação enquanto o usuário digita
// Ao sair do campo, valida.
$('#formSugestao').on('focusout', '.form-control', function () {
  validarCampo($(this));
});

// Ao digitar, só revalida se o campo já foi marcado (evita erro na 1ª letra).
$('#formSugestao').on('input', '.form-control', function () {
  const $campo = $(this);
  if ($campo.hasClass('is-valid') || $campo.hasClass('is-invalid')) {
    validarCampo($campo);
  }
});

//Envio do formulário
$('#formSugestao').on('submit', async function (evento) {
  evento.preventDefault(); // não deixa a página recarregar

  // Valida todos os campos (todos os erros aparecem de uma vez)
  const campos = $('#sugNome, #sugEmail, #sugProduto').toArray().map(el => $(el));
  const resultados = campos.map($c => validarCampo($c));

  if (resultados.includes(false)) {
    campos[resultados.indexOf(false)].trigger('focus'); // foca o 1º campo com erro
    mostrarRetorno('danger', 'Corrija os campos destacados e tente novamente.');
    return;
  }

  // Monta o objeto que vai virar JSON
  const dados = {
    nome: $('#sugNome').val().trim(),
    email: $('#sugEmail').val().trim(),
    planta: $('#sugProduto').val().trim(),
    mensagem: $('#sugMensagem').val().trim(),
    data: new Date().toISOString()
  };

  const $botao = $(this).find('button[type="submit"]');
  $botao.prop('disabled', true).text('Enviando...');

  try {
    const resposta = await fetch(URL_SUGESTAO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados) // objeto -> texto JSON
    });

    if (!resposta.ok) {
      throw new Error('Falha no envio: HTTP ' + resposta.status);
    }

    const retorno = await resposta.json(); // o servidor devolve o que recebeu + um id
    console.log('Resposta do servidor:', retorno);

    mostrarRetorno('success', 'Obrigado, ' + dados.nome.split(' ')[0] + '! Sua sugestão foi enviada.');
    this.reset();
    $(this).find('.form-control').removeClass('is-valid is-invalid');
  } catch (erro) {
    console.error(erro);
    mostrarRetorno('danger', 'Não foi possível enviar sua sugestão. Tente novamente em instantes.');
  } finally {
    $botao.prop('disabled', false).text('Enviar sugestão');
  }
});