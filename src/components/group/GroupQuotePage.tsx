import React, { useState, useRef } from 'react';
import { useQuote } from '../../context/QuoteContext';
import {
  Users,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  Edit2,
  Plus,
  Download,
  ShieldCheck,
  Zap,
  Building2,
  ChevronRight,
  AlertCircle,
  FileText
} from 'lucide-react';
import { GroupEmployee, GroupQuotePlan } from '../../types/insurance';
import { MOCK_GROUP_PLANS } from '../../data/mockPlans';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

export const GroupQuotePage: React.FC = () => {
  const {
    groupEmployees,
    setGroupEmployees,
    selectedGroupPlan,
    setSelectedGroupPlan,
    loadSampleCensus,
    groupMetrics,
    showToast,
    navigate
  } = useQuote();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<GroupEmployee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // New employee state for manual addition
  const [newEmployee, setNewEmployee] = useState<Omit<GroupEmployee, 'id'>>({
    employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    dateOfBirth: '1992-05-15',
    age: 34,
    gender: 'Male',
    nationality: 'Emirati',
    location: 'Dubai, UAE',
    employmentStatus: 'Full-Time',
    salary: 18000,
    coverageTier: 'Standard',
    dependentsCount: 0
  });

  const handleFileProcess = async (file: File) => {
    setUploadError(null);
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds 10MB limit. Please upload a smaller file.');
      showToast('File is larger than 10MB limit.', 'error');
      return;
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      setUploadError('Invalid format. Please upload CSV, XLSX, or XLS.');
      showToast('Please upload a valid CSV or Excel file.', 'error');
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows: any[] = XLSX.utils.sheet_to_json(firstSheet);

      if (!rawRows || rawRows.length === 0) {
        setUploadError('The uploaded file does not contain any data rows.');
        return;
      }

      const parsedEmployees: GroupEmployee[] = rawRows.map((row, index) => {
        const empId = row['Employee ID'] || row['ID'] || `EMP-${1000 + index}`;
        const name = row['Employee Name'] || row['Name'] || `Employee ${index + 1}`;
        const dob = row['Date of Birth'] || row['DOB'] || '1992-01-01';
        const age = Number(row['Age']) || 32;
        const gender = (row['Gender'] === 'Female' ? 'Female' : 'Male') as 'Male' | 'Female';
        const nationality = row['Nationality'] || 'Resident';
        const location = row['Location'] || 'Dubai, UAE';
        const employmentStatus = row['Employment Status'] || 'Full-Time';
        const salary = Number(row['Salary']) || 15000;
        const coverageTier = (row['Coverage Tier'] || 'Standard') as any;
        const dependentsCount = Number(row['Dependents']) || Number(row['Dependents Count']) || 0;

        return {
          id: `emp-up-${Date.now()}-${index}`,
          employeeId: String(empId),
          name: String(name),
          dateOfBirth: String(dob),
          age,
          gender,
          nationality: String(nationality),
          location: String(location),
          employmentStatus: String(employmentStatus),
          salary,
          coverageTier,
          dependentsCount
        };
      });

      setGroupEmployees(parsedEmployees);
      showToast(`Successfully processed census with ${parsedEmployees.length} employees!`, 'success');
    } catch (err) {
      console.error(err);
      setUploadError('Failed to parse employee file. Check file columns and format.');
      showToast('Could not parse file. Try sample template.', 'error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadSampleCsv = () => {
    const csvContent =
      'Employee ID,Employee Name,Date of Birth,Age,Gender,Nationality,Location,Employment Status,Salary,Coverage Tier,Dependents\n' +
      'EMP-1001,Ahmed Mansoor,1988-04-12,38,Male,Emirati,Dubai UAE,Full-Time,28000,Executive,3\n' +
      'EMP-1002,Sarah Jenkins,1992-09-24,34,Female,British,Dubai UAE,Full-Time,22000,Standard,1\n' +
      'EMP-1003,Rahul Sharma,1995-11-03,31,Male,Indian,Abu Dhabi UAE,Full-Time,16500,Standard,0\n' +
      'EMP-1004,Fatima Al-Zahra,1998-02-17,28,Female,Jordanian,Sharjah UAE,Full-Time,14000,Basic,0\n' +
      'EMP-1005,Carlos Mendoza,1985-07-30,41,Male,Spanish,Dubai UAE,Full-Time,31000,Executive,2\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'HealthQuote_Employee_Census_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded sample census CSV template!', 'info');
  };

  const handleDeleteEmployee = (id: string) => {
    setGroupEmployees((prev) => prev.filter((e) => e.id !== id));
    showToast('Employee removed from census.', 'info');
  };

  const handleSaveEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    setGroupEmployees((prev) =>
      prev.map((item) => (item.id === editingEmployee.id ? editingEmployee : item))
    );
    setEditingEmployee(null);
    showToast('Employee details updated.', 'success');
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name.trim()) {
      showToast('Employee Name is required.', 'error');
      return;
    }
    const emp: GroupEmployee = {
      ...newEmployee,
      id: `emp-${Date.now()}`
    };
    setGroupEmployees((prev) => [emp, ...prev]);
    setShowAddModal(false);
    setNewEmployee({
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      dateOfBirth: '1992-05-15',
      age: 34,
      gender: 'Male',
      nationality: 'Emirati',
      location: 'Dubai, UAE',
      employmentStatus: 'Full-Time',
      salary: 18000,
      coverageTier: 'Standard',
      dependentsCount: 0
    });
    showToast('Employee added to census!', 'success');
  };

  const handleDownloadGroupPdf = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const plan = selectedGroupPlan || MOCK_GROUP_PLANS[1];

    doc.setFillColor(2, 132, 199);
    doc.rect(0, 0, 210, 8, 'F');

    doc.setTextColor(2, 132, 199);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('HealthQuote AI', 20, 24);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Group & Corporate Medical Underwriting Schedule', 20, 30);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 36, 190, 36);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('CORPORATE HEALTH INSURANCE QUOTE', 20, 46);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Plan: ${plan.name} (${plan.provider})  |  Headcount: ${groupMetrics.totalHeadcount} Lives`, 20, 52);

    // Metrics Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, 58, 170, 40, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(2, 132, 199);
    doc.text('Census Summary', 25, 66);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Total Employees: ${groupMetrics.totalEmployees}`, 25, 74);
    doc.text(`Eligible Primary Lives: ${groupMetrics.eligibleEmployees}`, 25, 80);
    doc.text(`Declared Dependents: ${groupMetrics.dependentsCount}`, 25, 86);

    doc.text(`Average Age: ${groupMetrics.averageAge} Years`, 105, 74);
    doc.text(`Estimated Monthly Premium: AED ${groupMetrics.baseEstimatedMonthly.toLocaleString()}`, 105, 80);
    doc.text(`Estimated Annual Premium: AED ${groupMetrics.baseEstimatedAnnual.toLocaleString()}`, 105, 86);

    // Disclaimer
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(20, 240, 170, 24, 2, 2, 'F');
    doc.setTextColor(153, 27, 27);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('DEMO GROUP ESTIMATE NOTICE:', 25, 246);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(
      'This group quotation is an indicative estimate based on census demographics. Binding group terms require carrier underwriting review and compliance verification.',
      25,
      252,
      { maxWidth: 160 }
    );

    doc.save('HealthQuote_Corporate_Group_Quote.pdf');
    showToast('Downloaded Corporate Group Quotation PDF!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Blue Hero matching Screen 9 */}
        <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-sky-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <Building2 className="w-4 h-4 text-sky-200" />
              <span>SME & Corporate Solutions</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Group Health Insurance
            </h1>
            <p className="text-sky-100 text-sm max-w-xl">
              Get a rated quote for your entire team in minutes. Upload your staff census to compare corporate plans across the UAE.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={loadSampleCensus}
              className="px-4 py-3 bg-white text-blue-700 hover:bg-sky-50 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Load Sample Census</span>
            </button>
            <button
              onClick={handleDownloadSampleCsv}
              className="px-4 py-3 bg-sky-800/80 hover:bg-sky-800 text-white font-semibold rounded-xl text-xs border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV Template</span>
            </button>
          </div>
        </div>

        {/* Upload Employee Census Section matching Screen 9 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8">
          <div className="max-w-2xl mx-auto text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Upload Employee Census
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Simply upload your employee list (CSV or Excel) and get a customized group quote.
            </p>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-sky-500 bg-sky-50/70 scale-101'
                : 'border-slate-300 hover:border-sky-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
              accept=".csv,.xlsx,.xls"
              className="hidden"
            />

            <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 stroke-[1.8]" />
            </div>

            <p className="text-sm font-bold text-slate-800 mb-1">
              Drag & drop your file here
            </p>
            <p className="text-xs text-slate-500 mb-4">or</p>

            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Browse Files</span>
            </button>

            <p className="text-[11px] text-slate-400 mt-4">
              Supported formats: CSV, XLS, XLSX (Max 10MB)
            </p>
          </div>

          {uploadError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>

        {/* Group Metrics Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Total Staff</span>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {groupMetrics.totalEmployees}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Dependents</span>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {groupMetrics.dependentsCount}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Average Age</span>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {groupMetrics.averageAge} Yrs
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Est. Monthly</span>
            <span className="text-2xl font-black text-sky-700 tabular-nums">
              AED {groupMetrics.baseEstimatedMonthly.toLocaleString()}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Est. Annual</span>
            <span className="text-2xl font-black text-emerald-700 tabular-nums">
              AED {groupMetrics.baseEstimatedAnnual.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Group Plans Options */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Recommended Corporate Plans
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select a group coverage tier to update premium rate calculations.
              </p>
            </div>
            <button
              onClick={handleDownloadGroupPdf}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Group PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MOCK_GROUP_PLANS.map((gPlan) => {
              const isSelected = selectedGroupPlan?.id === gPlan.id;

              return (
                <div
                  key={gPlan.id}
                  className={`bg-white rounded-3xl p-6 border transition-all ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md'
                      : 'border-slate-200/80 shadow-xs hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wide">
                      {gPlan.tier}
                    </span>
                    <span className="text-xs text-slate-400">{gPlan.provider}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{gPlan.name}</h3>

                  <div className="mt-3 mb-4">
                    <span className="text-2xl font-black text-slate-900 tabular-nums">
                      AED {gPlan.monthlyPerEmployee}
                    </span>
                    <span className="text-xs text-slate-500"> /employee/mo</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3 mb-5">
                    <p>• Inpatient: <span className="font-semibold text-slate-800">{gPlan.inpatientLimit}</span></p>
                    <p>• Outpatient: <span className="font-semibold text-slate-800">{gPlan.outpatientCoverage}</span></p>
                    <p>• Network: <span className="font-semibold text-slate-800">{gPlan.networkSize}</span></p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedGroupPlan(gPlan);
                      showToast(`Switched to ${gPlan.name}`, 'info');
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? 'Selected Group Plan' : 'Select This Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Employee Census Table with Edit/Delete */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Uploaded Staff Census ({groupEmployees.length} Members)
              </h3>
              <p className="text-xs text-slate-500">
                Edit member details, change coverage tiers, or delete rows.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Employee</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
              <thead className="bg-slate-50 font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Age / Gender</th>
                  <th className="py-3 px-3">Nationality</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Coverage Tier</th>
                  <th className="py-3 px-3">Dependents</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groupEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-slate-600">
                      {emp.employeeId}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {emp.name}
                    </td>
                    <td className="py-3 px-3">
                      {emp.age} yrs · {emp.gender}
                    </td>
                    <td className="py-3 px-3">{emp.nationality}</td>
                    <td className="py-3 px-3">{emp.location}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
                        {emp.coverageTier}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold">{emp.dependentsCount}</td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingEmployee({ ...emp })}
                        className="p-1 text-slate-400 hover:text-sky-600 cursor-pointer"
                        title="Edit employee"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete employee"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Bottom Highlights matching Screen 9 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Fast Processing</h4>
              <p className="text-[11px] text-slate-500">Automated census rating in seconds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Competitive Rates</h4>
              <p className="text-[11px] text-slate-500">Group pooled rates from top UAE carriers</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Compliant & Secure</h4>
              <p className="text-[11px] text-slate-500">100% DHA & MOH regulatory compliant</p>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Edit Employee Record</h3>
            <form onSubmit={handleSaveEditEmployee} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee Name</label>
                <input
                  type="text"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={editingEmployee.age}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={editingEmployee.gender}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coverage Tier</label>
                  <select
                    value={editingEmployee.coverageTier}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, coverageTier: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dependents</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editingEmployee.dependentsCount}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, dependentsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Employee to Census</h3>
            <form onSubmit={handleAddEmployee} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Mahmoud"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={newEmployee.age}
                    onChange={(e) => setNewEmployee({ ...newEmployee, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newEmployee.gender}
                    onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coverage Tier</label>
                  <select
                    value={newEmployee.coverageTier}
                    onChange={(e) => setNewEmployee({ ...newEmployee, coverageTier: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dependents</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newEmployee.dependentsCount}
                    onChange={(e) => setNewEmployee({ ...newEmployee, dependentsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 cursor-pointer"
                >
                  Add to Census
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
