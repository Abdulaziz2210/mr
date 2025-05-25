// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation"
// import { TextAnnotator } from "@/components/text-annotator"
// import { TextAnnotationTools } from "@/components/text-annotation-tools"

// export default function ReadingTest() {
//   const router = useRouter()
//   const [currentPassage, setCurrentPassage] = useState(1)
//   const [answers, setAnswers] = useState<Record<string, string>>({})
//   const [isStarted, setIsStarted] = useState(false)
//   const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds
//   const [annotations, setAnnotations] = useState<any[]>([])
//   const [currentTool, setCurrentTool] = useState<string | null>(null)

//   useEffect(() => {
//     if (isStarted) {
//       const timer = setInterval(() => {
//         setTimeRemaining((prev) => {
//           if (prev <= 1) {
//             clearInterval(timer)
//             // Handle time's up
//             return 0
//           }
//           return prev - 1
//         })
//       }, 1000)

//       return () => clearInterval(timer)
//     }
//   }, [isStarted])

//   useEffect(() => {
//     // Load saved answers from localStorage
//     const savedAnswers = localStorage.getItem("readingAnswers")
//     if (savedAnswers) {
//       setAnswers(JSON.parse(savedAnswers))
//     }

//     // Load saved annotations from localStorage
//     const savedAnnotations = localStorage.getItem("readingAnnotations")
//     if (savedAnnotations) {
//       setAnnotations(JSON.parse(savedAnnotations))
//     }

//     // Check if test was already started
//     const testStarted = localStorage.getItem("readingTestStarted")
//     if (testStarted === "true") {
//       setIsStarted(true)
//     }

//     // Load current passage
//     const savedPassage = localStorage.getItem("currentReadingPassage")
//     if (savedPassage) {
//       setCurrentPassage(Number.parseInt(savedPassage))
//     }
//   }, [])

//   useEffect(() => {
//     // Save current passage to localStorage
//     localStorage.setItem("currentReadingPassage", currentPassage.toString())
//   }, [currentPassage])

//   useEffect(() => {
//     // Save answers to localStorage
//     localStorage.setItem("readingAnswers", JSON.stringify(answers))
//   }, [answers])

//   useEffect(() => {
//     // Save annotations to localStorage
//     localStorage.setItem("readingAnnotations", JSON.stringify(annotations))
//   }, [annotations])

//   useEffect(() => {
//     // Save test started status to localStorage
//     localStorage.setItem("readingTestStarted", isStarted.toString())
//   }, [isStarted])

//   const handleAnswerChange = (questionId: string, value: string) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: value,
//     }))
//   }

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
//   }

//   const handleStartTest = () => {
//     setIsStarted(true)
//   }

//   const handleNextPassage = () => {
//     if (currentPassage < 3) {
//       setCurrentPassage(currentPassage + 1)
//     } else {
//       // Navigate to the next section (Writing)
//       localStorage.setItem("currentSection", "writing")
//       router.push("/writing/task1")
//     }
//   }

//   const handlePreviousPassage = () => {
//     if (currentPassage > 1) {
//       setCurrentPassage(currentPassage - 1)
//     }
//   }

//   const handleFinishTest = () => {
//     // Navigate to the next section (Writing)
//     localStorage.setItem("currentSection", "writing")
//     router.push("/writing/task1")
//   }

//   const handleAnnotation = (annotation: any) => {
//     setAnnotations((prev) => [...prev, annotation])
//   }

//   const handleCircleClick = () => {
//     setCurrentTool(currentTool === "circle" ? null : "circle")
//   }

//   const handleUnderlineClick = () => {
//     setCurrentTool(currentTool === "underline" ? null : "underline")
//   }

//   const handleUndoAnnotation = () => {
//     setAnnotations((prev) => prev.slice(0, -1))
//   }

//   // Reading passages content
//   const passages = [
//     {
//      title: "Passage 1",
//      content: `The last man who knew everything

//  In the 21st century, it would be quite impossible for even the most learned man to know everything. However, as recently as the 18th century, there were those whose knowledge encompassed most of the information available at that time. This is a review of a biography of one such man.

//  Thomas Young (1773–1829) contributed 63 articles to the great British encyclopaedia, Encyclopaedia Britannica, including 46 biographical entries (mostly on scientists and classical scholars), and substantial essays on 'Bridge' (a card game), 'Egypt', 'Languages' and 'Tides'. Was someone who could write authoritatively about so many subjects a genius, or a dilettante?* In an ambitious biography, Andrew Robinson argues that Young is a good contender to be described as 'the last man who knew everything'. Young has competition, however: the phrase which Robinson uses as the title of his biography of Young also serves as the subtitle of two other recent biographies: Leonard Warren's 1998 life of palaeontologist Joseph Leidy (1823–1891) and Paula Findlen's 2004 book on Athanasius Kircher (1602–1680).

//  Young, of course, did more than write encyclopaedia entries. He presented his first paper, on the human eye, to the prestigious academic institution, the Royal Society of London** at the age of 20 and was elected a Fellow of the Society shortly afterwards. In the paper, which seeks to explain how the eye focuses on objects at varying distances, Young hypothesised that this was achieved by changes in the shape of the lens. He also theorised that light travels in waves, and believed that, to be able to see in colour, there must be three receptors in the eye corresponding to the three 'principal colours' (red, green and violet) to which the retina could respond. All these hypotheses were subsequently proved to be correct. Later in his life, when he was in his forties, Young was instrumental in cracking the code that unlocked the unknown script on the Rosetta Stone, a tablet found in Egypt by the Napoleonic army in 1799. The stone has text in three alphabets: Greek, Egyptian hieroglyphs, and something originally unrecognisable. The unrecognisable script is now known as 'demotic' and, as Young deduced, is related directly to Egyptian hieroglyphs. His initial work on this appeared in the Britannica entry 'Egypt'. In another entry, Young coined the term 'Indo-European' to describe the family of languages spoken throughout most of Europe and northern India. These works are the landmark achievements of a man who was a child prodigy but who, unlike many remarkable children, did not fade into obscurity as an adult.

//  Born in 1773 in Somerset in England, Young lived with his maternal grandfather from an early age. He devoured books from the age of two and excelled at Latin, Greek, mathematics and natural philosophy (the 18th-century term for science). After leaving school, he was greatly encouraged by Richard Brocklesby, a physician and Fellow of the Royal Society. Following Brocklesby's lead, Young decided to pursue a career in medicine. He studied in London and then moved on to more formal education in Edinburgh, Göttingen and Cambridge. After completing his medical training at the University of Cambridge in 1808, Young set up practice as a physician in London and a few years later was appointed physician at St. George's Hospital.

//  Young's skill as a physician, however, did not equal his talent as a scholar of natural philosophy or linguistics. In 1801, he had been appointed to a professorship of natural philosophy at the Royal Institution, where he delivered as many as 60 lectures a year. His opinions were requested by civic and national authorities on matters such as the introduction of gas lighting to London streets and methods of ship construction. From 1819, he was superintendent of the Nautical Almanac and secretary to the Board of Longitude. Between 1816 and 1825, he contributed many entries to the Encyclopaedia Britannica, and throughout his career he authored numerous other essays, papers and books.

//  Young is a perfect subject for a biography — perfect, but daunting. Few men contributed so much to so many technical fields. Robinson's aim is to introduce non-scientists to Young's work and life. He succeeds, providing clear expositions of the technical material (especially that on optics and Egyptian hieroglyphs). Some readers of this book will, like Robinson, find Young's accomplishments impressive; others will see him as some historians have — as a dilettante. Yet despite the rich material presented in this book, readers will not end up knowing Young personally. We catch glimpses of a playful Young, doodling Greek and Latin phrases in his notes on medical lectures and translating the verses that a young lady had written on the walls of a summerhouse into Greek elegiacs. Young was introduced into elite society, attended the theatre and learned to dance and play the flute. In addition, he was an accomplished horseman. However, his personal life looks pale next to his vibrant career and studies.

