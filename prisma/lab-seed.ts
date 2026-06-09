import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const laboratorySeedData = [
  // ── PAGE 1 ──────────────────────────────────────────────────────────────────

  {
    name: "Hematology",
    slug: "hematology",
    description: "Blood cell counts and related hematological tests.",
    displayOrder: 1,
    services: [
      "CBC with PC",
      "CT/BT",
      "Blood Typing",
      "Bleeding Time",
      "Clotting Time",
      "ESR",
    ],
  },
  {
    name: "Serology",
    slug: "serology",
    description: "Immunological and serological diagnostic tests.",
    displayOrder: 2,
    services: [
      "Rheumatoid Factor (RF)",
      "Influenza A/B",
      "Hepatitis B Ag Screening",
      "Syphilis",
      "Dengue Duo",
      "D-DIMER",
      "25-(OH) VD",
      "TSH",
      "FT3",
      "FT4",
      "High Sensitivity Trop I",
      "NT-Pro-BNP",
      "PSA",
      "AFP",
      "CEA",
      "CA-125",
      "CA 15-3",
      "CA 19-9",
    ],
  },
  {
    name: "Blood Chemistry",
    slug: "blood-chemistry",
    description: "Chemical analysis of blood components and metabolites.",
    displayOrder: 3,
    services: [
      "1 Hr Post Prandial Glucose",
      "2nd Hr Post Prandial Glucose",
      "Blood Urea Nitrogen",
      "Blood Uric Acid",
      "Creatinine",
      "Fasting Blood Glucose",
      "HDL",
      "Hemoglobin A1c/HbA1c",
      "Lipid Profile",
      "OGTT (50g/75g) Third Hour",
      "OGTT (50g/75g) Second Hour",
      "Random Blood Sugar",
      "SGPT/ALT",
      "SGOT/AST",
      "Total Cholesterol",
      "Triglycerides",
      "Total Protein",
      "Albumin",
      "TPAG",
      "GGT",
      "Alkaline Phosphatase (ALP)",
      "Bilirubin (TB DB IB)",
      "Direct Bilirubin (DB)",
    ],
  },
  {
    name: "Electrolytes",
    slug: "electrolytes",
    description: "Measurement of essential electrolytes in the blood.",
    displayOrder: 4,
    services: [
      "Sodium / Na",
      "Potassium / K",
      "Chloride / Cl",
      "Ionized Calcium",
      "Sodium + Potassium + Chloride",
      "Sodium + Potassium + Chloride + Ionized Calcium",
      "Magnesium",
      "Phosphorus",
    ],
  },
  {
    name: "Clinical Microscopy",
    slug: "clinical-microscopy",
    description: "Microscopic examination of biological specimens.",
    displayOrder: 5,
    services: [
      "Fecalysis",
      "Preg Test Blood",
      "Preg Test Urine",
      "Urinalysis (4 Parameter)",
      "Urinalysis (10 Parameter)",
      "Urine Albumin Creatinine Ratio",
      "FOBT",
    ],
  },
  {
    name: "ECG",
    slug: "ecg",
    description: "Electrocardiogram services.",
    displayOrder: 6,
    services: ["12-L ECG with Interpretation"],
  },
  {
    name: "HIV Screening",
    slug: "hiv-screening",
    description: "HIV screening test.",
    displayOrder: 7,
    services: ["HIV Screening"],
  },
  {
    name: "Drug Testing",
    slug: "drug-testing",
    description: "Drug screening services.",
    displayOrder: 8,
    services: ["Drug Testing Screening"],
  },
  {
    name: "Available Packages",
    slug: "available-packages",
    description: "Bundled laboratory test packages for comprehensive screening.",
    displayOrder: 9,
    services: [
      "C5 (FBS, BUN, Crea, Total Cholesterol)",
      "C7 (C5 + ALT, AST)",
      "C8 - FBS, BUN, BUA, Crea, Lipid Profile",
      "C10 - C8 + ALT, AST",
      "C12 - C10 + CBC/PC, Urinalysis",
      "C15 - C12 + NA, K, CL",
      "C16 - C15 + Ionized Calcium",
      "C-DM - FBS, HBA1C Urinalysis",
      "C-LIVER - ALT, AST, GGT, ALP, TB, DB",
      "C-KIDNEY 1 - BUN, BUA, Crea TPAG U/A",
      "C-KIDNEY 2 - C-KIDNEY 1 + Urine Albumin Crea Ratio",
      "C-THYROID - FT3, FT4, TSH",
      "C-PRE EMP - CBC, U/A FA, Drug Testing",
      "C-ELEC 1 - NA, K, CL",
      "C-ELEC 2 - NA, K, CL, Ionized Calcium",
      "C-ELEC 3 - NA, K, CL, ICAL, MG, PHOS",
      "C-TUMOR (MALE) PSA, AFP, CEA, CA 19-9",
      "C-TUMOR (FEMALE) CA-125, CA 15-3, AFP, CEA, CA 19-9",
    ],
  },

  // ── PAGE 2 ──────────────────────────────────────────────────────────────────

  {
    name: "Buntis Packages - 1st Trimester",
    slug: "buntis-packages-1st-trimester",
    description: "Recommended laboratory tests for the first trimester of pregnancy.",
    displayOrder: 10,
    services: [
      "CBC with PC",
      "Urinalysis",
      "ABO Typing",
      "HBsAg",
      "VDRL / Syphilis",
      "HIV",
      "TSH",
      "OGTT 75g (2nd Hour)",
      "Transvaginal Ultrasound",
    ],
  },
  {
    name: "Buntis Packages - 2nd Trimester",
    slug: "buntis-packages-2nd-trimester",
    description: "Recommended laboratory tests for the second trimester of pregnancy.",
    displayOrder: 11,
    services: ["CBC with PC", "Urinalysis", "OGTT 75g (2nd Hour)", "Pelvic UTZ"],
  },
  {
    name: "Buntis Packages - 3rd Trimester",
    slug: "buntis-packages-3rd-trimester",
    description: "Recommended laboratory tests for the third trimester of pregnancy.",
    displayOrder: 12,
    services: ["CBC with PC", "Urinalysis", "BPS UTZ"],
  },
  {
    name: "Annual Physical Exam (APE) Packages",
    slug: "ape-packages",
    description: "Comprehensive annual physical examination packages.",
    displayOrder: 13,
    services: [
      "Basic APE - PE, CBC with PC, U/A, FA, Chest Xray (PA View)",
      "Standard APE - PE, CBC with PC, FBS, U/A, FA, Chest Xray, Drug Test",
      "Comprehensive APE - PE, CBC with PC, FBS, LP, HBsAg, U/A, FA, Chest Xray, Drug Test",
      "Executive APE - PE, CBC with PC, FBS, LP, SGPT, Crea, ECG, U/A, FA, Chest Xray, Drug Test",
    ],
  },
  {
    name: "Ultrasound",
    slug: "ultrasound",
    description: "Diagnostic ultrasound imaging services.",
    displayOrder: 14,
    services: [
      "Upper Abdomen",
      "Lower Abdomen",
      "Hepatobiliary Tree (HBT)",
      "Neck",
      "Kidney Urinary Bladder (KUB)",
      "KUB-Prostate / with Pre/Post Void",
      "Prostate",
      "Thyroid",
      "Inguino-Scrotal / with Doppler",
      "Inguino Only / Scrotal Only",
      "Scrotum with Doppler",
      "Breast (One side) / Bilateral",
      "Chest, Bilateral",
      "Mass Big / Small",
      "Transvaginal Pregnant",
      "Transvaginal non Pregnant",
      "Pelvic",
      "Whole Abdomen with Pelvic",
      "Umbilical",
      "Transrectal",
      "BPS",
      "Placenta / Cervical Length",
      "Appendix",
      "Other organ",
    ],
  },
  {
    name: "Radiology / Imaging - X-Ray",
    slug: "radiology-xray",
    description: "X-ray imaging and radiological diagnostic services.",
    displayOrder: 15,
    services: [
      "Chest PA",
      "Chest AP & Lateral",
      "Chest X-ray Apicolordotic View",
      "Lumco-Sacral",
      "Thoraco-Lumbar",
      "Cervico-Thoracic",
      "Skull",
      "Paranasal Sinus",
      "Scout Film (Abdomen)",
      "Pelvic AP & Lateral",
      "Knee AP & Lateral",
      "R/L Foot AP/O",
      "R/L Shoulder AP/O",
      "R/L Forearm AP/L",
      "R/L Arm AP/L",
      "R/L Hand AP/O",
      "Wrist AP/L/O",
      "Ankle AP/L and Mortise",
      "R/L Thigh AP/L",
      "R/L Leg AP/L",
      "Others",
    ],
  },
];

async function main() {
  console.log("🌱 Seeding LaboratoryServiceCategory...");

  for (const category of laboratorySeedData) {
    const upserted = await prisma.laboratoryServiceCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        services: category.services,
        displayOrder: category.displayOrder,
        isActive: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        services: category.services,
        isActive: true,
        displayOrder: category.displayOrder,
      },
    });

    console.log(`  ✅ ${upserted.name} (${upserted.services.length} services)`);
  }

  console.log("\n✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });