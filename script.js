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

// Função para coletar os itens selecionados de todas as páginas e armazenar no local storage
function coletarItens(proximaPagina) {
    let items = JSON.parse(localStorage.getItem('selectedItems')) || [];
    let totalPreco = parseFloat(localStorage.getItem('totalPreco')) || 0;

    document.querySelectorAll('input[type=checkbox]:checked').forEach((checkbox) => {
        const itemNome = checkbox.parentElement.querySelector('p')?.textContent || checkbox.nextElementSibling.textContent;
        items.push(itemNome);
        totalPreco += parseFloat(checkbox.getAttribute('data-preco')) || 0; // Adiciona o preço se existir
        console.log(`Item: ${itemNome}, Preço: ${totalPreco}`);
    });

    if (items.length === 0) {
        alert('Por favor, selecione ao menos um item.');
        return;
    }

    // Salvar dados no local storage para uso posterior
    localStorage.setItem('selectedItems', JSON.stringify(items));
    localStorage.setItem('totalPreco', totalPreco.toFixed(2));

    // Navegar para a próxima página
    window.location.href = proximaPagina;
}

// Função para mostrar os itens e o total na página de resumo
function mostrarItens() {
    let items = JSON.parse(localStorage.getItem('selectedItems')) || [];
    let totalPreco = localStorage.getItem('totalPreco') || 0;
    let resumoDiv = document.getElementById('resumo');

    if (!resumoDiv) {
        console.error('Elemento #resumo não foi encontrado.');
        return;
    }

    if (items.length > 0) {
        items.forEach((item) => {
            let itemDiv = document.createElement('div');
            itemDiv.textContent = item;
            resumoDiv.appendChild(itemDiv);
        });
    } else {
        let vazioDiv = document.createElement('div');
        vazioDiv.textContent = 'Nenhum item selecionado';
        resumoDiv.appendChild(vazioDiv);
    }

    let totalDiv = document.createElement('div');
    totalDiv.textContent = `Total: R$${totalPreco}`;
    resumoDiv.appendChild(totalDiv);
}

// Função para confirmar o pedido e enviar para o banco de dados
function confirmarPedido() {
    let items = JSON.parse(localStorage.getItem('selectedItems')) || [];
    let totalPreco = localStorage.getItem('totalPreco') || 0;

    if (items.length === 0) {
        alert('Nenhum item foi selecionado.');
        return;
    }

    // Recuperar nome e CPF do local storage
    let cliente = JSON.parse(localStorage.getItem('cliente')) || {};
    let nome = cliente.nome || '';
    let cpf = cliente.cpf || '';

    if (!nome) {
        alert('Por favor, insira seu nome.');
        return;
    }

    let formaPagamento = document.querySelector('.opcao-pagamento:checked')?.value;
    if (!formaPagamento) {
        alert('Por favor, selecione uma forma de pagamento.');
        return;
    }

    // Enviar dados para o backend
    fetch('http://localhost:8080/addPedido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: items, totalPreco: totalPreco, formaPagamento: formaPagamento, nome: nome, cpf: cpf })
    }).then(response => response.text())
      .then(data => {
          console.log(data);
          alert('Pedido confirmado!');
          reiniciarEVoltar();
      })
      .catch(error => console.error('Erro:', error));
}

function reiniciarEVoltar() {
    localStorage.clear();
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', mostrarItens);
