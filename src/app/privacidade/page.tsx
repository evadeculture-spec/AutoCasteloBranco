import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/config/site";
import { emailLabel } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Política de privacidade",
  description: "Como a Castelo Branco Auto trata os dados pessoais enviados através deste website.",
  path: "/privacidade",
});

/*
 * MINUTA — deve ser revista e completada pelo responsável pelo tratamento
 * (idealmente com apoio jurídico) antes da publicação.
 */
export default function PrivacyPage() {
  const controller = site.legal.name ?? "[Denominação social por configurar]";
  const nif = site.legal.nif ?? "[NIF por configurar]";

  const sections: Array<{ title: string; body: React.ReactNode }> = [
    {
      title: "Responsável pelo tratamento",
      body: (
        <p>
          {controller}, NIF {nif}, com contacto através de {emailLabel()}.
        </p>
      ),
    },
    {
      title: "Que dados recolhemos",
      body: (
        <p>
          Apenas os dados que nos envia nos formulários: nome, telefone e/ou email, a mensagem e — conforme o pedido — a
          viatura de interesse, a marca e o modelo do seu veículo, o serviço pretendido e uma data preferencial.
        </p>
      ),
    },
    {
      title: "Para que os usamos",
      body: (
        <p>
          Exclusivamente para responder ao seu pedido de informação, contacto ou marcação. A base legal é o seu consentimento e
          as diligências pré-contratuais a seu pedido (artigo 6.º, n.º 1, alíneas a) e b) do RGPD).
        </p>
      ),
    },
    {
      title: "Durante quanto tempo",
      body: <p>Pelo tempo necessário para tratar o pedido e, depois, pelo prazo que vier a ser definido pela empresa. [Prazo por definir]</p>,
    },
    {
      title: "Partilha de dados",
      body: (
        <p>
          Não vendemos nem cedemos os seus dados. Podem ser tratados por prestadores de serviços técnicos (alojamento do
          website, receção de pedidos) apenas na medida necessária. [Identificar prestadores quando configurados]
        </p>
      ),
    },
    {
      title: "Cookies e estatísticas",
      body: (
        <p>
          Este website não utiliza cookies de publicidade nem ferramentas de estatística por defeito. Caso venham a ser
          utilizadas, só serão ativadas com o seu consentimento prévio.
        </p>
      ),
    },
    {
      title: "Os seus direitos",
      body: (
        <p>
          Pode pedir o acesso, retificação, apagamento, limitação ou portabilidade dos seus dados, opor-se ao tratamento e
          retirar o consentimento a qualquer momento, através de {emailLabel()}. Pode ainda apresentar reclamação à Comissão
          Nacional de Proteção de Dados (CNPD).
        </p>
      ),
    },
  ];

  return (
    <section aria-labelledby="privacidade-title" className="container-x py-14 lg:py-20">
      <SectionLabel className="text-muted">Informação legal</SectionLabel>
      <h1 id="privacidade-title" className="font-display mt-8 text-[clamp(2.4rem,5vw,4.4rem)] leading-none font-bold">
        Política de privacidade
      </h1>
      <p className="label mt-8 inline-block border border-accent/40 px-2 py-1 leading-relaxed text-accent">
        Minuta por validar — completar os campos entre parênteses retos antes de publicar
      </p>
      <div className="mt-14 grid max-w-3xl gap-10">
        {sections.map((s, i) => (
          <section key={s.title} className="grid gap-3 border-t border-ink/15 pt-6 sm:grid-cols-[3.5rem_1fr]">
            <span className="label tabular pt-1.5 text-muted">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="font-display text-[1.35rem] font-semibold">{s.title}</h2>
              <div className="mt-3 leading-relaxed text-muted">{s.body}</div>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
