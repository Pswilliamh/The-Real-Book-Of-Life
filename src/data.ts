// The Real Book of Life structural truths and historical-scientific data assets.

export interface CreationDay {
  id: number;
  title: string;
  subtitle: string;
  summary: string;
  scriptureRef: string;
  scriptureText: string;
  pressureAtm: number;
  tempK: number;
  vortexFrequencyHz: number;
  activeLayers: string[];
}

export interface GroundingColumn {
  id: string;
  name: string;
  color: string;
  accentClass: string;
  frequency: number;
  integrity: number;
  description: string;
  theologyRef: string;
}

export interface SedimentLayer {
  id: string;
  name: string;
  thickness: string;
  composition: string;
  moistureFlow: string;
  color: string;
}

export interface DialoguePair {
  id: number;
  critical: string;
  supportive: string;
}

export interface HebrewLetter {
  char: string;
  name: string;
  value: number;
  sofiaValue: number;
  frequency: number; // tone sound
  meaning: string;
}

export const CREATION_DAYS: CreationDay[] = [
  {
    id: 1,
    title: "Day 1: Command & Light Waves",
    subtitle: "Scalar wave separation and the acoustic call Of light.",
    summary: "Establishment of the primary frequency matrix. Divine voice acts as a scalar compression wave setting the foundations of cosmic vibration.",
    scriptureRef: "Genesis 1:3",
    scriptureText: "וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי אוֹר (And God said, Let there be light: and there was light.)",
    pressureAtm: 1.0,
    tempK: 273.15,
    vortexFrequencyHz: 432,
    activeLayers: ["Atmosphere", "Flat Earth Plane", "Outer Waters"]
  },
  {
    id: 2,
    title: "Day 2: Atmosphere & Expansion",
    subtitle: "The dividing firmament separates the high and low waters.",
    summary: "Creation of the double-layered pressurized crystalline sphere dividing the waters above from the subterranean reservoirs below.",
    scriptureRef: "Genesis 1:6",
    scriptureText: "וַיֹּאמֶר אֱלֹהִים יְהִי רָקִיעַ בְּתוֹךְ הַמָּיִם וִיהִי מַבְדִּיל בֵּין מַיִם לָמָיִם",
    pressureAtm: 1.8,
    tempK: 285.4,
    vortexFrequencyHz: 528,
    activeLayers: ["Crystalline Dome", "Upper Waters", "Atmosphere"]
  },
  {
    id: 3,
    title: "Day 3: Dry Land & Sieve Filters",
    subtitle: "Gathering of waters, emergence of dry continents and plant matrices.",
    summary: "The horizontal earth crust rises, creating continent profiles (Eurasia, Africa, Americas) and triggering underground aquifers and mineral seeds.",
    scriptureRef: "Genesis 1:9",
    scriptureText: "תִּקָּווּ הַמַּיִם מִתַּחַת הַשָּׁמַיִם אֶל מָקוֹם אֶחָד וְתֵרָאֶה הַיַּבָּשָׁה",
    pressureAtm: 2.1,
    tempK: 290.0,
    vortexFrequencyHz: 639,
    activeLayers: ["Continents", "Sediment Strata", "Acoustic Vegetation"]
  },
  {
    id: 4,
    title: "Day 4: Celestial Orbits & Clockwork",
    subtitle: "Sun, Moon, and Stars aligned along the Figure-8 Analemma path.",
    summary: "The primary clockwork system. The solar node and lunar crescent are activated inside the dome, governed by 3-6-9 electromagnet forces.",
    scriptureRef: "Genesis 1:14",
    scriptureText: "יְהִי מְאֹרֹת בִּרְקִיעַ הַשָּׁמַיִם לְהַבְדִּיל בֵּין הַיּוֹם וּבֵין הַלָּיְלָה",
    pressureAtm: 2.4,
    tempK: 295.5,
    vortexFrequencyHz: 741,
    activeLayers: ["Crystalline Dome", "Analemma Orbit", "Celestial Orbs"]
  },
  {
    id: 5,
    title: "Day 5: Aquatic & Avian Life Seeds",
    subtitle: "Flowing edge waterfalls and flying atmospheric pneuma.",
    summary: "Activation of life forms inhabiting the active recycling water channels and hyperbaric atmospheric layers.",
    scriptureRef: "Genesis 1:20",
    scriptureText: "יִשְׁרְצוּ הַמַּיִם שֶׁרֶץ נֶפֶשׁ חַיָּה וְעוֹף יְעוֹפֵף עַל הָאָרֶץ",
    pressureAtm: 2.5,
    tempK: 298.0,
    vortexFrequencyHz: 852,
    activeLayers: ["Edge Waterfalls", "Aquifer Reservoirs", "Atmosphere"]
  },
  {
    id: 6,
    title: "Day 6: Earth Beings & Spirit Breath",
    subtitle: "Sovereign biological crowns and the final grounding temples.",
    summary: "The synthesis of material soil and divine non-polarized spirit, anchoring the material realm in deep harmonic congruence.",
    scriptureRef: "Genesis 1:24",
    scriptureText: "תּוֹצֵא הָאָרֶץ נֶפֶשׁ חַיָּה לְמִינָהּ בְּהֵמָה וָרֶמֶשׂ וְחַיְתוֹ אֶרֶץ",
    pressureAtm: 2.4,
    tempK: 300.0,
    vortexFrequencyHz: 963,
    activeLayers: ["Continents", "Four Grounding Pillars", "Pneuma Flow"]
  },
  {
    id: 7,
    title: "Day 7: Covenant Equilibrium & Rest",
    subtitle: "Perfect hydrostatic equilibrium and 3-6-9 vortex rest state.",
    summary: "Energy orbits achieve complete static harmony. Hydroelectric cycles perform in loop-back status. Sealed containment secures long-term wellness.",
    scriptureRef: "Genesis 2:2",
    scriptureText: "וַיִּשְׁבֹּת בַּיּוֹם הַשְּׁבִיעִי מִכָּל מְלַאכְתּוֹ אֲשֶׁר עָשָׂה",
    pressureAtm: 2.2,
    tempK: 294.1,
    vortexFrequencyHz: 369,
    activeLayers: ["Complete Closed Environment"]
  }
];

