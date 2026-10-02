// Conteúdo da página. Tudo aqui veio do site atual (egocorp.com.br),
// exceto os textos dos pilares E-G-O, que são rascunho para a Ego validar.

export const WHATSAPP_NUMBER = "5512988970878";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Vim pelo site da EGO CORP.",
)}`;
export const EMAIL = "egocorporations@gmail.com";
export const INSTAGRAM_URL = "https://www.instagram.com/egocorporation/";

export const PILLARS = [
  {
    letter: "E",
    label: "Explosive",
    title: "Criativo que para o scroll.",
    text: "Ideias subversivas, direção de arte e vídeo feitos para a sua marca ser a primeira lembrada.",
  },
  {
    letter: "G",
    label: "Genuine",
    title: "Estratégia com a cara da sua marca.",
    text: "Nada de template. Posicionamento, conteúdo e identidade partem do que só o seu negócio tem.",
  },
  {
    letter: "O",
    label: "Obsessive",
    title: "Obsessão por resultado.",
    text: "Tráfego, mensuração e otimização contínua. Cada campanha é medida, ajustada e medida de novo.",
  },
] as const;

export const MANIFESTO =
  "Com mais de 10 anos de experiência conjunta, a Ego Corp existe para provar que agência é passado. Somos uma produtora, ousamos no presente e moldamos o futuro das marcas que sabem que seu ego merece destaque.";

export const SERVICES = [
  {
    name: "Marketing para Redes Sociais",
    items: [
      "Planejamento de Conteúdo",
      "Criação de Posts & Reels",
      "Direção Criativa & Estratégia",
      "Gestão de Comunidade",
    ],
  },
  {
    name: "Edição & Captação de Vídeos",
    items: [
      "Captação Profissional",
      "Edição & Motion Design",
      "Roteiro & Direção",
      "Pós-produção",
    ],
  },
  {
    name: "Gestão de Tráfego Pago",
    items: [
      "Planejamento de Campanhas",
      "Gestão de Anúncios (Meta / Google)",
      "Otimização & Mensuração de Resultados",
      "Relatórios & Análises",
    ],
  },
  {
    name: "Desenvolvimento de Sites",
    items: [
      "Landing Pages & Institucionais",
      "UX/UI Design",
      "Integrações & Otimização",
      "Manutenção & Performance",
    ],
  },
  {
    name: "Email Marketing",
    items: [
      "Estratégia de Comunicação",
      "Criação de Copy & Layout",
      "Automação & Fluxos",
      "Análise & Otimização de Campanhas",
    ],
  },
  {
    name: "Desenvolvimento de E-books",
    items: [
      "Roteiro & Conteúdo Editorial",
      "Design Editorial",
      "Identidade Visual do Material",
      "Versões Interativas e PDF",
    ],
  },
  {
    name: "Mídia Indoor & Outdoor",
    items: [
      "Planejamento de Campanhas",
      "Criação de Artes & Peças",
      "Estratégia de Impacto Local",
      "Produção & Direcionamento de Instalação",
    ],
  },
];

// Por enquanto as peças são carregadas direto do site atual da Ego.
// Antes de publicar, copie os arquivos para /public/portfolio e troque os caminhos.
const UPLOADS = "https://egocorp.com.br/wp-content/uploads/2025/11/";
export const PORTFOLIO = [
  "SITE-819x1024.jpg",
  "post-barbearia-819x1024.jpg",
  "QUAL-VINIL-VC-LEVARIA-819x1024.jpg",
  "POST-SEXTOU-819x1024.jpg",
  "caixa-819x1024.jpg",
  "apocalipse_sonoro-819x1024.jpg",
  "CORTE-DOMICILIO-819x1024.jpg",
  "Sintonize-a-vibe-certa-819x1024.jpg",
  "kit-sobrevivencia-819x1024.jpg",
  "conectando-futuro-do-vinil-819x1024.jpg",
  "catalogo-819x1024.jpg",
  "anuncie-819x1024.jpg",
].map((file) => UPLOADS + file);

export const FEEDBACKS = [
  {
    quote:
      "Super recomendo a Ego! Profissionais competentes, trabalho de qualidade e atendimento impecável.",
    name: "Roman Barbearia",
    where: "Barbearia, SJCampos (SP)",
  },
  {
    quote:
      "Resolveram problemas que muitos não conseguiram, entregam resultados realmente impactantes.",
    name: "Ary Barroso",
    where: "Escola de Música, SJCampos (SP)",
  },
  {
    quote:
      "Serviço excelente! Criativos e vídeos com bons resultados, entrega rápida e criatividade impressionante.",
    name: "Forte Truck Center",
    where: "Centro Automotivo, Taubaté (SP)",
  },
  {
    quote:
      "Com a Ego, ganhamos presença online e proximidade com os ouvintes. Equipe criativa e estratégica.",
    name: "Beira Mar",
    where: "Rádio de Ubatuba (SP)",
  },
  {
    quote:
      "Foi sorte e oportunidade. A Ego entendeu minha necessidade e hoje tudo flui com ótimos resultados.",
    name: "Vloot Discos",
    where: "Clube de assinatura",
  },
  {
    quote:
      "A Ego, mesmo sendo nova, tem muita experiência. Criaram minha logo com excelência e fiquei muito satisfeita.",
    name: "Padoka",
    where: "Pães & Bolos Artesanais",
  },
];
