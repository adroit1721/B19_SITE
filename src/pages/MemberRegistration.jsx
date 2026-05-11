import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerMember, clearMemberMsg, clearMemberError } from '../features/members/memberSlice';
import { User, Mail, Phone, MapPin, Briefcase, Camera, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const EMPTY = {
  name: '', studentId: '', batch: '2019', group: 'Science',
  phone: '', email: '', presentAddress: '', permanentAddress: '',
  occupation: '', organization: '', photoUrl: '',
  socialLinks: { facebook: '', linkedin: '', instagram: '', whatsapp: '' },
  isPublic: true
};

export default function MemberRegistration() {
  const dispatch = useDispatch();
  const { loading, successMsg, error } = useSelector((s) => s.members);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (successMsg) {
      setSubmitted(true);
      toast.success(successMsg);
      dispatch(clearMemberMsg());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMemberError());
    }
  }, [successMsg, error, dispatch]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error('File too large (max 2MB)');
    
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await api.post('/upload', fd);
      setForm({ ...form, photoUrl: data.url });
      toast.success('Photo uploaded!');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error('Name and Phone are required');
    dispatch(registerMember(form));
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="glass-card max-w-md w-full p-10 text-center animate-scale-in">
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="font-display font-bold text-3xl text-white mb-4">Registration Successful!</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Thank you for joining the community. Your information has been sent for admin approval. 
            You will be visible in the directory once approved.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/directory" className="btn-neon w-full py-4">View Directory</Link>
            <Link to="/" className="btn-ghost w-full">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-12 md:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <Link to="/directory" className="flex items-center gap-2 text-gray-500 hover:text-neon-cyan transition-colors mb-8 group w-fit">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Header Info */}
          <div className="lg:col-span-3 mb-4">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Member <span className="text-neon-cyan">Registration</span>
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              Register yourself to be part of the SSC Batch-2019 digital directory. 
              Fill in your details and wait for admin approval to go public.
            </p>
          </div>

          {/* Left Column: Photo Upload */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-neon-cyan/10">
              <label className="block text-sm font-medium text-gray-400 mb-4">Profile Photo</label>
              <div className="relative group aspect-square rounded-2xl bg-white/3 border border-white/5 overflow-hidden flex items-center justify-center border-dashed hover:border-neon-cyan/30 transition-all">
                {form.photoUrl ? (
                  <>
                    <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="btn-neon text-xs cursor-pointer py-2 px-4">Change Photo
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-neon-cyan transition-colors w-full h-full justify-center p-6 text-center">
                    <Camera className="w-12 h-12 mb-3 opacity-30" />
                    <span className="text-xs font-bold uppercase tracking-widest mb-1">Upload Photo</span>
                    <span className="text-[10px] text-gray-600">JPG, PNG up to 2MB</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                )}
                {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="spinner w-8 h-8" /></div>}
              </div>
            </div>

            <div className="glass-card p-6 bg-neon-purple/5 border-neon-purple/10">
              <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-neon-purple" /> Approval Process
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                After submission, an administrator will review your profile. This usually takes 24-48 hours. 
                You will appear in the directory search once approved.
              </p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-8">
              {/* Section: Personal Info */}
              <div className="space-y-4">
                <h3 className="text-neon-cyan font-mono text-xs uppercase tracking-widest font-bold border-b border-white/5 pb-2">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name *</label>
                    <input className="input-neon" placeholder="Enter your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Student ID / Roll</label>
                    <input className="input-neon" placeholder="Your ID in school" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Group</label>
                    <select className="input-neon" value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}>
                      {['Science','Commerce','Arts','Other'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">SSC Batch</label>
                    <input className="input-neon opacity-50 cursor-not-allowed" value="2019" disabled />
                  </div>
                </div>
              </div>

              {/* Section: Professional Info */}
              <div className="space-y-4">
                <h3 className="text-neon-purple font-mono text-xs uppercase tracking-widest font-bold border-b border-white/5 pb-2">Occupation & Organization</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Current Occupation</label>
                    <input className="input-neon" placeholder="e.g. Student, Engineer" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Organization / Institution</label>
                    <input className="input-neon" placeholder="e.g. University Name, Workplace" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Section: Contact */}
              <div className="space-y-4">
                <h3 className="text-neon-pink font-mono text-xs uppercase tracking-widest font-bold border-b border-white/5 pb-2">Contact & Social</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input className="input-neon pl-10" placeholder="e.g. 017xxxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="email" className="input-neon pl-10" placeholder="example@mail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Facebook Profile Link</label>
                    <input className="input-neon" placeholder="https://facebook.com/yourprofile" value={form.socialLinks.facebook} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })} />
                  </div>
                </div>
              </div>

              {/* Section: Address */}
              <div className="space-y-4">
                <h3 className="text-gray-400 font-mono text-xs uppercase tracking-widest font-bold border-b border-white/5 pb-2">Addresses</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Present Address</label>
                    <textarea className="input-neon min-h-[80px] py-3" placeholder="Where you live now..." value={form.presentAddress} onChange={(e) => setForm({ ...form, presentAddress: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Permanent Address</label>
                    <textarea className="input-neon min-h-[80px] py-3" placeholder="Home address..." value={form.permanentAddress} onChange={(e) => setForm({ ...form, permanentAddress: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col md:flex-row items-center gap-6 pt-6 border-t border-white/5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} className="w-5 h-5 accent-neon-cyan" />
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Show my profile in public directory</span>
                </label>
                <div className="flex-1" />
                <button type="submit" disabled={loading || uploading} className="btn-neon flex items-center gap-2 py-3 px-8 w-full md:w-auto justify-center">
                  {loading ? <><span className="spinner w-4 h-4" />Submitting...</> : <><Save className="w-4 h-4" />Submit Registration</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
