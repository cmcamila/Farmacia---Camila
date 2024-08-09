import promptSync from "prompt-sync";
import chalk from "chalk";
import fs from "fs";
import { agradecimento, littleLogo, logo } from "./visual.js";
import funcionarios from "./funcionarios.json" assert { type: "json" };
// import { clear } from "console";
const prompt = promptSync();

function salvarFuncionarios() {
  // Converte a lista de funcionários para JSON
  let dadosFuncionarios = JSON.stringify(funcionarios, null, 2);
  // Salva os dados no arquivo funcionarios.json
  fs.writeFileSync("funcionarios.json", dadosFuncionarios);
}

function criarFuncionario() {
  console.log(chalk.blue("Bem vindo ao sistema de cadastro de funcionario!"));
  console.log("");
  let id = prompt("Digite o cpf do funcionário usando apenas números): ");
  let nome = prompt("Digite o nome do funcionário: ");
  let email = prompt("Digite o email do funcionário: ");
  let pin = prompt("Peça para o funcionário inserir uma senha: ");
  let isAdmin = prompt(
    chalk.blue("Esse funcionário será administrador? (") +
      chalk.green("s") +
      chalk.blue("/") +
      chalk.red("n") +
      chalk.blue(")")
  );

  let roleAdmin = false;
  if (isAdmin.toLowerCase() === "s") roleAdmin = true;
  else if (isAdmin.toLowerCase() === "n") {
    roleAdmin = false;
  }

  let novoFuncionario = {
    id: id,
    nome: nome,
    email: email,
    pin: pin,
    administrador: roleAdmin,
  };

  funcionarios.push(novoFuncionario);

  console.log(chalk.green("\nFuncionário cadastrado com sucesso!"));
}

function loginFuncionario() {
  let loginEmail = prompt("Digite o seu e-mail: ");
  let loginPin = prompt("Digite a sua senha: ");
  let funcionarioEncontrado = false;

  for (let i = 0; i < funcionarios.length; i++) {
    if (
      loginEmail === funcionarios[i].email &&
      loginPin === funcionarios[i].pin
    ) {
      funcionarioEncontrado = true;
      return funcionarios[i];
    }
  }
  for (let i = 0; i < funcionarios.length; i++) {
    //coloquei um if/return igual ao de cima para voltar pra opçao de login e nao deixar seguir para venda se o login/senha estiverem errado.
    if (
      loginEmail !== funcionarios[i].email &&
      loginPin !== funcionarios[i].pin
    ) {
      funcionarioEncontrado = false;
      return console.log(chalk.red("\nE-mail ou senha incorretos!"));
    }
    return [];
  }
}

function carregarFuncionarios() {
  try {
    // Tenta ler o arquivo JSON
    let dadosFuncionarios = fs.readFileSync("funcionarios.json");
    return JSON.parse(dadosFuncionarios);
  } catch (err) {
    // Se houver um erro ao ler o arquivo (por exemplo, arquivo não existente), retorna uma lista vazia
    console.log(chalk.red("Erro ao carregar funcionários:"), err);
    return [];
  }
}
carregarFuncionarios();

// Função para salvar os remédios no arquivo JSON
function salvarRemedios() {
  try {
    fs.writeFileSync("./medicamentos.json", JSON.stringify(remedios, null, 2), "utf-8"); // utiliza o writeFileSync do módulo fs para escrever a string JSON no arquivo medicamentos.json. O JSON.stringfy converte o objeto remedios em uma string JSON
  } catch (err) {
    console.error("Erro ao salvar o arquivo JSON:", err);
  }
}

// Função para carregar o arquivo JSON
function listaRemedios() {
  try {
    const data = fs.readFileSync("./medicamentos.json", "utf-8"); // a função readFileSync do módulo fs (file system) do Node.js é usada para ler o conteúdo do arquivo medicamentos.json. O parâmetro 'utf-8' indica que o conteúdo deve ser lido como uma string de texto.
    return JSON.parse(data); //Converte a string JSON lida do arquivo em um objeto JavaScript.
  } catch (err) {
    console.error("Erro ao carregar o arquivo JSON:", err);
    return [];
  }
}

