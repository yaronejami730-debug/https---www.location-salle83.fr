import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Conditions générales de location" };

export default function ConditionsGeneralesPage() {
  return (
    <LegalPage title="Conditions générales de location">
      <p>
        Ces conditions générales s&apos;appliquent à toute location de salle, d&apos;hébergement ou d&apos;espace
        au Domaine de la Bégude, exploité par EURL PACIFIC COTE D&apos;AZUR. Elles complètent le devis et le
        contrat de location signés entre les parties.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Montant de la caution</h2>
      <p>
        Une caution de <strong>500 €</strong> en espèces est demandée à la prise en charge de la salle. Elle est
        restituée au départ, déduction faite le cas échéant des détériorations occasionnées, des objets manquants
        et du nettoyage selon l&apos;état des lieux.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Ménage</h2>
      <p>
        Le ménage doit être fait par le locataire, ou payé selon l&apos;état de la salle au tarif en vigueur de{" "}
        <strong>30 € de l&apos;heure</strong>.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Attestation d&apos;assurance</h2>
      <p>
        Le locataire doit avertir son assureur de l&apos;événement (gratuit dans la plupart des cas) et fournir
        une attestation de responsabilité civile.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Prise en charge de la salle et de la cuisine</h2>
      <p>
        La salle peut être prise en charge la veille de l&apos;événement, de 9h à 19h, afin d&apos;approvisionner
        les réfrigérateurs et de décorer la salle. Une sonorisation peut être installée dans l&apos;espace prévu à
        cet effet, à condition d&apos;être adaptée à la dimension de la salle pour ne pas créer de nuisance sonore,
        conformément à la législation en vigueur.
      </p>
      <p>
        Le jour de l&apos;événement, la fête peut durer jusqu&apos;à 4 heures du matin, mais la musique devra être
        baissée de façon conséquente, ou certaines portes et fenêtres fermées, à partir de 23h30 afin de préserver
        la tranquillité des résidents et conformément à la législation en vigueur.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Équipements de la salle et de la cuisine</h2>
      <p>
        Le tarif de la cuisine (de 200 à 290 € selon le nombre de personnes) inclut une cuisine professionnelle de
        49 m², cinq réfrigérateurs, une machine à glaçons, deux pianos de cuisson, deux fours (gaz et électrique),
        deux fours micro-ondes, une salamandre, deux étuves et un espace plonge équipé (machine à laver et double
        évier inox). Le gaz en bouteille n&apos;est pas inclus.
      </p>
      <p>
        Le tarif de la vaisselle (de 110 à 150 € selon le nombre de personnes) comprend assiettes, verres et
        couverts sur demande ; un inventaire est signé par le locataire. L&apos;utilisation de chaises blanches en
        extérieur est facturée 1 € par pièce, à restituer nettoyées.
      </p>
      <p>
        Sont inclus dans le tarif de la salle : une salle de 90 m² aménagée de tables rondes et de leurs chaises
        (5 tables de 180 cm pour 12 personnes maximum, 6 tables de 152 cm pour 8 personnes), des sanitaires
        doubles avec sas, une terrasse de 90 m², ainsi qu&apos;une piste de danse de 60 m² supplémentaire, offerte
        pour les événements de plus de 65 personnes.
      </p>
      <p>
        Un supplément de 500 € s&apos;applique si aucun hébergement du domaine n&apos;est réservé pour
        l&apos;événement. Ce supplément peut être réduit ou annulé selon le nombre de logements réservés sur le
        domaine (remise progressive, annulation à partir de 10 logements réservés).
      </p>
      <p>Chapiteau : 200 € par pièce, deux chapiteaux de 8 x 4 m (32 personnes) et trois de 4 x 4 m (12 personnes) disponibles.</p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Montant des arrhes</h2>
      <p>
        Des arrhes équivalentes à <strong>50 % du montant total</strong> sont payables le jour de la réservation et
        ne sont pas remboursées en cas d&apos;annulation. Le solde et la caution sont réglés à l&apos;arrivée dans
        les lieux.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Hygiène et propreté</h2>
      <p>
        Il est interdit de fumer dans la salle. Les mégots doivent être éteints dans les cendriers prévus sur la
        terrasse. Les poubelles, situées à l&apos;entrée de la résidence, doivent recevoir tous les détritus en
        fin de manifestation, avec tri du verre et du plastique obligatoire. La direction se réserve le droit de
        conserver la totalité de la caution en cas de non-respect de ces règles.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Règlement de la piscine</h2>
      <p>
        Ouverte de 9h à 20h, non surveillée. Les enfants de moins de 15 ans doivent être accompagnés par un
        adulte. Sont interdits en piscine : contenants en verre, sodas, alcool, chiens, tabac (y compris
        cigarette électronique), nourriture (hors eau en bouteille plastique) et musique. Tout manquement
        entraîne la fermeture immédiate de la piscine.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Inventaire</h2>
      <p>
        Un inventaire est signé le jour de la prise en charge de la salle. Tout matériel détérioré ou cassé devra
        être remboursé au retour des clés.
      </p>
    </LegalPage>
  );
}
