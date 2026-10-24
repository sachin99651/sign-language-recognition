import { SignDefinition } from '../types/signLanguage';

/**
 * Authentic American Sign Language (ASL) Knowledge Base
 * Covers ASL Manual Alphabet (A-Z), ASL Numbers (0-9), and Essential ASL Vocabulary.
 */

export const ASL_ALPHABET: SignDefinition[] = [
  {
    id: 'asl-a',
    label: 'A',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter A: Make a fist with fingers curled tightly into the palm. Keep the thumb resting straight upright against the side of the index finger.',
    instructions: [
      'Curl all four fingers (index, middle, ring, pinky) tightly into your palm.',
      'Place your thumb straight and upright alongside the index finger.',
      'Face your palm forward toward the viewer.'
    ],
    mnemonic: 'Like holding an apple with thumb on the outside edge.',
    commonMistakes: ['Do not tuck the thumb over the fingers (that is letter S) or between fingers (letters T, M, N).'],
    fingerStatus: { thumb: 'extended', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-b',
    label: 'B',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter B: All four fingers extended straight up and pressed together. Fold the thumb across the palm.',
    instructions: [
      'Extend index, middle, ring, and pinky fingers straight upward, holding them flush together.',
      'Fold your thumb horizontally across the lower palm.',
      'Palm faces forward.'
    ],
    mnemonic: 'B is like a flat blue board standing tall.',
    commonMistakes: ['Fingers must touch and remain parallel, not spread apart (which is the number 4).'],
    fingerStatus: { thumb: 'across', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' }
  },
  {
    id: 'asl-c',
    label: 'C',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter C: Curve your hand so all fingers and the thumb form the visible curved shape of the letter C.',
    instructions: [
      'Curve all four fingers downward together.',
      'Oppose your curved thumb upward to create the circular letter C opening.',
      'Turn hand slightly so the C profile is visible.'
    ],
    mnemonic: 'Shape your hand into a cup or the letter C.',
    commonMistakes: ['Do not close the fingers into a full O; keep an open gap.'],
    fingerStatus: { thumb: 'opposing', index: 'half', middle: 'half', ring: 'half', pinky: 'half' }
  },
  {
    id: 'asl-d',
    label: 'D',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter D: Extend the index finger straight up. Touch middle, ring, and pinky fingertips to the thumb tip to form a circle.',
    instructions: [
      'Extend only your index finger straight toward the ceiling.',
      'Curl middle, ring, and pinky fingers down to meet the tip of your thumb, creating a circle at the base.',
      'Palm faces forward or slightly angled.'
    ],
    mnemonic: 'D has one tall stem (index) and a round belly (thumb + other fingers).',
    commonMistakes: ['Confusing with F: In D only index is up; in F three fingers are up and index touches thumb.'],
    fingerStatus: { thumb: 'opposing', index: 'extended', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-e',
    label: 'E',
    category: 'alphabet',
    difficulty: 'Intermediate',
    description: 'ASL Letter E: Curl all four fingers down onto the palm with fingertips touching the thumb curled underneath them.',
    instructions: [
      'Bend all four fingers at the knuckles and rest their tips onto the upper palm.',
      'Tuck your thumb horizontally underneath the four curled fingertips.',
      'Palm faces forward with nails visible.'
    ],
    mnemonic: 'Looks like the horizontal prongs of a capital letter E.',
    commonMistakes: ['Do not wrap the thumb over the fingers; thumb must rest cleanly under the tips.'],
    fingerStatus: { thumb: 'across', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-f',
    label: 'F',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter F: Touch the tip of your index finger to the tip of your thumb to form a circle. Extend middle, ring, and pinky fingers upright and spread.',
    instructions: [
      'Form an "OK" circle by joining index fingertip and thumb tip.',
      'Hold middle, ring, and pinky fingers straight upright and slightly fan them out.',
      'Palm faces forward.'
    ],
    mnemonic: 'F looks like an "OK" handshape with three feathers standing up.',
    commonMistakes: ['Do not let the three back fingers flop down.'],
    fingerStatus: { thumb: 'opposing', index: 'curled', middle: 'extended', ring: 'extended', pinky: 'extended' }
  },
  {
    id: 'asl-g',
    label: 'G',
    category: 'alphabet',
    difficulty: 'Intermediate',
    description: 'ASL Letter G: Point the index finger horizontally to the side with thumb parallel, like holding a small coin.',
    instructions: [
      'Curl middle, ring, and pinky into your palm.',
      'Extend index finger and thumb horizontally, separated by about 1 inch.',
      'Turn your hand so the back of your hand faces you and the fingers point sideways.'
    ],
    mnemonic: 'Measuring a tiny Gap with index and thumb.',
    commonMistakes: ['Ensure index and thumb are pointing sideways (horizontal), not upright.'],
    fingerStatus: { thumb: 'extended', index: 'extended', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-h',
    label: 'H',
    category: 'alphabet',
    difficulty: 'Intermediate',
    description: 'ASL Letter H: Extend both index and middle fingers horizontally pressed together. Ring and pinky curled in, thumb alongside.',
    instructions: [
      'Extend index and middle fingers together horizontally.',
      'Curl ring and pinky fingers into your palm.',
      'Keep thumb tucked alongside the ring finger or below the middle finger.',
      'Fingers point sideways to your non-dominant side.'
    ],
    mnemonic: 'Two horizontal lines, like the crossbar of an H.',
    commonMistakes: ['Ensure index and middle are touching tightly, not spread apart.'],
    fingerStatus: { thumb: 'across', index: 'extended', middle: 'extended', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-i',
    label: 'I',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter I: Extend only the pinky finger straight up. Curl other three fingers into a fist with the thumb across them.',
    instructions: [
      'Extend the pinky finger straight upward.',
      'Curl index, middle, and ring fingers tightly down into your palm.',
      'Rest your thumb across the middle segments of the curled fingers.',
      'Palm faces forward.'
    ],
    mnemonic: 'The pinky finger is the slimmest finger, just like the slim letter I.',
    commonMistakes: ['Do not extend the thumb outward (that is the ILY or Y sign).'],
    fingerStatus: { thumb: 'across', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'extended' }
  },
  {
    id: 'asl-j',
    label: 'J',
    category: 'alphabet',
    difficulty: 'Advanced',
    description: 'ASL Letter J (Dynamic): Hold the "I" handshape (pinky up) and trace a J swoop downward and curl the pinky toward yourself.',
    instructions: [
      'Start in the "I" handshape with pinky pointing up.',
      'Trace the letter J in the air by moving downward and curving the pinky tip toward your chest in a swooping motion.',
      'Finish with the palm facing inward.'
    ],
    mnemonic: 'J is a moving letter, drawn with the pinky pen.',
    commonMistakes: ['Moving the entire arm instead of a fluid wrist trace.'],
    fingerStatus: { thumb: 'across', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'extended' }
  },
  {
    id: 'asl-k',
    label: 'K',
    category: 'alphabet',
    difficulty: 'Intermediate',
    description: 'ASL Letter K: Extend index straight up, angle middle finger forward, and place thumb tip directly between them touching the middle joint.',
    instructions: [
      'Extend your index finger straight up.',
      'Extend middle finger angled outward at roughly 45 degrees.',
      'Place the tip of your thumb against the inside knuckle of your middle finger.',
      'Curl ring and pinky fingers into your palm.'
    ],
    mnemonic: 'The index finger is the vertical line of K, the middle finger and thumb form the two diagonal wings.',
    commonMistakes: ['Confusing with V or P: In K the thumb is tucked between index and middle.'],
    fingerStatus: { thumb: 'opposing', index: 'extended', middle: 'extended', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-l',
    label: 'L',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter L: Extend thumb and index finger at a 90-degree right angle, forming an unmistakable letter L.',
    instructions: [
      'Extend your index finger straight up toward the ceiling.',
      'Extend your thumb straight out horizontally to the side at a 90-degree angle.',
      'Curl middle, ring, and pinky fingers flat against your palm.',
      'Palm faces forward.'
    ],
    mnemonic: 'Direct visual replica of the capital letter L.',
    commonMistakes: ['Angling the thumb downward instead of a crisp 90-degree angle.'],
    fingerStatus: { thumb: 'extended', index: 'extended', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-m',
    label: 'M',
    category: 'alphabet',
    difficulty: 'Intermediate',
    description: 'ASL Letter M: Tuck your thumb under your index, middle, and ring fingers so three fingers drape over the thumb.',
    instructions: [
      'Tuck your thumb across your palm.',
      'Drape your index, middle, and ring fingers over the thumb (thumb peeks between ring and pinky).',
      'Curl pinky finger alongside the thumb.',
      'Palm faces forward.'
    ],
    mnemonic: 'Three fingers draped over thumb = three bumps in the letter M.',
    commonMistakes: ['Confusing with N (which has 2 fingers draped) or T (1 finger draped).'],
    fingerStatus: { thumb: 'across', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-n',
    label: 'N',
    category: 'alphabet',
    difficulty: 'Intermediate',
    description: 'ASL Letter N: Tuck thumb under index and middle fingers so two fingers drape over the thumb.',
    instructions: [
      'Tuck thumb across your palm.',
      'Drape index and middle fingers over the thumb (thumb peeks out between middle and ring fingers).',
      'Curl ring and pinky fingers into the palm.',
      'Palm faces forward.'
    ],
    mnemonic: 'Two fingers draped over thumb = two legs of the letter N.',
    commonMistakes: ['Draping three fingers creates M; draping two creates N.'],
    fingerStatus: { thumb: 'across', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-o',
    label: 'O',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter O: Curve all four fingers and thumb together to make a clean, continuous circular O ring.',
    instructions: [
      'Curve all four fingers downward.',
      'Meet all four fingertips against the tip of your curved thumb.',
      'Form an open circular aperture visible from the front.',
      'Palm faces forward.'
    ],
    mnemonic: 'Looks like the circular letter O.',
    commonMistakes: ['Squishing the circle flat into a line.'],
    fingerStatus: { thumb: 'opposing', index: 'half', middle: 'half', ring: 'half', pinky: 'half' }
  },
  {
    id: 'asl-p',
    label: 'P',
    category: 'alphabet',
    difficulty: 'Intermediate',
    description: 'ASL Letter P: Hold the "K" handshape and point it downward so index finger is horizontal and middle finger points down.',
    instructions: [
      'Form the ASL "K" handshape (index up, middle angled, thumb between).',
      'Drop your wrist downward so the index finger points forward and middle finger points straight down.',
      'Palm faces downward.'
    ],
    mnemonic: 'A "K" pointing down to the pavement is a "P".',
    commonMistakes: ['Keeping the wrist upright (which is K).'],
    fingerStatus: { thumb: 'opposing', index: 'extended', middle: 'extended', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-q',
    label: 'Q',
    category: 'alphabet',
    difficulty: 'Intermediate',
    description: 'ASL Letter Q: Hold the "G" handshape and point it straight downward toward the ground.',
    instructions: [
      'Form the "G" handshape (index and thumb extended parallel, others curled).',
      'Point index and thumb downward toward the floor.',
      'Palm faces inward or downward.'
    ],
    mnemonic: 'G points sideways; Q points quietly down to the ground.',
    commonMistakes: ['Pointing sideways instead of down.'],
    fingerStatus: { thumb: 'extended', index: 'extended', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-r',
    label: 'R',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter R: Cross your middle finger over your index finger (the classic "fingers crossed" gesture).',
    instructions: [
      'Extend index and middle fingers straight up.',
      'Cross your middle finger over the back of your index finger.',
      'Curl ring and pinky fingers into the palm with thumb resting over them.',
      'Palm faces forward.'
    ],
    mnemonic: 'The "fingers crossed for good luck" sign is ASL letter R (Ready / Rope).',
    commonMistakes: ['Crossing index over middle instead of middle over index.'],
    fingerStatus: { thumb: 'across', index: 'crossed', middle: 'crossed', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-s',
    label: 'S',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter S: Make a firm fist with your thumb wrapped horizontally across the front of all curled fingers.',
    instructions: [
      'Curl all four fingers tightly into your palm.',
      'Wrap your thumb horizontally across the front knuckles of your fingers.',
      'Palm faces forward.'
    ],
    mnemonic: 'S is a Solid fist with thumb across the front (unlike A where thumb is at side).',
    commonMistakes: ['Leaving thumb at the side (A) or tucking thumb between fingers (T, M, N).'],
    fingerStatus: { thumb: 'across', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-t',
    label: 'T',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter T: Tuck your thumb between your index finger and middle finger, then close into a fist.',
    instructions: [
      'Tuck your thumb so it pokes upward between your index and middle fingers.',
      'Curl all four fingers into a fist over the thumb.',
      'Palm faces forward.'
    ],
    mnemonic: 'Thumb peeks through one finger (index) = T has one crossbar.',
    commonMistakes: ['Peeking between middle and ring is N.'],
    fingerStatus: { thumb: 'across', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-u',
    label: 'U',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter U: Extend index and middle fingers straight up, pressed tightly together. Ring and pinky curled into palm with thumb over them.',
    instructions: [
      'Extend index and middle fingers straight up toward the ceiling.',
      'Keep index and middle fingers touching snugly.',
      'Curl ring and pinky fingers into the palm and secure them with the thumb.',
      'Palm faces forward.'
    ],
    mnemonic: 'Two fingers touching form the letter U.',
    commonMistakes: ['Spreading the fingers apart creates letter V! U must stay united.'],
    fingerStatus: { thumb: 'across', index: 'extended', middle: 'extended', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-v',
    label: 'V',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter V: Extend index and middle fingers straight up and spread them apart in a clear "V" or peace shape.',
    instructions: [
      'Extend index and middle fingers straight up.',
      'Spread them apart into a distinct V shape.',
      'Curl ring and pinky into your palm and hold down with your thumb.',
      'Palm faces forward.'
    ],
    mnemonic: 'Classic Victory or Peace sign.',
    commonMistakes: ['Touching fingers together creates U; they must be clearly spread for V.'],
    fingerStatus: { thumb: 'across', index: 'extended', middle: 'extended', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-w',
    label: 'W',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter W: Extend index, middle, and ring fingers straight up and spread them evenly. Touch pinky tip to thumb tip.',
    instructions: [
      'Extend index, middle, and ring fingers straight up and spread them apart.',
      'Hold down pinky with your thumb tip in front of the palm.',
      'Palm faces forward.'
    ],
    mnemonic: 'Three upright fingers form the three peaks of a capital W.',
    commonMistakes: ['In ASL, 3 is thumb + index + middle; W is index + middle + ring with pinky held down.'],
    fingerStatus: { thumb: 'opposing', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'curled' }
  },
  {
    id: 'asl-x',
    label: 'X',
    category: 'alphabet',
    difficulty: 'Intermediate',
    description: 'ASL Letter X: Make a fist and raise only the index finger, bending it into a hooked claw shape.',
    instructions: [
      'Make a fist with your hand.',
      'Raise only the index finger and curve its top two knuckles into a hook or pirate claw.',
      'Thumb rests against curled middle finger.',
      'Palm faces forward or slightly angled.'
    ],
    mnemonic: 'Captain Hook’s claw marks the spot on a treasure map: X marks the spot.',
    commonMistakes: ['Fully extending index finger (which is 1 or D); it must be distinctly bent.'],
    fingerStatus: { thumb: 'across', index: 'half', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-y',
    label: 'Y',
    category: 'alphabet',
    difficulty: 'Beginner',
    description: 'ASL Letter Y: Extend thumb and pinky finger fully outward while curling the middle three fingers tightly into the palm.',
    instructions: [
      'Extend your thumb out horizontally.',
      'Extend your pinky finger out opposite.',
      'Curl index, middle, and ring fingers tightly down into your palm.',
      'Palm faces forward or slightly toward you.'
    ],
    mnemonic: 'Shaka / phone handshape with thumb and pinky forming the two upper arms of Y.',
    commonMistakes: ['Extending the index finger transforms this into I LOVE YOU.'],
    fingerStatus: { thumb: 'extended', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'extended' }
  },
  {
    id: 'asl-z',
    label: 'Z',
    category: 'alphabet',
    difficulty: 'Advanced',
    description: 'ASL Letter Z (Dynamic): Extend the index finger and trace the letter Z in the air (horizontal right, diagonal down-left, horizontal right).',
    instructions: [
      'Make a fist and extend your index finger forward.',
      'Trace a sharp Z in the air: straight across, diagonally down, straight across.',
      'Keep other fingers curled.'
    ],
    mnemonic: 'Drawing the letter Z like Zorro with your index finger.',
    commonMistakes: ['Moving the entire body; keep the wrist and finger controlled.'],
    fingerStatus: { thumb: 'across', index: 'extended', middle: 'curled', ring: 'curled', pinky: 'curled' }
  }
];

export const ASL_NUMBERS: SignDefinition[] = [
  {
    id: 'asl-num-0',
    label: '0',
    category: 'number',
    difficulty: 'Beginner',
    description: 'ASL Number 0: All four fingertips touch the thumb tip, forming a vertical oval / zero shape.',
    instructions: ['Curve all fingers to meet the thumb tip, identical to letter O.'],
    fingerStatus: { thumb: 'opposing', index: 'half', middle: 'half', ring: 'half', pinky: 'half' }
  },
  {
    id: 'asl-num-1',
    label: '1',
    category: 'number',
    difficulty: 'Beginner',
    description: 'ASL Number 1: Extend only the index finger straight up. Palm faces inward toward the signer.',
    instructions: ['Extend index finger straight up. In standard ASL counting 1-5, palm faces toward the signer.'],
    fingerStatus: { thumb: 'across', index: 'extended', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-num-2',
    label: '2',
    category: 'number',
    difficulty: 'Beginner',
    description: 'ASL Number 2: Extend index and middle fingers in a spread V shape, palm facing inward.',
    instructions: ['Index and middle extended and spread; palm faces signer.'],
    fingerStatus: { thumb: 'across', index: 'extended', middle: 'extended', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-num-3',
    label: '3',
    category: 'number',
    difficulty: 'Beginner',
    description: 'ASL Number 3: Extend thumb, index, and middle fingers! (Crucial ASL rule: 3 is NOT index+middle+ring).',
    instructions: [
      'Extend your thumb, index finger, and middle finger.',
      'Curl ring and pinky fingers into your palm.',
      'Palm faces inward toward the signer.'
    ],
    mnemonic: 'In ASL counting, thumb is always the third finger for 3!',
    commonMistakes: ['Using index + middle + ring is the European/English 3, not American Sign Language!'],
    fingerStatus: { thumb: 'extended', index: 'extended', middle: 'extended', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-num-4',
    label: '4',
    category: 'number',
    difficulty: 'Beginner',
    description: 'ASL Number 4: All four fingers extended straight up and spread apart. Thumb folded across palm.',
    instructions: ['Four fingers up and spread; thumb folded in palm; palm faces inward.'],
    fingerStatus: { thumb: 'across', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' }
  },
  {
    id: 'asl-num-5',
    label: '5',
    category: 'number',
    difficulty: 'Beginner',
    description: 'ASL Number 5: All five fingers extended and spread wide (open hand).',
    instructions: ['All five digits extended and spread; palm faces inward.'],
    fingerStatus: { thumb: 'extended', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' }
  },
  {
    id: 'asl-num-6',
    label: '6',
    category: 'number',
    difficulty: 'Intermediate',
    description: 'ASL Number 6: Touch thumb tip to the pinky fingernail. Index, middle, and ring fingers extended straight up. Palm faces OUT.',
    instructions: [
      'From 6 through 9, the palm faces OUTWARD.',
      'Touch your thumb tip to the pinky tip (smallest finger = smallest 6-9 number, 6).',
      'Keep index, middle, and ring fingers standing straight up.'
    ],
    mnemonic: 'Pinky is finger #6 in the 6-7-8-9 finger ladder.',
    fingerStatus: { thumb: 'opposing', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'curled' }
  },
  {
    id: 'asl-num-7',
    label: '7',
    category: 'number',
    difficulty: 'Intermediate',
    description: 'ASL Number 7: Touch thumb tip to the ring fingertip. Index, middle, and pinky fingers extended.',
    instructions: [
      'Palm faces forward.',
      'Touch thumb tip to your ring fingertip.',
      'Keep index, middle, and pinky standing tall.'
    ],
    mnemonic: 'Ring finger is #7 on the 6-9 ladder.',
    fingerStatus: { thumb: 'opposing', index: 'extended', middle: 'extended', ring: 'curled', pinky: 'extended' }
  },
  {
    id: 'asl-num-8',
    label: '8',
    category: 'number',
    difficulty: 'Intermediate',
    description: 'ASL Number 8: Touch thumb tip to middle fingertip. Index, ring, and pinky extended.',
    instructions: [
      'Palm faces forward.',
      'Touch thumb tip to your middle fingertip.',
      'Keep index, ring, and pinky extended.'
    ],
    mnemonic: 'Middle finger is #8 on the ladder.',
    fingerStatus: { thumb: 'opposing', index: 'extended', middle: 'curled', ring: 'extended', pinky: 'extended' }
  },
  {
    id: 'asl-num-9',
    label: '9',
    category: 'number',
    difficulty: 'Intermediate',
    description: 'ASL Number 9: Touch thumb tip to index fingertip (like letter F). Middle, ring, and pinky extended.',
    instructions: [
      'Palm faces forward.',
      'Touch thumb tip to index fingertip.',
      'Middle, ring, and pinky fingers extended up.'
    ],
    mnemonic: 'Index finger is #9 on the ladder.',
    fingerStatus: { thumb: 'opposing', index: 'curled', middle: 'extended', ring: 'extended', pinky: 'extended' }
  }
];

export const ASL_CORE_SIGNS: SignDefinition[] = [
  {
    id: 'asl-hello',
    label: 'HELLO',
    category: 'phrase',
    difficulty: 'Beginner',
    description: 'ASL Sign for HELLO: Open flat hand with fingers together, placed near the temple/forehead, then moved outward in an open salute of greeting.',
    instructions: [
      'Hold dominant hand flat with fingers together (open B handshape).',
      'Touch fingertips gently near your forehead or temple.',
      'Move the hand outward and slightly upward toward the other person in a friendly salute.'
    ],
    mnemonic: 'A friendly salute to welcome someone.',
    fingerStatus: { thumb: 'extended', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' }
  },
  {
    id: 'asl-thank-you',
    label: 'THANK YOU',
    category: 'phrase',
    difficulty: 'Beginner',
    description: 'ASL Sign for THANK YOU: Open flat hand touches your chin with fingertips, then extends outward toward the person being thanked.',
    instructions: [
      'Dominant flat open hand (fingers together).',
      'Touch your chin or lower lips with fingertips.',
      'Move hand outward and slightly down toward the other person with a slight head nod.'
    ],
    mnemonic: 'Sending warmth and gratitude from your lips out to the person.',
    commonMistakes: ['Do not blow a kiss (blowing kiss uses palm facing you; thank you faces up/out).'],
    fingerStatus: { thumb: 'extended', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' }
  },
  {
    id: 'asl-please',
    label: 'PLEASE',
    category: 'phrase',
    difficulty: 'Beginner',
    description: 'ASL Sign for PLEASE: Place flat dominant hand against center of chest, rub in circular clockwise motion.',
    instructions: [
      'Dominant open flat hand placed palm-down against center of chest.',
      'Rub in small smooth clockwise circular motion 2-3 times.'
    ],
    mnemonic: 'Soothing your heart to politely ask.',
    fingerStatus: { thumb: 'extended', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' }
  },
  {
    id: 'asl-yes',
    label: 'YES',
    category: 'phrase',
    difficulty: 'Beginner',
    description: 'ASL Sign for YES: Form an "S" fist and nod the wrist up and down, mimicking a head nodding yes.',
    instructions: [
      'Make an "S" fist with your dominant hand.',
      'Tilt wrist forward and down in a nodding motion twice.'
    ],
    mnemonic: 'The fist acts as a miniature head nodding yes.',
    fingerStatus: { thumb: 'across', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-no',
    label: 'NO',
    category: 'phrase',
    difficulty: 'Beginner',
    description: 'ASL Sign for NO: Snap index and middle fingers down together onto the thumb, mimicking a speaking mouth firmly shutting.',
    instructions: [
      'Extend index and middle fingers together, with thumb open below them.',
      'Quickly snap index and middle fingertips down onto the thumb tip once or twice.'
    ],
    mnemonic: 'Like two lips snapping shut: "N-O".',
    fingerStatus: { thumb: 'opposing', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-ily',
    label: 'I LOVE YOU',
    category: 'phrase',
    difficulty: 'Beginner',
    description: 'ASL Sign for I LOVE YOU (ILY): Combines the letters I, L, and Y by extending thumb, index, and pinky simultaneously.',
    instructions: [
      'Extend your thumb out to the side.',
      'Extend your index finger straight up.',
      'Extend your pinky finger straight up.',
      'Curl middle and ring fingers into the palm.',
      'Palm faces forward toward the person you love.'
    ],
    mnemonic: 'Thumb + Index = L. Pinky = I. Thumb + Pinky = Y. All together = I Love You!',
    fingerStatus: { thumb: 'extended', index: 'extended', middle: 'curled', ring: 'curled', pinky: 'extended' }
  },
  {
    id: 'asl-water',
    label: 'WATER',
    category: 'phrase',
    difficulty: 'Beginner',
    description: 'ASL Sign for WATER: Form a "W" handshape and tap the index finger against your chin twice.',
    instructions: [
      'Make a "W" handshape with your dominant hand (index, middle, ring up).',
      'Tap your index finger against your chin twice.'
    ],
    mnemonic: 'W for Water tapped right at the mouth where you drink it.',
    fingerStatus: { thumb: 'opposing', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'curled' }
  },
  {
    id: 'asl-help',
    label: 'HELP',
    category: 'phrase',
    difficulty: 'Intermediate',
    description: 'ASL Sign for HELP: Place a thumbs-up (A handshape) dominant hand on top of a flat open non-dominant palm, and lift both together.',
    instructions: [
      'Non-dominant hand held flat, palm facing up.',
      'Dominant hand forms an "A" fist with thumb pointed up.',
      'Rest dominant fist on non-dominant palm and lift both hands upward together.'
    ],
    mnemonic: 'One hand physically supporting and lifting the other upward.',
    fingerStatus: { thumb: 'extended', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-sorry',
    label: 'SORRY',
    category: 'phrase',
    difficulty: 'Beginner',
    description: 'ASL Sign for SORRY: Make an "A" fist and rub it in circles over your heart/chest with an apologetic expression.',
    instructions: [
      'Form an "A" fist (thumb on side).',
      'Place knuckles against center of chest.',
      'Rotate fist in clockwise circular motion.'
    ],
    mnemonic: 'Circular motion over the heavy heart expressing remorse.',
    fingerStatus: { thumb: 'extended', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  {
    id: 'asl-peace',
    label: 'PEACE / OK',
    category: 'phrase',
    difficulty: 'Beginner',
    description: 'ASL Sign for PEACE / OK: Spread V handshape or clean OK circle with three upright fingers.',
    instructions: ['V handshape held calmly or F/OK circle.'],
    fingerStatus: { thumb: 'across', index: 'extended', middle: 'extended', ring: 'curled', pinky: 'curled' }
  }
];

export const ALL_ASL_SIGNS: SignDefinition[] = [
  ...ASL_ALPHABET,
  ...ASL_NUMBERS,
  ...ASL_CORE_SIGNS
];

export const ASL_CATEGORIES = [
  { id: 'all', label: 'All ASL Signs' },
  { id: 'alphabet', label: 'ASL Alphabet (A-Z)' },
  { id: 'number', label: 'ASL Numbers (0-9)' },
  { id: 'phrase', label: 'ASL Words & Phrases' },
] as const;
