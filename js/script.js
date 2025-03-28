// Variáveis globais para armazenar os dados do cliente
let nomeCliente = '';
let emailCliente = '';
let telefoneCliente = '';
let enderecoCliente = '';

// Captação dos dados do cliente ao salvar o formulário do modal
document.getElementById('clienteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    nomeCliente = document.getElementById('nome').value.trim();
    emailCliente = document.getElementById('email').value.trim();
    telefoneCliente = document.getElementById('telefone').value.trim();
    enderecoCliente = document.getElementById('endereco').value.trim();

    alert('Dados da cliente salvos com sucesso!');

    // Fecha o modal manualmente
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCliente'));
    modal.hide();
});

// Recheios disponíveis
const recheiosTrufado = ["Chocolate Tradicional", "Crocante", "Amendoim"];
const recheiosColher = ["Brigadeiro", "Prestígio", "Ninho", "Sensação", "Branco", "Doce de Leite", "Maracujá"];

// Atualiza visibilidade dos campos conforme o produto
function atualizarTipoOvo() {
    const produto = document.getElementById('produto').value;
    document.getElementById('tipoOvoSection').style.display = produto === 'ovo' ? 'block' : 'none';
    document.getElementById('pesoSection').style.display = produto ? 'block' : 'none';
    document.getElementById('recheiosSection').style.display = produto === 'ovo' ? 'block' : 'none';
    document.getElementById('adicionaisSection').style.display = produto === 'ovo' ? 'block' : 'none';

    if (produto === 'ovo') {
        carregarRecheios('trufado');
    }
}

// Atualiza recheios ao mudar tipo de ovo
document.getElementById('tipoOvo').addEventListener('change', function () {
    carregarRecheios(this.value);
});

// Carrega opções de recheios
function carregarRecheios(tipo) {
    const recheiosDiv = document.getElementById('recheios');
    recheiosDiv.innerHTML = '';
    const lista = tipo === 'colher' ? recheiosColher : recheiosTrufado;
    lista.forEach((r, index) => {
        recheiosDiv.innerHTML += `
            <input type="radio" class="form-check-input" name="recheio" id="r${index}" value="${r}">
            <label class="form-check-label" for="r${index}">${r}</label><br>
        `;
    });
}

// Gera o orçamento e preenche o resumo + link WhatsApp
function gerarOrcamento() {
    const produto = document.getElementById('produto').value;
    const tipo = document.getElementById('tipoOvo').value;
    const peso = document.getElementById('peso').value;
    const recheio = document.querySelector('input[name="recheio"]:checked')?.value || '';
    const adicionais = [...document.querySelectorAll('#adicionaisSection input[type="checkbox"]:checked')].map(a => a.value);

    // Cálculo do preço
    let preco = 0;
    if (produto === 'ovo') {
        if (tipo === 'trufado') preco = peso === '250' ? 50 : peso === '500' ? 85 : 140;
        else if (tipo === 'colher') preco = peso === '250' ? 45 : peso === '500' ? 70 : 100;
        preco += adicionais.length * 10;
    } else if (produto === 'barra') {
        preco = 28;
    }

    // Resumo do pedido + dados do cliente
    const resumo = `📋 *Resumo do Pedido*\n` +
        `Produto: ${produto}\n` +
        (tipo ? `Tipo: ${tipo}\n` : '') +
        `Peso: ${peso}g\n` +
        (recheio ? `Recheio: ${recheio}\n` : '') +
        (adicionais.length ? `Adicionais: ${adicionais.join(', ')}\n` : '') +
        `Valor Total: R$${preco},00\n` +
        `Sinal (50%): R$${preco / 2},00\n\n` +
        `👤 *Dados da Cliente*\n` +
        `Nome: ${nomeCliente || 'Não informado'}\n` +
        `Telefone: ${telefoneCliente || 'Não informado'}\n` +
        (emailCliente ? `Email: ${emailCliente}\n` : '') +
        (enderecoCliente ? `Endereço: ${enderecoCliente}\n` : '');

    document.getElementById('resumo').innerText = resumo;

    const textoWpp = encodeURIComponent("Olá! Gostaria de fazer um pedido de Páscoa:\n\n" + resumo);
    document.getElementById('linkWhatsapp').href = `https://wa.me/5511982865807?text=${textoWpp}`;
    document.getElementById('linkWhatsapp').style.display = 'inline-block';
}
