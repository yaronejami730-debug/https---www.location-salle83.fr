import "server-only";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { siteConfig } from "@/lib/site";
import type { PricingBracket, ExtraOption } from "@/lib/pricing";
import type { ClauseItem } from "@/lib/contract-template";
import { parseClauseBody, fillPriceTokens } from "@/lib/contract-template";

const styles = StyleSheet.create({
  page: { padding: 36, paddingBottom: 50, fontSize: 9, fontFamily: "Helvetica", color: "#2b2a26" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  logo: { width: 52, height: 52 },
  title: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  subtitle: { fontSize: 8, color: "#6b6a63", marginTop: 1 },
  section: { marginTop: 8 },
  heading: { marginTop: 8 },
  sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 3, color: "#6b7d5f" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  label: { color: "#6b6a63" },
  value: { fontFamily: "Helvetica-Bold" },
  table: { marginTop: 4, borderWidth: 1, borderColor: "#e5e2da" },
  tHeadRow: { flexDirection: "row", backgroundColor: "#f2ede4", borderBottomWidth: 1, borderBottomColor: "#e5e2da" },
  tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e2da" },
  tRowLast: { flexDirection: "row" },
  tCell: { flex: 1, padding: 4, fontSize: 7.5 },
  tCellHead: { flex: 1, padding: 4, fontSize: 7.5, fontFamily: "Helvetica-Bold" },
  tCellActive: { flex: 1, padding: 4, fontSize: 7.5, fontFamily: "Helvetica-Bold" },
  tCellHighlight: {
    flex: 1,
    padding: 4,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#6b7d5f",
    color: "#ffffff",
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6, paddingTop: 5, borderTopWidth: 1, borderTopColor: "#2b2a26" },
  totalLabel: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  totalValue: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#6b7d5f" },
  paragraph: { marginBottom: 3, lineHeight: 1.25 },
  bullet: { flexDirection: "row", marginBottom: 1.5 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1, lineHeight: 1.2 },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, fontSize: 7.5, color: "#9a988f", textAlign: "center" },
  pageNumber: { position: "absolute", bottom: 24, right: 40, fontSize: 7.5, color: "#9a988f" },
  headerRight: { alignItems: "center" },
  qrCode: { width: 52, height: 52, marginTop: 6 },
  clientCard: { marginTop: 8, padding: 10, borderWidth: 1, borderColor: "#e5e2da", borderRadius: 4, backgroundColor: "#faf8f4" },
  clientName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  clientLine: { fontSize: 8.5, color: "#6b6a63", marginBottom: 1.5 },
});

export type ContractPdfProps = {
  reference: string;
  civility: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  eventDate: string;
  guestCount: number;
  bracket: PricingBracket;
  /** Every bracket, for the full pricing table (ordered) — the live grid from pricing_brackets, not a fixed copy. */
  allBrackets: PricingBracket[];
  lineItems: { label: string; amount: number }[];
  total: number;
  arrhes: number;
  logoDataUri: string | null;
  qrCodeDataUri: string | null;
  options: { lendemain: boolean; piscine: boolean; vaisselle: boolean; cuisine: boolean; chapiteauCount: number };
  chapiteauUnitPrice: number;
  /** Options supplémentaires définies dans l'admin (colonnes en plus du chapiteau dans le tableau) et celles cochées pour ce dossier. */
  extraOptions?: ExtraOption[];
  extraIds?: string[];
  /** Titre et texte d'introduction de la clause 1 (éditables) — voir resolveClause1(). */
  clause1Title: string;
  clause1Intro: string;
  /** Resolved clause list (already merged with defaults) — see resolveClauses() in contract-template.ts. */
  clauses: ClauseItem[];
  clause1PageBreak?: boolean;
  signaturePageBreak?: boolean;
};

function ClauseBody({ body }: { body: string }) {
  return (
    <>
      {parseClauseBody(body).map((line, i) =>
        line.type === "bullet" ? (
          <Bullet key={i}>{line.content}</Bullet>
        ) : (
          <Text key={i} style={styles.paragraph}>
            {line.content}
          </Text>
        ),
      )}
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

// Title + its first line of body wrapped together (wrap={false}) so a numbered
// section heading can never land alone at the bottom of a page with its body
// pushed to the next one.
function Heading({ number, title, children, pageBreak }: { number: string; title: string; children?: React.ReactNode; pageBreak?: boolean }) {
  return (
    <View style={styles.heading} wrap={false} break={pageBreak}>
      <Text style={styles.sectionTitle}>
        {number}) {title}
      </Text>
      {children}
    </View>
  );
}

export function ContractPdfDocument({
  reference,
  civility,
  fullName,
  address,
  phone,
  email,
  eventDate,
  guestCount,
  bracket,
  allBrackets,
  lineItems,
  total,
  arrhes,
  logoDataUri,
  qrCodeDataUri,
  options,
  chapiteauUnitPrice,
  extraOptions = [],
  extraIds = [],
  clause1Title,
  clause1Intro,
  clauses,
  clause1PageBreak,
  signaturePageBreak,
}: ContractPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} fixed>
          <View>
            <Text style={styles.title}>CONTRAT DE LOCATION SALLE</Text>
            <Text style={styles.subtitle}>{siteConfig.name.toUpperCase()}</Text>
            <Text style={styles.subtitle}>N° de demande : {reference}</Text>
          </View>
          <View style={styles.headerRight}>
            {logoDataUri && <Image src={logoDataUri} style={styles.logo} />}
            {qrCodeDataUri && <Image src={qrCodeDataUri} style={styles.qrCode} />}
          </View>
        </View>

        <Text style={styles.paragraph}>
          Ce contrat est établi entre la Société PACIFIC COTE D&apos;AZUR{"\n"}
          {siteConfig.name.toUpperCase()}, sise au N° {siteConfig.address}{"\n"}
          Portable : {siteConfig.phone} – {siteConfig.email}{"\n"}
          www.domainedelabegude.com et www.location-salle83.fr
        </Text>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>ET :</Text>
          <View style={styles.clientCard}>
            <Text style={styles.clientName}>
              {civility ? `${civility} ` : ""}
              {fullName || "……………………………"}
            </Text>
            <Text style={styles.clientLine}>Domicilié(e) à : {address || "……………………………"}</Text>
            <Text style={styles.clientLine}>Tél / Port : {phone || "……………………………"}</Text>
            <Text style={styles.clientLine}>Email : {email || "……………………………"}</Text>
          </View>
        </View>

        <View style={styles.section} break={clause1PageBreak}>
          <Text style={styles.sectionTitle}>1) {fillPriceTokens(clause1Title, allBrackets, chapiteauUnitPrice)}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{eventDate || "……… / ……… / 2026"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre de personnes occupant et entrant dans le domaine pour l&apos;événement</Text>
            <Text style={styles.value}>{guestCount || "……"}</Text>
          </View>
          <View style={{ marginTop: 4 }}>
            <ClauseBody body={fillPriceTokens(clause1Intro, allBrackets, chapiteauUnitPrice)} />
          </View>

          <View style={styles.table}>
            <View style={styles.tHeadRow}>
              <Text style={styles.tCellHead}>Personnes</Text>
              <Text style={styles.tCellHead}>La Salle</Text>
              <Text style={styles.tCellHead}>Lendemain</Text>
              <Text style={styles.tCellHead}>Piscine</Text>
              <Text style={styles.tCellHead}>Vaisselle</Text>
              <Text style={styles.tCellHead}>Cuisine</Text>
              <Text style={styles.tCellHead}>Chapiteau</Text>
              {extraOptions.map((o) => (
                <Text key={o.id} style={styles.tCellHead}>
                  {o.label}
                </Text>
              ))}
            </View>
            {allBrackets.map((b, i) => {
              const active = b.key === bracket.key;
              const isLast = i === allBrackets.length - 1;
              const base = active ? styles.tCellActive : styles.tCell;
              const cellStyle = (selected: boolean) => (active && selected ? styles.tCellHighlight : base);
              return (
                <View key={b.key} style={isLast ? styles.tRowLast : styles.tRow}>
                  <Text style={base}>{b.label}</Text>
                  <Text style={cellStyle(true)}>{b.salle} €</Text>
                  <Text style={cellStyle(options.lendemain)}>{b.lendemain} €</Text>
                  <Text style={cellStyle(options.piscine)}>{b.piscine} €</Text>
                  <Text style={cellStyle(options.vaisselle)}>{b.vaisselle} €</Text>
                  <Text style={cellStyle(options.cuisine)}>{b.cuisine} €</Text>
                  <Text style={cellStyle(options.chapiteauCount > 0)}>{chapiteauUnitPrice} €/Pièce</Text>
                  {extraOptions.map((o) => (
                    <Text key={o.id} style={cellStyle(extraIds.includes(o.id))}>
                      {o.price} €
                    </Text>
                  ))}
                </View>
              );
            })}
          </View>

          <View style={{ marginTop: 12 }} wrap={false}>
            <Text style={styles.sectionTitle}>Options choisies pour cette proposition ({bracket.label})</Text>
            <View style={styles.table}>
              <View style={styles.tRow}>
                <Text style={[styles.tCell, { flex: 2 }]}>Forfait salle</Text>
                <Text style={[styles.tCell, { textAlign: "right", fontFamily: "Helvetica-Bold" }]}>{bracket.salle} €</Text>
              </View>
              {lineItems.map((item, i) => (
                <View key={item.label} style={i === lineItems.length - 1 ? styles.tRowLast : styles.tRow}>
                  <Text style={[styles.tCell, { flex: 2 }]}>{item.label}</Text>
                  <Text style={[styles.tCell, { textAlign: "right", fontFamily: "Helvetica-Bold" }]}>{item.amount} €</Text>
                </View>
              ))}
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Montant Total</Text>
              <Text style={styles.totalValue}>{total} €</Text>
            </View>
          </View>
        </View>

        {clauses.map((c, i) => (
          <Heading key={c.id} number={String(i + 2)} title={fillPriceTokens(c.title, allBrackets, chapiteauUnitPrice)} pageBreak={c.pageBreak}>
            {c.special === "arrhes" ? (
              <View style={styles.row}>
                <Text style={styles.label}>{fillPriceTokens(c.body, allBrackets, chapiteauUnitPrice)}</Text>
                <Text style={styles.value}>{arrhes} €</Text>
              </View>
            ) : (
              <ClauseBody body={fillPriceTokens(c.body, allBrackets, chapiteauUnitPrice)} />
            )}
          </Heading>
        ))}

        <View style={styles.section} wrap={false} break={signaturePageBreak}>
          <Text style={styles.paragraph}>Fayence, le _______________</Text>
          <Text style={[styles.paragraph, { marginTop: 16, fontFamily: "Helvetica-Bold" }]}>« Bon pour acceptation »</Text>
          <View style={[styles.row, { marginTop: 24 }]}>
            <Text>Le locataire,</Text>
            <Text>Le bailleur,</Text>
          </View>
          <Text style={[styles.paragraph, { marginTop: 30, fontSize: 8, color: "#9a988f" }]}>
            Ps : Veuillez également parapher chaque page du contrat.
          </Text>
        </View>

        <Text style={styles.footer} fixed>
          {siteConfig.name} — {siteConfig.address} — {siteConfig.phone} — {siteConfig.email}
        </Text>
        <Text
          style={styles.pageNumber}
          fixed
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>
    </Document>
  );
}
