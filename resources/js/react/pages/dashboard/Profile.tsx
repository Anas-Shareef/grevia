import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ShieldCheck, UserCircle } from 'lucide-react';
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
                title: "Profile Updated",
                description: "Your information has been saved successfully.",
            });
            setIsEditing(false);
            window.location.reload();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
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
                title: "Password Changed",
                description: "Your security settings have been updated.",
            });
            setIsPasswordOpen(false);
            setPasswordData({ current_password: '', password: '', password_confirmation: '' });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to change password.",
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <header className="mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                    My <span className="text-primary">Profile</span>
                </h2>
                <p className="text-foreground/40 font-medium mt-2">Manage your personal information and account security.</p>
            </header>

            {/* Personal Information Card */}
            <div className="bg-white rounded-[48px] shadow-[0_8px_30px_rgba(46,125,50,0.04)] border border-primary/5 p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                            <UserCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-foreground tracking-tight">Personal Information</h3>
                            <p className="text-sm font-medium text-foreground/30">Your basic account details</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <Button 
                            variant="outline" 
                            className="rounded-full border-primary/10 text-primary hover:bg-primary/5 font-bold h-11 px-6"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">Full Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                readOnly={!isEditing}
                                className={`h-14 rounded-2xl px-6 border-primary/5 text-base font-medium transition-all duration-300 ${
                                    !isEditing ? "bg-primary/[0.02] border-transparent" : "bg-white border-primary/20 focus:ring-primary/20"
                                }`}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">Email Address</label>
                            <Input
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                readOnly={!isEditing}
                                className={`h-14 rounded-2xl px-6 border-primary/5 text-base font-medium transition-all duration-300 ${
                                    !isEditing ? "bg-primary/[0.02] border-transparent" : "bg-white border-primary/20 focus:ring-primary/20"
                                }`}
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end gap-4 pt-6">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                className="rounded-full font-bold h-12 px-8 text-foreground/50 hover:bg-primary/5"
                                onClick={() => setIsEditing(false)} 
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="rounded-full bg-primary text-white font-bold h-12 px-10 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    )}
                </form>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-[48px] shadow-[0_8px_30px_rgba(46,125,50,0.04)] border border-primary/5 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Account Security</h3>
                        <p className="text-sm font-medium text-foreground/30">Protect your account with a strong password</p>
                    </div>
                </div>

                <div className="bg-[#fdfcf6] rounded-3xl p-8 border border-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="font-bold text-foreground mb-1">Password Management</h4>
                        <p className="text-sm font-medium text-foreground/40">Keep your account safe by updating your password regularly.</p>
                    </div>
                    <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-full bg-primary text-white font-bold h-12 px-8 shadow-md hover:scale-105 transition-transform">
                                Change Password
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[40px] border-none p-10 max-w-md">
                            <DialogHeader className="mb-8">
                                <DialogTitle className="text-2xl font-black tracking-tight">Security Update</DialogTitle>
                                <DialogDescription className="font-medium text-foreground/50 pt-2">
                                    Update your account password to ensure maximum security.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">Current Password</label>
                                    <Input
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                        required
                                        className="h-12 rounded-xl border-primary/10 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">New Password</label>
                                    <Input
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                        required
                                        minLength={8}
                                        className="h-12 rounded-xl border-primary/10 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">Confirm New Password</label>
                                    <Input
                                        type="password"
                                        value={passwordData.password_confirmation}
                                        onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                                        required
                                        className="h-12 rounded-xl border-primary/10 focus:ring-primary/20"
                                    />
                                </div>
                                <DialogFooter className="pt-6">
                                    <Button type="submit" className="w-full h-14 rounded-full bg-primary text-white font-bold" disabled={passwordLoading}>
                                        {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update Password
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default DashboardProfile;
