// Função para garantir que apenas uma opção de pagamento seja selecionada por vez
document.querySelectorAll('.opcao-pagamento').forEach((checkbox) => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            document.querySelectorAll('.opcao-pagamento').forEach((box) => {
                if (box !== this) {
                    box.checked = false;
                }
            });
        }
    });
});

// Função para coletar os itens selecionados e calcular o total
function coletarItens(proximaPagina) {
    let items = JSON.parse(localStorage.getItem('selectedItems')) || [];
    let totalPreco = parseFloat(localStorage.getItem('totalPreco')) || 0;
    document.querySelectorAll('input[type=checkbox]:checked').forEach((checkbox) => {
        if (checkbox.parentElement.querySelector('p')) {
            const itemNome = checkbox.parentElement.querySelector('p').textContent;
            items.push(itemNome);
            totalPreco += parseFloat(checkbox.getAttribute('data-preco'));
        }
    });
    localStorage.setItem('selectedItems', JSON.stringify(items));
    localStorage.setItem('totalPreco', totalPreco.toFixed(2));
    window.location.href = proximaPagina;
}

// Função para mostrar os itens e o total na página de resumo
function mostrarItens() {
    let items = JSON.parse(localStorage.getItem('selectedItems'));
    let totalPreco = localStorage.getItem('totalPreco');
    let resumoDiv = document.getElementById('resumo');
    if (items) {
        items.forEach((item) => {
            let itemDiv = document.createElement('div');
            itemDiv.textContent = item;
            resumoDiv.appendChild(itemDiv);
        });
    }

    let totalDiv = document.createElement('div');
    totalDiv.textContent = `Total: R$${totalPreco}`;
    resumoDiv.appendChild(totalDiv);
}

// Função para reiniciar o local storage e voltar ao índice
function reiniciarEVoltar() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Função para validar a seleção da forma de pagamento
function validarPagamento() {
    const selecao = document.querySelectorAll('.opcao-pagamento:checked');
    if (selecao.length === 0) {
        alert('Por favor, selecione uma forma de pagamento.');
    } else {
        // Armazena a forma de pagamento selecionada
        let formaPagamento = selecao[0].value;
        localStorage.setItem('formaPagamento', formaPagamento);
        window.location.href = 'finalizado.html';
    }
}

// Chame esta função na página de resumo para carregar os itens
document.addEventListener('DOMContentLoaded', mostrarItens);
