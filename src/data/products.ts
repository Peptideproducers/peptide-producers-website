export interface VialSize {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  casNumber?: string;
  image: string;
  description: string;
  vialSizes: VialSize[];
  purity: string;
  endotoxin: string;
  faqs: { question: string; answer: string }[];
}

export const products: Product[] = [
  {
    id: 'bpc-157',
    name: 'BPC-157',
    category: 'Recovery Compound',
    casNumber: '137525-51-0',
    image: '/images/product-bpc157.jpg',
    description: 'BPC-157 is a synthetic peptide studied for its potential effects on tissue regeneration, wound healing, and recovery processes. Research explores its interaction with growth factors and cellular repair mechanisms.',
    vialSizes: [
      { size: '5mg', price: 39 },
      { size: '10mg', price: 69 },
    ],
    purity: '≥99%',
    endotoxin: '<0.01 EU/μg',
    faqs: [
      {
        question: 'Does the product come with instructions?',
        answer: 'Yes, all products include detailed handling instructions and safety data sheets for proper laboratory use.',
      },
      {
        question: 'What\'s the actual amount in each vial?',
        answer: 'Each vial contains the exact amount of lyophilized peptide powder as indicated on the label.',
      },
      {
        question: 'Are additional supplies needed?',
        answer: 'Bacteriostatic water or acetic acid may be required for reconstitution, sold separately.',
      },
    ],
  },
  {
    id: 'bpc-tb-combo',
    name: 'BPC-157 + TB-500',
    category: 'Recovery Compound',
    image: '/images/product-bpc-tb.jpg',
    description: 'A synergistic blend of BPC-157 and TB-500 peptides studied for enhanced recovery and tissue repair properties. Research explores their combined effects on cellular regeneration.',
    vialSizes: [
      { size: 'Blend', price: 99 },
    ],
    purity: '≥99%',
    endotoxin: '<0.01 EU/μg',
    faqs: [
      {
        question: 'Does the product come with instructions?',
        answer: 'Yes, all products include detailed handling instructions and safety data sheets for proper laboratory use.',
      },
      {
        question: 'What\'s the actual amount in each vial?',
        answer: 'Each blend vial contains a pre-mixed ratio of both peptides for research convenience.',
      },
    ],
  },
  {
    id: 'cjc-ipa',
    name: 'CJC-1295 + Ipamorelin',
    category: 'Growth Compound',
    image: '/images/product-cjc-ipa.jpg',
    description: 'A research blend combining CJC-1295 and Ipamorelin peptides. Studies explore their synergistic effects on growth hormone release patterns and related metabolic pathways.',
    vialSizes: [
      { size: 'Blend', price: 89 },
    ],
    purity: '≥99%',
    endotoxin: '<0.01 EU/μg',
    faqs: [
      {
        question: 'Does the product come with instructions?',
        answer: 'Yes, all products include detailed handling instructions and safety data sheets for proper laboratory use.',
      },
      {
        question: 'What\'s the actual amount in each vial?',
        answer: 'Each blend vial contains a pre-mixed ratio optimized for research purposes.',
      },
    ],
  },
  {
    id: 'glp3-r',
    name: 'GLP3-R',
    category: 'Research Compound',
    casNumber: '2381089-83-2',
    image: '/images/product-glp3.jpg',
    description: 'GLP3-R is an investigational peptide studied for its interaction with GLP-1, GIP, and glucagon receptors at the cellular level. Research explores its effects on metabolic signaling, insulin sensitivity pathways, and energy regulation mechanisms in vitro.',
    vialSizes: [
      { size: '10mg', price: 139 },
      { size: '15mg', price: 189 },
      { size: '30mg', price: 329 },
    ],
    purity: '≥99%',
    endotoxin: '<0.01 EU/μg',
    faqs: [
      {
        question: 'Does the product come with instructions?',
        answer: 'Yes, all products include detailed handling instructions and safety data sheets for proper laboratory use.',
      },
      {
        question: 'What\'s the actual amount in each vial?',
        answer: 'Each vial contains the exact amount of lyophilized peptide powder as indicated on the label.',
      },
      {
        question: 'Are additional supplies needed?',
        answer: 'Bacteriostatic water may be required for reconstitution, sold separately.',
      },
      {
        question: 'How long does a vial last?',
        answer: 'When stored properly at -20°C, lyophilized peptides remain stable for 12-24 months.',
      },
    ],
  },
  {
    id: 'glp2-t',
    name: 'GLP2-T',
    category: 'Research Compound',
    casNumber: '2023788-19-2',
    image: '/images/product-glp2.jpg',
    description: 'GLP2-T is a research peptide studied for its potential effects on cellular metabolic processes and receptor interactions. Research focuses on its in vitro activity and signaling pathways.',
    vialSizes: [
      { size: '10mg', price: 99 },
      { size: '20mg', price: 169 },
    ],
    purity: '≥99%',
    endotoxin: '<0.01 EU/μg',
    faqs: [
      {
        question: 'Does the product come with instructions?',
        answer: 'Yes, all products include detailed handling instructions and safety data sheets for proper laboratory use.',
      },
      {
        question: 'What\'s the actual amount in each vial?',
        answer: 'Each vial contains the exact amount of lyophilized peptide powder as indicated on the label.',
      },
    ],
  },
  {
    id: 'tb-500',
    name: 'TB-500',
    category: 'Recovery Compound',
    casNumber: '885340-08-9',
    image: '/images/product-tb500.jpg',
    description: 'TB-500 is a synthetic peptide studied for its potential effects on cellular migration, tissue repair, and recovery processes. Research explores its interaction with actin and cellular regeneration mechanisms.',
    vialSizes: [
      { size: '5mg', price: 69 },
      { size: '10mg', price: 119 },
    ],
    purity: '≥99%',
    endotoxin: '<0.01 EU/μg',
    faqs: [
      {
        question: 'Does the product come with instructions?',
        answer: 'Yes, all products include detailed handling instructions and safety data sheets for proper laboratory use.',
      },
      {
        question: 'What\'s the actual amount in each vial?',
        answer: 'Each vial contains the exact amount of lyophilized peptide powder as indicated on the label.',
      },
    ],
  },
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    category: 'Growth Compound',
    casNumber: '218949-48-5',
    image: '/images/product-tesamorelin.jpg',
    description: 'Tesamorelin is a synthetic growth hormone-releasing factor analog studied for its effects on growth hormone secretion patterns. Research focuses on its in vitro activity and metabolic interactions.',
    vialSizes: [
      { size: '2mg', price: 79 },
      { size: '5mg', price: 149 },
    ],
    purity: '≥99%',
    endotoxin: '<0.01 EU/μg',
    faqs: [
      {
        question: 'Does the product come with instructions?',
        answer: 'Yes, all products include detailed handling instructions and safety data sheets for proper laboratory use.',
      },
      {
        question: 'What\'s the actual amount in each vial?',
        answer: 'Each vial contains the exact amount of lyophilized peptide powder as indicated on the label.',
      },
    ],
  },
  {
    id: 'sermorelin',
    name: 'Sermorelin',
    category: 'Growth Compound',
    casNumber: '86168-78-7',
    image: '/images/product-sermorelin.jpg',
    description: 'Sermorelin is a growth hormone-releasing hormone analog studied for its effects on pituitary function and growth hormone release. Research explores its in vitro mechanisms and signaling pathways.',
    vialSizes: [
      { size: '2mg', price: 49 },
      { size: '5mg', price: 89 },
    ],
    purity: '≥99%',
    endotoxin: '<0.01 EU/μg',
    faqs: [
      {
        question: 'Does the product come with instructions?',
        answer: 'Yes, all products include detailed handling instructions and safety data sheets for proper laboratory use.',
      },
      {
        question: 'What\'s the actual amount in each vial?',
        answer: 'Each vial contains the exact amount of lyophilized peptide powder as indicated on the label.',
      },
    ],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};
