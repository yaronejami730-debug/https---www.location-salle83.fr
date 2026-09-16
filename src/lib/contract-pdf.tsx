import "server-only";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { siteConfig } from "@/lib/site";
import type { PricingBracket } from "@/lib/pricing";

const styles = StyleSheet.create({
  page: { padding: 36, paddingBottom: 50, fontSize: 9, fontFamily: "Helvetica", color: "#2b2a26" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  logo: { width: 52, height: 52 },
  title: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  subtitle: { fontSize: 8, color: "#6b6a63", marginTop: 1 },
  section: { marginTop: 8 },
  sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 3, color: "#6b7d5f" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  label: { color: "#6b6a63" },
  value: { fontFamily: "Helvetica-Bold" },
  table: { marginTop: 4, borderWidth: 1, borderColor: "#e5e2da" },
  tHeadRow: { flexDirection: "row", backgroundColor: "#f2ede4", borderBottomWidth: 1, borderBottomColor: "#e5e2da" },
  tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e2da" },
  tRowLast: { flexDirection: "row" },
  tRowActive: { flexDirection: "row", backgroundColor: "#eef1ea", borderBottomWidth: 1, borderBottomColor: "#e5e2da" },
  tCell: { flex: 1, padding: 4, fontSize: 7.5 },
  tCellHead: { flex: 1, padding: 4, fontSize: 7.5, fontFamily: "Helvetica-Bold" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6, paddingTop: 5, borderTopWidth: 1, borderTopColor: "#2b2a26" },
  totalLabel: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  totalValue: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#6b7d5f" },
  paragraph: { marginBottom: 3, lineHeight: 1.25 },
  bullet: { flexDirection: "row", marginBottom: 1.5 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1, lineHeight: 1.2 },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, fontSize: 7.5, color: "#9a988f", textAlign: "center" },
  pageNumber: { position: "absolute", bottom: 24, right: 40, fontSize: 7.5, color: "#9a988f" },
});

export type ContractPdfProps = {
  reference: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  eventDate: string;
  guestCount: number;
  bracket: PricingBracket;
  lineItems: { label: string; amount: number }[];
  total: number;
  arrhes: number;
  logoDataUri: string | null;
};

