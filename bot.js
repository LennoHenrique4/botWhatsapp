const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode-terminal');

// Cria uma nova instância do cliente
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Armazena o status de resposta de cada usuário para evitar respostas duplicadas
const userStatus = new Map();

// Gera QR code quando o cliente estiver pronto
client.on('qr', (qr) => {
    QRCode.generate(qr, { small: true });
});

// Evento chamado quando o cliente estiver autenticado
client.on('authenticated', () => {
    console.log('Cliente autenticado com sucesso!');
});

// Evento chamado quando uma mensagem é recebida
client.on('message', message => {
    const msg = message.body.toLowerCase();
    const chatId = message.from;

    // Checa se o usuário já escolheu uma opção
    if (!userStatus.has(chatId)) {
        userStatus.set(chatId, { greeted: false, optionChhosen: false});
    }

    const status = userStatus.get(chatId);

    // Responde a saudações e apresenta as opções
    if (['olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'oi'].includes(msg) && !status.greeted) {
        message.reply('Olá! Eu sou Henrique, o atendente virtual da Oi. Como eu posso ajudar você?\n\nEscolha abaixo a opção que você deseja:\n\n1. Quero saber sobre os planos da Oi.\n2. Tirar dúvidas direto com um Consultor da Oi.');
        status.geeted = true;
    }

    // Responde à escolha de opções somente se o usuário ainda não escolheu uma
    else if (msg === '1' && !status.optionChhosen) {
        message.reply('A Oi Fibra oferece diferentes planos para atender às suas necessidades, seja para navegar com velocidade, assistir seus filmes e séries favoritos ou até mesmo para o seu negócio.\n\n*500 Mega:* Ideal para quem busca uma internet rápida para navegar, assistir vídeos e realizar tarefas do dia a dia. O preço, como você viu, é de *R$89,90 por mês no cartão de crédito* e se for pagar pelo *Boleto ou Cartão de Debito o valor fica por R$109,90 por mês*.\n\n *700 Mega:* Perfeito para quem gosta de jogar online, fazer streaming em alta qualidade e precisa de uma conexão mais estável. Além disso, ao contratar esse plano, você ganha 3 meses de acesso gratuito ao Paramount+, uma plataforma de streaming com filmes, séries e muito mais. O preço é de R$109,90 por mês no cartão de crédito e se for pagar pelo *Boleto ou Cartão de Debito o valor fica por R$129,90 por mês*.\n\n*1 Giga:* A melhor opção para quem precisa de uma internet super rápida e sem limites, ideal para grandes downloads e streaming em alta qualidade. O preço é de R$159,90 por mês no cartão de crédito e se for pagar pelo *Boleto ou Cartão de Debito o valor fica por R$179,90 por mês*.\n\n *Paramount+:* "Ao contratar o plano de 700 Mega ou superior", você ganha 3 meses de acesso gratuito ao Paramount+, uma plataforma de streaming com filmes, séries e muito mais.*Globoplay:* "Em qualquer plano", você pode adicionar o Globoplay com condições especiais, para ter acesso a uma grande variedade de conteúdos.\n\nPara seu Negócio:\nA Oi também oferece soluções para quem tem um negócio, como a maquininha de cartão em comodato sem custo, com taxas exclusivas para diversas formas de pagamento.');
    } else if (msg === '2'&& !status.optionChhosen) {
        message.reply('OK! Aguarde 1 minuto, já estamos solicitando um *Consultor Oi* para falar com você!');
        status.optionChhosen = true;
    }


});


// Inicia o cliente
client.initialize();