function updateMedicine(funcionario) {
  if (funcionario.administrador == true) {
    console.log(chalk.blue("\nLista de remédios disponíveis: "));
    remedios.forEach((remedio, index) => {
      console.log(`${index + 1}. ${remedio.nome}`);
    });

    console.log("");
    let buscadorRemedio = Number(
      prompt(chalk.yellow(`Qual remédio você deseja alterar?(digite o id) `))
    );

    for (let i = 0; i < remedios.length; i++) {
      if (buscadorRemedio == remedios[i].id) {
        console.log(
          chalk.blue(
            `1 - Nome\n2 - Preço\n3 - Categoria\n4 - Necessidade de Receita\n5 - Quantidade`
          )
        );
        console.log("");
        let info = Number(
          prompt(
            chalk.yellow(`Qual informação do remédio você deseja alterar? `)
          )
        );
        switch (info) {
          case 1:
            let novoNome = prompt(
              `Qual será o novo nome do remédio ${remedios[i].nome}? `
            );
            remedios[i].nome = novoNome;
            console.log(chalk.green(`\nO nome do remédio foi atualizado`));
            break;
          case 2:
            let novoPreco = Number(
              prompt(`Qual será o novo preço do remédio ${remedios[i].nome}? `)
            );
            remedios[i].preco = novoPreco;
            console.log(chalk.green(`O preço do remédio foi atualizado`));
            break;
          case 3:
            let novaCategoria = prompt(
              `Qual será a nova categoria do remédio ${remedios[i].nome}? `
            );
            remedios[i].categoria = novaCategoria;
            console.log(chalk.green(`A Categoria do remédio foi atualizada`));
            break;
          case 4:
            let novaNecessidade = prompt(
              chalk.blue(
                `O remédio ${remedios[i].nome} irá precisar de receita?) (`
              ) +
                chalk.green(`S`) +
                chalk.blue(`/`) +
                chalk.red(`n`) +
                chalk.blue(")")
            );

            if (novaNecessidade.toLowerCase() == "s") {
              remedios[i].controlado = true;
              console.log(
                chalk.green(`Agora o remédio necessitará de receita`)
              );
            } else if (novaNecessidade.toLowerCase() == "n") {
              remedios[i].controlado = false;
              console.log(
                chalk.green(`Agora o remédio NÃO necessitará de receita`)
              );
            } else {
              console.log(chalk.red(`ERRO`));
            }
            break;
          case 5:
            let novaQuantidade = Number(
              prompt(
                `Qual será a nova quantidade do remédio ${remedios[i].nome}? `
              )
            );
            remedios[i].quantidade = novaQuantidade;
            console.log(chalk.green(`A quantidade do remédio foi atualizada`));
            break;
          default:
            console.log(chalk.red(`ERRO`));
            break;
        }
        salvarRemedios(remedios);
        break;
      }
    }
  } else {
    console.log(
      chalk.red("\nVocê não tem permissão para acessar essa funcionalidade")
    );
  }
}

function listarCategorias() {
  for (let index = 0; index < categorias.length; index++) {
    console.log(index + 1 + " - " + categorias[index]);
  }
}

function listarRemediosPorCategoria(categoriaEscolhida) {
  console.log(`\nVocê escolheu a categoria: ${categoriaEscolhida}`);
  console.log(
    chalk.blue(`\nAqui estão os remédios disponíveis dessa categoria:`)
  );
  let remediosCategoria = remedios.filter(
    (remedio) => remedio.categoria === categoriaEscolhida
  );
  for (let remedio of remediosCategoria) {
    console.log(
      `${remedio.id} - ${remedio.nome} - R$${remedio.preco.toFixed(
        2
      )} - Quantidade: ${remedio.quantidade}`
    );
  }
  return remediosCategoria;
}

function venda(carrinho) {
  do {
    console.log(chalk.blue("\nCategorias disponiveis: "));
    listarCategorias();
    let escolhaCategoria = Number(
      prompt(chalk.yellow("Digite o número da categoria que você deseja: "))
    );
    let categoriaEscolhida = categorias[escolhaCategoria - 1];
    let remediosCategoria = listarRemediosPorCategoria(categoriaEscolhida);

    let adicionarMaisRemedios = false;
    do {
      console.log("");
      let codigoRemedio = Number(
        prompt(chalk.yellow(`Digite o código do remédio que você deseja: `))
      );
      let remedioSelecionado = remediosCategoria.find(
        (remedio) => remedio.id === codigoRemedio
      );
      if (!remedioSelecionado) {
        console.log(
          chalk.red(
            `Este código não existe ou não pertence à categoria escolhida.`
          )
        );
      } else {
        if (remedioSelecionado.controlado) {
          let temReceita = prompt(
            `Você tem receita para ${remedioSelecionado.nome}? (s/n) `
          );
          if (temReceita.toLowerCase() === "s") {
            carrinho.push(remedioSelecionado);
          } else {
            console.log(
              chalk.red(
                `Você não pode adicionar ${remedioSelecionado.nome} ao carrinho sem receita.`
              )
            );
          }
        } else {
          carrinho.push(remedioSelecionado);
        }
      }
      console.log("");
      let continuar = prompt(
        chalk.yellow(`Deseja adicionar outro remédio desta categoria? (`) +
          chalk.green(`s`) +
          chalk.yellow(`/`) +
          chalk.red(`n`) +
          chalk.yellow(`) `)
      );
      adicionarMaisRemedios = continuar.toLowerCase() === "s";
    } while (adicionarMaisRemedios);

    console.log("");
    let continuarCategoria = prompt(
      chalk.yellow(`Deseja adicionar remédios de outra categoria? (`) +
        chalk.green(`s`) +
        chalk.yellow(`/`) +
        chalk.red(`n`) +
        chalk.yellow(`) `)
    );
    continuarComprando = continuarCategoria.toLowerCase() === "s";
  } while (continuarComprando);
}