export const GROUNDING_COLUMNS: GroundingColumn[] = [
  {
    id: "aquatic",
    name: "Aquatic Pillar",
    color: "cyan",
    accentClass: "border-cyan-400 text-cyan-400 bg-cyan-950/30",
    frequency: 444,
    integrity: 98,
    description: "Channels active hydrostatic feedback currents down into regional oceans, preventing core expansion overload.",
    theologyRef: "Amos 9:6"
  },
  {
    id: "living-core",
    name: "Living Core Pillar",
    color: "emerald",
    accentClass: "border-emerald-400 text-emerald-400 bg-emerald-950/30",
    frequency: 528,
    integrity: 95,
    description: "Anchors genetic botanical templates and transfers metabolic vital forces into the surrounding terrestrial topsoil.",
    theologyRef: "Psalm 104:14"
  },
  {
    id: "crystalline",
    name: "Crystalline Pillar",
    color: "fuchsia",
    accentClass: "border-fuchsia-400 text-fuchsia-400 bg-fuchsia-950/30",
    frequency: 741,
    integrity: 92,
    description: "Synthesizes magnetic and quartz frequency alignments, maintaining structural rigid stabilization of the level ground.",
    theologyRef: "Job 38:6"
  },
  {
    id: "temple",
    name: "Temple Pillar",
    color: "amber",
    accentClass: "border-amber-400 text-amber-400 bg-amber-950/30",
    frequency: 963,
    integrity: 97,
    description: "Aligns the human vocal center with divine covenant parameters. Radiates golden illumination rays throughout basement sediment layers.",
    theologyRef: "Isaiah 6:3"
  }
];

export const SEDIMENT_LAYERS: SedimentLayer[] = [
  {
    id: "topsoil",
    name: "Topsoil Sediment",
    thickness: "0 - 150m",
    composition: "Humic botanical compounds & fertile magnetic clay",
    moistureFlow: "Humid (72%)",
    color: "bg-amber-950/60"
  },
  {
    id: "gravel",
    name: "Sieve Gravel Filter",
    thickness: "150 - 600m",
    composition: "Porous limestone, quartz pebbles & water purifier sands",
    moistureFlow: "Rapid percolation (5.4 m/s)",
    color: "bg-stone-700/60"
  },
  {
    id: "aquifer",
    name: "Deep Hydro-Aquifers",
    thickness: "600 - 1800m",
    composition: "Subterranean pressure channels & rich thermal aquifers",
    moistureFlow: "Continuous recycling currents",
    color: "bg-blue-900/60"
  },
  {
    id: "bedrock",
    name: "Basal Bedrock Pillar",
    thickness: "1800m+",
    composition: "Highly dense crystalline basalt & atomic basalt columns",
    moistureFlow: "Sealed (0.01% leak rating)",
    color: "bg-slate-900/90"
  }
];

