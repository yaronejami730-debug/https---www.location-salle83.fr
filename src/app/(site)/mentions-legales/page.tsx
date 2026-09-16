import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales">
      <h2 className="font-serif text-xl text-[var(--foreground)]">Identification</h2>
      <p>
        Ces mentions légales régissent l&apos;utilisation du site www.domainedelabegude.com (ci-après, LE SITE WEB),
        propriété de EURL PACIFIC COTE D&apos;AZUR (ci-après, PROPRIÉTAIRE DU SITE WEB).
      </p>
      <p>
        LE PROPRIETAIRE DU SITE WEB, en conformité avec la loi 34/2002 du 11 juillet, relative aux services de la
        société, de l&apos;information et du commerce électronique, vous informe :
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Directeur de la publication : GONZAGUE TASSOU</li>
        <li>Raison sociale : EURL PACIFIC COTE D&apos;AZUR</li>
        <li>Nom de l&apos;enseigne : DOMAINE DE LA BEGUDE</li>
        <li>Nº de SIRET : 40308696000016</li>
        <li>Nº TVA : FR13403 086 960</li>
        <li>Siège social : DOMAINE DE LA BEGUDE RD 562 83440 FAYENCE, FRANCE</li>
        <li>E-mail : gonzaguetassou@gmail.com</li>
      </ul>
      <p>
        Toutes notifications et communications entre les Utilisateurs et le PROPRIÉTAIRE DU SITE WEB seront
        considérées comme valides, à toutes fins utiles, lorsqu&apos;elles sont effectuées par courrier postal ou
        courrier électronique à l&apos;adresse détaillée ci-dessus.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Utilisateurs</h2>
      <p>
        L&apos;accès et/ou l&apos;utilisation du SITE WEB attribue la condition d&apos;UTILISATEUR, acceptant, suite à
        cet accès et/ou utilisation, les Conditions Générales d&apos;Utilisation établies ci-après. Les conditions
        citées devront être appliquées indépendamment des Conditions Générales de Vente qui, dans leur cas, sont
        obligatoires.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Utilisation du site web</h2>
      <p>
        Le Site Web et ses services sont en accès libre et gratuit, cependant, le PROPRIETAIRE DU SITE WEB
        conditionne l&apos;utilisation de certains des services proposés sur son site Web à la saisie préalable du
        formulaire correspondant, afin de devenir un Utilisateur du SITE WEB.
      </p>
      <p>
        L&apos;Utilisateur garantit l&apos;authenticité et l&apos;actualité de toutes les données communiquées au
        PROPRIÉTAIRE DU SITE WEB et sera seul responsable des déclarations fausses ou inexactes.
      </p>
      <p>
        L&apos;Utilisateur accepte expressément de faire un usage approprié des contenus et services du PROPRIETAIRE
        DU SITE WEB et de ne pas les utiliser pour, entre autres :
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          Diffuser des contenus délictifs, violents, pornographiques, racistes, xénophobes, offensants, préconisant
          le terrorisme ou, en général, contraire à la loi ou à l&apos;ordre public.
        </li>
        <li>
          Introduire des virus informatiques sur le réseau ou effectuer des actions susceptibles d&apos;altérer, de
          modifier, d&apos;interrompre ou de générer des erreurs ou des dommages aux documents électroniques, aux
          données ou aux systèmes physiques et logiques du PROPRIETAIRE DU SITE WEB ou d&apos;un tiers ; ainsi que
          d&apos;empêcher les autres utilisateurs d&apos;accéder au Site Web et à ses services par la consommation
          massive de ressources informatiques à travers lesquels le PROPRIETAIRE DU SITE WEB fournit ses services.
        </li>
        <li>
          Essayer d&apos;accéder aux comptes de messagerie électronique d&apos;autres utilisateurs ou aux zones
          d&apos;accès restreint des systèmes informatiques du PROPRIÉTAIRE DU SITE WEB ou d&apos;un tiers et, le cas
          échéant, d&apos;en extraire des informations.
        </li>
        <li>
          Porter atteinte aux droits de propriété intellectuelle ou industrielle, ainsi que violer la
          confidentialité des informations du PROPRIÉTAIRE DU SITE WEB ou d&apos;un tiers.
        </li>
        <li>Usurper l&apos;identité d&apos;un autre utilisateur, d&apos;administrations publiques ou d&apos;un tiers.</li>
        <li>
          Reproduire, copier, distribuer, mettre à disposition ou communiquer publiquement, transformer ou modifier
          les contenus, à moins d&apos;en avoir l&apos;autorisation du titulaire des droits correspondants ou que cela
          soit légalement autorisé.
        </li>
        <li>
          Recueillir des données à des fins publicitaires et envoyer des publicités de toute nature et des
          communications commerciales ou autres, sans en avoir obtenu préalablement l&apos;autorisation.
        </li>
      </ul>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Politique de confidentialité</h2>
      <p>
        Le PROPRIÉTAIRE DU SITE WEB veut informer les Utilisateurs et les Clients de son Site Web que la politique
        menée concernant le traitement et la protection des données personnelles des personnes qui utilisent
        volontairement les formulaires de contact pour contacter le PROPRIÉTAIRE DU SITE WEB, ainsi que l&apos;accès
        à son propre site, implique la communication de vos données personnelles au PROPRIÉTAIRE DU SITE WEB.
      </p>
      <p>
        Le PROPRIÉTAIRE DU SITE WEB informe l&apos;Utilisateur et le client de son Site Web de l&apos;existence
        d&apos;un registre automatisé d&apos;activités de données personnelles, où les données personnelles
        communiquées par l&apos;Utilisateur et le client sont collectées et stockées afin de gérer la demande. Vous
        pouvez à tout moment consulter notre Charte de Confidentialité sur ce site.
      </p>
      <p>
        Le PROPRIETAIRE DU SITE WEB modifiera sans préavis la politique de confidentialité si nécessaire, pour
        l&apos;adapter à toute modification législative, réglementaire, jurisprudentielle, administrative ou dans le
        but d&apos;adapter ladite politique aux instructions émises par l&apos;Agence de Protection des Données. Toute
        modification de cette politique sera publiée et annoncée sur le site du PROPRIETAIRE DU SITE WEB.
      </p>
      <p>
        Le PROPRIETAIRE DU SITE WEB ne demande pas d&apos;informations aux internautes qui le visitent, uniquement
        des données purement identificatives. La communication des données personnelles par l&apos;utilisateur au
        PROPRIETAIRE DU SITE WEB via son site Web n&apos;a lieu que lorsque l&apos;utilisateur utilise volontairement
        le formulaire de contact ou d&apos;autres moyens de communication pour le contacter, aux fins suivantes :
        exécuter les procédures liées à la préparation des devis, des contrats et à la prestation des services du
        PROPRIETAIRE DU SITE WEB, ainsi que répondre aux demandes reçues.
      </p>
      <p>
        Le PROPRIETAIRE DU SITE WEB informe l&apos;Utilisateur de la possibilité d&apos;exercer ses droits
        d&apos;accès, de rectification, de limitation du traitement, de portabilité, d&apos;opposition au traitement
        et de suppression de ses données, ainsi que le droit de présenter une réclamation à l&apos;Autorité de
        Contrôle, par écrit à l&apos;adresse postale ou électronique mentionnée ci-dessus, en joignant une copie de
        la carte d&apos;identité.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Propriété intellectuelle et industrielle</h2>
      <p>
        En vertu des dispositions de la législation en vigueur régissant la Propriété Intellectuelle, sont
        expressément interdits la reproduction, la distribution et la communication publique (y compris son mode de
        mise à disposition) de la totalité ou d&apos;une partie des contenus (textes, photographies, graphiques,
        images, icônes, technologie, logiciels, graphisme et codes sources) à des fins commerciales, sur n&apos;importe
        quel support et par n&apos;importe quel moyen technique, sans l&apos;autorisation du PROPRIÉTAIRE DU SITE WEB.
      </p>
      <p>
        Tous les contenus du Site WEB constituent la propriété du PROPRIÉTAIRE DU SITE WEB, sans qu&apos;aucun des
        droits d&apos;exploitation sur ceux-ci ne soit cédé à l&apos;usager, au-delà de ce qui est strictement
        nécessaire pour une utilisation correcte du Site Web.
      </p>
      <p>
        Toutes les marques, noms commerciaux ou signes distinctifs de toute nature qui apparaissent sur le site Web
        sont la propriété du PROPRIÉTAIRE DU SITE WEB, sans que l&apos;utilisation ou l&apos;accès à celui-ci
        n&apos;attribue à l&apos;utilisateur un droit quelconque sur eux.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Exclusion de garanties et de responsabilité</h2>
      <p>
        Le contenu de ce site web est de nature générale et a un but purement informatif, sans garantir pleinement
        l&apos;accès à tous les contenus, leur exhaustivité, leur exactitude, leur validité ou actualisation, ou leur
        pertinence ou utilité dans un but spécifique.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Liens</h2>
      <p>
        Le PROPRIETAIRE DU SITE WEB décline toute responsabilité concernant les informations qui se trouvent en
        dehors de ce Site Web et qui ne sont pas gérées directement par notre webmaster.
      </p>

      <h2 className="font-serif text-xl text-[var(--foreground)]">Droit applicable et juridiction</h2>
      <p>
        Ces conditions seront régies ou interprétées conformément à la législation française dans les domaines qui
        ne sont pas expressément établis.
      </p>
    </LegalPage>
  );
}