const ALL_BRACKETS: PricingBracket[] = [
  { key: "40", label: "-40 Pers", maxGuests: 40, salle: 1700, lendemain: 250, piscine: 150, vaisselle: 110, cuisine: 200 },
  { key: "50", label: "-50 Pers", maxGuests: 50, salle: 1800, lendemain: 250, piscine: 150, vaisselle: 110, cuisine: 200 },
  { key: "65", label: "-65 Pers", maxGuests: 65, salle: 1950, lendemain: 300, piscine: 200, vaisselle: 120, cuisine: 230 },
  { key: "80", label: "-80 Pers", maxGuests: 80, salle: 2100, lendemain: 350, piscine: 250, vaisselle: 130, cuisine: 250 },
  { key: "95", label: "-95 Pers", maxGuests: 95, salle: 2250, lendemain: 400, piscine: 300, vaisselle: 140, cuisine: 270 },
  { key: "110", label: "-110 Pers", maxGuests: 110, salle: 2400, lendemain: 450, piscine: 350, vaisselle: 150, cuisine: 290 },
];

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export function ContractPdfDocument({
  reference,
  fullName,
  address,
  phone,
  email,
  eventDate,
  guestCount,
  bracket,
  lineItems,
  total,
  arrhes,
  logoDataUri,
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
          {logoDataUri && <Image src={logoDataUri} style={styles.logo} />}
        </View>

        <Text style={styles.paragraph}>
          Ce contrat est établi entre la Société PACIFIC COTE D&apos;AZUR{"\n"}
          {siteConfig.name.toUpperCase()}, sise au N° {siteConfig.address}{"\n"}
          Portable : {siteConfig.phone} – {siteConfig.email}{"\n"}
          www.domainedelabegude.com et www.location-salle83.fr
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ET :</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Mr et Mme</Text>
            <Text style={styles.value}>{fullName || "……………………………"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Domicilié à</Text>
            <Text style={styles.value}>{address || "……………………………"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tél / Port</Text>
            <Text style={styles.value}>{phone || "……………………………"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email || "……………………………"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1) EVENEMENT :</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{eventDate || "……… / ……… / 2026"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre de personnes occupant et entrant dans le domaine pour l&apos;événement</Text>
            <Text style={styles.value}>{guestCount || "……"}</Text>
          </View>
          <Text style={[styles.paragraph, { marginTop: 4 }]}>
            Les Tarifs et les Options : (En fonction du nombre de personnes le jour de l&apos;évènement) Enfants
            comme adultes sont comptabilisés.{"\n"}
            (FORFAIT SALLE MINIMUM de 1700 euros, Sauf le 31 Décembre 1800 Euros).
          </Text>

          <View style={styles.table}>
            <View style={styles.tHeadRow}>
              <Text style={styles.tCellHead}>Personnes</Text>
              <Text style={styles.tCellHead}>La Salle</Text>
              <Text style={styles.tCellHead}>Lendemain</Text>
              <Text style={styles.tCellHead}>Piscine</Text>
              <Text style={styles.tCellHead}>Vaisselle</Text>
              <Text style={styles.tCellHead}>Cuisine</Text>
              <Text style={styles.tCellHead}>Chapiteau</Text>
            </View>
            {ALL_BRACKETS.map((b, i) => {
              const active = b.key === bracket.key;
              const isLast = i === ALL_BRACKETS.length - 1;
              return (
                <View key={b.key} style={active ? styles.tRowActive : isLast ? styles.tRowLast : styles.tRow}>
                  <Text style={active ? styles.tCellHead : styles.tCell}>{b.label}</Text>
                  <Text style={active ? styles.tCellHead : styles.tCell}>{b.salle} €</Text>
                  <Text style={active ? styles.tCellHead : styles.tCell}>{b.lendemain} €</Text>
                  <Text style={active ? styles.tCellHead : styles.tCell}>{b.piscine} €</Text>
                  <Text style={active ? styles.tCellHead : styles.tCell}>{b.vaisselle} €</Text>
                  <Text style={active ? styles.tCellHead : styles.tCell}>{b.cuisine} €</Text>
                  <Text style={active ? styles.tCellHead : styles.tCell}>200 €/Pièce</Text>
                </View>
              );
            })}
          </View>

          <View style={{ marginTop: 12 }}>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2) MENAGE :</Text>
          <Text style={styles.paragraph}>Le ménage doit être fait par le locataire</Text>
          <Text style={styles.paragraph}>Ou payé selon l&apos;état de la salle : Tarif en vigueur = 30 € de l&apos;heure</Text>

          <Text style={styles.sectionTitle}>3) MONTANT CAUTION :</Text>
          <Text style={styles.paragraph}>
            500 EUROS en espèces payable d&apos;avance à la prise en charge de la salle et restituée au départ,
            déduction faite éventuellement des détériorations occasionnées, des objets manquants et du nettoyage
            selon l&apos;état des lieux.
          </Text>

          <Text style={styles.sectionTitle}>4) ATTESTATION D&apos;ASSURANCE :</Text>
          <Text style={styles.paragraph}>
            Avertir votre assureur de l&apos;événement, (gratuit dans la plupart des cas). Fournir l&apos;attestation
            de responsabilité civile.
          </Text>

          <Text style={styles.sectionTitle}>5) PRISE EN CHARGE DE LA SALLE ET DE LA CUISINE :</Text>
          <Text style={styles.paragraph}>
            La salle peut être prise la veille de l&apos;évènement à partir de 9 h, jusqu&apos;à 19 h afin
            d&apos;approvisionner les réfrigérateurs et de décorer la salle.
          </Text>
          <Text style={styles.paragraph}>
            Possibilité de brancher une sono dans une salle prévue à cet effet. L&apos;équipement de la
            sonorisation devra être adapté à la dimension de la salle pour ne pas créer de nuisance sonore selon la
            législation en vigueur.
          </Text>
          <Text style={styles.paragraph}>
            Le jour de l&apos;évènement, la fête peut durer jusqu&apos;à 4 heures du matin mais la musique devra
            être baissée de façon conséquente ou certaines portes et fenêtres seront fermées à partir de 23H30 afin
            de préserver la tranquillité des résidents et selon la législation en vigueur.
          </Text>

          <Text style={styles.sectionTitle}>6) EQUIPEMENTS DE LA SALLE ET DE LA CUISINE :</Text>
          <Text style={styles.paragraph}>Tarif en fonction du Nombre de personnes (voir le tableau en première page)</Text>
          <Text style={styles.paragraph}>
            Supplément utilisation de la cuisine forfait de 200 à 290 euros. Une cuisine professionnelle de 49 M²
            pour orchestrer vos repas.
          </Text>
          <Bullet>Cinq frigos pour le stockage de toutes vos denrées alimentaires.</Bullet>
          <Bullet>Une machine à Glaçons</Bullet>
          <Bullet>Deux pianos de cuisson.</Bullet>
          <Bullet>Deux Gaz pour faire vos cuissons.</Bullet>
          <Bullet>Deux fours (un Gaz et un électrique) — Gaz en Bouteille non inclus, à voir ensemble selon vos besoins.</Bullet>
          <Bullet>Deux fours micro-ondes</Bullet>
          <Bullet>Salamandre</Bullet>
          <Bullet>Deux étuves de petite taille.</Bullet>
          <Bullet>Un espace plonge équipée (Machine à laver et d&apos;un double évier en inox)</Bullet>
        </View>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Supplément utilisation de la vaisselle forfait de 110 à 150 euros. (sur demande la vaisselle :
            assiettes, verres, couverts). Un inventaire sera signé par le locataire.
          </Text>
          <Text style={styles.paragraph}>
            Utilisation en Extérieur : Supplément pour la location des chaises Blanches soit 1 euro pièce. Et les
            rendre nettoyées !
          </Text>
          <Text style={styles.paragraph}>Supplément Le lendemain Forfait de 250 à 450 Euros</Text>
          <Text style={styles.paragraph}>Supplément Accès Piscine Forfait de 150 à 350 Euros</Text>
          <Text style={styles.paragraph}>
            Supplément « aucun Gîte réservé » Forfait de 500 Euros. Ce supplément est toutefois possible
            d&apos;être annulé en partie ou totalement dans le cas où vous louez des logements dans le Domaine de
            la Bégude. Exemple : Un logement loué vous permettra d&apos;avoir une remise de 10% sur cette option
            unique. Ex : Cinq Logements 50% de remise sur cette option, et à partir de 10 logements réservés sur le
            domaine, ceci vous permettra l&apos;annulation de ce supplément de 500 euros.
          </Text>
          <Text style={styles.paragraph}>Inclus dans le tarif :</Text>
          <Bullet>
            La salle de 90 M² est aménagée de tables rectangulaires ou rondes avec les chaises. Soit : 5 Tables
            Rondes d&apos;un diamètre de 180 pour 12 personnes maxi, + 6 Tables Rondes d&apos;un diamètre de 152
            pour 8 personnes.
          </Bullet>
          <Bullet>Double sanitaires avec sas.</Bullet>
          <Bullet>Ainsi qu&apos;une terrasse de 90 M².</Bullet>
          <Bullet>Incluse Piste de danse en plus de 60 m² (pour les événements de plus de 65 Pers Gratuit).</Bullet>

          <Text style={styles.sectionTitle}>7) MONTANT ARRHES :</Text>
          <View style={styles.row}>
            <Text style={styles.label}>50 % du montant total payable le jour de la réservation, (non remboursées en cas d&apos;annulation)</Text>
            <Text style={styles.value}>{arrhes} €</Text>
          </View>

          <Text style={styles.sectionTitle}>8) HYGIENE ET PROPRETE :</Text>
          <Bullet>Interdiction de fumer dans salle</Bullet>
          <Bullet>
            Les mégots doivent être éteints soigneusement dans les cendriers placés sur la terrasse et non pas
            jetés au sol afin de respecter les lieux et la nature environnante
          </Bullet>
          <Bullet>
            Les poubelles sont situées à l&apos;entrée de la Résidence et tous les détritus doivent y être déposés
            dans des sacs poubelles à la fin de la manifestation. De plus, il est obligatoire de faire le tri du
            verre et du plastique durant votre séjour. La direction du Domaine de la Begude se réserve le droit de
            conserver la totalité de la caution en cas de non-respect des règles.
          </Bullet>
          <Bullet>Règlement de la Piscine : Horaire d&apos;ouverture 9H à 20H</Bullet>
        </View>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            La piscine n&apos;étant pas surveillée, nous prions les parents de bien vouloir accompagner les enfants
            de moins de 15 ans, même s&apos;ils savent nager. Un accident est si vite arrivé ! Le Bailleur décline
            toute responsabilité éventuelle. Vous êtes priés d&apos;informer vos invités du règlement de la
            Piscine.
          </Text>
          <Bullet>De vous déchausser à l&apos;entrée et de laisser vos chaussures de chaque côté de l&apos;escalier dans le gazon</Bullet>
          <Bullet>De tremper vos pieds dans le pédiluve à chaque fois que vous entrez en piscine.</Bullet>
          <Bullet>De vous doucher obligatoirement avant chaque baignade (de la tête aux pieds)</Bullet>
          <Bullet>
            Interdits en piscine : Les contenants en Verre, les sodas, l&apos;alcool, les chiens, de fumer (toutes
            cigarettes même vapotage), la nourriture en général (excepté l&apos;eau en bouteille plastique)
          </Bullet>
          <Bullet>La musique est interdite en Piscine.</Bullet>
          <Bullet>De ranger les transats utilisés et de les mettre en position horizontale lors de votre départ.</Bullet>
          <Bullet>
            Durant votre absence sur les lieux, il est interdit de laisser vos serviettes de bains sur les
            transats afin de les réserver.
          </Bullet>
          <Bullet>Tout manquement à ces règles entrainera la fermeture de la Piscine immédiate.</Bullet>

          <Text style={styles.sectionTitle}>9) CHAPITEAU :</Text>
          <Text style={styles.paragraph}>Couvre une belle partie de la terrasse extérieure.</Text>
          <Bullet>Tarif unitaire : 200 Euros</Bullet>
          <Bullet>En stock deux chapiteaux de cette taille : Dimension 8 Mts x 4 Mts pouvant accueillir 32 personnes par chapiteau.</Bullet>
          <Bullet>En stock trois chapiteaux de cette taille : Dimension 4 Mts x 4 Mts pouvant accueillir 12 personnes par chapiteau.</Bullet>

          <Text style={styles.sectionTitle}>10) L&apos;INVENTAIRE :</Text>
          <Text style={styles.paragraph}>
            A signer le jour de la prise en charge de la salle. (Tout matériel détérioré ou cassé devra être
            remboursé au retour des clés).
          </Text>

          <Text style={styles.sectionTitle}>11) TARIFS des HEBERGEMENTS en Formule Hôtel</Text>
          <Text style={styles.paragraph}>Le Domaine de la Begude pourra accueillir environ 60 Personnes.</Text>
          <Text style={styles.paragraph}>Exemple : Pour un Mazet 2/4 Personnes 110 à 135 Euros la Nuitée en formule Hôtel.</Text>
          <Text style={styles.paragraph}>
            A certaines dates, un minimum de nuitée par logement vous sera demandé. Exemple en période estivale :
            en Juillet quatre nuitées et en Août 6 ou 7 nuitées.
          </Text>
          <Text style={styles.paragraph}>
            La Formule Hôtel : sont inclus Draps, serviettes de toilette et ménage final selon le nombre de jours
            choisi. + Montant des Taxes de séjour (soit 1,30 €/pers de plus de 17 ans et par jour).
          </Text>
          <Text style={styles.paragraph}>
            A certaines périodes, l&apos;ensemble des gîtes est indissociable du Contrat de location de Salle,
            c&apos;est-à-dire qu&apos;ils doivent être intégrés en totalité ou en partie.
          </Text>

          <Text style={styles.sectionTitle}>12) LE REGLEMENT DE LA PRESTATION</Text>
          <Text style={styles.paragraph}>Le solde et la caution doivent être payés à l&apos;arrivée dans les lieux.</Text>
        </View>

        <View style={styles.section}>
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