export const DIALOGUE_PRESETS: DialoguePair[] = [
  {
    id: 1,
    critical: "My environment limits me, and there is not enough vital resource for my growth.",
    supportive: "Covenant alignment declares: Subterranean deep aquifers feed the horizontal terrestrial soil, and my ground sustains perfect abundance."
  },
  {
    id: 2,
    critical: "I operate under heavy pressure and feel on the absolute verge of breaking.",
    supportive: "Atmospheric scan reveals: High-pressure firmament enclosure coordinates are completely sealed to sustain my micro-biological cellular equilibrium."
  },
  {
    id: 3,
    critical: "I am completely isolated and detached from the foundational columns.",
    supportive: "Linguistic frequency decoding anchors: I am structurally grounded on four mighty pillars of Aquatic, Living, Crystalline, and Temple integrity."
  },
  {
    id: 4,
    critical: "Chaos and cosmic radiation are leaking in, disrupting my peace.",
    supportive: "Pressurized Shield reports: Thermal outer water vaults deflect 100% of cosmic noise, and the central vortex portal establishes direct vertical line connection."
  }
];

export const HEBREW_ALPHABET: HebrewLetter[] = [
  { char: "א", name: "Aleph", value: 1, sofiaValue: 1, frequency: 111, meaning: "Sovereign Crown / Source Power" },
  { char: "ב", name: "Bet", value: 2, sofiaValue: 2, frequency: 222, meaning: "Containment Vessel / Structural House" },
  { char: "ג", name: "Gimel", value: 3, sofiaValue: 3, frequency: 333, meaning: "Benevolent Flow / Vector Ascent" },
  { char: "ד", name: "Dalet", value: 4, sofiaValue: 4, frequency: 444, meaning: "Horizontal Gateway / Grounding Portal" },
  { char: "ה", name: "He", value: 5, sofiaValue: 5, frequency: 417, meaning: "Divine Breath / Expansion Space" },
  { char: "ו", name: "Vav", value: 6, sofiaValue: 6, frequency: 528, meaning: "Electromagnetic Anchor / Pillar Hook" },
  { char: "ז", name: "Zayin", value: 7, sofiaValue: 7, frequency: 639, meaning: "Vortex Sword / Active Axis" },
  { char: "ח", name: "Het", value: 8, sofiaValue: 8, frequency: 711, meaning: "Gravel Sieve Fence / Sealed Chamber" },
  { char: "ט", name: "Tet", value: 9, sofiaValue: 9, frequency: 852, meaning: "Vortex Loop Circle / Perfect Embryo" },
  { char: "י", name: "Yod", value: 10, sofiaValue: 1, frequency: 963, meaning: "Pneuma Spark / Celestial Digit" },
  { char: "כ", name: "Kaf", value: 20, sofiaValue: 2, frequency: 120, meaning: "Curved Hand / Hydraulic Basin" },
  { char: "ל", name: "Lamed", value: 30, sofiaValue: 3, frequency: 130, meaning: "Acoustic Pointer / Guidance Altitude" },
  { char: "מ", name: "Mem", value: 40, sofiaValue: 4, frequency: 432, meaning: "Deep Aquifer / Celestial Waters" },
  { char: "נ", name: "Nun", value: 50, sofiaValue: 5, frequency: 150, meaning: "Sovereign Seed / Fluid Biological Temple" },
  { char: "ס", name: "Samekh", value: 60, sofiaValue: 6, frequency: 160, meaning: "Crystalline Glass Dome Enclosure" },
  { char: "ע", name: "Ayin", value: 70, sofiaValue: 7, frequency: 170, meaning: "Central Vortex Portal Eye" },
  { char: "פ", name: "Pe", value: 80, sofiaValue: 8, frequency: 180, meaning: "Active Oral Waveform / Voice Command" },
  { char: "צ", name: "Tsadi", value: 90, sofiaValue: 9, frequency: 190, meaning: "Righteous Column Anchor" },
  { char: "ק", name: "Kof", value: 100, sofiaValue: 1, frequency: 200, meaning: "Solar Analemma Node Axis" },
  { char: "ר", name: "Resh", value: 200, sofiaValue: 2, frequency: 220, meaning: "Cosmic Mind Core" },
  { char: "ש", name: "Shin", value: 300, sofiaValue: 3, frequency: 300, meaning: "Tri-Pole Flame / Tesla Force" },
  { char: "ת", name: "Tav", value: 400, sofiaValue: 4, frequency: 400, meaning: "Eternal Covenant Seal" }
];