//  Young married Eliza Maxwell in 1804, and according to Robinson, 'their marriage was happy and she appreciated his work'. Almost all we know about her is that she sustained her husband through some rancorous disputes about optics and that she worried about money when his medical career was slow to take off. Little evidence survives concerning the complexities of Young's relationships with his mother and father. Robinson does not credit them with shaping Young's extraordinary mind. Despite the lack of details concerning Young's relationships, however, anyone interested in what it means to be a genius should read this book.`,
//      questions: [
//         {
//           id: "rq1",
//           type: "truefalse",
//           question: "1. The author suggests that the topic of the passage is well-researched.",
//           options: ["TRUE", "FALSE", "NOT GIVEN"],
//         },
//         {
//           id: "rq2",
//           type: "truefalse",
//           question: "2. According to the passage, the findings are conclusive.",
//           options: ["TRUE", "FALSE", "NOT GIVEN"],
//         },
//         {
//           id: "rq3",
//           type: "truefalse",
//           question: "3. The research mentioned in the passage was conducted over a period of five years.",
//           options: ["TRUE", "FALSE", "NOT GIVEN"],
//         },
//         {
//           id: "rq4",
//           type: "truefalse",
//           question: "4. The author believes that further research is necessary.",
//           options: ["TRUE", "FALSE", "NOT GIVEN"],
//         },
//         {
//           id: "rq5",
//           type: "shortanswer",
//           question: "5. What was the main focus of the research described in the passage?",
//         },
//         {
//           id: "rq6",
//           type: "shortanswer",
//           question: "6. Who funded the research project?",
//         },
//         {
//           id: "rq7",
//           type: "shortanswer",
//           question: "7. In which year was the initial study conducted?",
//         },
//         {
//           id: "rq8",
//           type: "shortanswer",
//           question: "8. What method was used to collect the data?",
//         },
//         {
//           id: "rq9",
//           type: "multiplechoice",
//           question: "9. Which of the following best describes the author's attitude toward the research?",
//           options: ["A. Enthusiastic", "B. Skeptical", "C. Neutral", "D. Critical"],
//         },
//         {
//           id: "rq10",
//           type: "multiplechoice",
//           question: "10. According to the passage, what was the most significant finding of the research?",
//           options: [
//             "A. The correlation between variables X and Y",
//             "B. The lack of evidence for the initial hypothesis",
//             "C. The unexpected relationship between factors A and B",
//             "D. The confirmation of previous studies' results",
//           ],
//         },
//         {
//           id: "rq11",
//           type: "multiplechoice",
//           question: "11. What limitation of the research does the author acknowledge?",
//           options: [
//             "A. Small sample size",
//             "B. Potential researcher bias",
//             "C. Limited geographical scope",
//             "D. Outdated methodology",
//           ],
//         },
//         {
//           id: "rq12",
//           type: "multiplechoice",
//           question: "12. What does the author suggest for future research?",
//           options: [
//             "A. Replicating the study with a larger sample",
//             "B. Using different methodologies",
//             "C. Focusing on different variables",
//             "D. Collaborating with international researchers",
//           ],
//         },
//         {
//           id: "rq13",
//           type: "multiplechoice",
//           question: "13. What is the primary purpose of the passage?",
//           options: [
//             "A. To criticize previous research",
//             "B. To present new findings",
//             "C. To compare competing theories",
//             "D. To propose a new methodology",
//           ],
//         },
//       ],
//     },
//     {
//       title: "Passage 2",
//       content: `The fashion industry

// A The fashion industry is a multibillion-dollar global enterprise devoted to the business of making and selling clothes. It encompasses all types of garments, from designer fashions to ordinary everyday clothing. Because data on the industry are typically reported for national economies, and expressed in terms of its many separate sectors, total figures for world production of textiles* and clothing are difficult to obtain. However, by any measure, the industry accounts for a significant share of world economic output.

// B The fashion industry is a product of the modern age. Prior to the mid-19th century, virtually all clothing was handmade for individuals, either as home production or on order from dressmakers and tailors. By the beginning of the 20th century, with the development of new technologies such as the sewing machine, the development of the factory system of production, and the growth of department stores and other retail outlets, clothing had increasingly come to be mass-produced in standard sizes, and sold at fixed prices. Although the fashion industry developed first in Europe, today it is highly globalised, with garments often designed in one country, manufactured in another, and sold in a third. For example, an American fashion company might source fabric in China and have the clothes manufactured in Vietnam, finished in Italy, and shipped to a warehouse in the United States for distribution to retail outlets internationally.

// C One of the first accomplishments of the Industrial Revolution in the 18th century was the partial automation of the spinning and weaving of wool, cotton, silk and other natural fibres. Today, these processes are highly automated and carried out by computer-controlled, high-speed machinery, and fabrics made from both natural fibres and synthetic fibres (such as nylon, acrylic, and polyester) are produced. A growing interest in sustainable fashion (or 'eco-fashion') has led to greater use of environmentally friendly fibres, such as hemp. In addition, high-tech synthetic fabrics offer such properties as moisture absorption, stain resistance, retention or dissipation of body heat, and protection against fire, weapons, cold, ultraviolet radiation, and other hazards. Fabrics are also produced with a wide range of visual effects through dyeing, weaving, printing, and other processes. Together with fashion forecasters, fabric manufacturers work well in advance of the clothing production cycle, to create fabrics with colours, textures, and other qualities that anticipate consumer demand.

// D Historically, very few fashion designers have become famous brands such as Coco Chanel or Calvin Klein, who have been responsible for prestigious high-fashion collections. These designers are influential in the fashion world, but, contrary to popular belief, they do not dictate new fashions; rather, they endeavour to design clothes that will meet consumer demand. The vast majority of designers work in anonymity for manufacturers, as part of design teams, adapting designs into marketable garments for average consumers. They draw inspiration from a wide range of sources, including film and television costumes, street clothing, and active sportswear.

// The fashion industry's traditional design methods, such as paper sketches and the draping of fabric on mannequins, have been supplemented or replaced by computer-assisted design techniques. These allow designers to rapidly make changes to a proposed design, and instantaneously share the proposed changes with colleagues – whether they are in the next room or on another continent.

// E An important stage in garment production is the translation of the clothing design into templates, in a range of sizes, for cutting the cloth. Because the proportions of the human body change with increases or decreases in weight, templates cannot simply be scaled up or down. Template making was traditionally a highly skilled profession. Today, despite innovations in computer programming, designs in larger sizes are difficult to adjust for every body shape. Whatever the size, the template – whether drawn on paper or programmed as a set of computer instructions – determines how fabric is cut into the pieces that will be joined to make a garment. For all but the most expensive clothing, fabric cutting is accomplished by computer-guided knives or high-intensity lasers that can cut many layers of fabric at once.

// F The next stage of production is the assembly process. Some companies use their own production facilities for some or all of the manufacturing process, but the majority rely on separately owned manufacturing firms or contractors to produce garments to their specifications. In the field of women's clothing, manufacturers typically produce several product lines a year, which they deliver to retailers on predetermined dates. Technological innovation, including the development of computer-guided machinery, has resulted in the automation of some stages of assembly. Nevertheless, the fundamental process of sewing remains labour-intensive. In the late 20th century, China emerged as the world's largest producer of clothing because of its low labour costs and highly disciplined workforce.

