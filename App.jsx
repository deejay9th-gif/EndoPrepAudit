import React, { useState, useEffect } from 'react';
import { ClipboardList, BarChart3, CheckCircle2, AlertCircle, Plus, FileText, User, Calendar, Activity, Home, Zap, RotateCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const initialData = [
  {
    id: 1,
    date: '2026-05-18',
    staffInitials: 'JD',
    procedureType: 'Colonoscopy',
    bookingNotice: 'Short Notice (< 3 days)',
    language: 'Language Barrier (No interpreter)',
    preAssessment: 'No pre-assessment done',
    instructions: ['None / Unknown'],
    livingSituation: 'Lives alone',
    mobility: 'Mild mobility issues (uses stick/walker)',
    prepQuality: 'Inadequate (Unsafe to proceed)',
    consequence: 'Cancelled due to poor prep'
  },
  {
    id: 2,
    date: '2026-05-19',
    staffInitials: 'SW',
    procedureType: 'Colonoscopy',
    bookingNotice: 'Standard Notice (> 7 days)',
    language: 'Native/Fluent Speaker',
    preAssessment: 'Yes, fully completed',
    instructions: ['Printed Leaflet (Mailed)', 'Email / Digital Link'],
    livingSituation: 'Lives with family/partner/carer',
    mobility: 'Fully mobile',
    prepQuality: 'Excellent',
    consequence: 'Completed successfully'
  }
];

const initialFormState = {
  date: new Date().toISOString().split('T')[0],
  staffInitials: '',
  procedureType: '',
  bookingNotice: '',
  language: '',
  preAssessment: '',
  instructions: [],
  livingSituation: '',
  mobility: '',
  prepQuality: '',
  consequence: ''
};

export default function EndoscopyAuditApp() {
  const [activeTab, setActiveTab] = useState('form');
  const [entries, setEntries] = useState(initialData);
  const [formData, setFormData] = useState(initialFormState);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle generic input changes (radio, text, date)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes specifically for arrays
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => {
      const currentValues = prev[name];
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter((v) => v !== value) };
      }
    });
  };

  const handleFastTrack = () => {
    setFormData(prev => ({
      ...prev,
      procedureType: 'Colonoscopy',
      bookingNotice: 'Standard Notice (> 7 days)',
      language: 'Native/Fluent Speaker',
      preAssessment: 'Yes, fully completed',
      instructions: ['Email / Digital Link'],
      livingSituation: 'Lives with family/partner/carer',
      mobility: 'Fully mobile',
      prepQuality: 'Excellent (Mostly liquid, clear)',
      consequence: 'Completed successfully'
    }));
  };

  const handleClear = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      ...formData,
      id: Date.now(),
    };
    setEntries([newEntry, ...entries]);
    setShowSuccess(true);
    setFormData(initialFormState);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const renderDashboard = () => {
    const inadequateCount = entries.filter(e => e.prepQuality.includes('Inadequate') || e.prepQuality.includes('Poor')).length;
    const cancelCount = entries.filter(e => e.consequence.includes('Cancelled')).length;

    const noticeData = [
      { name: '< 3 days', Adequate: 0, Inadequate: 0 },
      { name: '3-7 days', Adequate: 0, Inadequate: 0 },
      { name: '> 7 days', Adequate: 0, Inadequate: 0 }
    ];
    
    const languageData = [
      { name: 'Native/Fluent', Adequate: 0, Inadequate: 0 },
      { name: 'Has Interpreter', Adequate: 0, Inadequate: 0 },
      { name: 'No Interpreter', Adequate: 0, Inadequate: 0 }
    ];

    const livingData = [
      { name: 'Family/Carer', Adequate: 0, Inadequate: 0 },
      { name: 'Lives Alone', Adequate: 0, Inadequate: 0 },
      { name: 'Care Home', Adequate: 0, Inadequate: 0 }
    ];

    const mobilityData = [
      { name: 'Mobile', Adequate: 0, Inadequate: 0 },
      { name: 'Mild Issues', Adequate: 0, Inadequate: 0 },
      { name: 'Severe Issues', Adequate: 0, Inadequate: 0 },
      { name: 'Bedbound', Adequate: 0, Inadequate: 0 }
    ];

    entries.forEach(e => {
      // Determine if prep was adequate or inadequate
      const isAdequate = !e.prepQuality.includes('Inadequate') && !e.prepQuality.includes('Poor');
      const type = isAdequate ? 'Adequate' : 'Inadequate';
      
      // Map to Notice Chart
      if (e.bookingNotice.includes('< 3 days')) noticeData[0][type]++;
      else if (e.bookingNotice.includes('3 to 7 days')) noticeData[1][type]++;
      else noticeData[2][type]++;

      // Map to Language Chart
      if (e.language.includes('Native')) languageData[0][type]++;
      else if (e.language.includes('present')) languageData[1][type]++;
      else languageData[2][type]++;

      // Map to Living Chart
      if (e.livingSituation.includes('family')) livingData[0][type]++;
      else if (e.livingSituation.includes('alone')) livingData[1][type]++;
      else livingData[2][type]++;

      // Map to Mobility Chart
      if (e.mobility.includes('Fully')) mobilityData[0][type]++;
      else if (e.mobility.includes('Mild')) mobilityData[1][type]++;
      else if (e.mobility.includes('Severe')) mobilityData[2][type]++;
      else mobilityData[3][type]++;
    });

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><ClipboardList size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Audits</p>
              <p className="text-2xl font-bold text-slate-800">{entries.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><AlertCircle size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Poor/Inadequate Preps</p>
              <p className="text-2xl font-bold text-slate-800">{inadequateCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><Activity size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Cancellations</p>
              <p className="text-2xl font-bold text-slate-800">{cancelCount}</p>
            </div>
          </div>
        </div>

        { }
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Prep by Notice */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-6">Prep Quality by Booking Notice</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={noticeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '14px'}} />
                  <Bar dataKey="Adequate" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} maxBarSize={50} />
                  <Bar dataKey="Inadequate" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Prep by Living Situation */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-6">Prep Quality by Living Situation</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={livingData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '14px'}} />
                  <Bar dataKey="Adequate" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} maxBarSize={50} />
                  <Bar dataKey="Inadequate" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Prep by Mobility */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-6">Prep Quality by Mobility</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mobilityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '14px'}} />
                  <Bar dataKey="Adequate" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} maxBarSize={50} />
                  <Bar dataKey="Inadequate" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Recent Audit Entries</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Staff</th>
                  <th className="px-6 py-3 font-medium">Procedure</th>
                  <th className="px-6 py-3 font-medium">Notice</th>
                  <th className="px-6 py-3 font-medium">Language</th>
                  <th className="px-6 py-3 font-medium">Social Factors</th>
                  <th className="px-6 py-3 font-medium">Prep Quality</th>
                  <th className="px-6 py-3 font-medium">Consequence</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{entry.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">{entry.staffInitials}</td>
                    <td className="px-6 py-4">{entry.procedureType}</td>
                    <td className="px-6 py-4">{entry.bookingNotice}</td>
                    <td className="px-6 py-4">{entry.language}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500">{entry.livingSituation}</span>
                        <span className="text-xs text-slate-500">{entry.mobility}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.prepQuality.includes('Inadequate') || entry.prepQuality.includes('Poor')
                          ? 'bg-red-100 text-red-700'
                          : entry.prepQuality.includes('Fair') 
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {entry.prepQuality.split(' ')[0]}
                      </span>
                    </td>
                    <td className="px-6 py-4">{entry.consequence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {entries.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No audits recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => (
    <div className="max-w-3xl mx-auto">
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center shadow-sm animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Audit submitted successfully! Ready for the next entry.
        </div>
      )}

      {}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm gap-4">
        <div>
          <h3 className="font-semibold text-blue-900 flex items-center text-lg">
            <Zap size={20} className="mr-2 text-amber-500 fill-amber-500" />
            Standard Successful Procedure?
          </h3>
          <p className="text-sm text-blue-700 mt-1">Save time by auto-filling the optimal patient profile. Just add your initials and submit!</p>
        </div>
        <button
          type="button"
          onClick={handleFastTrack}
          className="whitespace-nowrap px-5 py-2.5 bg-white text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 font-semibold rounded-lg transition-all shadow-sm text-sm"
        >
          Auto-Fill Form
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Procedure Basics */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
            <Calendar className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-slate-800">1. Procedure Basics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Staff Initials</label>
              <input 
                type="text" 
                name="staffInitials"
                required
                maxLength={3}
                placeholder="e.g. JD"
                value={formData.staffInitials}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date of Procedure</label>
              <input 
                type="date" 
                name="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Procedure Type</label>
              <select 
                name="procedureType"
                required
                value={formData.procedureType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Select procedure...</option>
                <option value="Colonoscopy">Colonoscopy</option>
                <option value="Flexible Sigmoidoscopy">Flexible Sigmoidoscopy</option>
                <option value="Gastroscopy">Gastroscopy</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: The Variables */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
            <User className="text-indigo-600" size={20} />
            <h2 className="text-xl font-semibold text-slate-800">2. The Variables (The "Why")</h2>
          </div>

          <div className="space-y-6">
            {/* Booking Notice */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3">Booking Notice (Time from booking to procedure)</label>
              <div className="space-y-2">
                {['Short Notice (< 3 days)', 'Medium Notice (3 to 7 days)', 'Standard Notice (> 7 days)'].map(option => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="bookingNotice" value={option} checked={formData.bookingNotice === option} onChange={handleInputChange} required className="w-4 h-4 text-indigo-600" />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3">Language & Communication</label>
              <div className="space-y-2">
                {['Native/Fluent Speaker', 'Language Barrier (Interpreter booked/present)', 'Language Barrier (No interpreter)'].map(option => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="language" value={option} checked={formData.language === option} onChange={handleInputChange} required className="w-4 h-4 text-indigo-600" />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pre-Assessment */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3">Pre-Assessment Completion</label>
              <div className="space-y-2">
                {['Yes, fully completed', 'Attempted, but incomplete', 'No pre-assessment done'].map(option => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="preAssessment" value={option} checked={formData.preAssessment === option} onChange={handleInputChange} required className="w-4 h-4 text-indigo-600" />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3">Instruction Delivery Method (Select all that apply)</label>
              <div className="space-y-2">
                {['Printed Leaflet (Handed)', 'Printed Leaflet (Mailed)', 'Email / Digital Link', 'Verbal instructions only', 'None / Unknown'].map(option => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" name="instructions" value={option} checked={formData.instructions.includes(option)} onChange={handleCheckboxChange} className="w-4 h-4 text-indigo-600 rounded" />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Social & Physical Factors */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
            <Home className="text-purple-600" size={20} />
            <h2 className="text-xl font-semibold text-slate-800">3. Social & Physical Factors</h2>
          </div>

          <div className="space-y-6">
            {/* Living Situation */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3">Living Situation</label>
              <div className="space-y-2">
                {['Lives with family/partner/carer', 'Lives alone', 'Care home / Assisted living'].map(option => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="livingSituation" value={option} checked={formData.livingSituation === option} onChange={handleInputChange} required className="w-4 h-4 text-purple-600" />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobility */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3">Mobility Issues</label>
              <div className="space-y-2">
                {['Fully mobile', 'Mild mobility issues (uses stick/walker)', 'Severe mobility issues (wheelchair/hoist)', 'Bedbound'].map(option => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="mobility" value={option} checked={formData.mobility === option} onChange={handleInputChange} required className="w-4 h-4 text-purple-600" />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: The Outcome */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
            <FileText className="text-emerald-600" size={20} />
            <h2 className="text-xl font-semibold text-slate-800">4. The Outcome</h2>
          </div>

          <div className="space-y-6">
            {/* Prep Quality */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3">Bowel Preparation Quality</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Excellent (Mostly liquid, clear)',
                  'Good (Minor fluid, washed easily)',
                  'Fair (Semi-solid, adequate visibility)',
                  'Poor (Solid debris, compromised)',
                  'Inadequate (Unsafe to proceed)'
                ].map(option => (
                  <label key={option} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${formData.prepQuality === option ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input type="radio" name="prepQuality" value={option} checked={formData.prepQuality === option} onChange={handleInputChange} required className="w-4 h-4 mt-1 text-emerald-600" />
                    <span className="ml-3 text-sm text-slate-700 leading-tight">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Consequence */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3">Clinical Consequence</label>
              <div className="space-y-2">
                {['Completed successfully', 'Completed, but early repeat required', 'Cancelled due to poor prep'].map(option => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="consequence" value={option} checked={formData.consequence === option} onChange={handleInputChange} required className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:space-x-4 pt-2">
          <button 
            type="button" 
            onClick={handleClear}
            className="flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-medium rounded-xl transition-colors shadow-sm"
          >
            <RotateCcw size={18} className="mr-2" />
            Clear Form
          </button>
          <button 
            type="submit" 
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <Plus size={20} className="mr-2" />
            Submit Audit Entry
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900 font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold mr-3">
                <Activity size={20} />
              </div>
              <h1 className="text-xl font-bold text-slate-800 hidden sm:block">EndoAudit</h1>
            </div>
            
            <div className="flex space-x-1 sm:space-x-4">
              <button
                onClick={() => setActiveTab('form')}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'form' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ClipboardList size={18} className="mr-2" />
                <span className="hidden sm:inline">New Audit</span>
                <span className="sm:hidden">Audit</span>
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BarChart3 size={18} className="mr-2" />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'form' ? renderForm() : renderDashboard()}
      </main>
    </div>
  );
}
