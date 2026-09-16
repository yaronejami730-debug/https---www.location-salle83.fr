import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Charte de confidentialité" };

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Charte de confidentialité">
      <p>Dernière mise à jour : 31/08/2018</p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données à caractère personnel collectées sur le site
        www.domainedelabegude.com est EURL PACIFIC COTE D&apos;AZUR, exploitant le DOMAINE DE LA BEGUDE, dont le
        siège social est situé DOMAINE DE LA BEGUDE RD 562, 83440 FAYENCE, France, SIRET 40308696000016, représentée
        par Gonzague Tassou. Pour toute question relative à la présente charte, vous pouvez nous contacter à
        l&apos;adresse gonzaguetassou@gmail.com.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Données collectées</h2>
      <p>
        Nous collectons uniquement les données que vous nous transmettez volontairement, notamment lorsque vous
        utilisez notre formulaire de contact ou de demande de devis : nom, prénom, adresse e-mail, numéro de
        téléphone, ainsi que les informations relatives à votre événement (date souhaitée, nombre d&apos;invités,
        type de prestation) nécessaires à l&apos;établissement d&apos;un devis ou d&apos;une réponse à votre demande.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Finalités du traitement</h2>
      <p>Vos données personnelles sont traitées aux fins suivantes :</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Répondre à vos demandes de renseignements ou de devis ;</li>
        <li>Assurer la gestion de la relation commerciale et contractuelle ;</li>
        <li>Vous adresser des informations relatives à nos prestations, si vous y avez consenti ;</li>
        <li>Améliorer la qualité de nos services et de notre site internet.</li>
      </ul>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Base légale</h2>
      <p>
        Le traitement de vos données repose sur votre consentement, exprimé lors de la soumission du formulaire de
        contact, ainsi que, le cas échéant, sur l&apos;exécution de mesures précontractuelles ou contractuelles
        prises à votre demande.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Destinataires des données</h2>
      <p>
        Les données collectées sont destinées exclusivement au PROPRIETAIRE DU SITE WEB et ne sont ni vendues, ni
        louées, ni cédées à des tiers à des fins commerciales. Elles peuvent être communiquées, le cas échéant, à nos
        prestataires techniques (hébergement, messagerie) strictement dans la mesure nécessaire à la fourniture de
        leurs services, et dans le respect de la réglementation applicable.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Durée de conservation</h2>
      <p>
        Vos données sont conservées pendant la durée nécessaire au traitement de votre demande, puis archivées
        conformément aux délais de prescription légale applicables en matière commerciale et fiscale.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Sécurité</h2>
      <p>
        Le PROPRIETAIRE DU SITE WEB met en œuvre les mesures techniques et organisationnelles appropriées afin de
        garantir la sécurité et la confidentialité de vos données personnelles, et de les protéger contre toute
        perte, utilisation détournée, accès non autorisé, divulgation, altération ou destruction.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Vos droits</h2>
      <p>
        Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
        vous disposez d&apos;un droit d&apos;accès, de rectification, de limitation du traitement, de portabilité,
        d&apos;opposition et d&apos;effacement de vos données personnelles. Vous pouvez exercer ces droits en nous
        écrivant à l&apos;adresse gonzaguetassou@gmail.com ou par courrier postal à DOMAINE DE LA BEGUDE RD 562,
        83440 FAYENCE, en joignant une copie d&apos;un justificatif d&apos;identité.
      </p>
      <p>
        Vous disposez également du droit d&apos;introduire une réclamation auprès de la Commission Nationale de
        l&apos;Informatique et des Libertés (CNIL), autorité de contrôle compétente, si vous estimez que le
        traitement de vos données personnelles constitue une violation des textes applicables.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Cookies</h2>
      <p>
        Le site peut utiliser des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie de suivi
        publicitaire ou de mesure d&apos;audience tiers n&apos;est déposé sans votre consentement préalable.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Modification de la présente charte</h2>
      <p>
        Le PROPRIETAIRE DU SITE WEB se réserve le droit de modifier la présente charte de confidentialité à tout
        moment, notamment pour se conformer à toute évolution législative, réglementaire, jurisprudentielle ou
        technique. Toute modification sera publiée sur cette page.
      </p>
    </LegalPage>
  );
}