// Assembled items then go through various processes collectively known as 'finishing'. These include the addition of decorative elements, fasteners, brand-name labels, and other labels (often legally required) specifying fibre content, laundry instructions, and country of manufacture. Finished items are then pressed and packed for shipment.

// G For much of the period following World War II, trade in textiles and garments was strictly regulated by purchasing countries, which imposed quotas and tariffs. Since the 1980s, these protectionist measures, which were intended (ultimately without success) to prevent textile and clothing production from moving from high-wage to low-wage countries, have gradually been abandoned. They have been replaced by a free-trade approach, under the regulatory control of global organisations. The advent of metal shipping containers and relatively inexpensive air freight have also made it possible for production to be closely tied to market conditions, even across globe-spanning distances.`,
//       questions: [
//         {
//           id: "rq14",
//           type: "matching",
//           question: "14-20. Match each statement with the correct person, A-G.",
//           options: [
//             "A. Dr. Smith",
//             "B. Professor Johnson",
//             "C. Researcher Williams",
//             "D. Dr. Brown",
//             "E. Professor Davis",
//             "F. Researcher Wilson",
//             "G. Dr. Taylor",
//           ],
//           statements: [
//             { id: "rq14", text: "14. Believed that the traditional approach was flawed." },
//             { id: "rq15", text: "15. Proposed a new theoretical framework." },
//             { id: "rq16", text: "16. Conducted the first empirical study on the subject." },
//             { id: "rq17", text: "17. Criticized the methodology of previous studies." },
//             { id: "rq18", text: "18. Found contradictory evidence to the established theory." },
//             { id: "rq19", text: "19. Suggested practical applications for the research findings." },
//             { id: "rq20", text: "20. Advocated for interdisciplinary collaboration." },
//           ],
//         },
//         {
//           id: "rq21",
//           type: "completion",
//           question:
//             "21-26. Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
//           summary: `The research on this topic began in the early 21._______ when scientists first observed the phenomenon. Initially, they believed it was caused by 22._______, but later studies revealed a more complex explanation. The breakthrough came when researchers developed a new 23._______ that allowed for more precise measurements. This led to the discovery that the process occurs in three distinct 24._______, each with its own characteristics. The implications of these findings extend beyond the original field to areas such as 25._______ and environmental science. Current research is focused on understanding how external 26._______ might influence the process.`,
//         },
//       ],
//     },
//     {
//      title: "Passage 3",
//        content: `How a prehistoric predator took to the skies

//  Is that a bird in the sky? A plane? No, it's a pterosaur. Kate Thomas meets Professor Matthew Wilkinson, who built a life-size model to find out how this prehistoric predator ever got off the ground.

//  Pterosaurs existed from the Triassic period, 220 million years ago, to the end of the Cretaceous period, 65 million years ago, when South America pulled away from Africa and the South Atlantic was formed. They are among the least understood of all the extinct reptiles that once spent their lives in the skies while the dinosaurs dominated the land. Pterosaurs had no feathers, but at least part of their bodies was covered in hair, not unlike bats. Some believe this is an indication they were warm-blooded. Researchers also debate whether pterosaurs travelled on the ground by walking on their hind legs, like birds, or by using all fours, relying on their three-toed front feet as well as their four-toed rear feet.

//  Pterosaurs were vertebrates, meaning they were the first species possessing backbones to become airborne, but scientists have never quite understood their flight technique. How, they wondered, did such a heavy creature ever manage to take off? How could a wing that appears to have been supported by fine, hollow bones have carried one into the sky? Then came the discovery of a site in Brazil's Araripe basin. Here, not only were hundreds of fossils of amphibians* and other reptiles found, but archaeologists unearthed a number of very well-preserved pterosaurs. The anhanguera – a fish-eating sub-species of pterosaur that ruled the skies in the Cretaceous period – was among them. With a wingspan of up to 12 metres, they would have made an amazing sight in the sky – had any human been there to witness it. 'I've been studying pterosaurs for about eight years now,' says Dr Matthew Wilkinson, a professor of zoology at Cambridge University. With an anhanguera fossil as his model, Wilkinson began gradually reconstructing its skeletal structure in his Cambridge studio. The probability of finding three-dimensional pterosaur fossils anywhere is slim. 'That was quite a find,' he says. 'Their bones are usually crushed to dust.' Once the structure was complete, it inspired him to make a robot version as a way to understand the animal's locomotion. With a team of model-makers, he has built a remote-controlled pterosaur in his studio. 'Fossils show just how large these creatures were. I've always been interested in how they managed to launch themselves, so I thought the real test would be to actually build one and fly it.'

//  Wilkinson hasn't been alone in his desire to recreate a prehistoric beast. Swiss scientists recently announced they had built an amphibious robot that could walk on land and swim in water using the sort of backbone movements that must have been employed by the first creatures to crawl from the sea. But Wilkinson had the added complication of working out his beast's flight technique. Unlike those of bats or flying squirrels, pterosaur wings – soft, stretchy membranes of skin tissue – are thought to have reached from the chest right to the ankle, reinforced by fibres that stiffened the wing and prevented tearing. Smaller subspecies flapped their wings during takeoff. That may have explained the creatures' flexibility, but it did not answer the most pressing question: how did such heavy animals manage to launch themselves into the sky? Working with researchers in London and Berlin, Wilkinson began to piece together the puzzle.

//  It emerged that the anhanguera had an elongated limb called the pteroid. It had previously been thought the pteroid pointed towards the shoulder of the creature and supported a soft forewing in front of the arm. But if that were the case, the forewing would have been too small and ineffectual for flight. However, to the surprise of many scientists, fossils from the Araripe basin showed the pteroid possibly faced the opposite way, creating a much greater forewing that would have caught the air, working in the same way as the flaps on the wings of an aeroplane. So, with both feet on the ground, the anhanguera might have simply faced into the wind, spread its wings and risen up into the sky. Initial trials in wind tunnels proved the point – models of pterosaurs with forward-facing pteroids were not only adept at gliding, but were agile flyers in spite of their size. 'This high-lift capability would have significantly reduced the minimum flight speed, allowing even the largest forms to take off without difficulty,' Wilkinson says. 'It would have enabled them to glide very slowly and may have been instrumental in the evolution of large size by the pterosaurs.'

//  Resting in the grass at the test site near Cambridge, the robot-model's wings ripple in the wind. In flight, the flexible membrane, while much stiffer than the real thing, allows for a smooth takeoff and landing. But the model has been troubled by other mechanical problems. 'Unlike an aircraft, which is stabilised by the tail wing at the back, the model is stabilised by its head, which means it can start spinning around. That's the most problematic bit as far as we're concerned,' Wilkinson says. 'We've had to take it flying without the head so far.' When it flies with its head attached, Wilkinson will finally have proved his point.

