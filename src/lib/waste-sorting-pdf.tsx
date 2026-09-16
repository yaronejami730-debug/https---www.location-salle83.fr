import "server-only";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { siteConfig } from "@/lib/site";

const styles = StyleSheet.create({
  page: { padding: 44, fontFamily: "Helvetica", color: "#2b2a26" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  logo: { width: 48, height: 48 },
  title: { fontSize: 22, fontFamily: "Helvetica-Bold", textAlign: "center" },
  subtitle: { fontSize: 11, color: "#6b6a63", textAlign: "center", marginTop: 4 },
  intro: { marginTop: 18, fontSize: 10.5, lineHeight: 1.5, color: "#3d3c37" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e2da",
    borderRadius: 8,
  },
  iconBadge: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginRight: 14 },
  iconLid: { width: 4, height: 2, borderRadius: 1, marginBottom: 1 },
  iconHandle: { width: 13, height: 2, borderRadius: 1, marginBottom: 1 },
  iconBody: { width: 11, height: 11, borderRadius: 1.5 },
  binName: { fontSize: 13, fontFamily: "Helvetica-Bold" },
  binDesc: { fontSize: 10.5, color: "#6b6a63", marginTop: 1 },
  warning: {
    marginTop: 26,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fdecec",
    borderWidth: 1,
    borderColor: "#e8b4b4",
  },
  warningTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#a33", marginBottom: 4 },
  warningText: { fontSize: 10.5, lineHeight: 1.4, color: "#5a2222" },
  footer: { position: "absolute", bottom: 24, left: 44, right: 44, fontSize: 8, color: "#9a988f", textAlign: "center" },
});

const bins: { name: string; color: string; light: string; description: string }[] = [
  { name: "Poubelle jaune", color: "#c99a1f", light: "#fbf1d6", description: "Tous les emballages" },
  { name: "Poubelle marron", color: "#8a5a3c", light: "#ece0d5", description: "Déchets ménagers" },
  { name: "Poubelle verte", color: "#4c7a4c", light: "#dcebdc", description: "Le verre" },
  { name: "Poubelle compost", color: "#6b4f2a", light: "#e8e0d3", description: "Les déchets de légumes" },
  { name: "Poubelle carton", color: "#a68a5c", light: "#f0e9dc", description: "Carton à plat" },
];

function BinIcon({ color, light }: { color: string; light: string }) {
  return (
    <View style={[styles.iconBadge, { backgroundColor: light }]}>
      <View style={[styles.iconLid, { backgroundColor: color }]} />
      <View style={[styles.iconHandle, { backgroundColor: color }]} />
      <View style={[styles.iconBody, { backgroundColor: color }]} />
    </View>
  );
}

export function WasteSortingPdfDocument({ logoDataUri }: { logoDataUri: string | null }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoDataUri ? <Image src={logoDataUri} style={styles.logo} /> : <View />}
          <View />
        </View>

        <Text style={styles.title}>Que deviennent vos poubelles ?</Text>
        <Text style={styles.subtitle}>{siteConfig.name}</Text>

        <Text style={styles.intro}>
          Un sujet sensible aujourd&apos;hui : la communauté de communes nous demande d&apos;être vigilants sur ce
          point. Les différentes poubelles de tri sont à votre disposition :
        </Text>

        {bins.map((bin) => (
          <View key={bin.name} style={styles.row}>
            <BinIcon color={bin.color} light={bin.light} />
            <View>
              <Text style={styles.binName}>{bin.name}</Text>
              <Text style={styles.binDesc}>= {bin.description}</Text>
            </View>
          </View>
        ))}

        <View style={styles.warning}>
          <Text style={styles.warningTitle}>Sujet très important</Text>
          <Text style={styles.warningText}>
            Si le tri n&apos;est pas respecté durant votre séjour au Domaine de la Bégude, la caution sera retenue
            en intégralité, et les autorités compétentes seront informées.
          </Text>
        </View>

        <Text style={styles.footer}>
          {siteConfig.name} — {siteConfig.address} — {siteConfig.phone} — {siteConfig.email}
        </Text>
      </Page>
    </Document>
  );
}
