import { jsPDF } from 'jspdf';
import { InsurancePlan, PersonalDetails, HealthInformation } from '../types/insurance';
import { calculateAge } from './recommendationEngine';

export function generateQuotePdf(
  plan: InsurancePlan,
  personal: PersonalDetails,
  health: HealthInformation
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const age = calculateAge(personal.dateOfBirth);
  const annualPremium = plan.monthlyPremium * 12;
  const quoteRef = `HQ-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Top Accent Bar
  doc.setFillColor(2, 132, 199); // Sky blue #0284c7
  doc.rect(0, 0, 210, 8, 'F');

  // Brand Header
  doc.setTextColor(2, 132, 199);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('HealthQuote AI', 20, 24);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Smart. Fast. Reliable.', 20, 30);

  // Provider Pill / Badge on Right
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(130, 16, 60, 16, 3, 3, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(plan.provider, 160, 26, { align: 'center' });

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 36, 190, 36);

  // Document Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('HEALTH INSURANCE QUOTATION', 20, 46);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Reference No: ${quoteRef}   |   Issued: ${dateStr}   |   Valid for 30 Days`, 20, 52);

  // Two Column Box Section (Policy Details & Member Details)
  // Left: Policy Details Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, 58, 82, 60, 2, 2, 'FD');

  doc.setTextColor(2, 132, 199);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Policy Details', 25, 66);

  doc.setFontSize(9);
  const policyLabels = [
    ['Plan Name:', plan.planName],
    ['Coverage Type:', `${health.coverageType} Plan`],
    ['Duration:', health.coverageDuration || '1 Year'],
    ['Monthly Premium:', `${plan.currency} ${plan.monthlyPremium.toLocaleString()}`],
    ['Est. Annual Total:', `${plan.currency} ${annualPremium.toLocaleString()}`],
    ['Currency:', plan.currency]
  ];

  let pY = 73;
  policyLabels.forEach(([label, val]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(label, 25, pY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(val, 97, pY, { align: 'right' });
    pY += 8;
  });

  // Right: Member Details Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(108, 58, 82, 60, 2, 2, 'FD');

  doc.setTextColor(2, 132, 199);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Member Details', 113, 66);

  const memberLabels = [
    ['Full Name:', personal.fullName || 'Muhammad Ali'],
    ['Age:', `${age} Years (${personal.gender})`],
    ['Location:', personal.cityCountry || 'Dubai, UAE'],
    ['Nationality:', personal.nationality || 'UAE Resident'],
    ['Employment:', personal.employmentStatus || 'Employed'],
    ['Health Status:', `${health.healthStatus || 'Good'} (Pre-existing: ${health.hasPreExistingConditions ? 'Yes' : 'No'})`]
  ];

  let mY = 73;
  memberLabels.forEach(([label, val]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(label, 113, mY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(val, 185, mY, { align: 'right' });
    mY += 8;
  });

  // Coverage Benefits Grid
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Coverage & Benefit Limits', 20, 127);

  const benefitsGrid = [
    { label: 'Inpatient Hospitalization', value: plan.inpatientCoverage },
    { label: 'Outpatient Care & Consultations', value: plan.outpatientCoverage },
    { label: 'Maternity Care (Standard/Optional)', value: plan.maternityCoverage },
    { label: 'Hospital & Clinic Network', value: plan.globalNetwork },
    { label: 'Dental Benefit Allowance', value: plan.dentalCoverage },
    { label: 'Optical & Vision Care', value: plan.visionCoverage }
  ];

  let gridY = 133;
  benefitsGrid.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const colX = isEven ? 20 : 108;
    const currentY = gridY + Math.floor(index / 2) * 16;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(colX, currentY, 82, 13, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, colX + 4, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(item.value, colX + 4, currentY + 10);
  });

  // AI Recommendation Highlights
  const recY = 188;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('AI Personalized Plan Assessment', 20, recY);

  doc.setFillColor(240, 249, 255); // Sky 50
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(20, recY + 4, 170, 36, 2, 2, 'FD');

  const reasons = plan.recommendationReasons || [
    'Optimal balance of comprehensive hospital access and competitive premiums',
    'Broad direct billing network across leading private healthcare facilities in the UAE',
    'Compliant with regulatory health authority guidelines and visa requirements'
  ];

  let bY = recY + 12;
  reasons.slice(0, 3).forEach((reason) => {
    doc.setTextColor(2, 132, 199);
    doc.setFont('helvetica', 'bold');
    doc.text('✓', 25, bY);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(reason, 32, bY);
    bY += 9;
  });

  // Next Steps Guidance
  const stepsY = 236;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('How to Proceed:', 20, stepsY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('1. Review your quote details and benefit schedule above.', 20, stepsY + 6);
  doc.text('2. Upload Emirates ID or Passport and submit standard health declaration.', 20, stepsY + 11);
  doc.text('3. Complete secure digital payment and receive digital insurance card instantly.', 20, stepsY + 16);

  // Mandatory Prototype Disclaimer Box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(20, 258, 170, 20, 2, 2, 'FD');

  doc.setTextColor(153, 27, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('DEMO / ESTIMATED QUOTATION NOTICE:', 24, 264);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(127, 29, 29);
  const disclaimerText =
    'This quotation is an illustrative demo estimate generated by HealthQuote AI. Final premiums, underwriting acceptance, medical exclusions, co-payments and policy terms are determined exclusively by the respective licensed insurance carrier.';
  doc.text(doc.splitTextToSize(disclaimerText, 162), 24, 269);

  // Bottom Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 283, 190, 283);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('HealthQuote AI • Smart. Fast. Reliable. • Quote Reference: ' + quoteRef, 20, 288);
  doc.text('Page 1 of 1', 190, 288, { align: 'right' });

  return doc;
}

export function downloadQuotePdfFile(
  plan: InsurancePlan,
  personal: PersonalDetails,
  health: HealthInformation
) {
  const doc = generateQuotePdf(plan, personal, health);
  const cleanName = (personal.fullName || 'Member').trim().replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`HealthQuote_${cleanName}_Quote.pdf`);
}