//  So what's next for the zoologist – perhaps a full-size Tyrannosaurus rex? 'No,' he tells me. 'We're desperate to build really big pterosaurs. I'm talking creatures with even greater wingspans, weighing a quarter of a ton. But,' he adds, just as one begins to fear for the safety and stress levels of pilots landing nearby at Cambridge City Airport, 'it's more likely we'll start off with one of the smaller, flapping pterosaurs.' This is certainly more reassuring. Let's hope he is content to leave it at that.`,
//       questions: [
//         {
//           id: "rq27",
//           type: "headings",
//           question: "27-33. Match each paragraph (A-G) with the most suitable heading (i-x).",
//           options: [
//             "i. Historical background",
//             "ii. Competing theories",
//             "iii. Methodological challenges",
//             "iv. Recent discoveries",
//             "v. Practical applications",
//             "vi. Future directions",
//             "vii. Limitations of current knowledge",
//             "viii. Interdisciplinary perspectives",
//             "ix. Ethical considerations",
//             "x. Global implications",
//           ],
//           paragraphs: [
//             { id: "rq27", text: "A. The first paragraph of the passage." },
//             { id: "rq28", text: "B. The second paragraph of the passage." },
//             { id: "rq29", text: "C. The third paragraph of the passage." },
//             { id: "rq30", text: "D. The fourth paragraph of the passage." },
//             { id: "rq31", text: "E. The fifth paragraph of the passage." },
//             { id: "rq32", text: "F. The sixth paragraph of the passage." },
//             { id: "rq33", text: "G. The seventh paragraph of the passage." },
//           ],
//         },
//         {
//           id: "rq34",
//           type: "yesnonotgiven",
//           question: "34. The author agrees with the mainstream view on this topic.",
//           options: ["YES", "NO", "NOT GIVEN"],
//         },
//         {
//           id: "rq35",
//           type: "yesnonotgiven",
//           question: "35. The research has led to practical applications in industry.",
//           options: ["YES", "NO", "NOT GIVEN"],
//         },
//         {
//           id: "rq36",
//           type: "yesnonotgiven",
//           question: "36. The author has personally conducted research in this field.",
//           options: ["YES", "NO", "NOT GIVEN"],
//         },
//         {
//           id: "rq37",
//           type: "yesnonotgiven",
//           question: "37. Government funding for this research has increased in recent years.",
//           options: ["YES", "NO", "NOT GIVEN"],
//         },
//         {
//           id: "rq38",
//           type: "multiplechoice",
//           question: "38. What is the author's main criticism of the current research?",
//           options: [
//             "A. It focuses too narrowly on specific aspects",
//             "B. It relies too heavily on outdated theories",
//             "C. It fails to consider alternative explanations",
//             "D. It does not adequately address practical applications",
//           ],
//         },
//         {
//           id: "rq39",
//           type: "multiplechoice",
//           question: "39. According to the passage, what is the most promising direction for future research?",
//           options: [
//             "A. Developing new theoretical models",
//             "B. Conducting larger-scale empirical studies",
//             "C. Exploring interdisciplinary connections",
//             "D. Focusing on practical applications",
//           ],
//         },
//         {
//           id: "rq40",
//           type: "multiplechoice",
//           question: "40. Which of the following best describes the author's tone in the passage?",
//           options: [
//             "A. Enthusiastic and optimistic",
//             "B. Critical but constructive",
//             "C. Neutral and objective",
//             "D. Skeptical and cautious",
//           ],
//         },
//       ],
//     },
//   ]

//   const currentPassageData = passages[currentPassage - 1]

//   if (!isStarted) {
//     return (
//       <div className="container mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-4">IELTS Reading Test</h1>
//         <p className="mb-4">
//           This test consists of three passages with a total of 40 questions. You have 60 minutes to complete the test.
//         </p>
//         <p className="mb-4">
//           You should spend about 20 minutes on each passage. The passages will increase in difficulty level.
//         </p>
//         <Button onClick={handleStartTest}>Start Test</Button>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="flex justify-between items-center p-4 border-b border-gray-200">
//         <h1 className="text-2xl font-bold">Reading {currentPassageData.title}</h1>
//         <div className="text-xl font-semibold">Time Remaining: {formatTime(timeRemaining)}</div>
//       </div>

//       <TextAnnotationTools
//         onCircleClick={handleCircleClick}
//         onUnderlineClick={handleUnderlineClick}
//         onUndoClick={handleUndoAnnotation}
//         activeMode={currentTool}
//       />

//       <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-120px)]">
//         <div className="border-r border-gray-200">
//           <div className="p-4 h-full overflow-auto">
//             <h2 className="text-xl font-semibold mb-4">Reading Passage</h2>
//             <TextAnnotator
//               content={currentPassageData.content}
//               annotations={annotations}
//               onAnnotation={handleAnnotation}
//               currentTool={currentTool}
//             />
//           </div>
//         </div>

//         <div className="bg-gray-50">
//           <div className="p-4 h-full overflow-auto">
//             <h2 className="text-xl font-semibold mb-4">Questions</h2>
//             <div className="space-y-6">
//               {currentPassageData.questions.map((question) => {
//                 if (question.type === "truefalse" || question.type === "yesnonotgiven") {
//                   return (
//                     <div key={question.id} className="mb-4">
//                       <p className="mb-2">{question.question}</p>
//                       <div className="space-y-2">
//                         {question.options?.map((option) => (
//                           <div key={option} className="flex items-center">
//                             <input
//                               type="radio"
//                               id={`${question.id}-${option}`}
//                               name={question.id}
//                               value={option}
//                               checked={answers[question.id] === option}
//                               onChange={() => handleAnswerChange(question.id, option)}
//                               className="mr-2"
//                             />
//                             <label htmlFor={`${question.id}-${option}`}>{option}</label>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )
//                 } else if (question.type === "multiplechoice") {
//                   return (
//                     <div key={question.id} className="mb-4">
//                       <p className="mb-2">{question.question}</p>
//                       <div className="space-y-2">
//                         {question.options?.map((option) => (
//                           <div key={option} className="flex items-center">
//                             <input
//                               type="radio"
//                               id={`${question.id}-${option}`}
//                               name={question.id}
//                               value={option}
//                               checked={answers[question.id] === option}
//                               onChange={() => handleAnswerChange(question.id, option)}
//                               className="mr-2"
//                             />
//                             <label htmlFor={`${question.id}-${option}`}>{option}</label>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )
//                 } else if (question.type === "shortanswer") {
//                   return (
//                     <div key={question.id} className="mb-4">
//                       <p className="mb-2">{question.question}</p>
//                       <input
//                         type="text"
//                         value={answers[question.id] || ""}
//                         onChange={(e) => handleAnswerChange(question.id, e.target.value)}
//                         placeholder="Enter your answer"
//                         className="w-full p-2 border rounded"
//                       />
//                     </div>
//                   )
//                 } else if (question.type === "matching") {
//                   return (
//                     <div key={question.id} className="mb-4">
//                       <p className="mb-2">{question.question}</p>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <h4 className="font-medium mb-2">Options:</h4>
//                           <ul className="list-disc pl-5">
//                             {question.options?.map((option) => (
//                               <li key={option}>{option}</li>
//                             ))}
//                           </ul>
//                         </div>
//                         <div>
//                           <h4 className="font-medium mb-2">Statements:</h4>
//                           {question.statements?.map((statement) => (
//                             <div key={statement.id} className="mb-2">
//                               <p>{statement.text}</p>
//                               <input
//                                 type="text"
//                                 value={answers[statement.id] || ""}
//                                 onChange={(e) => handleAnswerChange(statement.id, e.target.value)}
//                                 placeholder="Enter letter (A-G)"
//                                 className="w-full p-2 border rounded mt-1"
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 } else if (question.type === "completion") {
//                   return (
//                     <div key={question.id} className="mb-4">
//                       <p className="mb-2">{question.question}</p>
//                       <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
//                         {question.summary?.split(/(\d+\._______)/g).map((part, index) => {
//                           if (part.match(/\d+\._______/)) {
//                             const questionNumber = part.match(/(\d+)\._______/)?.[1]
//                             const inputId = `rq${questionNumber}`
//                             return (
//                               <span key={index} className="inline-block">
//                                 <input
//                                   type="text"
//                                   value={answers[inputId] || ""}
//                                   onChange={(e) => handleAnswerChange(inputId, e.target.value)}
//                                   placeholder="________"
//                                   className="w-24 p-1 border rounded mx-1 inline-block"
//                                 />
//                               </span>
//                             )
//                           }
//                           return <span key={index}>{part}</span>
//                         })}
//                       </div>
//                     </div>
//                   )
//                 } else if (question.type === "headings") {
//                   return (
//                     <div key={question.id} className="mb-4">
//                       <p className="mb-2">{question.question}</p>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <h4 className="font-medium mb-2">Headings:</h4>
//                           <ul className="list-disc pl-5">
//                             {question.options?.map((option) => (
//                               <li key={option}>{option}</li>
//                             ))}
//                           </ul>
//                         </div>
//                         <div>
//                           <h4 className="font-medium mb-2">Paragraphs:</h4>
//                           {question.paragraphs?.map((paragraph) => (
//                             <div key={paragraph.id} className="mb-2">
//                               <p>{paragraph.text}</p>
//                               <input
//                                 type="text"
//                                 value={answers[paragraph.id] || ""}
//                                 onChange={(e) => handleAnswerChange(paragraph.id, e.target.value)}
//                                 placeholder="Enter heading number (i-x)"
//                                 className="w-full p-2 border rounded mt-1"
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 }
//                 return null
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-between p-4 border-t border-gray-200 bg-white">
//         {currentPassage > 1 && <Button onClick={handlePreviousPassage}>Previous Passage</Button>}
//         {currentPassage < 3 ? (
//           <Button onClick={handleNextPassage} className="ml-auto">
//             Next Passage
//           </Button>
//         ) : (
//           <Button onClick={handleFinishTest} className="ml-auto">
//             Go to Writing
//           </Button>
//         )}
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { TextAnnotator } from "@/components/text-annotator"
import { TextAnnotationTools } from "@/components/text-annotation-tools"

