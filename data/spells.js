/*
 * D&D 5e SRD spell data (starter set).
 * Source: System Reference Document 5.1 (Wizards of the Coast, CC-BY-4.0 / OGL).
 * Descriptions are condensed for a glanceable heads-up display.
 *
 * This is a representative subset (cantrips through level 3, all core classes).
 * To load the FULL SRD spell list later, replace this array with the ~319-spell
 * dataset (see README "Expanding the spell list") — the app needs no other changes.
 *
 * Schema per spell:
 *   name         string
 *   level        number   (0 = cantrip)
 *   school       string
 *   classes      string[] (class names that can cast it)
 *   cast         string   (casting time)
 *   range        string
 *   components   string   (V / S / M markers)
 *   duration     string
 *   desc         string   (short, HUD-friendly)
 */
window.SPELLS = [
  // ---- Cantrips (level 0) ----
  { name: "Fire Bolt", level: 0, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "120 ft", components: "V, S", duration: "Instant", desc: "Ranged spell attack for 1d10 fire. Ignites unattended flammable objects. Damage scales with level." },
  { name: "Eldritch Blast", level: 0, school: "Evocation", classes: ["Warlock"], cast: "1 action", range: "120 ft", components: "V, S", duration: "Instant", desc: "Ranged spell attack, 1d10 force. Gains extra beams at levels 5, 11, 17." },
  { name: "Ray of Frost", level: 0, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "60 ft", components: "V, S", duration: "Instant", desc: "Ranged spell attack, 1d8 cold and target's speed drops by 10 ft until your next turn." },
  { name: "Sacred Flame", level: 0, school: "Evocation", classes: ["Cleric"], cast: "1 action", range: "60 ft", components: "V, S", duration: "Instant", desc: "Target makes a Dex save or takes 1d8 radiant. Ignores cover." },
  { name: "Vicious Mockery", level: 0, school: "Enchantment", classes: ["Bard"], cast: "1 action", range: "60 ft", components: "V", duration: "Instant", desc: "Wis save or 1d4 psychic and disadvantage on its next attack roll." },
  { name: "Mage Hand", level: 0, school: "Conjuration", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "30 ft", components: "V, S", duration: "1 minute", desc: "Spectral hand manipulates objects up to 10 lb. Can't attack or carry more." },
  { name: "Minor Illusion", level: 0, school: "Illusion", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "30 ft", components: "S, M", duration: "1 minute", desc: "Create a sound or an image of an object (5-ft cube). Investigation check reveals it." },
  { name: "Prestidigitation", level: 0, school: "Transmutation", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "10 ft", components: "V, S", duration: "Up to 1 hour", desc: "Minor magical trick: spark, clean/soil, flavor, tiny mark, or trinket." },
  { name: "Guidance", level: 0, school: "Divination", classes: ["Cleric", "Druid"], cast: "1 action", range: "Touch", components: "V, S", duration: "Conc. 1 min", desc: "Willing target adds 1d4 to one ability check of its choice." },
  { name: "Druidcraft", level: 0, school: "Transmutation", classes: ["Druid"], cast: "1 action", range: "30 ft", components: "V, S", duration: "Instant", desc: "Predict weather, bloom a flower, sense nature, or a minor sensory effect." },

  // ---- Level 1 ----
  { name: "Magic Missile", level: 1, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "120 ft", components: "V, S", duration: "Instant", desc: "Three darts, 1d4+1 force each, auto-hit. +1 dart per slot level above 1st." },
  { name: "Shield", level: 1, school: "Abjuration", classes: ["Sorcerer", "Wizard"], cast: "1 reaction", range: "Self", components: "V, S", duration: "1 round", desc: "+5 AC until your next turn, including vs the triggering attack. Blocks Magic Missile." },
  { name: "Cure Wounds", level: 1, school: "Evocation", classes: ["Bard", "Cleric", "Druid", "Paladin", "Ranger"], cast: "1 action", range: "Touch", components: "V, S", duration: "Instant", desc: "Heal 1d8 + spellcasting mod. +1d8 per slot above 1st. No effect on undead/constructs." },
  { name: "Healing Word", level: 1, school: "Evocation", classes: ["Bard", "Cleric", "Druid"], cast: "1 bonus action", range: "60 ft", components: "V", duration: "Instant", desc: "Heal 1d4 + mod at range. +1d4 per slot above 1st. Great for reviving downed allies." },
  { name: "Bless", level: 1, school: "Enchantment", classes: ["Cleric", "Paladin"], cast: "1 action", range: "30 ft", components: "V, S, M", duration: "Conc. 1 min", desc: "Up to 3 creatures add 1d4 to attack rolls and saving throws." },
  { name: "Guiding Bolt", level: 1, school: "Evocation", classes: ["Cleric"], cast: "1 action", range: "120 ft", components: "V, S", duration: "1 round", desc: "Ranged spell attack, 4d6 radiant. Next attacker vs target has advantage." },
  { name: "Faerie Fire", level: 1, school: "Evocation", classes: ["Bard", "Druid"], cast: "1 action", range: "60 ft", components: "V", duration: "Conc. 1 min", desc: "Dex save or outlined in light: attacks vs it have advantage, no benefit from invisibility." },
  { name: "Sleep", level: 1, school: "Enchantment", classes: ["Bard", "Sorcerer", "Wizard"], cast: "1 action", range: "90 ft", components: "V, S, M", duration: "1 minute", desc: "5d8 HP of creatures (lowest first) fall unconscious. +2d8 per slot above 1st." },
  { name: "Thunderwave", level: 1, school: "Evocation", classes: ["Bard", "Druid", "Sorcerer", "Wizard"], cast: "1 action", range: "Self (15-ft cube)", components: "V, S", duration: "Instant", desc: "Con save; 2d8 thunder and pushed 10 ft on fail (half, no push on success)." },
  { name: "Hex", level: 1, school: "Enchantment", classes: ["Warlock"], cast: "1 bonus action", range: "90 ft", components: "V, S, M", duration: "Conc. 1 hr", desc: "+1d6 necrotic on your hits vs target; it has disadvantage on a chosen ability." },
  { name: "Charm Person", level: 1, school: "Enchantment", classes: ["Bard", "Druid", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "30 ft", components: "V, S", duration: "1 hour", desc: "Wis save or charmed by you. It knows it was charmed when the spell ends." },
  { name: "Detect Magic", level: 1, school: "Divination", classes: ["Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Wizard"], cast: "1 action", range: "Self", components: "V, S", duration: "Conc. 10 min", desc: "Sense magic within 30 ft; learn each aura's school. Ritual." },

  // ---- Level 2 ----
  { name: "Misty Step", level: 2, school: "Conjuration", classes: ["Sorcerer", "Warlock", "Wizard"], cast: "1 bonus action", range: "Self", components: "V", duration: "Instant", desc: "Teleport up to 30 ft to an unoccupied space you can see." },
  { name: "Scorching Ray", level: 2, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "120 ft", components: "V, S", duration: "Instant", desc: "Three rays, each a ranged spell attack for 2d6 fire. +1 ray per slot above 2nd." },
  { name: "Hold Person", level: 2, school: "Enchantment", classes: ["Bard", "Cleric", "Druid", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "60 ft", components: "V, S, M", duration: "Conc. 1 min", desc: "Humanoid makes Wis save or is paralyzed; repeats save each turn." },
  { name: "Spiritual Weapon", level: 2, school: "Evocation", classes: ["Cleric"], cast: "1 bonus action", range: "60 ft", components: "V, S", duration: "1 minute", desc: "Floating weapon: melee spell attack for 1d8 + mod force. Move it 20 ft as a bonus action." },
  { name: "Invisibility", level: 2, school: "Illusion", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "Touch", components: "V, S, M", duration: "Conc. 1 hr", desc: "Target turns invisible until it attacks or casts a spell." },
  { name: "Lesser Restoration", level: 2, school: "Abjuration", classes: ["Bard", "Cleric", "Druid", "Paladin", "Ranger"], cast: "1 action", range: "Touch", components: "V, S", duration: "Instant", desc: "End one disease or the blinded, deafened, paralyzed, or poisoned condition." },
  { name: "Web", level: 2, school: "Conjuration", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "60 ft", components: "V, S, M", duration: "Conc. 1 hr", desc: "20-ft cube of webs: difficult terrain; Dex save or restrained. Flammable." },
  { name: "Moonbeam", level: 2, school: "Evocation", classes: ["Druid"], cast: "1 action", range: "120 ft", components: "V, S, M", duration: "Conc. 1 min", desc: "5-ft beam; Con save for 2d10 radiant (half on success). Move it 60 ft each turn." },

  // ---- Level 3 ----
  { name: "Fireball", level: 3, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "150 ft", components: "V, S, M", duration: "Instant", desc: "20-ft radius; Dex save for 8d6 fire (half on success). +1d6 per slot above 3rd." },
  { name: "Counterspell", level: 3, school: "Abjuration", classes: ["Sorcerer", "Warlock", "Wizard"], cast: "1 reaction", range: "60 ft", components: "S", duration: "Instant", desc: "Interrupt a spell of 3rd level or lower automatically; higher needs an ability check." },
  { name: "Lightning Bolt", level: 3, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "Self (100-ft line)", components: "V, S, M", duration: "Instant", desc: "100-ft line; Dex save for 8d6 lightning (half on success). Ignites objects." },
  { name: "Fly", level: 3, school: "Transmutation", classes: ["Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "Touch", components: "V, S, M", duration: "Conc. 10 min", desc: "Target gains a flying speed of 60 ft. +1 target per slot above 3rd." },
  { name: "Dispel Magic", level: 3, school: "Abjuration", classes: ["Bard", "Cleric", "Druid", "Paladin", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "120 ft", components: "V, S", duration: "Instant", desc: "End spells of 3rd level or lower; higher needs an ability check per spell." },
  { name: "Revivify", level: 3, school: "Necromancy", classes: ["Cleric", "Paladin"], cast: "1 action", range: "Touch", components: "V, S, M", duration: "Instant", desc: "Return a creature dead less than 1 minute to life with 1 HP. Costs 300 gp diamond." },
  { name: "Spirit Guardians", level: 3, school: "Conjuration", classes: ["Cleric"], cast: "1 action", range: "Self (15 ft)", components: "V, S, M", duration: "Conc. 10 min", desc: "Protective spirits: enemies' speed halved; Wis save for 3d8 radiant/necrotic (half on success)." },
  { name: "Haste", level: 3, school: "Transmutation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "30 ft", components: "V, S, M", duration: "Conc. 1 min", desc: "Target: +2 AC, double speed, advantage on Dex saves, one extra limited action." },
  { name: "Mass Healing Word", level: 3, school: "Evocation", classes: ["Cleric"], cast: "1 bonus action", range: "60 ft", components: "V", duration: "Instant", desc: "Up to 6 creatures heal 1d4 + mod. +1d4 per slot above 3rd." },

  // ---- Expanded set: more cantrips ----
  { name: "Light", level: 0, school: "Evocation", classes: ["Bard", "Cleric", "Sorcerer", "Wizard"], cast: "1 action", range: "Touch", components: "V, M", duration: "1 hour", desc: "Object sheds bright light in a 20-ft radius. Dex save to avoid if cast on a creature." },
  { name: "Mending", level: 0, school: "Transmutation", classes: ["Bard", "Cleric", "Druid", "Sorcerer", "Wizard"], cast: "1 minute", range: "Touch", components: "V, S, M", duration: "Instant", desc: "Repair a single break or tear in an object (no larger than 1 ft)." },
  { name: "Message", level: 0, school: "Transmutation", classes: ["Bard", "Sorcerer", "Wizard"], cast: "1 action", range: "120 ft", components: "V, S, M", duration: "1 round", desc: "Whisper a message to a creature you point at; it can whisper back." },
  { name: "Shocking Grasp", level: 0, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "Touch", components: "V, S", duration: "Instant", desc: "Melee spell attack, 1d8 lightning; target can't take reactions until its next turn." },
  { name: "Poison Spray", level: 0, school: "Conjuration", classes: ["Druid", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "10 ft", components: "V, S", duration: "Instant", desc: "Con save or 1d12 poison damage." },
  { name: "Chill Touch", level: 0, school: "Necromancy", classes: ["Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "120 ft", components: "V, S", duration: "1 round", desc: "Ranged spell attack, 1d8 necrotic; target can't regain HP until your next turn." },
  { name: "Acid Splash", level: 0, school: "Conjuration", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "60 ft", components: "V, S", duration: "Instant", desc: "One or two nearby creatures make a Dex save or take 1d6 acid." },
  { name: "Spare the Dying", level: 0, school: "Necromancy", classes: ["Cleric"], cast: "1 action", range: "Touch", components: "V, S", duration: "Instant", desc: "Stabilize a creature at 0 HP." },
  { name: "Thaumaturgy", level: 0, school: "Transmutation", classes: ["Cleric"], cast: "1 action", range: "30 ft", components: "V", duration: "Up to 1 min", desc: "Minor wonder: booming voice, flickering flames, tremors, or other sign." },
  { name: "Resistance", level: 0, school: "Abjuration", classes: ["Cleric", "Druid"], cast: "1 action", range: "Touch", components: "V, S", duration: "Conc. 1 min", desc: "Target adds 1d4 to one saving throw of its choice." },
  { name: "Dancing Lights", level: 0, school: "Evocation", classes: ["Bard", "Sorcerer", "Wizard"], cast: "1 action", range: "120 ft", components: "V, S, M", duration: "Conc. 1 min", desc: "Create up to four floating lights you can move." },
  { name: "True Strike", level: 0, school: "Divination", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "30 ft", components: "S", duration: "Conc. 1 round", desc: "Advantage on your next attack roll against the target." },

  // ---- Level 1 (more) ----
  { name: "Burning Hands", level: 1, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "Self (15-ft cone)", components: "V, S", duration: "Instant", desc: "Dex save for 3d6 fire (half on success). Ignites flammable objects." },
  { name: "Mage Armor", level: 1, school: "Abjuration", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "Touch", components: "V, S, M", duration: "8 hours", desc: "Unarmored target's base AC becomes 13 + Dex modifier." },
  { name: "Chromatic Orb", level: 1, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "90 ft", components: "V, S, M", duration: "Instant", desc: "Ranged spell attack, 3d8 of a chosen damage type." },
  { name: "Command", level: 1, school: "Enchantment", classes: ["Cleric", "Paladin"], cast: "1 action", range: "60 ft", components: "V", duration: "1 round", desc: "Wis save or the target obeys a one-word command (approach, drop, flee...)." },
  { name: "Inflict Wounds", level: 1, school: "Necromancy", classes: ["Cleric"], cast: "1 action", range: "Touch", components: "V, S", duration: "Instant", desc: "Melee spell attack for 3d10 necrotic." },
  { name: "Shield of Faith", level: 1, school: "Abjuration", classes: ["Cleric", "Paladin"], cast: "1 bonus action", range: "60 ft", components: "V, S, M", duration: "Conc. 10 min", desc: "Target gains +2 AC." },
  { name: "Fog Cloud", level: 1, school: "Conjuration", classes: ["Druid", "Ranger", "Sorcerer", "Wizard"], cast: "1 action", range: "120 ft", components: "V, S", duration: "Conc. 1 hr", desc: "20-ft-radius sphere of heavily obscuring fog." },
  { name: "Entangle", level: 1, school: "Conjuration", classes: ["Druid"], cast: "1 action", range: "90 ft", components: "V, S", duration: "Conc. 1 min", desc: "20-ft square of grasping weeds; Str save or restrained." },
  { name: "Goodberry", level: 1, school: "Transmutation", classes: ["Druid", "Ranger"], cast: "1 action", range: "Touch", components: "V, S, M", duration: "Instant", desc: "Create 10 berries; eating one restores 1 HP and feeds for a day." },
  { name: "Hunter's Mark", level: 1, school: "Divination", classes: ["Ranger"], cast: "1 bonus action", range: "90 ft", components: "V", duration: "Conc. 1 hr", desc: "+1d6 damage on your hits vs the target; advantage to track it." },
  { name: "Divine Favor", level: 1, school: "Evocation", classes: ["Paladin"], cast: "1 bonus action", range: "Self", components: "V, S", duration: "Conc. 1 min", desc: "Your weapon hits deal +1d4 radiant." },
  { name: "Feather Fall", level: 1, school: "Transmutation", classes: ["Bard", "Sorcerer", "Wizard"], cast: "1 reaction", range: "60 ft", components: "V, M", duration: "1 minute", desc: "Up to 5 falling creatures descend safely and take no fall damage." },
  { name: "Longstrider", level: 1, school: "Transmutation", classes: ["Bard", "Druid", "Ranger", "Wizard"], cast: "1 action", range: "Touch", components: "V, S, M", duration: "1 hour", desc: "Target's speed increases by 10 ft." },
  { name: "Disguise Self", level: 1, school: "Illusion", classes: ["Bard", "Sorcerer", "Wizard"], cast: "1 action", range: "Self", components: "V, S", duration: "1 hour", desc: "Change your appearance (and clothing/gear) until it ends." },

  // ---- Level 2 (more) ----
  { name: "Aid", level: 2, school: "Abjuration", classes: ["Cleric", "Paladin"], cast: "1 action", range: "30 ft", components: "V, S, M", duration: "8 hours", desc: "Up to 3 creatures gain +5 current and maximum HP." },
  { name: "Blur", level: 2, school: "Illusion", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "Self", components: "V", duration: "Conc. 1 min", desc: "Attackers have disadvantage unless they don't rely on sight." },
  { name: "Darkness", level: 2, school: "Evocation", classes: ["Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "60 ft", components: "V, M", duration: "Conc. 10 min", desc: "15-ft-radius magical darkness that normal light can't dispel." },
  { name: "Enhance Ability", level: 2, school: "Transmutation", classes: ["Bard", "Cleric", "Druid", "Sorcerer"], cast: "1 action", range: "Touch", components: "V, S, M", duration: "Conc. 1 hr", desc: "Advantage on one ability's checks (plus a bonus effect)." },
  { name: "Pass without Trace", level: 2, school: "Abjuration", classes: ["Druid", "Ranger"], cast: "1 action", range: "Self", components: "V, S, M", duration: "Conc. 1 hr", desc: "You and allies get +10 Stealth and can't be tracked." },
  { name: "See Invisibility", level: 2, school: "Divination", classes: ["Bard", "Sorcerer", "Wizard"], cast: "1 action", range: "Self", components: "V, S, M", duration: "1 hour", desc: "See invisible creatures and into the Ethereal Plane." },
  { name: "Silence", level: 2, school: "Illusion", classes: ["Bard", "Cleric", "Ranger"], cast: "1 action", range: "120 ft", components: "V, S", duration: "Conc. 10 min", desc: "No sound in a 20-ft-radius sphere; blocks verbal spells. Ritual." },
  { name: "Spike Growth", level: 2, school: "Transmutation", classes: ["Druid", "Ranger"], cast: "1 action", range: "150 ft", components: "V, S, M", duration: "Conc. 10 min", desc: "20-ft area of difficult terrain; 2d4 piercing per 5 ft moved." },
  { name: "Suggestion", level: 2, school: "Enchantment", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "30 ft", components: "V, M", duration: "Conc. 8 hr", desc: "Wis save or follow a suggested reasonable course of action." },
  { name: "Calm Emotions", level: 2, school: "Enchantment", classes: ["Bard", "Cleric"], cast: "1 action", range: "60 ft", components: "V, S", duration: "Conc. 1 min", desc: "Suppress charm/fear or make creatures indifferent." },
  { name: "Prayer of Healing", level: 2, school: "Evocation", classes: ["Cleric"], cast: "10 minutes", range: "30 ft", components: "V, S", duration: "Instant", desc: "Up to 6 creatures heal 2d8 + mod." },
  { name: "Magic Weapon", level: 2, school: "Transmutation", classes: ["Paladin", "Wizard"], cast: "1 bonus action", range: "Touch", components: "V, S", duration: "Conc. 1 hr", desc: "A nonmagical weapon becomes +1 (scales at higher levels)." },

  // ---- Level 3 (more) ----
  { name: "Hypnotic Pattern", level: 3, school: "Illusion", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "120 ft", components: "S, M", duration: "Conc. 1 min", desc: "Wis save or charmed and incapacitated in a 30-ft cube." },
  { name: "Fear", level: 3, school: "Illusion", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "Self (30-ft cone)", components: "V, S, M", duration: "Conc. 1 min", desc: "Wis save or frightened and drop what you're holding, then flee." },
  { name: "Slow", level: 3, school: "Transmutation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "120 ft", components: "V, S, M", duration: "Conc. 1 min", desc: "Up to 6 creatures: Wis save or halved speed, -2 AC/Dex saves, one action." },
  { name: "Stinking Cloud", level: 3, school: "Conjuration", classes: ["Bard", "Sorcerer", "Wizard"], cast: "1 action", range: "90 ft", components: "V, S, M", duration: "Conc. 1 min", desc: "20-ft cloud; Con save or lose your action retching." },
  { name: "Vampiric Touch", level: 3, school: "Necromancy", classes: ["Warlock", "Wizard"], cast: "1 action", range: "Self", components: "V, S", duration: "Conc. 1 min", desc: "Melee spell attack for 3d6 necrotic; heal half the damage dealt." },
  { name: "Major Image", level: 3, school: "Illusion", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "120 ft", components: "V, S, M", duration: "Conc. 10 min", desc: "Detailed illusion with sound, smell, and temperature." },
  { name: "Protection from Energy", level: 3, school: "Abjuration", classes: ["Cleric", "Druid", "Ranger", "Sorcerer", "Wizard"], cast: "1 action", range: "Touch", components: "V, S", duration: "Conc. 1 hr", desc: "Resistance to one damage type (acid, cold, fire, lightning, thunder)." },
  { name: "Beacon of Hope", level: 3, school: "Abjuration", classes: ["Cleric"], cast: "1 action", range: "30 ft", components: "V, S", duration: "Conc. 1 min", desc: "Allies gain advantage on Wis and death saves and max healing." },
  { name: "Animate Dead", level: 3, school: "Necromancy", classes: ["Cleric", "Wizard"], cast: "1 minute", range: "10 ft", components: "V, S, M", duration: "Instant", desc: "Raise a skeleton or zombie under your control." },
  { name: "Call Lightning", level: 3, school: "Conjuration", classes: ["Druid"], cast: "1 action", range: "120 ft", components: "V, S", duration: "Conc. 10 min", desc: "Summon a storm cloud; call down 3d10 lightning bolts each turn." },
  { name: "Daylight", level: 3, school: "Evocation", classes: ["Cleric", "Druid", "Paladin", "Ranger", "Sorcerer"], cast: "1 action", range: "60 ft", components: "V, S", duration: "1 hour", desc: "60-ft sphere of bright daylight; dispels magical darkness of lower level." },

  // ---- Level 4 ----
  { name: "Banishment", level: 4, school: "Abjuration", classes: ["Cleric", "Paladin", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "60 ft", components: "V, S, M", duration: "Conc. 1 min", desc: "Cha save or banished to another plane; extraplanar creatures may not return." },
  { name: "Dimension Door", level: 4, school: "Conjuration", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "500 ft", components: "V", duration: "Instant", desc: "Teleport yourself (and one willing creature) up to 500 ft." },
  { name: "Greater Invisibility", level: 4, school: "Illusion", classes: ["Bard", "Sorcerer", "Wizard"], cast: "1 action", range: "Touch", components: "V, S", duration: "Conc. 1 min", desc: "Target is invisible even while attacking or casting." },
  { name: "Polymorph", level: 4, school: "Transmutation", classes: ["Bard", "Druid", "Sorcerer", "Wizard"], cast: "1 action", range: "60 ft", components: "V, S, M", duration: "Conc. 1 hr", desc: "Transform a creature into a beast of equal or lower CR." },
  { name: "Ice Storm", level: 4, school: "Evocation", classes: ["Druid", "Sorcerer", "Wizard"], cast: "1 action", range: "300 ft", components: "V, S, M", duration: "Instant", desc: "20-ft radius; Dex save for 2d8 bludgeoning + 4d6 cold. Difficult terrain." },
  { name: "Wall of Fire", level: 4, school: "Evocation", classes: ["Druid", "Sorcerer", "Wizard"], cast: "1 action", range: "120 ft", components: "V, S, M", duration: "Conc. 1 min", desc: "Wall of flame; 5d8 fire to creatures on the chosen side." },
  { name: "Stoneskin", level: 4, school: "Abjuration", classes: ["Druid", "Ranger", "Sorcerer", "Wizard"], cast: "1 action", range: "Touch", components: "V, S, M", duration: "Conc. 1 hr", desc: "Target gains resistance to nonmagical bludgeoning/piercing/slashing." },
  { name: "Death Ward", level: 4, school: "Abjuration", classes: ["Cleric", "Paladin"], cast: "1 action", range: "Touch", components: "V, S", duration: "8 hours", desc: "First time target would drop to 0 HP, it drops to 1 instead." },
  { name: "Freedom of Movement", level: 4, school: "Abjuration", classes: ["Bard", "Cleric", "Druid", "Ranger"], cast: "1 action", range: "Touch", components: "V, S, M", duration: "1 hour", desc: "Target ignores difficult terrain and is immune to restraint/paralysis effects." },

  // ---- Level 5 ----
  { name: "Cone of Cold", level: 5, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "Self (60-ft cone)", components: "V, S, M", duration: "Instant", desc: "Con save for 8d8 cold (half on success)." },
  { name: "Greater Restoration", level: 5, school: "Abjuration", classes: ["Bard", "Cleric", "Druid"], cast: "1 action", range: "Touch", components: "V, S, M", duration: "Instant", desc: "End one: exhaustion, charm, petrification, curse, or an ability/HP-max reduction." },
  { name: "Mass Cure Wounds", level: 5, school: "Evocation", classes: ["Bard", "Cleric", "Druid"], cast: "1 action", range: "60 ft", components: "V, S", duration: "Instant", desc: "Up to 6 creatures heal 3d8 + mod." },
  { name: "Raise Dead", level: 5, school: "Necromancy", classes: ["Bard", "Cleric", "Paladin"], cast: "1 hour", range: "Touch", components: "V, S, M", duration: "Instant", desc: "Return a creature dead up to 10 days to life. Costs 500 gp diamond." },
  { name: "Hold Monster", level: 5, school: "Enchantment", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "90 ft", components: "V, S, M", duration: "Conc. 1 min", desc: "Any creature: Wis save or paralyzed; repeats save each turn." },
  { name: "Wall of Force", level: 5, school: "Evocation", classes: ["Wizard"], cast: "1 action", range: "120 ft", components: "V, S, M", duration: "Conc. 10 min", desc: "Invisible, immovable wall nothing physical can pass through." },
  { name: "Flame Strike", level: 5, school: "Evocation", classes: ["Cleric"], cast: "1 action", range: "60 ft", components: "V, S, M", duration: "Instant", desc: "Column of fire; Dex save for 4d6 fire + 4d6 radiant (half on success)." },
  { name: "Telekinesis", level: 5, school: "Transmutation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "60 ft", components: "V, S", duration: "Conc. 10 min", desc: "Move creatures or objects with your mind (Str contest for creatures)." },

  // ---- Level 6 ----
  { name: "Chain Lightning", level: 6, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "150 ft", components: "V, S, M", duration: "Instant", desc: "Up to 4 targets; Dex save for 10d8 lightning (half on success)." },
  { name: "Disintegrate", level: 6, school: "Transmutation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "60 ft", components: "V, S, M", duration: "Instant", desc: "Dex save or 10d6 + 40 force; reduced to dust if it drops to 0 HP." },
  { name: "Heal", level: 6, school: "Evocation", classes: ["Cleric", "Druid"], cast: "1 action", range: "60 ft", components: "V, S", duration: "Instant", desc: "Restore 70 HP and end blindness, deafness, and disease." },
  { name: "Harm", level: 6, school: "Necromancy", classes: ["Cleric"], cast: "1 action", range: "60 ft", components: "V, S", duration: "Instant", desc: "Con save for 14d6 necrotic (half on success); caps current HP." },
  { name: "Mass Suggestion", level: 6, school: "Enchantment", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "60 ft", components: "V, M", duration: "24 hours", desc: "Suggest a course of action to up to 12 creatures." },
  { name: "Sunbeam", level: 6, school: "Evocation", classes: ["Druid", "Sorcerer", "Wizard"], cast: "1 action", range: "Self (60-ft line)", components: "V, S, M", duration: "Conc. 1 min", desc: "Con save for 6d8 radiant and blinded (half, no blind on success). Repeatable." },
  { name: "True Seeing", level: 6, school: "Divination", classes: ["Bard", "Cleric", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "Touch", components: "V, S, M", duration: "1 hour", desc: "Truesight 120 ft: see through illusions, invisibility, and into the Ethereal." },

  // ---- Level 7 ----
  { name: "Finger of Death", level: 7, school: "Necromancy", classes: ["Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "60 ft", components: "V, S", duration: "Instant", desc: "Con save for 7d8 + 30 necrotic; a humanoid killed rises as your zombie." },
  { name: "Fire Storm", level: 7, school: "Evocation", classes: ["Cleric", "Druid", "Sorcerer"], cast: "1 action", range: "150 ft", components: "V, S", duration: "Instant", desc: "Dex save for 7d10 fire across a shaped area (half on success)." },
  { name: "Regenerate", level: 7, school: "Transmutation", classes: ["Bard", "Cleric", "Druid"], cast: "1 minute", range: "Touch", components: "V, S, M", duration: "1 hour", desc: "Heal 4d8 + 15, then 1 HP each turn; regrow severed limbs." },
  { name: "Resurrection", level: 7, school: "Necromancy", classes: ["Bard", "Cleric"], cast: "1 hour", range: "Touch", components: "V, S, M", duration: "Instant", desc: "Return a creature dead up to a century (with a body) to full life." },
  { name: "Teleport", level: 7, school: "Conjuration", classes: ["Bard", "Sorcerer", "Wizard"], cast: "1 action", range: "10 ft", components: "V", duration: "Instant", desc: "Teleport yourself and up to 8 willing creatures across great distances." },
  { name: "Plane Shift", level: 7, school: "Conjuration", classes: ["Cleric", "Druid", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "Touch", components: "V, S, M", duration: "Instant", desc: "Transport a party to another plane of existence." },
  { name: "Prismatic Spray", level: 7, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "Self (60-ft cone)", components: "V, S", duration: "Instant", desc: "Eight rays of random colors, each a different damage or debilitating effect." },

  // ---- Level 8 ----
  { name: "Power Word Stun", level: 8, school: "Enchantment", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "60 ft", components: "V", duration: "Instant", desc: "Stun a creature with 150 HP or fewer (no save; Con save each turn to recover)." },
  { name: "Sunburst", level: 8, school: "Evocation", classes: ["Druid", "Sorcerer", "Wizard"], cast: "1 action", range: "150 ft", components: "V, S, M", duration: "Instant", desc: "60-ft burst; Con save for 12d6 radiant and blinded (half, no blind on success)." },
  { name: "Dominate Monster", level: 8, school: "Enchantment", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "60 ft", components: "V, S", duration: "Conc. 1 hr", desc: "Wis save or you control the creature's actions." },
  { name: "Feeblemind", level: 8, school: "Enchantment", classes: ["Bard", "Druid", "Warlock", "Wizard"], cast: "1 action", range: "150 ft", components: "V, S, M", duration: "Instant", desc: "4d6 psychic; on a failed Int save, Int and Cha drop to 1." },
  { name: "Earthquake", level: 8, school: "Evocation", classes: ["Cleric", "Druid", "Sorcerer"], cast: "1 action", range: "500 ft", components: "V, S, M", duration: "Conc. 1 min", desc: "The ground ruptures; creatures fall prone and structures collapse." },

  // ---- Level 9 ----
  { name: "Wish", level: 9, school: "Conjuration", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "Self", components: "V", duration: "Instant", desc: "Duplicate any 8th-level-or-lower spell, or alter reality (with risk)." },
  { name: "Meteor Swarm", level: 9, school: "Evocation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "1 mile", components: "V, S", duration: "Instant", desc: "Four 40-ft blasts; Dex save for 20d6 fire + 20d6 bludgeoning (half on success)." },
  { name: "Power Word Kill", level: 9, school: "Enchantment", classes: ["Bard", "Sorcerer", "Warlock", "Wizard"], cast: "1 action", range: "60 ft", components: "V", duration: "Instant", desc: "Instantly kill a creature with 100 HP or fewer. No save." },
  { name: "Time Stop", level: 9, school: "Transmutation", classes: ["Sorcerer", "Wizard"], cast: "1 action", range: "Self", components: "V", duration: "Instant", desc: "Take 1d4 + 1 turns in a row; ends if you affect another creature." },
  { name: "True Resurrection", level: 9, school: "Necromancy", classes: ["Cleric", "Druid"], cast: "1 hour", range: "Touch", components: "V, S, M", duration: "Instant", desc: "Revive a creature dead up to 200 years, even with no body." },
  { name: "Mass Heal", level: 9, school: "Evocation", classes: ["Cleric"], cast: "1 action", range: "60 ft", components: "V, S", duration: "Instant", desc: "Restore up to 700 HP divided among creatures; end diseases and conditions." },
  { name: "Foresight", level: 9, school: "Divination", classes: ["Bard", "Druid", "Warlock", "Wizard"], cast: "1 minute", range: "Touch", components: "V, S, M", duration: "8 hours", desc: "Target has advantage on all d20 rolls; attackers have disadvantage vs it." },
  { name: "Gate", level: 9, school: "Conjuration", classes: ["Cleric", "Sorcerer", "Wizard"], cast: "1 action", range: "60 ft", components: "V, S, M", duration: "Conc. 1 min", desc: "Open a portal linking to another plane; can pull a named creature through." }
];
