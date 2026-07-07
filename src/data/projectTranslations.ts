// Localized copy for the hardcoded charity projects. Project/charity *names*
// stay in the source language (they're brand names); everything narrative is
// translated here. English lives in `projects.ts` and is the fallback, so this
// file only needs the non-English locales. Keyed by project slug → language.
//
// Machine-assisted translations — a native proofread pass is welcome, but these
// are production-quality and let German/Spanish visitors read the mission copy
// instead of falling back to English.

export interface ProjectI18nContent {
  tagline?: string
  problem?: string
  solution?: string
  impact?: string[]
  charityDescription?: string
}

export const projectTranslations: Record<string, Record<string, ProjectI18nContent>> = {
  'rich-in-life': {
    de: {
      tagline: 'Neu denken, was Reichtum wirklich bedeutet.',
      problem:
        'In den abgelegenen ländlichen Gemeinden von Milagros, La Unión und anderen Dörfern in Paya, Kolumbien, ist materieller Reichtum knapp. Schulen fehlt es oft an grundlegenden Lernmaterialien, der Zugang zu Gesundheitsversorgung ist begrenzt, und Lehrkräfte arbeiten unter schwierigen Bedingungen, um Kindern fernab städtischer Ressourcen Bildung zu ermöglichen.\n\nUnd doch besitzen die Menschen hier trotz all dieser Herausforderungen etwas, das viele von uns vergessen haben: starke Gemeinschaften, eine enge Verbindung zur Natur und die bemerkenswerte Fähigkeit, das Beste aus dem zu machen, was sie haben.\n\nDie Frage ist nicht nur, was diesen Gemeinschaften fehlt, sondern auch, was sie uns über eine andere Art von Reichtum lehren können.',
      solution:
        'Gemeinsam mit Mission Positivity haben wir die Kollektion Rich in Life geschaffen, um Kinder, Lehrkräfte und Familien in den ländlichen Gemeinden von Paya, Kolumbien, zu unterstützen.\n\nJedes Shirt hilft, Bildungsprojekte, Schulmaterial, Gemeinschaftsprogramme, Gesundheitsinitiativen und Chancen zu finanzieren, die sonst unerreichbar blieben. Jeder Kauf schafft direkte Wirkung dort, wo sie am dringendsten gebraucht wird.\n\nEs ist eine Einladung, neu zu denken, was Reichtum wirklich bedeutet. Rich in Life erinnert uns daran, dass Erfüllung oft in Verbundenheit, Sinn und Gemeinschaft liegt – und nicht im materiellen Besitz.\n\n100% der Gewinne dieser Kollektion unterstützen die Arbeit von Mission Positivity vor Ort.',
      impact: ['Finanzierung von Sprachtherapie', 'Schulmaterial & Ressourcen', 'Unterstützung von Freiwilligenprogrammen', 'Umweltbildung'],
      charityDescription:
        'Mission Positivity ist eine deutsche gemeinnützige Organisation, getragen von einer einfachen Überzeugung: Positiver Wandel wird möglich, wenn Menschen zusammenkommen und handeln. Die Organisation setzt sich dafür ein, Bildungschancen für Kinder und Jugendliche zu erweitern, Gemeinschaften in sozialen und wirtschaftlichen Herausforderungen zu unterstützen und Wege zu einer selbstbestimmteren und nachhaltigeren Zukunft zu ebnen.\n\nSeit 2023 arbeitet Mission Positivity eng mit Schulen, Lehrkräften, Kindern und Familien in den abgelegenen ländlichen Gemeinden von Paya, Kolumbien, zusammen. Durch Bildungsförderung, Schulmaterial, Gesundheitsinitiativen, Freiwilligenprogramme und langfristige lokale Partnerschaften hilft die Organisation, Chancen dort zu schaffen, wo der Zugang zu Ressourcen begrenzt ist.\n\n2025 kehrte das Team nach Milagros und La Unión zurück, um seine Projekte fortzuführen und einen Dokumentarfilm über das Leben in diesen abgelegenen Gemeinden zu drehen. Im Zentrum steht eine einfache Frage: Was bedeutet es wirklich, reich zu sein?\n\nDie Kollektion Rich in Life entstand aus den Antworten, die sie fanden.',
    },
    es: {
      tagline: 'Repensar lo que realmente significa la riqueza.',
      problem:
        'En las remotas comunidades rurales de Milagros, La Unión y otros campos de Paya, Colombia, la riqueza material escasea. A menudo las escuelas carecen de materiales básicos de aprendizaje, el acceso a la salud es limitado y los docentes trabajan en condiciones difíciles para dar educación a niños que crecen lejos de los recursos urbanos.\n\nY sin embargo, a pesar de estos desafíos, quienes viven aquí poseen algo que muchos de nosotros hemos olvidado: comunidades fuertes, una conexión cercana con la naturaleza y una notable capacidad de sacar el máximo provecho de lo que tienen.\n\nLa pregunta no es solo qué les falta a estas comunidades, sino también qué pueden enseñarnos sobre otra clase de riqueza.',
      solution:
        'Junto a Mission Positivity creamos la colección Rich in Life para apoyar a niños, docentes y familias de las comunidades rurales de Paya, Colombia.\n\nCada camiseta ayuda a financiar proyectos educativos, materiales escolares, programas comunitarios, iniciativas de salud y oportunidades que de otro modo quedarían fuera de alcance. Cada compra genera un impacto directo donde más se necesita.\n\nEs una invitación a repensar lo que realmente significa la riqueza. Rich in Life nos recuerda que la plenitud suele estar en la conexión, el propósito y la comunidad, más que en las posesiones materiales.\n\nEl 100% de los beneficios de esta colección apoya el trabajo de Mission Positivity sobre el terreno.',
      impact: ['Financiación de terapia del lenguaje', 'Materiales y recursos escolares', 'Apoyo a programas de voluntariado', 'Educación ambiental'],
      charityDescription:
        'Mission Positivity es una organización sin fines de lucro alemana impulsada por una creencia sencilla: el cambio positivo es posible cuando las personas se unen y actúan. La organización trabaja para ampliar las oportunidades educativas de niños y jóvenes, apoyar a comunidades que enfrentan desafíos sociales y económicos, y ayudar a abrir caminos hacia un futuro más autónomo y sostenible.\n\nDesde 2023, Mission Positivity trabaja estrechamente con escuelas, docentes, niños y familias en las remotas comunidades rurales de Paya, Colombia. A través del apoyo educativo, los materiales escolares, las iniciativas de salud, los programas de voluntariado y las alianzas locales a largo plazo, la organización ayuda a crear oportunidades donde el acceso a los recursos es limitado.\n\nEn 2025, el equipo regresó a Milagros y La Unión para continuar sus proyectos y filmar un documental que explora la vida en estas comunidades remotas. En su corazón late una pregunta sencilla: ¿qué significa realmente ser rico?\n\nLa colección Rich in Life nació de las respuestas que encontraron.',
    },
  },

  'wild-at-heart': {
    de: {
      tagline: 'Gemeinsam für Giganten. Gemeinsam für Hoffnung.',
      problem:
        'Der Afrikanische Elefant ist eines der außergewöhnlichsten Lebewesen der Erde – intelligent, sozial, emotional und tief mit seiner Herde verbunden. Doch trotz ihrer Bedeutung stehen Elefanten unter ständigem Druck durch Lebensraumverlust, Mensch-Elefant-Konflikte und sich verändernde Landschaften. Diese Zusammenarbeit beruht auf einer einfachen Überzeugung: Wenn wir aus Liebe handeln, schützen wir das Wilde und halten die Hoffnung am Leben. WILD AT HEART ist mehr als ein Design – es ist eine Erinnerung daran, dass der Schutz der Natur damit beginnt, Mitgefühl zu wählen, Bewusstsein zu wählen und zu handeln.',
      solution:
        'Bei Perfect World glauben wir, dass jeder Faden eine Geschichte erzählen kann – eine Geschichte von Verbundenheit, von Handeln, von Mitgefühl. Mit unserem Design WILD AT HEART sind wir stolz, gemeinsam mit Elephants for Africa den wilden Geist des Afrikanischen Elefanten und die Gemeinschaften zu unterstützen, die seinen Lebensraum teilen. Von jedem Teil der WILD AT HEART Kollektion gehen 100% der Gewinne direkt an Elephants for Africa. Das Design ist eine Hommage an die Stärke, Sanftheit und Widerstandskraft afrikanischer Elefanten – und an den wilden Geist, der in uns allen lebt. Gestaltet von Libby, einer Zehntklässlerin der Munich International School, trägt das Design eine Botschaft der Hoffnung der nächsten Generation: eine Erinnerung daran, dass der Schutz unseres Planeten mit Bewusstsein, Mitgefühl und mutiger Vorstellungskraft beginnt. Mit diesem Design folgst du nicht einfach einem Trend – du setzt ein Statement. Du sagst: Ich stehe für das Wilde. Ich stehe für Hoffnung.',
      impact: ['5.000+ Elefanten geschützt', '50.000 Hektar Lebensraum bewahrt', '100+ Wilderer festgenommen'],
      charityDescription:
        'Elephants for Africa, gegründet von Dr. Kate Evans, ist eine Wohltätigkeitsorganisation, die sich dem Schutz von Elefanten durch Forschung, Bildung und Zusammenarbeit mit lokalen Gemeinschaften in Botswana widmet. Ihre Arbeit konzentriert sich auf die Erforschung des Verhaltens von Elefanten (insbesondere männlicher Elefanten, die im Naturschutz oft weniger Aufmerksamkeit erhalten), die Unterstützung lokaler Gemeinschaften und Landwirte beim Schutz ihrer Lebensgrundlagen im Zusammenleben mit wandernden Elefantenherden sowie die Bildung der nächsten Generation durch Schulprogramme und Naturschutzclubs. Elephants for Africa „schützt" nicht nur Elefanten – sie bauen eine Welt, in der Mensch und Wildtier Seite an Seite gedeihen können.',
    },
    es: {
      tagline: 'Juntos por los gigantes. Juntos por la esperanza.',
      problem:
        'El elefante africano es uno de los seres más extraordinarios de la Tierra: inteligente, social, emocional y profundamente unido a su manada. Sin embargo, pese a su importancia, los elefantes viven bajo una presión constante por la pérdida de hábitat, el conflicto entre humanos y elefantes y los paisajes cambiantes. Esta colaboración se basa en una creencia sencilla: cuando actuamos por amor, protegemos lo salvaje y mantenemos viva la esperanza. WILD AT HEART es más que un diseño: es un recordatorio de que proteger la naturaleza empieza por elegir la compasión, elegir la conciencia y elegir actuar.',
      solution:
        'En Perfect World creemos que cada hilo puede contar una historia: una historia de conexión, de acción, de compasión. Con nuestro diseño WILD AT HEART, nos enorgullece unir fuerzas con Elephants for Africa para apoyar el espíritu salvaje del elefante africano y a las comunidades que comparten su hogar. Con cada pieza de la colección WILD AT HEART, el 100% de los beneficios va directamente a Elephants for Africa. El diseño es un homenaje a la fuerza, la ternura y la resiliencia de los elefantes africanos, y al espíritu salvaje que vive en todos nosotros. Creado por Libby, una estudiante de décimo grado de la Munich International School, el diseño lleva un mensaje de esperanza de la próxima generación: un recordatorio de que proteger nuestro planeta empieza con conciencia, compasión e imaginación audaz. Al elegir este diseño, no sigues simplemente una tendencia: haces una declaración. Dices: Defiendo lo salvaje. Defiendo la esperanza.',
      impact: ['+5.000 elefantes protegidos', '50.000 hectáreas de hábitat preservadas', '+100 cazadores furtivos detenidos'],
      charityDescription:
        'Elephants for Africa, fundada por la Dra. Kate Evans, es una organización benéfica dedicada a proteger a los elefantes mediante la investigación, la educación y la colaboración con las comunidades de Botsuana. Su trabajo se centra en investigar el comportamiento de los elefantes (especialmente los machos, que suelen recibir menos atención en la conservación), apoyar a las comunidades locales y a los agricultores para que protejan sus medios de vida mientras conviven con las manadas migratorias, y educar a la próxima generación a través de programas escolares y clubes de conservación. Elephants for Africa no solo "protege elefantes": construye un mundo donde las personas y la vida silvestre puedan prosperar juntas.',
    },
  },

  'endangered-oceans': {
    de: {
      tagline: 'Unsere Ozeane retten, eine Koralle nach der anderen',
      problem:
        'Korallenriffe sind die Lungen unserer Ozeane – sie tragen das marine Leben und schützen unsere Küsten. Doch sie verschwinden in alarmierendem Tempo, durch Klimawandel, Verschmutzung und menschliches Handeln.',
      solution:
        'Die ENDANGERED OCEANS Kollektion ist mehr als nur Mode – sie ist ein Aufruf zum Handeln. Jedes Teil ist gestaltet, um Bewusstsein zu schaffen und echte Lösungen für unsere Ozeane zu finanzieren. Alle Gewinne gehen direkt an SECORE International, einen weltweit führenden Akteur in der Korallenrestauration. Durch wegweisende Forschung, innovative Techniken zur Riffwiederherstellung und Bildung arbeiten sie an einer Zukunft, in der Korallenriffe gedeihen – nicht nur überleben.',
      impact: ['100.000+ Korallenfragmente gepflanzt', '15 Arten in Wiederansiedlung', '8 unterstützte Länder'],
      charityDescription:
        'SECORE International hat sich zur Aufgabe gemacht, unsere Ozeane durch wegweisende Forschung, innovative Techniken zur Riffwiederherstellung und Bildung zu retten. Sie arbeiten daran, dass Korallenriffe für kommende Generationen gedeihen.',
    },
    es: {
      tagline: 'Salvar nuestros océanos, un coral a la vez',
      problem:
        'Los arrecifes de coral son los pulmones de nuestros océanos: sostienen la vida marina y protegen nuestras costas. Pero están desapareciendo a un ritmo alarmante debido al cambio climático, la contaminación y la actividad humana.',
      solution:
        'La colección ENDANGERED OCEANS es mucho más que moda: es un llamado a la acción. Cada pieza está diseñada para difundir conciencia y financiar soluciones reales para nuestros océanos. Todos los beneficios van directamente a SECORE International, líder mundial en la restauración de corales. Mediante investigación pionera, técnicas innovadoras de restauración de arrecifes y educación, trabajan para asegurar un futuro en el que los arrecifes de coral prosperen, no solo sobrevivan.',
      impact: ['+100.000 fragmentos de coral plantados', '15 especies en restauración', '8 países apoyados'],
      charityDescription:
        'SECORE International tiene la misión de salvar nuestros océanos mediante la investigación pionera, técnicas innovadoras de restauración de arrecifes y la educación. Trabajan para que los arrecifes de coral prosperen durante generaciones.',
    },
  },

  'one-world': {
    de: {
      tagline: 'Hoffnung für Kinder, die die Realität des Krieges erleben',
      problem:
        'Unzählige Kinder auf der ganzen Welt wachsen ohne elterliche Fürsorge auf und tragen Nachteile, die ihr ganzes Leben prägen können. Für jene in vom Krieg zerrütteten Regionen sind die Herausforderungen noch größer – ohne Zugang zu grundlegenden Dingen, Bildung und dem geborgenen Umfeld, das jedes Kind verdient.',
      solution:
        'Die ONE WORLD Kollektion steht für Einheit und Mitgefühl angesichts von Widrigkeiten. Alle Gewinne dieser Kollektion gehen direkt an Care in Action, eine gemeinnützige Organisation, die benachteiligten Kindern – besonders jenen ohne elterliche Fürsorge – hilft, aufzuwachsen und im Leben erfolgreich zu sein. Durch grundlegende Fürsorge, Bildung und ein geborgenes Umfeld ist Care in Action eine Lebensader für Kinder, die die harte Realität des Krieges erleben.',
      impact: ['50.000+ Menschen mit Zugang zu sauberem Wasser', '20+ gebaute Schulen', '5.000+ Frauen in Mikrofinanzprogrammen'],
      charityDescription:
        'Care in Action ist eine gemeinnützige Organisation, die sich dafür einsetzt, benachteiligten Kindern – besonders jenen ohne elterliche Fürsorge – zu helfen, aufzuwachsen und im Leben erfolgreich zu sein. Durch grundlegende Fürsorge, Bildung und ein geborgenes Umfeld ist Care in Action eine Lebensader für jene, die die harte Realität des Krieges erleben.',
    },
    es: {
      tagline: 'Esperanza para los niños que enfrentan la realidad de la guerra',
      problem:
        'Innumerables niños en todo el mundo crecen sin cuidado parental, enfrentando desventajas que pueden marcar toda su vida. Para quienes quedan atrapados en regiones devastadas por la guerra, los desafíos son aún más severos: sin acceso a lo básico, a la educación y al entorno protector que todo niño merece.',
      solution:
        'La colección ONE WORLD representa la unidad y la compasión frente a la adversidad. Todos los beneficios de esta colección van directamente a Care in Action, una organización sin fines de lucro dedicada a ayudar a niños desfavorecidos —en especial a quienes no tienen cuidado parental— a crecer y salir adelante en la vida. Al brindar cuidados esenciales, educación y un entorno protector, Care in Action es un salvavidas para los niños que enfrentan la dura realidad de la guerra.',
      impact: ['+50.000 personas con acceso a agua potable', '+20 escuelas construidas', '+5.000 mujeres en programas de microfinanzas'],
      charityDescription:
        'Care in Action es una organización sin fines de lucro dedicada a ayudar a niños desfavorecidos, en especial a quienes no tienen cuidado parental, a crecer y salir adelante en la vida. Al procurar cuidados esenciales, educación y un entorno protector, Care in Action es un salvavidas para quienes enfrentan la dura realidad de la guerra.',
    },
  },

  'cool-down': {
    de: {
      tagline: 'Für Klimagerechtigkeit kämpfen, einen Baum nach dem anderen',
      problem:
        'Der Klimawandel bedroht unseren Planeten, und die Entwaldung beschleunigt seine verheerenden Folgen. Ökosysteme weltweit sind in der Krise, jedes Jahr gehen Millionen Bäume verloren. Der dringende Ruf nach Klimagerechtigkeit verlangt sofortiges Handeln, um wiederherzustellen, was verloren wurde.',
      solution:
        'Die COOL DOWN Kollektion steht für unser Engagement, den Klimawandel durch direktes Handeln zu bekämpfen. Alle Gewinne aus dem Verkauf unserer Designs gehen direkt an Plant-for-the-Planet, eine Initiative, die die Wiederherstellung von Ökosystemen weltweit unterstützt, um für Klimagerechtigkeit zu kämpfen. Jeder Kauf hilft, Bäume zu pflanzen und lebenswichtige Ökosysteme wiederherzustellen – eine spürbare Wirkung im Kampf gegen den Klimawandel.',
      impact: ['15 Milliarden Bäume zugesagt', '100+ teilnehmende Länder', '1 Million ausgebildete Klimabotschafter:innen'],
      charityDescription:
        'Plant-for-the-Planet ist eine Initiative, die die Wiederherstellung von Ökosystemen weltweit unterstützt, um für Klimagerechtigkeit zu kämpfen. Durch globale Mobilisierung und direktes Handeln befähigt sie Menschen, Ökosysteme wiederherzustellen und den Klimawandel zu bekämpfen, indem sie überall auf der Welt Bäume pflanzen.',
    },
    es: {
      tagline: 'Luchar por la justicia climática, un árbol a la vez',
      problem:
        'El cambio climático amenaza nuestro planeta, y la deforestación acelera sus efectos devastadores. Los ecosistemas de todo el mundo están en crisis, con millones de árboles perdidos cada año. La urgente necesidad de justicia climática exige una acción inmediata para restaurar lo que se ha perdido.',
      solution:
        'La colección COOL DOWN representa nuestro compromiso de combatir el cambio climático mediante la acción directa. Todos los beneficios de la venta de nuestros diseños van directamente a Plant-for-the-Planet, una iniciativa que apoya la restauración de ecosistemas en todo el mundo para luchar por la justicia climática. Cada compra ayuda a plantar árboles y restaurar ecosistemas vitales, generando un impacto tangible en la lucha contra el cambio climático.',
      impact: ['15.000 millones de árboles comprometidos', '+100 países participantes', '1 millón de embajadores climáticos formados'],
      charityDescription:
        'Plant-for-the-Planet es una iniciativa que apoya la restauración de ecosistemas en todo el mundo para luchar por la justicia climática. Mediante la movilización global y la acción directa, empodera a la ciudadanía para restaurar ecosistemas y combatir el cambio climático plantando árboles por todo el planeta.',
    },
  },

  'talk-about-it': {
    de: {
      tagline: 'Das Schweigen über psychische Gesundheit brechen',
      problem:
        'Psychische Erkrankungen betreffen Millionen Menschen weltweit, doch Stigma und Schweigen halten sie davon ab, Hilfe zu suchen. Suizid bleibt eine der häufigsten Todesursachen, besonders bei jungen Menschen, und unzählige Betroffene leiden in Isolation.',
      solution:
        'Die TALK ABOUT IT Kollektion soll Gespräche anstoßen und Leben retten. Alle Gewinne aus dem Verkauf unserer Designs gehen direkt an die Mental Health Initiative, eine Organisation, die sich der Suizidprävention, dem Abbau von Stigmata, der Aufklärung der Öffentlichkeit sowie politischem und gesellschaftlichem Einfluss widmet, um zu verändern, wie unsere Gesellschaft mit psychischer Gesundheit umgeht.',
      impact: ['100.000+ Menschen erreicht', '500+ gegründete Selbsthilfegruppen', 'Krisen-Hotline rund um die Uhr'],
      charityDescription:
        'Die Mental Health Initiative setzt sich für Suizidprävention ein, baut Stigmata ab, schafft öffentliches Bewusstsein und nimmt politischen und gesellschaftlichen Einfluss. Durch Aufklärung, Bildung und Unterstützung in der Gemeinschaft arbeitet sie an einer Welt, in der psychische Gesundheit denselben Stellenwert erhält wie körperliche.',
    },
    es: {
      tagline: 'Romper el silencio en torno a la salud mental',
      problem:
        'Los problemas de salud mental afectan a millones de personas en todo el mundo, pero el estigma y el silencio les impiden buscar ayuda. El suicidio sigue siendo una de las principales causas de muerte, especialmente entre los jóvenes, e innumerables personas sufren en aislamiento.',
      solution:
        'La colección TALK ABOUT IT está diseñada para iniciar conversaciones y salvar vidas. Todos los beneficios de la venta de nuestros diseños van directamente a la Mental Health Initiative, una organización dedicada a promover la prevención del suicidio, reducir el estigma, crear conciencia pública y ejercer influencia política y social para cambiar la forma en que la sociedad aborda la salud mental.',
      impact: ['+100.000 personas alcanzadas', '+500 grupos de apoyo creados', 'Línea de crisis 24/7'],
      charityDescription:
        'La Mental Health Initiative busca promover la prevención del suicidio, reducir el estigma, crear conciencia pública y ejercer influencia política y social. Mediante la incidencia, la educación y el apoyo comunitario, trabaja para crear un mundo donde la salud mental reciba la misma importancia que la salud física.',
    },
  },
}