export default function ReadingTest() {
  const router = useRouter()
  const [currentPassage, setCurrentPassage] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isStarted, setIsStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds
  const [annotations, setAnnotations] = useState<any[]>([])
  const [currentTool, setCurrentTool] = useState<string | null>(null)

  useEffect(() => {
    if (isStarted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            // Handle time's up
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isStarted])

  useEffect(() => {
    // Load saved answers from localStorage
    const savedAnswers = localStorage.getItem("readingAnswers")
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }

    // Load saved annotations from localStorage
    const savedAnnotations = localStorage.getItem("readingAnnotations")
    if (savedAnnotations) {
      setAnnotations(JSON.parse(savedAnnotations))
    }

    // Check if test was already started
    const testStarted = localStorage.getItem("readingTestStarted")
    if (testStarted === "true") {
      setIsStarted(true)
    }

    // Load current passage
    const savedPassage = localStorage.getItem("currentReadingPassage")
    if (savedPassage) {
      setCurrentPassage(Number.parseInt(savedPassage))
    }
  }, [])

  useEffect(() => {
    // Save current passage to localStorage
    localStorage.setItem("currentReadingPassage", currentPassage.toString())
  }, [currentPassage])

  useEffect(() => {
    // Save answers to localStorage
    localStorage.setItem("readingAnswers", JSON.stringify(answers))
  }, [answers])

  useEffect(() => {
    // Save annotations to localStorage
    localStorage.setItem("readingAnnotations", JSON.stringify(annotations))
  }, [annotations])

  useEffect(() => {
    // Save test started status to localStorage
    localStorage.setItem("readingTestStarted", isStarted.toString())
  }, [isStarted])

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartTest = () => {
    setIsStarted(true)
  }

  const handleNextPassage = () => {
    if (currentPassage < 3) {
      setCurrentPassage(currentPassage + 1)
    } else {
      // Navigate to the next section (Writing)
      localStorage.setItem("currentSection", "writing")
      router.push("/writing/task1")
    }
  }

  const handlePreviousPassage = () => {
    if (currentPassage > 1) {
      setCurrentPassage(currentPassage - 1)
    }
  }

  const handleFinishTest = () => {
    // Navigate to the next section (Writing)
    localStorage.setItem("currentSection", "writing")
    router.push("/writing/task1")
  }

  const handleAnnotation = (annotation: any) => {
    setAnnotations((prev) => [...prev, annotation])
  }

  const handleCircleClick = () => {
    setCurrentTool(currentTool === "circle" ? null : "circle")
  }

  const handleUnderlineClick = () => {
    setCurrentTool(currentTool === "underline" ? null : "underline")
  }

  const handleUndoAnnotation = () => {
    setAnnotations((prev) => prev.slice(0, -1))
  }

  // Reading passages content
  const passages = [
    {
      title: "Passage 1",
      content: `The last man who knew everything

  In the 21st century, it would be quite impossible for even the most learned man to know everything. However, as recently as the 18th century, there were those whose knowledge encompassed most of the information available at that time. This is a review of a biography of one such man.

  Thomas Young (1773–1829) contributed 63 articles to the great British encyclopaedia, Encyclopaedia Britannica, including 46 biographical entries (mostly on scientists and classical scholars), and substantial essays on 'Bridge' (a card game), 'Egypt', 'Languages' and 'Tides'. Was someone who could write authoritatively about so many subjects a genius, or a dilettante?* In an ambitious biography, Andrew Robinson argues that Young is a good contender to be described as 'the last man who knew everything'. Young has competition, however: the phrase which Robinson uses as the title of his biography of Young also serves as the subtitle of two other recent biographies: Leonard Warren's 1998 life of palaeontologist Joseph Leidy (1823–1891) and Paula Findlen's 2004 book on Athanasius Kircher (1602–1680).

  Young, of course, did more than write encyclopaedia entries. He presented his first paper, on the human eye, to the prestigious academic institution, the Royal Society of London** at the age of 20 and was elected a Fellow of the Society shortly afterwards. In the paper, which seeks to explain how the eye focuses on objects at varying distances, Young hypothesised that this was achieved by changes in the shape of the lens. He also theorised that light travels in waves, and believed that, to be able to see in colour, there must be three receptors in the eye corresponding to the three 'principal colours' (red, green and violet) to which the retina could respond. All these hypotheses were subsequently proved to be correct. Later in his life, when he was in his forties, Young was instrumental in cracking the code that unlocked the unknown script on the Rosetta Stone, a tablet found in Egypt by the Napoleonic army in 1799. The stone has text in three alphabets: Greek, Egyptian hieroglyphs, and something originally unrecognisable. The unrecognisable script is now known as 'demotic' and, as Young deduced, is related directly to Egyptian hieroglyphs. His initial work on this appeared in the Britannica entry 'Egypt'. In another entry, Young coined the term 'Indo-European' to describe the family of languages spoken throughout most of Europe and northern India. These works are the landmark achievements of a man who was a child prodigy but who, unlike many remarkable children, did not fade into obscurity as an adult.

  Born in 1773 in Somerset in England, Young lived with his maternal grandfather from an early age. He devoured books from the age of two and excelled at Latin, Greek, mathematics and natural philosophy (the 18th-century term for science). After leaving school, he was greatly encouraged by Richard Brocklesby, a physician and Fellow of the Royal Society. Following Brocklesby's lead, Young decided to pursue a career in medicine. He studied in London and then moved on to more formal education in Edinburgh, Göttingen and Cambridge. After completing his medical training at the University of Cambridge in 1808, Young set up practice as a physician in London and a few years later was appointed physician at St. George's Hospital.

  Young's skill as a physician, however, did not equal his talent as a scholar of natural philosophy or linguistics. In 1801, he had been appointed to a professorship of natural philosophy at the Royal Institution, where he delivered as many as 60 lectures a year. His opinions were requested by civic and national authorities on matters such as the introduction of gas lighting to London streets and methods of ship construction. From 1819, he was superintendent of the Nautical Almanac and secretary to the Board of Longitude. Between 1816 and 1825, he contributed many entries to the Encyclopaedia Britannica, and throughout his career he authored numerous other essays, papers and books.

  Young is a perfect subject for a biography — perfect, but daunting. Few men contributed so much to so many technical fields. Robinson's aim is to introduce non-scientists to Young's work and life. He succeeds, providing clear expositions of the technical material (especially that on optics and Egyptian hieroglyphs). Some readers of this book will, like Robinson, find Young's accomplishments impressive; others will see him as some historians have — as a dilettante. Yet despite the rich material presented in this book, readers will not end up knowing Young personally. We catch glimpses of a playful Young, doodling Greek and Latin phrases in his notes on medical lectures and translating the verses that a young lady had written on the walls of a summerhouse into Greek elegiacs. Young was introduced into elite society, attended the theatre and learned to dance and play the flute. In addition, he was an accomplished horseman. However, his personal life looks pale next to his vibrant career and studies.

  Young married Eliza Maxwell in 1804, and according to Robinson, 'their marriage was happy and she appreciated his work'. Almost all we know about her is that she sustained her husband through some rancorous disputes about optics and that she worried about money when his medical career was slow to take off. Little evidence survives concerning the complexities of Young's relationships with his mother and father. Robinson does not credit them with shaping Young's extraordinary mind. Despite the lack of details concerning Young's relationships, however, anyone interested in what it means to be a genius should read this book.`,
      questions: [
        {
          id: "rq1",
          type: "truefalse",
          question: "1. The author suggests that the topic of the passage is well-researched.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
        },
        {
          id: "rq2",
          type: "truefalse",
          question: "2. According to the passage, the findings are conclusive.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
        },
        {
          id: "rq3",
          type: "truefalse",
          question: "3. The research mentioned in the passage was conducted over a period of five years.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
        },
        {
          id: "rq4",
          type: "truefalse",
          question: "4. The author believes that further research is necessary.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
        },
        {
          id: "rq5",
          type: "shortanswer",
          question: "5. What was the main focus of the research described in the passage?",
        },
        {
          id: "rq6",
          type: "shortanswer",
          question: "6. Who funded the research project?",
        },
        {
          id: "rq7",
          type: "shortanswer",
          question: "7. In which year was the initial study conducted?",
        },
        {
          id: "rq8",
          type: "shortanswer",
          question: "8. What method was used to collect the data?",
        },
        {
          id: "rq9",
          type: "multiplechoice",
          question: "9. Which of the following best describes the author's attitude toward the research?",
          options: ["A. Enthusiastic", "B. Skeptical", "C. Neutral", "D. Critical"],
        },
        {
          id: "rq10",
          type: "multiplechoice",
          question: "10. According to the passage, what was the most significant finding of the research?",
          options: [
            "A. The correlation between variables X and Y",
            "B. The lack of evidence for the initial hypothesis",
            "C. The unexpected relationship between factors A and B",
            "D. The confirmation of previous studies' results",
          ],
        },
        {
          id: "rq11",
          type: "multiplechoice",
          question: "11. What limitation of the research does the author acknowledge?",
          options: [
            "A. Small sample size",
            "B. Potential researcher bias",
            "C. Limited geographical scope",
            "D. Outdated methodology",
          ],
        },
        {
          id: "rq12",
          type: "multiplechoice",
          question: "12. What does the author suggest for future research?",
          options: [
            "A. Replicating the study with a larger sample",
            "B. Using different methodologies",
            "C. Focusing on different variables",
            "D. Collaborating with international researchers",
          ],
        },
        {
          id: "rq13",
          type: "multiplechoice",
          question: "13. What is the primary purpose of the passage?",
          options: [
            "A. To criticize previous research",
            "B. To present new findings",
            "C. To compare competing theories",
            "D. To propose a new methodology",
          ],
        },
      ],
    },
    {
      title: "Passage 2",
      content: `The fashion industry

A The fashion industry is a multibillion-dollar global enterprise devoted to the business of making and selling clothes. It encompasses all types of garments, from designer fashions to ordinary everyday clothing. Because data on the industry are typically reported for national economies, and expressed in terms of its many separate sectors, total figures for world production of textiles* and clothing are difficult to obtain. However, by any measure, the industry accounts for a significant share of world economic output.

B The fashion industry is a product of the modern age. Prior to the mid-19th century, virtually all clothing was handmade for individuals, either as home production or on order from dressmakers and tailors. By the beginning of the 20th century, with the development of new technologies such as the sewing machine, the development of the factory system of production, and the growth of department stores and other retail outlets, clothing had increasingly come to be mass-produced in standard sizes, and sold at fixed prices. Although the fashion industry developed first in Europe, today it is highly globalised, with garments often designed in one country, manufactured in another, and sold in a third. For example, an American fashion company might source fabric in China and have the clothes manufactured in Vietnam, finished in Italy, and shipped to a warehouse in the United States for distribution to retail outlets internationally.

C One of the first accomplishments of the Industrial Revolution in the 18th century was the partial automation of the spinning and weaving of wool, cotton, silk and other natural fibres. Today, these processes are highly automated and carried out by computer-controlled, high-speed machinery, and fabrics made from both natural fibres and synthetic fibres (such as nylon, acrylic, and polyester) are produced. A growing interest in sustainable fashion (or 'eco-fashion') has led to greater use of environmentally friendly fibres, such as hemp. In addition, high-tech synthetic fabrics offer such properties as moisture absorption, stain resistance, retention or dissipation of body heat, and protection against fire, weapons, cold, ultraviolet radiation, and other hazards. Fabrics are also produced with a wide range of visual effects through dyeing, weaving, printing, and other processes. Together with fashion forecasters, fabric manufacturers work well in advance of the clothing production cycle, to create fabrics with colours, textures, and other qualities that anticipate consumer demand.

D Historically, very few fashion designers have become famous brands such as Coco Chanel or Calvin Klein, who have been responsible for prestigious high-fashion collections. These designers are influential in the fashion world, but, contrary to popular belief, they do not dictate new fashions; rather, they endeavour to design clothes that will meet consumer demand. The vast majority of designers work in anonymity for manufacturers, as part of design teams, adapting designs into marketable garments for average consumers. They draw inspiration from a wide range of sources, including film and television costumes, street clothing, and active sportswear.

The fashion industry's traditional design methods, such as paper sketches and the draping of fabric on mannequins, have been supplemented or replaced by computer-assisted design techniques. These allow designers to rapidly make changes to a proposed design, and instantaneously share the proposed changes with colleagues – whether they are in the next room or on another continent.

E An important stage in garment production is the translation of the clothing design into templates, in a range of sizes, for cutting the cloth. Because the proportions of the human body change with increases or decreases in weight, templates cannot simply be scaled up or down. Template making was traditionally a highly skilled profession. Today, despite innovations in computer programming, designs in larger sizes are difficult to adjust for every body shape. Whatever the size, the template – whether drawn on paper or programmed as a set of computer instructions – determines how fabric is cut into the pieces that will be joined to make a garment. For all but the most expensive clothing, fabric cutting is accomplished by computer-guided knives or high-intensity lasers that can cut many layers of fabric at once.

F The next stage of production is the assembly process. Some companies use their own production facilities for some or all of the manufacturing process, but the majority rely on separately owned manufacturing firms or contractors to produce garments to their specifications. In the field of women's clothing, manufacturers typically produce several product lines a year, which they deliver to retailers on predetermined dates. Technological innovation, including the development of computer-guided machinery, has resulted in the automation of some stages of assembly. Nevertheless, the fundamental process of sewing remains labour-intensive. In the late 20th century, China emerged as the world's largest producer of clothing because of its low labour costs and highly disciplined workforce.

Assembled items then go through various processes collectively known as 'finishing'. These include the addition of decorative elements, fasteners, brand-name labels, and other labels (often legally required) specifying fibre content, laundry instructions, and country of manufacture. Finished items are then pressed and packed for shipment.

G For much of the period following World War II, trade in textiles and garments was strictly regulated by purchasing countries, which imposed quotas and tariffs. Since the 1980s, these protectionist measures, which were intended (ultimately without success) to prevent textile and clothing production from moving from high-wage to low-wage countries, have gradually been abandoned. They have been replaced by a free-trade approach, under the regulatory control of global organisations. The advent of metal shipping containers and relatively inexpensive air freight have also made it possible for production to be closely tied to market conditions, even across globe-spanning distances.`,
      questions: [
        {
          id: "rq14",
          type: "matching",
          question: "14-20. Match each statement with the correct person, A-G.",
          options: [
            "A. Dr. Smith",
            "B. Professor Johnson",
            "C. Researcher Williams",
            "D. Dr. Brown",
            "E. Professor Davis",
            "F. Researcher Wilson",
            "G. Dr. Taylor",
          ],
          statements: [
            { id: "rq14", text: "14. Believed that the traditional approach was flawed." },
            { id: "rq15", text: "15. Proposed a new theoretical framework." },
            { id: "rq16", text: "16. Conducted the first empirical study on the subject." },
            { id: "rq17", text: "17. Criticized the methodology of previous studies." },
            { id: "rq18", text: "18. Found contradictory evidence to the established theory." },
            { id: "rq19", text: "19. Suggested practical applications for the research findings." },
            { id: "rq20", text: "20. Advocated for interdisciplinary collaboration." },
          ],
        },
        {
          id: "rq21",
          type: "completion",
          question:
            "21-26. Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          summary: `The research on this topic began in the early 21._______ when scientists first observed the phenomenon. Initially, they believed it was caused by 22._______, but later studies revealed a more complex explanation. The breakthrough came when researchers developed a new 23._______ that allowed for more precise measurements. This led to the discovery that the process occurs in three distinct 24._______, each with its own characteristics. The implications of these findings extend beyond the original field to areas such as 25._______ and environmental science. Current research is focused on understanding how external 26._______ might influence the process.`,
        },
      ],
    },
    {
     title: "Passage 3",
       content: `How a prehistoric predator took to the skies

 Is that a bird in the sky? A plane? No, it's a pterosaur. Kate Thomas meets Professor Matthew Wilkinson, who built a life-size model to find out how this prehistoric predator ever got off the ground.

 Pterosaurs existed from the Triassic period, 220 million years ago, to the end of the Cretaceous period, 65 million years ago, when South America pulled away from Africa and the South Atlantic was formed. They are among the least understood of all the extinct reptiles that once spent their lives in the skies while the dinosaurs dominated the land. Pterosaurs had no feathers, but at least part of their bodies was covered in hair, not unlike bats. Some believe this is an indication they were warm-blooded. Researchers also debate whether pterosaurs travelled on the ground by walking on their hind legs, like birds, or by using all fours, relying on their three-toed front feet as well as their four-toed rear feet.

 Pterosaurs were vertebrates, meaning they were the first species possessing backbones to become airborne, but scientists have never quite understood their flight technique. How, they wondered, did such a heavy creature ever manage to take off? How could a wing that appears to have been supported by fine, hollow bones have carried one into the sky? Then came the discovery of a site in Brazil's Araripe basin. Here, not only were hundreds of fossils of amphibians* and other reptiles found, but archaeologists unearthed a number of very well-preserved pterosaurs. The anhanguera – a fish-eating sub-species of pterosaur that ruled the skies in the Cretaceous period – was among them. With a wingspan of up to 12 metres, they would have made an amazing sight in the sky – had any human been there to witness it. 'I've been studying pterosaurs for about eight years now,' says Dr Matthew Wilkinson, a professor of zoology at Cambridge University. With an anhanguera fossil as his model, Wilkinson began gradually reconstructing its skeletal structure in his Cambridge studio. The probability of finding three-dimensional pterosaur fossils anywhere is slim. 'That was quite a find,' he says. 'Their bones are usually crushed to dust.' Once the structure was complete, it inspired him to make a robot version as a way to understand the animal's locomotion. With a team of model-makers, he has built a remote-controlled pterosaur in his studio. 'Fossils show just how large these creatures were. I've always been interested in how they managed to launch themselves, so I thought the real test would be to actually build one and fly it.'

 Wilkinson hasn't been alone in his desire to recreate a prehistoric beast. Swiss scientists recently announced they had built an amphibious robot that could walk on land and swim in water using the sort of backbone movements that must have been employed by the first creatures to crawl from the sea. But Wilkinson had the added complication of working out his beast's flight technique. Unlike those of bats or flying squirrels, pterosaur wings – soft, stretchy membranes of skin tissue – are thought to have reached from the chest right to the ankle, reinforced by fibres that stiffened the wing and prevented tearing. Smaller subspecies flapped their wings during takeoff. That may have explained the creatures' flexibility, but it did not answer the most pressing question: how did such heavy animals manage to launch themselves into the sky? Working with researchers in London and Berlin, Wilkinson began to piece together the puzzle.

 It emerged that the anhanguera had an elongated limb called the pteroid. It had previously been thought the pteroid pointed towards the shoulder of the creature and supported a soft forewing in front of the arm. But if that were the case, the forewing would have been too small and ineffectual for flight. However, to the surprise of many scientists, fossils from the Araripe basin showed the pteroid possibly faced the opposite way, creating a much greater forewing that would have caught the air, working in the same way as the flaps on the wings of an aeroplane. So, with both feet on the ground, the anhanguera might have simply faced into the wind, spread its wings and risen up into the sky. Initial trials in wind tunnels proved the point – models of pterosaurs with forward-facing pteroids were not only adept at gliding, but were agile flyers in spite of their size. 'This high-lift capability would have significantly reduced the minimum flight speed, allowing even the largest forms to take off without difficulty,' Wilkinson says. 'It would have enabled them to glide very slowly and may have been instrumental in the evolution of large size by the pterosaurs.'

 Resting in the grass at the test site near Cambridge, the robot-model's wings ripple in the wind. In flight, the flexible membrane, while much stiffer than the real thing, allows for a smooth takeoff and landing. But the model has been troubled by other mechanical problems. 'Unlike an aircraft, which is stabilised by the tail wing at the back, the model is stabilised by its head, which means it can start spinning around. That's the most problematic bit as far as we're concerned,' Wilkinson says. 'We've had to take it flying without the head so far.' When it flies with its head attached, Wilkinson will finally have proved his point.

 So what's next for the zoologist – perhaps a full-size Tyrannosaurus rex? 'No,' he tells me. 'We're desperate to build really big pterosaurs. I'm talking creatures with even greater wingspans, weighing a quarter of a ton. But,' he adds, just as one begins to fear for the safety and stress levels of pilots landing nearby at Cambridge City Airport, 'it's more likely we'll start off with one of the smaller, flapping pterosaurs.' This is certainly more reassuring. Let's hope he is content to leave it at that.`,
      questions: [
        {
          id: "rq27",
          type: "headings",
          question: "27-33. Match each paragraph (A-G) with the most suitable heading (i-x).",
          options: [
            "i. Historical background",
            "ii. Competing theories",
            "iii. Methodological challenges",
            "iv. Recent discoveries",
            "v. Practical applications",
            "vi. Future directions",
            "vii. Limitations of current knowledge",
            "viii. Interdisciplinary perspectives",
            "ix. Ethical considerations",
            "x. Global implications",
          ],
          paragraphs: [
            { id: "rq27", text: "A. The first paragraph of the passage." },
            { id: "rq28", text: "B. The second paragraph of the passage." },
            { id: "rq29", text: "C. The third paragraph of the passage." },
            { id: "rq30", text: "D. The fourth paragraph of the passage." },
            { id: "rq31", text: "E. The fifth paragraph of the passage." },
            { id: "rq32", text: "F. The sixth paragraph of the passage." },
            { id: "rq33", text: "G. The seventh paragraph of the passage." },
          ],
        },
        {
          id: "rq34",
          type: "yesnonotgiven",
          question: "34. The author agrees with the mainstream view on this topic.",
          options: ["YES", "NO", "NOT GIVEN"],
        },
        {
          id: "rq35",
          type: "yesnonotgiven",
          question: "35. The research has led to practical applications in industry.",
          options: ["YES", "NO", "NOT GIVEN"],
        },
        {
          id: "rq36",
          type: "yesnonotgiven",
          question: "36. The author has personally conducted research in this field.",
          options: ["YES", "NO", "NOT GIVEN"],
        },
        {
          id: "rq37",
          type: "yesnonotgiven",
          question: "37. Government funding for this research has increased in recent years.",
          options: ["YES", "NO", "NOT GIVEN"],
        },
        {
          id: "rq38",
          type: "multiplechoice",
          question: "38. What is the author's main criticism of the current research?",
          options: [
            "A. It focuses too narrowly on specific aspects",
            "B. It relies too heavily on outdated theories",
            "C. It fails to consider alternative explanations",
            "D. It does not adequately address practical applications",
          ],
        },
        {
          id: "rq39",
          type: "multiplechoice",
          question: "39. According to the passage, what is the most promising direction for future research?",
          options: [
            "A. Developing new theoretical models",
            "B. Conducting larger-scale empirical studies",
            "C. Exploring interdisciplinary connections",
            "D. Focusing on practical applications",
          ],
        },
        {
          id: "rq40",
          type: "multiplechoice",
          question: "40. Which of the following best describes the author's tone in the passage?",
          options: [
            "A. Enthusiastic and optimistic",
            "B. Critical but constructive",
            "C. Neutral and objective",
            "D. Skeptical and cautious",
          ],
        },
      ],
    },
  ]

  const currentPassageData = passages[currentPassage - 1]

  if (!isStarted) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">IELTS Reading Test</h1>
        <p className="mb-4">
          This test consists of three passages with a total of 40 questions. You have 60 minutes to complete the test.
        </p>
        <p className="mb-4">
          You should spend about 20 minutes on each passage. The passages will increase in difficulty level.
        </p>
        <Button onClick={handleStartTest}>Start Test</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Reading {currentPassageData.title}</h1>
        <div className="text-xl font-semibold">Time Remaining: {formatTime(timeRemaining)}</div>
      </div>

      <TextAnnotationTools
        onCircleClick={handleCircleClick}
        onUnderlineClick={handleUnderlineClick}
        onUndoClick={handleUndoAnnotation}
        activeMode={currentTool}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-120px)]">
        <div className="border-r border-gray-200">
          <div className="p-4 h-full overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Reading Passage</h2>
            <TextAnnotator
              content={currentPassageData.content}
              annotations={annotations}
              onAnnotation={handleAnnotation}
              currentTool={currentTool}
            />
          </div>
        </div>

        <div className="bg-gray-50">
          <div className="p-4 h-full overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Questions</h2>
            <div className="space-y-6">
              {currentPassageData.questions.map((question) => {
                if (question.type === "truefalse" || question.type === "yesnonotgiven") {
                  return (
                    <div key={question.id} className="mb-4">
                      <p className="mb-2">{question.question}</p>
                      <div className="space-y-2">
                        {question.options?.map((option) => (
                          <div key={option} className="flex items-center">
                            <input
                              type="radio"
                              id={`${question.id}-${option}`}
                              name={question.id}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={() => handleAnswerChange(question.id, option)}
                              className="mr-2"
                            />
                            <label htmlFor={`${question.id}-${option}`}>{option}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                } else if (question.type === "multiplechoice") {
                  return (
                    <div key={question.id} className="mb-4">
                      <p className="mb-2">{question.question}</p>
                      <div className="space-y-2">
                        {question.options?.map((option) => (
                          <div key={option} className="flex items-center">
                            <input
                              type="radio"
                              id={`${question.id}-${option}`}
                              name={question.id}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={() => handleAnswerChange(question.id, option)}
                              className="mr-2"
                            />
                            <label htmlFor={`${question.id}-${option}`}>{option}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                } else if (question.type === "shortanswer") {
                  return (
                    <div key={question.id} className="mb-4">
                      <p className="mb-2">{question.question}</p>
                      <input
                        type="text"
                        value={answers[question.id] || ""}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Enter your answer"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )
                } else if (question.type === "matching") {
                  return (
                    <div key={question.id} className="mb-4">
                      <p className="mb-2">{question.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Options:</h4>
                          <ul className="list-disc pl-5">
                            {question.options?.map((option) => (
                              <li key={option}>{option}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Statements:</h4>
                          {question.statements?.map((statement) => (
                            <div key={statement.id} className="mb-2">
                              <p>{statement.text}</p>
                              <input
                                type="text"
                                value={answers[statement.id] || ""}
                                onChange={(e) => handleAnswerChange(statement.id, e.target.value)}
                                placeholder="Enter letter (A-G)"
                                className="w-full p-2 border rounded mt-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                } else if (question.type === "completion") {
                  return (
                    <div key={question.id} className="mb-4">
                      <p className="mb-2">{question.question}</p>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                        {question.summary?.split(/(\d+\._______)/g).map((part, index) => {
                          if (part.match(/\d+\._______/)) {
                            const questionNumber = part.match(/(\d+)\._______/)?.[1]
                            const inputId = `rq${questionNumber}`
                            return (
                              <span key={index} className="inline-block">
                                <input
                                  type="text"
                                  value={answers[inputId] || ""}
                                  onChange={(e) => handleAnswerChange(inputId, e.target.value)}
                                  placeholder="________"
                                  className="w-24 p-1 border rounded mx-1 inline-block"
                                />
                              </span>
                            )
                          }
                          return <span key={index}>{part}</span>
                        })}
                      </div>
                    </div>
                  )
                } else if (question.type === "headings") {
                  return (
                    <div key={question.id} className="mb-4">
                      <p className="mb-2">{question.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Headings:</h4>
                          <ul className="list-disc pl-5">
                            {question.options?.map((option) => (
                              <li key={option}>{option}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Paragraphs:</h4>
                          {question.paragraphs?.map((paragraph) => (
                            <div key={paragraph.id} className="mb-2">
                              <p>{paragraph.text}</p>
                              <input
                                type="text"
                                value={answers[paragraph.id] || ""}
                                onChange={(e) => handleAnswerChange(paragraph.id, e.target.value)}
                                placeholder="Enter heading number (i-x)"
                                className="w-full p-2 border rounded mt-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              })}

              {/* Navigation buttons at the end of questions */}
              <div className="flex justify-between pt-8 mt-8 border-t border-gray-300">
                {currentPassage > 1 && (
                  <Button onClick={handlePreviousPassage} variant="outline">
                    Previous Passage
                  </Button>
                )}
                {currentPassage < 3 ? (
                  <Button onClick={handleNextPassage} className="ml-auto">
                    Next Passage
                  </Button>
                ) : (
                  <Button onClick={handleFinishTest} className="ml-auto">
                    Go to Writing
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
