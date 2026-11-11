// ---------- Einrichtung: 100 Startzitate ----------
// Allgemeine Fragen und Sprichwörter ohne Autor sowie Zitate gemeinfreier Autoren
// (vor 1956 gestorben), jeweils mit Werk und Stelle geprüft. Englische Fassung: eigene Übersetzung bzw. eingeführte
// Formulierungen. Felder mit zwei Werten: [Deutsch, Englisch].
const START_QUOTES = [
 {
  "de": "Arbeite ich an etwas – oder bin ich nur beschäftigt?",
  "en": "Am I working on something – or am I just busy?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Arbeit"
   ],
   [
    "Work"
   ]
  ]
 },
 {
  "de": "Auch das wird vorübergehen.",
  "en": "This too shall pass.",
  "author": [
   "",
   ""
  ],
  "source": [
   "Sprichwort",
   "Proverb"
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Krisen"
   ],
   [
    "Crises"
   ]
  ]
 },
 {
  "de": "Bedenke, dass du sterben wirst.",
  "en": "Remember that you will die.",
  "author": [
   "",
   ""
  ],
  "source": [
   "Memento mori",
   "Memento mori"
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Zeit"
   ],
   [
    "Time"
   ]
  ]
 },
 {
  "de": "Das Glück deines Lebens hängt von der Beschaffenheit deiner Gedanken ab.",
  "en": "The happiness of your life depends on the quality of your thoughts.",
  "author": [
   "Marcus Aurelius",
   "Marcus Aurelius"
  ],
  "source": [
   "Selbstbetrachtungen",
   "Meditations"
  ],
  "place": [
   "5,16 (sinngemäß)",
   "5.16 (paraphrased)"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Gedanken"
   ],
   [
    "Thoughts"
   ]
  ]
 },
 {
  "de": "Das Leben wird vorwärts gelebt und rückwärts verstanden.",
  "en": "Life can only be understood backwards, but it must be lived forwards.",
  "author": [
   "Søren Kierkegaard",
   "Søren Kierkegaard"
  ],
  "source": [
   "Tagebücher",
   "Journals"
  ],
  "place": [
   "1843",
   "1843"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Zeit"
   ],
   [
    "Time"
   ]
  ]
 },
 {
  "de": "Das Wichtigste ist, nicht aufzuhören zu fragen.",
  "en": "The important thing is not to stop questioning.",
  "author": [
   "Albert Einstein",
   "Albert Einstein"
  ],
  "source": [
   "Interview in LIFE",
   "Interview in LIFE"
  ],
  "place": [
   "1955",
   "1955"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Lernen"
   ],
   [
    "Learning"
   ]
  ]
 },
 {
  "de": "Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.",
  "en": "The limits of my language mean the limits of my world.",
  "author": [
   "Ludwig Wittgenstein",
   "Ludwig Wittgenstein"
  ],
  "source": [
   "Tractatus logico-philosophicus",
   "Tractatus Logico-Philosophicus"
  ],
  "place": [
   "5.6",
   "5.6"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Gedanken"
   ],
   [
    "Thoughts"
   ]
  ]
 },
 {
  "de": "Die Karte ist nicht das Gebiet.",
  "en": "The map is not the territory.",
  "author": [
   "Alfred Korzybski",
   "Alfred Korzybski"
  ],
  "source": [
   "Science and Sanity",
   "Science and Sanity"
  ],
  "place": [
   "1933",
   "1933"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Gedanken"
   ],
   [
    "Thoughts"
   ]
  ]
 },
 {
  "de": "Die beste Rache ist, nicht so zu werden wie der, der dir Unrecht tat.",
  "en": "The best revenge is not to become like the one who wronged you.",
  "author": [
   "Marcus Aurelius",
   "Marcus Aurelius"
  ],
  "source": [
   "Selbstbetrachtungen",
   "Meditations"
  ],
  "place": [
   "6,6",
   "6.6"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Beziehungen"
   ],
   [
    "Relationships"
   ]
  ]
 },
 {
  "de": "Die beste Zeit, einen Baum zu pflanzen, war vor zwanzig Jahren. Die zweitbeste ist jetzt.",
  "en": "The best time to plant a tree was twenty years ago. The second best time is now.",
  "author": [
   "",
   ""
  ],
  "source": [
   "Sprichwort",
   "Proverb"
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Zeit"
   ],
   [
    "Time"
   ]
  ]
 },
 {
  "de": "Du könntest jetzt aus dem Leben scheiden. Lass das bestimmen, was du tust, sagst und denkst.",
  "en": "You could leave life right now. Let that determine what you do and say and think.",
  "author": [
   "Marcus Aurelius",
   "Marcus Aurelius"
  ],
  "source": [
   "Selbstbetrachtungen",
   "Meditations"
  ],
  "place": [
   "2,11",
   "2.11"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Zeit"
   ],
   [
    "Time"
   ]
  ]
 },
 {
  "de": "Ein ungeprüftes Leben ist nicht lebenswert.",
  "en": "The unexamined life is not worth living.",
  "author": [
   "Sokrates",
   "Socrates"
  ],
  "source": [
   "Platon, Apologie",
   "Plato, Apology"
  ],
  "place": [
   "38a",
   "38a"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Werte"
   ],
   [
    "Values"
   ]
  ]
 },
 {
  "de": "Eine Reise von tausend Meilen beginnt mit einem einzigen Schritt.",
  "en": "A journey of a thousand miles begins with a single step.",
  "author": [
   "Laozi",
   "Laozi"
  ],
  "source": [
   "Tao te king",
   "Tao Te Ching"
  ],
  "place": [
   "64",
   "64"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Ziele"
   ],
   [
    "Goals"
   ]
  ]
 },
 {
  "de": "Entscheide dich für den Weg, den du weniger bereust.",
  "en": "Choose the path you will regret less.",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Entscheidungen"
   ],
   [
    "Decisions"
   ]
  ]
 },
 {
  "de": "Entscheide ich gerade aus Angst oder aus meinen Werten heraus?",
  "en": "Am I deciding out of fear or out of my values?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Entscheidungen"
   ],
   [
    "Decisions"
   ]
  ]
 },
 {
  "de": "Erkenne dich selbst.",
  "en": "Know thyself.",
  "author": [
   "",
   ""
  ],
  "source": [
   "Inschrift in Delphi",
   "Inscription at Delphi"
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Werte"
   ],
   [
    "Values"
   ]
  ]
 },
 {
  "de": "Es ist nicht genug zu wissen, man muss auch anwenden.",
  "en": "Knowing is not enough; we must apply.",
  "author": [
   "Johann Wolfgang von Goethe",
   "Johann Wolfgang von Goethe"
  ],
  "source": [
   "Wilhelm Meisters Wanderjahre",
   "Wilhelm Meister's Journeyman Years"
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Wachstum"
   ],
   [
    "Growth"
   ]
  ]
 },
 {
  "de": "Es zählt nicht der Kritiker, sondern der, der tatsächlich in der Arena steht.",
  "en": "It is not the critic who counts, but the one who is actually in the arena.",
  "author": [
   "Theodore Roosevelt",
   "Theodore Roosevelt"
  ],
  "source": [
   "Rede an der Sorbonne",
   "Speech at the Sorbonne"
  ],
  "place": [
   "1910 (sinngemäß)",
   "1910 (paraphrased)"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Mut"
   ],
   [
    "Courage"
   ]
  ]
 },
 {
  "de": "Gedanken sind keine Tatsachen.",
  "en": "Thoughts are not facts.",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Gedanken"
   ],
   [
    "Thoughts"
   ]
  ]
 },
 {
  "de": "Habe Mut, dich deines eigenen Verstandes zu bedienen.",
  "en": "Have courage to use your own understanding.",
  "author": [
   "Immanuel Kant",
   "Immanuel Kant"
  ],
  "source": [
   "Was ist Aufklärung?",
   "What Is Enlightenment?"
  ],
  "place": [
   "1784",
   "1784"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Wachstum"
   ],
   [
    "Growth"
   ]
  ]
 },
 {
  "de": "Ich ging in die Wälder, weil ich bewusst leben wollte.",
  "en": "I went to the woods because I wished to live deliberately.",
  "author": [
   "Henry David Thoreau",
   "Henry David Thoreau"
  ],
  "source": [
   "Walden",
   "Walden"
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Zeit"
   ],
   [
    "Time"
   ]
  ]
 },
 {
  "de": "Ich weiß, dass ich nichts weiß.",
  "en": "I know that I know nothing.",
  "author": [
   "Sokrates",
   "Socrates"
  ],
  "source": [
   "Platon, Apologie",
   "Plato, Apology"
  ],
  "place": [
   "21d (sinngemäß)",
   "21d (paraphrased)"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Lernen"
   ],
   [
    "Learning"
   ]
  ]
 },
 {
  "de": "Ist das gerade das Wichtigste, was ich tun könnte?",
  "en": "Is this the most important thing I could be doing right now?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Prioritäten"
   ],
   [
    "Priorities"
   ]
  ]
 },
 {
  "de": "Jedes Ding hat zwei Henkel: einen, an dem man es tragen kann, und einen, an dem man es nicht tragen kann.",
  "en": "Everything has two handles: one by which it can be carried, and one by which it cannot.",
  "author": [
   "Epiktet",
   "Epictetus"
  ],
  "source": [
   "Handbüchlein der Moral",
   "Enchiridion"
  ],
  "place": [
   "43",
   "43"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Perspektive"
   ],
   [
    "Perspective"
   ]
  ]
 },
 {
  "de": "Kaufe ich das, um es zu haben, oder um jemandem etwas zu beweisen?",
  "en": "Am I buying this to have it, or to prove something to someone?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Geld"
   ],
   [
    "Money"
   ]
  ]
 },
 {
  "de": "Man muss noch Chaos in sich haben, um einen tanzenden Stern gebären zu können.",
  "en": "One must still have chaos in oneself to give birth to a dancing star.",
  "author": [
   "Friedrich Nietzsche",
   "Friedrich Nietzsche"
  ],
  "source": [
   "Also sprach Zarathustra",
   "Thus Spoke Zarathustra"
  ],
  "place": [
   "Vorrede 5",
   "Prologue 5"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Wachstum"
   ],
   [
    "Growth"
   ]
  ]
 },
 {
  "de": "Manche Dinge liegen in unserer Macht, andere nicht.",
  "en": "Some things are within our power, others are not.",
  "author": [
   "Epiktet",
   "Epictetus"
  ],
  "source": [
   "Handbüchlein der Moral",
   "Enchiridion"
  ],
  "place": [
   "1",
   "1"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Perspektive"
   ],
   [
    "Perspective"
   ]
  ]
 },
 {
  "de": "Mit wem möchte ich in zehn Jahren noch befreundet sein – und was tue ich heute dafür?",
  "en": "Who do I want to still be friends with in ten years – and what am I doing for it today?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Beziehungen"
   ],
   [
    "Relationships"
   ]
  ]
 },
 {
  "de": "Nicht die Dinge beunruhigen uns, sondern unsere Meinungen über die Dinge.",
  "en": "It is not things that disturb us, but our opinions about things.",
  "author": [
   "Epiktet",
   "Epictetus"
  ],
  "source": [
   "Handbüchlein der Moral",
   "Enchiridion"
  ],
  "place": [
   "5",
   "5"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Gedanken"
   ],
   [
    "Thoughts"
   ]
  ]
 },
 {
  "de": "Reich ist, wer weiß, dass er genug hat.",
  "en": "He who knows he has enough is rich.",
  "author": [
   "Laozi",
   "Laozi"
  ],
  "source": [
   "Tao te king",
   "Tao Te Ching"
  ],
  "place": [
   "33",
   "33"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Glück"
   ],
   [
    "Happiness"
   ]
  ]
 },
 {
  "de": "Spielt das in fünf Jahren noch eine Rolle?",
  "en": "Will this still matter in five years?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Perspektive"
   ],
   [
    "Perspective"
   ]
  ]
 },
 {
  "de": "Verschwende keine Zeit mehr mit der Frage, was ein guter Mensch ist. Sei einer.",
  "en": "Waste no more time arguing what a good person should be. Be one.",
  "author": [
   "Marcus Aurelius",
   "Marcus Aurelius"
  ],
  "source": [
   "Selbstbetrachtungen",
   "Meditations"
  ],
  "place": [
   "10,16",
   "10.16"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Werte"
   ],
   [
    "Values"
   ]
  ]
 },
 {
  "de": "Versuchen Sie, die Fragen selbst liebzuhaben.",
  "en": "Try to love the questions themselves.",
  "author": [
   "Rainer Maria Rilke",
   "Rainer Maria Rilke"
  ],
  "source": [
   "Briefe an einen jungen Dichter",
   "Letters to a Young Poet"
  ],
  "place": [
   "4. Brief",
   "Letter 4"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Werte"
   ],
   [
    "Values"
   ]
  ]
 },
 {
  "de": "Wann habe ich zuletzt jemandem gesagt, was er mir bedeutet?",
  "en": "When did I last tell someone what they mean to me?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Beziehungen"
   ],
   [
    "Relationships"
   ]
  ]
 },
 {
  "de": "Was gibt mir Energie, und was raubt sie mir?",
  "en": "What gives me energy, and what drains it?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Gesundheit"
   ],
   [
    "Health"
   ]
  ]
 },
 {
  "de": "Was habe ich diese Woche gelernt?",
  "en": "What did I learn this week?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Reflexion"
   ],
   [
    "Reflection"
   ]
  ]
 },
 {
  "de": "Was habe ich heute Gutes getan?",
  "en": "What good have I done today?",
  "author": [
   "Benjamin Franklin",
   "Benjamin Franklin"
  ],
  "source": [
   "Autobiographie",
   "Autobiography"
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Reflexion"
   ],
   [
    "Reflection"
   ]
  ]
 },
 {
  "de": "Was habe ich heute vermieden?",
  "en": "What did I avoid today?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Reflexion"
   ],
   [
    "Reflection"
   ]
  ]
 },
 {
  "de": "Was habe ich mir einmal gewünscht, das ich heute für selbstverständlich halte?",
  "en": "What did I once wish for that I now take for granted?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Glück"
   ],
   [
    "Happiness"
   ]
  ]
 },
 {
  "de": "Was habe ich zuletzt geändert, weil ich dazugelernt habe?",
  "en": "What did I last change because I learned something?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Lernen"
   ],
   [
    "Learning"
   ]
  ]
 },
 {
  "de": "Was hat mir in früheren schweren Zeiten geholfen?",
  "en": "What helped me through hard times before?",
  "author": [
   "",
   ""
  ],
  "source": [
   "Lösungsorientierte Frage",
   "Solution-focused question"
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Krisen"
   ],
   [
    "Crises"
   ]
  ]
 },
 {
  "de": "Was im Weg steht, wird zum Weg.",
  "en": "What stands in the way becomes the way.",
  "author": [
   "Marcus Aurelius",
   "Marcus Aurelius"
  ],
  "source": [
   "Selbstbetrachtungen",
   "Meditations"
  ],
  "place": [
   "5,20 (sinngemäß)",
   "5.20 (paraphrased)"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Perspektive"
   ],
   [
    "Perspective"
   ]
  ]
 },
 {
  "de": "Was ist das kleinste mutige Ding, das ich heute tun kann?",
  "en": "What is the smallest brave thing I can do today?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Mut"
   ],
   [
    "Courage"
   ]
  ]
 },
 {
  "de": "Was ist die Frage, die ich mir gerade nicht stellen will?",
  "en": "What is the question I don't want to ask myself right now?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Coaching"
   ],
   [
    "Coaching"
   ]
  ]
 },
 {
  "de": "Was ist mir wirklich wichtig – und sieht man das in meinem Kalender?",
  "en": "What really matters to me – and does my calendar show it?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Werte"
   ],
   [
    "Values"
   ]
  ]
 },
 {
  "de": "Was liegt hier in meiner Kontrolle – und was nicht?",
  "en": "What is within my control here – and what isn't?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Perspektive"
   ],
   [
    "Perspective"
   ]
  ]
 },
 {
  "de": "Was macht mich lebendig – und tue ich genug davon?",
  "en": "What makes me feel alive – and do I do enough of it?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Glück"
   ],
   [
    "Happiness"
   ]
  ]
 },
 {
  "de": "Was mich nicht umbringt, macht mich stärker.",
  "en": "What does not kill me makes me stronger.",
  "author": [
   "Friedrich Nietzsche",
   "Friedrich Nietzsche"
  ],
  "source": [
   "Götzen-Dämmerung",
   "Twilight of the Idols"
  ],
  "place": [
   "Sprüche 8",
   "Maxims 8"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Mut"
   ],
   [
    "Courage"
   ]
  ]
 },
 {
  "de": "Was müsste passieren, damit ich in einem Jahr stolz auf mich bin?",
  "en": "What would have to happen for me to be proud of myself a year from now?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Ziele"
   ],
   [
    "Goals"
   ]
  ]
 },
 {
  "de": "Was sehe ich nicht, weil ich zu nah dran bin?",
  "en": "What am I not seeing because I'm too close to it?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Perspektive"
   ],
   [
    "Perspective"
   ]
  ]
 },
 {
  "de": "Was sind die Opportunitätskosten, wenn ich zu lange warte oder den falschen Weg gehe?",
  "en": "What does it cost me to wait too long or to take the wrong path?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Prioritäten"
   ],
   [
    "Priorities"
   ]
  ]
 },
 {
  "de": "Was weiß ich längst, will es aber nicht wahrhaben?",
  "en": "What do I already know but don't want to admit?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Gedanken"
   ],
   [
    "Thoughts"
   ]
  ]
 },
 {
  "de": "Was werde ich mir in zehn Jahren wünschen, heute getan zu haben?",
  "en": "What will I wish in ten years that I had done today?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Bedauern"
   ],
   [
    "Regret"
   ]
  ]
 },
 {
  "de": "Was wäre in einem Jahr anders, wenn ich heute anfange?",
  "en": "What would be different in a year if I started today?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Prioritäten"
   ],
   [
    "Priorities"
   ]
  ]
 },
 {
  "de": "Was würde ich anders machen, wenn ich nur noch ein Jahr zu leben hätte?",
  "en": "What would I do differently if I had only one year left to live?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Zeit"
   ],
   [
    "Time"
   ]
  ]
 },
 {
  "de": "Was würde ich aufhören zu tun, wenn ich ernst nähme, was mir wichtig ist?",
  "en": "What would I stop doing if I took what matters to me seriously?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Prioritäten"
   ],
   [
    "Priorities"
   ]
  ]
 },
 {
  "de": "Was würde ich erschaffen, wenn ich wüsste, dass es niemand sieht?",
  "en": "What would I create if I knew no one would see it?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Kreativität"
   ],
   [
    "Creativity"
   ]
  ]
 },
 {
  "de": "Was würde ich tun, wenn ich wüsste, dass dieser Zustand sich nie ändert?",
  "en": "What would I do if I knew this situation would never change?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Krisen"
   ],
   [
    "Crises"
   ]
  ]
 },
 {
  "de": "Was würde mein 18-jähriges Ich zu meinem heutigen Leben sagen?",
  "en": "What would my 18-year-old self say about my life today?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Perspektive"
   ],
   [
    "Perspective"
   ]
  ]
 },
 {
  "de": "Was würde mein 80-jähriges Ich mir jetzt raten?",
  "en": "What would my 80-year-old self advise me now?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Perspektive"
   ],
   [
    "Perspective"
   ]
  ]
 },
 {
  "de": "Was würde mir heute guttun?",
  "en": "What would do me good today?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Glück"
   ],
   [
    "Happiness"
   ]
  ]
 },
 {
  "de": "Was würde passieren, wenn ich einfach fragen würde?",
  "en": "What would happen if I simply asked?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Coaching"
   ],
   [
    "Coaching"
   ]
  ]
 },
 {
  "de": "Was würde passieren, wenn ich es gar nicht täte?",
  "en": "What would happen if I didn't do it at all?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Arbeit"
   ],
   [
    "Work"
   ]
  ]
 },
 {
  "de": "Welche Dinge tue ich vielleicht gerade zum letzten Mal, ohne es zu wissen?",
  "en": "What might I be doing for the last time without knowing it?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Zeit"
   ],
   [
    "Time"
   ]
  ]
 },
 {
  "de": "Welche Entscheidung schiebe ich auf – und was kostet mich das Aufschieben?",
  "en": "Which decision am I putting off – and what does putting it off cost me?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Entscheidungen"
   ],
   [
    "Decisions"
   ]
  ]
 },
 {
  "de": "Welche Geschichte möchte ich später einmal erzählen können?",
  "en": "What story do I want to be able to tell one day?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Ziele"
   ],
   [
    "Goals"
   ]
  ]
 },
 {
  "de": "Welche Gewohnheit würde in fünf Jahren den größten Unterschied machen?",
  "en": "Which habit would make the biggest difference in five years?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Wachstum"
   ],
   [
    "Growth"
   ]
  ]
 },
 {
  "de": "Welche Schwäche habe ich heute geheilt? Welcher Versuchung widerstanden?",
  "en": "What weakness have I healed today? What temptation have I resisted?",
  "author": [
   "Seneca",
   "Seneca"
  ],
  "source": [
   "Über den Zorn",
   "On Anger"
  ],
  "place": [
   "3,36",
   "3.36"
  ],
  "kind": "Frage",
  "topic": [
   [
    "Reflexion"
   ],
   [
    "Reflection"
   ]
  ]
 },
 {
  "de": "Welche Werte möchte ich vorleben, auch wenn es unbequem ist?",
  "en": "Which values do I want to live by, even when it's uncomfortable?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Werte"
   ],
   [
    "Values"
   ]
  ]
 },
 {
  "de": "Welche Überzeugung über mich selbst hält mich am meisten zurück?",
  "en": "Which belief about myself holds me back the most?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Wachstum"
   ],
   [
    "Growth"
   ]
  ]
 },
 {
  "de": "Welches Gespräch schiebe ich auf, obwohl es mein Leben verbessern würde?",
  "en": "Which conversation am I putting off, even though it would improve my life?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Beziehungen"
   ],
   [
    "Relationships"
   ]
  ]
 },
 {
  "de": "Welches Problem würde ich gern für den Rest meines Lebens lösen?",
  "en": "Which problem would I like to work on for the rest of my life?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Arbeit"
   ],
   [
    "Work"
   ]
  ]
 },
 {
  "de": "Wem genug zu wenig ist, dem ist nichts genug.",
  "en": "Nothing is enough for the one to whom enough is too little.",
  "author": [
   "Epikur",
   "Epicurus"
  ],
  "source": [
   "Vatikanische Spruchsammlung",
   "Vatican Sayings"
  ],
  "place": [
   "68",
   "68"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Glück"
   ],
   [
    "Happiness"
   ]
  ]
 },
 {
  "de": "Wem schulde ich noch ein Danke?",
  "en": "Who do I still owe a thank-you?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Beziehungen"
   ],
   [
    "Relationships"
   ]
  ]
 },
 {
  "de": "Wen würde ich anrufen, wenn ich nur noch einen Anruf hätte – und warum warte ich?",
  "en": "Who would I call if I had only one call left – and why am I waiting?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Beziehungen"
   ],
   [
    "Relationships"
   ]
  ]
 },
 {
  "de": "Wenn du nicht weißt, wohin du willst, ist jeder Weg der richtige.",
  "en": "If you don't know where you want to go, any road will take you there.",
  "author": [
   "Lewis Carroll",
   "Lewis Carroll"
  ],
  "source": [
   "Alice im Wunderland",
   "Alice in Wonderland"
  ],
  "place": [
   "sinngemäß",
   "paraphrased"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Perspektive"
   ],
   [
    "Perspective"
   ]
  ]
 },
 {
  "de": "Wenn ich heute neu anfangen müsste: Würde ich diesen Job wieder wählen?",
  "en": "If I had to start over today: would I choose this job again?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Arbeit"
   ],
   [
    "Work"
   ]
  ]
 },
 {
  "de": "Wenn ich nur noch drei Dinge tun dürfte: Welche wären es?",
  "en": "If I could only do three more things: which would they be?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Prioritäten"
   ],
   [
    "Priorities"
   ]
  ]
 },
 {
  "de": "Wenn ich so weitermache: Wo stehe ich in zehn Jahren – und will ich dort sein?",
  "en": "If I keep going like this: where will I be in ten years – and do I want to be there?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Prioritäten"
   ],
   [
    "Priorities"
   ]
  ]
 },
 {
  "de": "Wenn mein Leben ein Buch wäre: Wie hieße dieses Kapitel?",
  "en": "If my life were a book: what would this chapter be called?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Perspektive"
   ],
   [
    "Perspective"
   ]
  ]
 },
 {
  "de": "Wenn nicht jetzt, wann dann?",
  "en": "If not now, when?",
  "author": [
   "Hillel",
   "Hillel"
  ],
  "source": [
   "Sprüche der Väter",
   "Ethics of the Fathers"
  ],
  "place": [
   "1,14",
   "1:14"
  ],
  "kind": "Frage",
  "topic": [
   [
    "Zeit"
   ],
   [
    "Time"
   ]
  ]
 },
 {
  "de": "Wer bin ich, wenn ich nichts leiste?",
  "en": "Who am I when I'm not achieving anything?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Wachstum"
   ],
   [
    "Growth"
   ]
  ]
 },
 {
  "de": "Wer ein Warum zum Leben hat, erträgt fast jedes Wie.",
  "en": "Whoever has a why to live can bear almost any how.",
  "author": [
   "Friedrich Nietzsche",
   "Friedrich Nietzsche"
  ],
  "source": [
   "Götzen-Dämmerung",
   "Twilight of the Idols"
  ],
  "place": [
   "Sprüche 12",
   "Maxims 12"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Werte"
   ],
   [
    "Values"
   ]
  ]
 },
 {
  "de": "Wer möchte ich in fünf Jahren sein – und was würde diese Person heute tun?",
  "en": "Who do I want to be in five years – and what would that person do today?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Wachstum"
   ],
   [
    "Growth"
   ]
  ]
 },
 {
  "de": "Wer würde mir widersprechen – und womit könnte er recht haben?",
  "en": "Who would disagree with me – and what might they be right about?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Lernen"
   ],
   [
    "Learning"
   ]
  ]
 },
 {
  "de": "Werde, der du bist.",
  "en": "Become who you are.",
  "author": [
   "Friedrich Nietzsche",
   "Friedrich Nietzsche"
  ],
  "source": [
   "Die fröhliche Wissenschaft",
   "The Gay Science"
  ],
  "place": [
   "270 (sinngemäß)",
   "270 (paraphrased)"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Werte"
   ],
   [
    "Values"
   ]
  ]
 },
 {
  "de": "Wie geht es meinem Körper wirklich – und höre ich auf ihn?",
  "en": "How is my body really doing – and am I listening to it?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Gesundheit"
   ],
   [
    "Health"
   ]
  ]
 },
 {
  "de": "Wie sähe mein Leben aus, wenn ich von weit oben darauf schaue?",
  "en": "What would my life look like if I looked at it from high above?",
  "author": [
   "",
   ""
  ],
  "source": [
   "Stoische Übung: Blick von oben",
   "Stoic exercise: view from above"
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Perspektive"
   ],
   [
    "Perspective"
   ]
  ]
 },
 {
  "de": "Wie würde jemand, den ich bewundere, diese Situation sehen?",
  "en": "How would someone I admire see this situation?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Perspektive"
   ],
   [
    "Perspective"
   ]
  ]
 },
 {
  "de": "Will ich das Ziel – oder das Gefühl, das ich mir davon verspreche?",
  "en": "Do I want the goal – or the feeling I expect from it?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Ziele"
   ],
   [
    "Goals"
   ]
  ]
 },
 {
  "de": "Wir haben nicht zu wenig Zeit, sondern wir verschwenden zu viel davon.",
  "en": "It is not that we have too little time, but that we waste too much of it.",
  "author": [
   "Seneca",
   "Seneca"
  ],
  "source": [
   "Von der Kürze des Lebens",
   "On the Shortness of Life"
  ],
  "place": [
   "1",
   "1"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Zeit"
   ],
   [
    "Time"
   ]
  ]
 },
 {
  "de": "Wir leiden öfter in der Vorstellung als in der Wirklichkeit.",
  "en": "We suffer more often in imagination than in reality.",
  "author": [
   "Seneca",
   "Seneca"
  ],
  "source": [
   "Briefe an Lucilius",
   "Letters to Lucilius"
  ],
  "place": [
   "13,4",
   "13.4"
  ],
  "kind": "Aussage",
  "topic": [
   [
    "Mut"
   ],
   [
    "Courage"
   ]
  ]
 },
 {
  "de": "Wo sage ich Ja, obwohl ich Nein meine?",
  "en": "Where am I saying yes when I mean no?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Beziehungen"
   ],
   [
    "Relationships"
   ]
  ]
 },
 {
  "de": "Wo treffen sich, was ich liebe, was ich gut kann, was die Welt braucht und wofür man mich bezahlt?",
  "en": "Where do what I love, what I'm good at, what the world needs and what I can be paid for meet?",
  "author": [
   "",
   ""
  ],
  "source": [
   "Ikigai",
   "Ikigai"
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Werte"
   ],
   [
    "Values"
   ]
  ]
 },
 {
  "de": "Wofür arbeite ich eigentlich – und wann ist es genug?",
  "en": "What am I actually working for – and when is it enough?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Geld"
   ],
   [
    "Money"
   ]
  ]
 },
 {
  "de": "Wofür bin ich heute dankbar?",
  "en": "What am I grateful for today?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Reflexion"
   ],
   [
    "Reflection"
   ]
  ]
 },
 {
  "de": "Woran werde ich mich in fünf Jahren von diesem Monat erinnern?",
  "en": "What will I remember about this month in five years?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Zeit"
   ],
   [
    "Time"
   ]
  ]
 },
 {
  "de": "Woran würde ich merken, dass ich angekommen bin?",
  "en": "How would I know that I have arrived?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Ziele"
   ],
   [
    "Goals"
   ]
  ]
 },
 {
  "de": "Worauf verzichte ich gerade unbemerkt, indem ich „später“ sage?",
  "en": "What am I quietly giving up by saying \"later\"?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Prioritäten"
   ],
   [
    "Priorities"
   ]
  ]
 },
 {
  "de": "Wovor genau habe ich Angst – und wie wahrscheinlich ist es wirklich?",
  "en": "What exactly am I afraid of – and how likely is it really?",
  "author": [
   "",
   ""
  ],
  "source": [
   "",
   ""
  ],
  "place": [
   "",
   ""
  ],
  "kind": "Frage",
  "topic": [
   [
    "Mut"
   ],
   [
    "Courage"
   ]
  ]
 }
];