function exibirRemedios(lista, acao) {
  console.log(chalk.bold(`Aqui estão os remédios que você ${acao}: `));
  for (let remedio of lista) {
    console.log(remedio.nome);
  }
}

function calcularTotal(lista) {
  let total = 0;
  for (let remedio of lista) {
    total += remedio.preco;
  }
  return total.toFixed(2);
}

// Carregar remédios do arquivo JSON
let loopPrincipalBool = true;
let remedios = listaRemedios();
let carrinho = [];
let categorias = [...new Set(remedios.map((remedio) => remedio.categoria))];
let continuarComprando = false;
logo();

function loopPrincipal() {
  while (loopPrincipalBool) {
    console.log(chalk.blue(`\nBem-vindo à FarmaTech!`));
    console.log(
      `\nO que você deseja fazer?\n1 - Criar Conta\n2 - Login\n3 - Sair`
    );
    let operacao = Number(
      prompt(chalk.yellow(`Digite o número referente a operação desejada: `))
    );
    switch (operacao) {
      case 1:
        criarFuncionario();
        salvarFuncionarios(funcionarios);
        break;
      case 2:
        let funcionario = loginFuncionario();
        if (funcionario) {
          logedOperations(funcionario);
        }
        break;
      case 3:
        console.log(chalk.green(`\nLogout realizado com sucesso. Até logo!`));
        break;
      default:
        return false;
        break;
    }
  }
}
loopPrincipal();

function logedOperations(funcionario) {
  while (true) {
    littleLogo();
    console.log(chalk.blue(`\n${funcionario.nome}, escolha uma opção:`));
    console.log(
      `\n1 - Vender\n2 - Atualizar Remédio (Apenas para administradores)\n3 - Ir para o Carrinho`
    );
    let operacao = Number(
      prompt(
        chalk.yellow(
          `Digite o número referente a operação a qual você irá realizar: `
        )
      )
    );
    switch (operacao) {
      case 1:
        venda(carrinho);
        break;
      case 2:
        updateMedicine(funcionario);
        break;
      default:
        loopPrincipalBool = false;
        return false;
    }
  }
}
console.log("");
exibirRemedios(carrinho, "selecionou");
console.log("");
let confirmaCompra = prompt(
  chalk.blue(`Você deseja concluir sua compra? (`) +
    chalk.green("s") +
    chalk.blue("/") +
    chalk.red("n") +
    chalk.blue(`) `)
);
if (confirmaCompra.toLowerCase() === "s") {
  console.log(chalk.green(`\nCompra realizada com sucesso!`));
  console.log("");
  exibirRemedios(carrinho, "comprou");
  let totalCompra = calcularTotal(carrinho);
  console.log(
    chalk.inverse(`\nO valor total da sua compra foi de: R$${totalCompra}`)
  );
  console.log("");
  agradecimento();
  logo();

  // Atualizar a quantidade dos remédios no estoque
  for (let remedio of carrinho) {
    let remedioEstoque = remedios.find((r) => r.id === remedio.id); // A função find é utilizada para procurar um elemento em um array que satisfaça a condição
    if (remedioEstoque) {
      remedioEstoque.quantidade -= 1; // Reduz a quantidade do remédio em 1 unidade
    }
  }
  salvarRemedios(remedios); // Salva as alterações de remedios no arquivo diretamente no JSON
} else {
  console.log(chalk.red(`\nCompra cancelada com sucesso!`));
  logo();
}

// criarFuncionario();
// salvarFuncionarios();
// loginFuncionario();
