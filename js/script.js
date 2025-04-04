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

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCliente'));
    modal.hide();
});

// Recheios disponíveis
const recheiosTrufado = ["Chocolate Tradicional", "Crocante", "Amendoim"];
const recheiosColher = ["Brigadeiro", "Prestígio", "Ninho", "Sensação", "Branco", "Doce de Leite", "Maracujá"];

// Atualiza visibilidade dos campos conforme o produto
function atualizarTipoOvo() {
    const produto = document.getElementById('produto').value;

    const tipoOvoSection = document.getElementById('tipoOvoSection');
    const pesoSection = document.getElementById('pesoSection');
    const recheiosSection = document.getElementById('recheiosSection');
    const adicionaisSection = document.getElementById('adicionaisSection');
    const tipoChocolateSection = document.getElementById('tipoChocolateSection');
    const variacaoChocolateSection = document.getElementById('variacaoChocolateSection');
    const alertaBranco = document.getElementById('alertaBranco');

    // Reset de valores
    tipoOvoSection.style.display = 'none';
    pesoSection.style.display = 'none';
    recheiosSection.style.display = 'none';
    adicionaisSection.style.display = 'none';
    tipoChocolateSection.style.display = 'none';
    variacaoChocolateSection.style.display = 'none';
    alertaBranco.style.display = 'none';

    document.getElementById('tipoChocolate').value = '';
    document.getElementById('variacaoChocolate').value = '';

    const brancoOption = document.querySelector('#tipoChocolate option[value="branco"]');
    brancoOption.style.display = 'inline';

    if (produto === 'ovo') {
        tipoOvoSection.style.display = 'block';
        pesoSection.style.display = produto ? 'block' : 'none';
        document.getElementById('quantidadeSection').style.display = produto ? 'block' : 'none';
        recheiosSection.style.display = 'block';
        adicionaisSection.style.display = 'block';
        tipoChocolateSection.style.display = 'block';
        carregarRecheios('trufado');
    } else if (produto === 'barra') {
        tipoOvoSection.style.display = 'none';
        pesoSection.style.display = 'block';
        recheiosSection.style.display = 'none';
        adicionaisSection.style.display = 'none';
        tipoChocolateSection.style.display = 'block';

        brancoOption.style.display = 'none';
        document.getElementById('tipoChocolate').value = 'preto';
        mostrarVariacoes();
    }
}

// Atualiza recheios ao mudar tipo de ovo
document.getElementById('tipoOvo').addEventListener('change', function () {
    carregarRecheios(this.value);
});

// Atualiza variações de chocolate
function mostrarVariacoes() {
    const tipo = document.getElementById('tipoChocolate').value;
    const variacaoSection = document.getElementById('variacaoChocolateSection');
    const alerta = document.getElementById('alertaBranco');

    if (tipo === 'preto') {
        variacaoSection.style.display = 'block';
        alerta.style.display = 'none';
    } else if (tipo === 'branco') {
        variacaoSection.style.display = 'none';
        alerta.style.display = 'block';
    } else {
        variacaoSection.style.display = 'none';
        alerta.style.display = 'none';
    }
}

// Carrega opções de recheios
function carregarRecheios(tipo) {
    const recheiosDiv = document.getElementById('recheios');
    recheiosDiv.innerHTML = '';
    let lista = recheiosColher; // Mostrar os mesmos recheios em ambos os tipos
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
    const tipoChocolate = document.getElementById('tipoChocolate').value;
    const variacaoChocolate = document.getElementById('variacaoChocolate')?.value || '';

    let preco = 0;

    if (produto === 'ovo') {
        if (tipo === 'trufado') {
            preco = peso === '250' ? 50 : peso === '500' ? 85 : 140;
        } else if (tipo === 'colher') {
            preco = peso === '250' ? 45 : peso === '500' ? 70 : 100;
        }

        if (tipoChocolate === 'branco') {
            preco += 15;
        }

        preco += adicionais.length * 10;
    } else if (produto === 'barra') {
        preco = 28;
    }

    const resumo = `📋 *Resumo do Pedido*\n` +
        `Produto: ${produto}\n` +
        (tipo ? `Tipo de Ovo: ${tipo}\n` : '') +
        `Peso: ${peso}g\n` +
        (tipoChocolate ? `Tipo de Chocolate: ${tipoChocolate}\n` : '') +
        (tipoChocolate === 'preto' && variacaoChocolate ? `Variação: ${variacaoChocolate}\n` : '') +
        (recheio ? `Recheio: ${recheio}\n` : '') +
        (adicionais.length ? `Adicionais: ${adicionais.join(', ')}\n` : '') +
        `\n💵 *Valor Total:* R$${preco},00\n` +
        `🔖 *Sinal (50%):* R$${preco / 2},00\n\n` +
        `👤 *Dados da Cliente*\n` +
        `Nome: ${nomeCliente || 'Não informado'}\n` +
        `Telefone: ${telefoneCliente || 'Não informado'}\n` +
        (emailCliente ? `Email: ${emailCliente}\n` : '') +
        (enderecoCliente ? `Endereço: ${enderecoCliente}\n` : '');

    document.getElementById('resumo').innerText = resumo;
    document.getElementById('resumo').classList.add('animate__animated', 'animate__fadeIn');

    const textoWpp = encodeURIComponent("Olá! Gostaria de fazer um pedido de Páscoa:\n\n" + resumo);
    document.getElementById('linkWhatsapp').href = `https://wa.me/5511982865807?text=${textoWpp}`;
    document.getElementById('linkWhatsapp').style.display = 'inline-block';
}
