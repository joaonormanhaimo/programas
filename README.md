# IMO · Programas de Acompanhamento

Página de apresentação dos programas de acompanhamento do **Instituto de Medicina Orgânica** (Intensivo, Completo e Básico). Tem comparador de economia, tabela comparativa e botões que abrem o WhatsApp da clínica com uma mensagem pronta.

É um site estático (HTML, CSS e JavaScript puro): não precisa de servidor, banco de dados nem instalação.

## Estrutura

```
index.html              → estrutura da página
assets/js/config.js     → PREÇOS, WHATSAPP, HORÁRIOS E TEXTOS (edite aqui)
assets/js/app.js        → cálculos e montagem da página (não precisa mexer)
assets/css/style.css    → visual (cores no topo do arquivo, em :root)
assets/img/            → logo do IMO (cabeçalho) e ícone da aba
.nojekyll               → evita processamento extra do GitHub Pages
```

## Publicar no GitHub Pages (passo a passo)

1. Entre em **github.com** → botão **New** (novo repositório).
2. Nome sugerido: `imo-programas`. Marque **Public**. Clique em **Create repository**.
3. Na página do repositório, clique em **uploading an existing file**.
4. Arraste **todo o conteúdo** desta pasta (o `index.html`, a pasta `assets` e o `.nojekyll`) e clique em **Commit changes**.
   - No Mac, o `.nojekyll` fica oculto. Pressione `Cmd + Shift + .` no Finder para exibi-lo. Se ele não subir, não tem problema: a página funciona sem ele.
5. Vá em **Settings → Pages**.
6. Em **Build and deployment → Source**, escolha **Deploy from a branch**. Em **Branch**, selecione `main` e a pasta `/ (root)`. Clique em **Save**.
7. Aguarde 1 a 2 minutos. O endereço aparece no topo da mesma tela:
   `https://SEU-USUARIO.github.io/imo-programas/`

### Domínio próprio (opcional)

Em **Settings → Pages → Custom domain**, informe algo como `programas.seudominio.com.br`. No painel do seu domínio, crie um registro **CNAME** apontando para `SEU-USUARIO.github.io`. Depois marque **Enforce HTTPS**.

## Como alterar preços ou textos

Tudo fica em `assets/js/config.js`. No GitHub, abra o arquivo, clique no ícone de lápis (**Edit**), faça a alteração e clique em **Commit changes**. A página se atualiza em cerca de 1 minuto.

Exemplos:

| Quero mudar…                        | Campo em `config.js`                            |
|-------------------------------------|-------------------------------------------------|
| Preço de um programa                | `programas[…].valor`                            |
| Número de consultas                 | `programas[…].consultas`                        |
| Valor por consulta arredondado      | `programas[…].valorConsultaExibido`             |
| Destaque "até X%" do topo           | `destaqueEconomia`                              |
| Valor da consulta avulsa            | `consultaAvulsa.valor`                          |
| Valor da primeira consulta          | `primeiraConsulta.valor`                        |
| Número do WhatsApp                  | `clinica.whatsapp` (só dígitos, com 55 + DDD)   |
| Dias/horário do telemonitoramento   | `telemonitoramento.dias` e `.horario`           |
| Desconto de renovação               | `programas[…].descontoRenovacao` (0 = sem)      |
| Mensagem que chega no WhatsApp      | `mensagens`                                     |

A economia, os percentuais e as parcelas são **recalculados automaticamente**. Atenção: se mudar o preço de um programa, atualize também o `valorConsultaExibido` dele (ou apague a linha para a página calcular sozinha) e o `destaqueEconomia`.

## Testar no computador antes de publicar

Basta dar dois cliques no `index.html`: ele abre no navegador.

## Observações

- O repositório é público: nunca coloque dados de pacientes aqui.
- A página não coleta nenhum dado. O contato acontece inteiramente pelo WhatsApp.
- Revise os textos com base nas normas de publicidade médica do CFM antes de divulgar.

---
Instituto de Medicina Orgânica · Goiânia · GO · Responsável técnico: Dr. João Carlos Normanha, CRM/GO 16888
