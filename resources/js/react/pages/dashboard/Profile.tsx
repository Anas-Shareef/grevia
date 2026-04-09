import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ShieldCheck, UserCircle, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const DashboardProfile = () => {
    const { user } = useAuth();
    const { toast } = useToast();

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    // Change Password State
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.updateProfile(formData);
            toast({
                title: "Information Synchronized",
                description: "Your local profile has been updated with high-fidelity parity.",
            });
            setIsEditing(false);
            setTimeout(() => window.location.reload(), 1000);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Correction Error",
                description: error.message || "Failed to update profile.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        try {
            await api.changePassword(passwordData);
            toast({
                title: "Security Hardened",
                description: "Your new credentials are now active.",
            });
            setIsPasswordOpen(false);
            setPasswordData({ current_password: '', password: '', password_confirmation: '' });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: error.message || "Security protocols prevent this change.",
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-24"
        >
            {/* Heroic Header - The Lovable Scale */}
            <header className="relative py-12">
                <motion.div variants={itemVariants} className="relative z-10">
                    <span className="inline-flex items-center gap-2 text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] text-primary/80 mb-6 bg-primary/5 px-4 py-2 rounded-full border border-primary/20">
                        <UserCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                        Account Center
                    </span>
                    <h2 className="flex items-center gap-3 whitespace-nowrap text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.85] mb-8">
                        My
                        <span className="text-primary tracking-[-0.08em]">Profile</span>
                    </h2>
                    <p className="text-lg lg:text-xl font-medium text-foreground/60 max-w-xl leading-relaxed">
                        Fine-tune your personal identity and ensure your security protocols are up to date.
                    </p>
                </motion.div>
                
                {/* Decorative Element */}
                <div className="hidden sm:block absolute -top-10 -left-10 lg:-left-20 text-[10rem] lg:text-[20rem] font-black text-primary/[0.03] select-none -z-10 pointer-events-none tracking-tighter">
                    M
                </div>
            </header>

            {/* Personal Information Structure */}
            <motion.section variants={itemVariants}>
                <div className="bg-white/60 backdrop-blur-md rounded-3xl lg:rounded-[80px] shadow-[0_40px_100px_-20px_rgba(26,46,26,0.06)] border border-white p-6 md:p-12 lg:p-20 group transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 lg:gap-10 mb-10 lg:mb-16">
                        <div className="space-y-2 lg:space-y-3">
                            <h3 className="text-3xl lg:text-4xl font-black text-foreground tracking-tighter">Information</h3>
                            <p className="text-sm lg:text-base font-medium text-foreground/60">Standard identification and contact details.</p>
                        </div>
                        {!isEditing && (
                            <Button 
                                variant="outline" 
                                className="w-full sm:w-auto rounded-full bg-white/50 backdrop-blur-sm border-2 border-primary/20 text-primary hover:bg-primary hover:text-white font-black h-12 lg:h-16 px-6 lg:px-10 text-xs uppercase tracking-widest shadow-xl shadow-primary/5 transition-all duration-500 hover:-translate-y-1 active:scale-95"
                                onClick={() => setIsEditing(true)}
                            >
                                <Settings2 className="mr-2 lg:mr-3 w-4 h-4" />
                                Modify Identity
                            </Button>
                        )}
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3 lg:space-y-4">
                                <label className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-foreground/60 ml-4">Full Identity</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    readOnly={!isEditing}
                                    className={`h-14 lg:h-20 rounded-2xl lg:rounded-full px-6 lg:px-10 border-none text-base lg:text-lg font-bold transition-all duration-700 ${
                                        !isEditing 
                                        ? "bg-primary/[0.03] text-foreground/60 shadow-inner cursor-not-allowed" 
                                        : "bg-white shadow-2xl shadow-primary/10 text-foreground ring-2 ring-primary/20 focus-visible:ring-primary scale-[1.02]"
                                    }`}
                                />
                            </div>
                            <div className="space-y-3 lg:space-y-4">
                                <label className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-foreground/60 ml-4">Communication Email</label>
                                <Input
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    readOnly={!isEditing}
                                    className={`h-14 lg:h-20 rounded-2xl lg:rounded-full px-6 lg:px-10 border-none text-base lg:text-lg font-bold transition-all duration-700 ${
                                        !isEditing 
                                        ? "bg-primary/[0.03] text-foreground/60 shadow-inner cursor-not-allowed" 
                                        : "bg-white shadow-2xl shadow-primary/10 text-foreground ring-2 ring-primary/20 focus-visible:ring-primary scale-[1.02]"
                                    }`}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center gap-6 pt-10"
                            >
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    className="rounded-full h-14 lg:h-16 px-8 lg:px-12 font-black text-[10px] lg:text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-colors"
                                    onClick={() => setIsEditing(false)} 
                                    disabled={loading}
                                >
                                    Abort
                                </Button>
                                <Button 
                                    type="submit" 
                                    className="rounded-full bg-primary text-white h-14 lg:h-16 px-8 lg:px-14 font-black text-[10px] lg:text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-500"
                                    disabled={loading}
                                >
                                    {loading && <Loader2 className="mr-3 lg:mr-4 h-5 w-5 animate-spin" />}
                                    Commit Changes
                                </Button>
                            </motion.div>
                        )}
                    </form>
                </div>
            </motion.section>

            {/* Security Protocol Section */}
            <motion.section variants={itemVariants}>
                <div className="bg-white/40 backdrop-blur-md rounded-3xl lg:rounded-[80px] p-6 md:p-12 lg:p-20 border border-white/40 overflow-hidden relative group transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="w-16 h-16 rounded-2xl lg:rounded-[28px] bg-primary/10 flex items-center justify-center text-primary mb-6 lg:mb-8 shadow-xl shadow-primary/5">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-3 lg:mb-4">Security</h3>
                            <p className="text-base lg:text-lg font-medium text-foreground/60 max-w-md">Maintain robust protection over your digital identity.</p>
                        </div>
                        
                        <div className="bg-white/80 rounded-3xl lg:rounded-[64px] p-6 lg:p-14 border border-white flex-1 flex flex-col sm:flex-row items-center justify-between gap-6 lg:gap-10 shadow-2xl shadow-primary/5 w-full">
                            <div className="text-center sm:text-left">
                                <h4 className="text-lg lg:text-xl font-black text-foreground mb-2">Access Credentials</h4>
                                <p className="text-xs lg:text-sm font-medium text-foreground/60 leading-relaxed">Update your entrance key to ensure account integrity.</p>
                            </div>
                            <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full sm:w-auto rounded-full bg-primary text-white h-14 lg:h-16 px-8 lg:px-10 font-black text-xs uppercase tracking-widest shadow-[0_4px_14px_-2px_rgba(46,125,50,0.4)] hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-500">
                                        Update Key
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-[64px] border-none p-16 max-w-xl bg-[#F5F2EA]/95 backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(26,46,26,0.15)]">
                                    <DialogHeader className="mb-12 text-center">
                                        <DialogTitle className="text-4xl font-black tracking-tighter text-foreground mb-4">Revise Access</DialogTitle>
                                        <DialogDescription className="text-base font-medium text-foreground/50">
                                            Enter your current signature and define a new, more robust passkey.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handlePasswordChange} className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 ml-4">Current Signature</label>
                                            <Input
                                                type="password"
                                                value={passwordData.current_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                                required
                                                className="h-16 rounded-full px-8 bg-white/50 border-primary/10 focus:ring-primary shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 ml-4">New Digital Key</label>
                                            <Input
                                                type="password"
                                                value={passwordData.password}
                                                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                                required
                                                minLength={8}
                                                className="h-16 rounded-full px-8 bg-white/50 border-primary/10 focus:ring-primary shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 ml-4">Verify Key</label>
                                            <Input
                                                type="password"
                                                value={passwordData.password_confirmation}
                                                onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                                                required
                                                className="h-16 rounded-full px-8 bg-white/50 border-primary/10 focus:ring-primary shadow-inner"
                                            />
                                        </div>
                                        <DialogFooter className="pt-10">
                                            <Button type="submit" className="w-full h-18 py-6 rounded-full bg-primary text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform" disabled={passwordLoading}>
                                                {passwordLoading && <Loader2 className="mr-5 h-6 w-6 animate-spin" />}
                                                Synchronize New Key
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </motion.section>
        </motion.div>
    );
};

export default DashboardProfile;
